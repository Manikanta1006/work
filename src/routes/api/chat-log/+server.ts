import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logToSheet, looksUnanswered } from '$lib/server/sheetLog';
import { isRateLimited } from '$lib/server/rateLimit';

// Fire-and-forget logging target for the chat widget. The browser calls this
// after it has already shown the answer, so slowness here is invisible to the
// visitor. No-op if GOOGLE_SHEET_WEBHOOK_URL is unset.
export const config = {
  maxDuration: 15
};

const LOG_RATE_LIMIT_WINDOW_MS = 60_000;
const LOG_RATE_LIMIT_MAX = 30; // cheap endpoint, but still capped against spam

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  if (isRateLimited(`chat-log:${getClientAddress()}`, LOG_RATE_LIMIT_WINDOW_MS, LOG_RATE_LIMIT_MAX)) {
    return json({ ok: false }, { status: 429 });
  }

  let body: any;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, { status: 400 });
  }

  const question = typeof body?.question === 'string' ? body.question.slice(0, 2000).trim() : '';
  const answer = typeof body?.answer === 'string' ? body.answer.slice(0, 8000) : '';

  if (!question) {
    return json({ ok: false }, { status: 400 });
  }

  const status: 'answered' | 'no_answer' | 'error' =
    body?.status === 'error' ? 'error' : looksUnanswered(answer) ? 'no_answer' : 'answered';

  await logToSheet({
    sessionId: typeof body?.sessionId === 'string' ? body.sessionId.slice(0, 100) : 'anonymous',
    question,
    answer,
    model: typeof body?.model === 'string' ? body.model.slice(0, 120) : '',
    status
  });

  return json({ ok: true });
};
