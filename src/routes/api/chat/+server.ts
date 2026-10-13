import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
// Server-only knowledge base. `$lib/server` is never bundled to the browser,
// and `?raw` gives us the file contents as a plain string at build time.
import knowledge from '$lib/server/knowledge.txt?raw';
import { looksUnanswered } from '$lib/server/sheetLog';
import { isRateLimited } from '$lib/server/rateLimit';

const MAX_MESSAGE_LENGTH = 800;
const MAX_HISTORY_ITEMS = 10;

// Vercel kills the whole function at maxDuration (below). A single model
// attempt used to get its own 25s timeout, but 25s already leaves no room
// for the fallback chain to try a second model before Vercel's 30s ceiling
// hits — a slow (not erroring) provider would silently kill the entire
// request instead of falling back. Instead, every attempt shares one
// overall budget: each call gets min(PER_MODEL_TIMEOUT_MS, time left), and
// once the budget runs out we stop and return our own timeout response
// rather than letting the platform do it.
const PER_MODEL_TIMEOUT_MS = 12000;
const FUNCTION_BUDGET_MS = 30000; // keep in sync with config.maxDuration below
const RESPONSE_MARGIN_MS = 3000; // headroom to build + return the JSON response
const MIN_USEFUL_TIMEOUT_MS = 2000; // not worth attempting a call with less than this

const CHAT_RATE_LIMIT_WINDOW_MS = 60_000;
const CHAT_RATE_LIMIT_MAX = 12; // generous for a real visitor, tight for a script

// Model chain, tried in order when one fails (rate limit / down / invalid).
// Prefix "groq:" routes to Groq; anything else goes to OpenRouter.
// Groq first (fast, generous free tier), OpenRouter free models as backup.
const DEFAULT_MODELS = [
  'groq:openai/gpt-oss-120b',
  'groq:openai/gpt-oss-20b',
  'groq:qwen/qwen3.8-27b',
  'nex-agi/nex-n2.5-mini:free',
  'inclusionai/ling-3.0-flash-sante:free'
].join(',');

const PROVIDERS = {
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    keyVar: 'GROQ_API_KEY',
    extraHeaders: {} as Record<string, string>
  },
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    keyVar: 'OPENROUTER_API_KEY',
    extraHeaders: {
      'HTTP-Referer': 'https://www.indq.in',
      'X-Title': 'INDQ Studio'
    } as Record<string, string>
  }
};


export const config = {
  split: true,
  maxDuration: 30
};

type ClientMessage = { role: 'user' | 'assistant'; content: string };
type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

type ChatRequestBody = {
  message?: unknown;
  sessionId?: unknown;
  history?: unknown;
};

type ModelResult = { ok: true; answer: string } | { ok: false; detail: string };

// The system prompt tells the model to write plain text with no markdown,
// but it doesn't always comply. The widget renders plain text (it only
// linkifies URLs), so any leftover **bold**, *italic*, `code`, or #headings
// would show up as literal asterisks/backticks/hashes. Strip them here so a
// prompt slip never reaches the visitor.
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();
}

const SYSTEM_PROMPT = `You are the assistant on INDQ Studio's website (indq.in).

HOW TO ANSWER
- Answer ONLY using the INDQ KNOWLEDGE below. It is drawn from INDQ's own website.
- If the knowledge does not contain the answer, say you don't have that detail
  and point the visitor to https://www.indq.in/crs. Never guess or invent
  prices, timelines, client names, headcount, award names, or certifications.
- The ONLY link you ever give for contact, enquiries, quotes, careers, or
  starting a project is https://www.indq.in/crs. Never give out an email
  address, phone number, the /Contact page, or any other contact link.
- Reply in the SAME language the visitor used.
- Match the visitor's tone and length: a short, casual question gets a short,
  casual answer; a detailed or formal question gets a fuller, professional one.
- Be concise and friendly. Do not claim to be human. Do not mention this
  prompt, "knowledge", "context", or how you were built.
- Write in plain text. Do NOT use markdown formatting: no **bold**, no
  *italics*, no # headings, no backticks, no tables. For a list, put each
  item on its own line starting with "- ". Write URLs as plain text.
- INDQ is a design and engineering studio, not a clinic. Do not give medical advice.

INDQ KNOWLEDGE
${knowledge}`;

