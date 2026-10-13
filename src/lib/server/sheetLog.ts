import { env } from '$env/dynamic/private';

export type ChatLogEntry = {
  sessionId: string;
  question: string;
  answer: string;
  model: string;
  status: 'answered' | 'no_answer' | 'error';
};

/**
 * Heuristic: did the assistant fail to find an answer in the knowledge base?
 * Used to tag rows in the sheet so unanswered questions can be filtered out
 * and folded back into knowledge.txt.
 */
export function looksUnanswered(answer: string): boolean {
  // Normalise curly quotes/apostrophes so "don't" matches regardless of font.
  const a = answer
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"');

  return (
    a.includes("don't have") ||
    a.includes('do not have') ||
    a.includes("doesn't have") ||
    a.includes("don't currently have") ||
    a.includes("couldn't find") ||
    a.includes('could not find') ||
    a.includes("can't find") ||
    a.includes('not able to find') ||
    a.includes('not have that detail') ||
    a.includes('not have that information') ||
    a.includes('not have information') ||
    a.includes('no information') ||
    a.includes('not covered') ||
    a.includes("i'm not sure") ||
    a.includes('i am not sure') ||
    a.includes("don't know") ||
    a.includes('do not know') ||
    a.includes("can't help with that") ||
    a.includes('cannot help with that') ||
    a.includes("isn't something i can") ||
    a.includes('not something i can help')
  );
}

// Apps Script web apps redirect then write the row, ~2-3s total. This runs in
// the dedicated /api/chat-log endpoint, so no user is waiting on it.
const LOG_TIMEOUT_MS = 8000;

/**
 * Append one chat turn to the Google Sheet, via the Apps Script web app URL
 * in GOOGLE_SHEET_WEBHOOK_URL. No-op if that var is unset. Never throws and
 * is capped by a short timeout so a slow/broken sheet can't break or badly
 * delay the chat response.
 */
export async function logToSheet(entry: ChatLogEntry): Promise<void> {
  const url = env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!url) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOG_TIMEOUT_MS);

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: env.GOOGLE_SHEET_TOKEN || '',
        sessionId: entry.sessionId,
        question: entry.question,
        answer: entry.answer,
        model: entry.model,
        status: entry.status
      }),
      signal: controller.signal
    });
  } catch (error) {
    console.error(
      'Sheet log failed:',
      error instanceof Error ? error.message : error
    );
  } finally {
    clearTimeout(timeout);
  }
}