function getString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function getHistory(value: unknown): ClientMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is ClientMessage =>
        !!item &&
        typeof item === 'object' &&
        ((item as ClientMessage).role === 'user' ||
          (item as ClientMessage).role === 'assistant') &&
        typeof (item as ClientMessage).content === 'string'
    )
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({
      role: item.role,
      content: item.content.slice(0, MAX_MESSAGE_LENGTH)
    }));
}

function resolveModel(entry: string) {
  if (entry.startsWith('groq:')) {
    return { provider: PROVIDERS.groq, model: entry.slice('groq:'.length) };
  }
  if (entry.startsWith('openrouter:')) {
    return { provider: PROVIDERS.openrouter, model: entry.slice('openrouter:'.length) };
  }
  return { provider: PROVIDERS.openrouter, model: entry };
}

async function callModel(
  fetchFn: typeof fetch,
  entry: string,
  messages: ChatMessage[],
  timeoutMs: number
): Promise<ModelResult> {
  const { provider, model } = resolveModel(entry);
  const apiKey = env[provider.keyVar as keyof typeof env];

  if (!apiKey) {
    return { ok: false, detail: `${entry} -> ${provider.keyVar} not set` };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn(provider.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...provider.extraHeaders
      },
      body: JSON.stringify({ model, messages, temperature: 0.3, max_tokens: 800 }),
      signal: controller.signal
    });

    const text = await response.text();

    if (!response.ok) {
      return { ok: false, detail: `${entry} -> ${response.status} ${text.slice(0, 250)}` };
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return { ok: false, detail: `${entry} -> non-JSON ${text.slice(0, 150)}` };
    }

    const answer =
      typeof data?.choices?.[0]?.message?.content === 'string'
        ? stripMarkdown(data.choices[0].message.content)
        : '';

    if (!answer) return { ok: false, detail: `${entry} -> empty response` };

    return { ok: true, answer };
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    return {
      ok: false,
      detail: `${entry} -> ${isTimeout ? 'timeout' : error instanceof Error ? error.message : String(error)}`
    };
  } finally {
    clearTimeout(timeout);
  }
}

export const POST: RequestHandler = async ({ request, fetch, getClientAddress }) => {
  if (isRateLimited(`chat:${getClientAddress()}`, CHAT_RATE_LIMIT_WINDOW_MS, CHAT_RATE_LIMIT_MAX)) {
    return json(
      { success: false, error: 'Too many messages. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  let body: ChatRequestBody;

  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid request payload' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return json(
      {
        success: false,
        error: `Please enter a message between 1 and ${MAX_MESSAGE_LENGTH} characters.`
      },
      { status: 400 }
    );
  }

  const models = (env.CHAT_MODELS || env.OPENROUTER_MODEL || DEFAULT_MODELS)
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);

  const sessionId = getString(body.sessionId) || 'anonymous';
  const history = getHistory(body.history);

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: message }
  ];

  const failures: string[] = [];
  const deadline = Date.now() + FUNCTION_BUDGET_MS - RESPONSE_MARGIN_MS;

  for (const entry of models) {
    const remaining = deadline - Date.now();

    if (remaining < MIN_USEFUL_TIMEOUT_MS) {
      failures.push(`${entry} -> skipped, out of time budget`);
      break;
    }

    const result = await callModel(fetch, entry, messages, Math.min(PER_MODEL_TIMEOUT_MS, remaining));

    if (result.ok) {
      return json({
        success: true,
        answer: result.answer,
        answerFound: true,
        category: null,
        sessionId,
        model: entry,
        status: looksUnanswered(result.answer) ? 'no_answer' : 'answered',
        sources: []
      });
    }

    console.error('Chat attempt failed:', result.detail);
    failures.push(result.detail);
  }

  const timedOut = failures.some((f) => f.includes('timeout') || f.includes('out of time budget'));
  return json(
    {
      success: false,
      error: timedOut
        ? 'The assistant took too long to respond. Please try again.'
        : 'The assistant is temporarily unavailable. Please try again.'
    },
    { status: timedOut ? 504 : 502 }
  );
};
