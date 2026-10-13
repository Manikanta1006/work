# Website chatbot

The "Ask INDQ" widget ([src/routes/components/chat.svelte](../src/routes/components/chat.svelte))
posts to `/api/chat` ([src/routes/api/chat/+server.ts](../src/routes/api/chat/+server.ts)),
which answers using an LLM grounded in a fixed knowledge file. There is no
n8n, no external webhook, and no vector database.

## How it works

```
chat.svelte  ──POST /api/chat──►  +server.ts
                                    │  1. validate message (<= 800 chars)
                                    │  2. build prompt:
                                    │       system rules + knowledge.txt
                                    │       + history (sent by the widget)
                                    │       + the new message
                                    │  3. POST openrouter.ai/api/v1/chat/completions
                                    │  4. return { success, answer, sessionId, ... }
```

- **Knowledge base:** [src/lib/server/knowledge.txt](../src/lib/server/knowledge.txt).
  Plain text, injected into the system prompt on every request. `$lib/server`
  means it is never sent to the browser. Edit the file and redeploy to change
  what the bot knows.
- **Tone / language matching:** controlled by `SYSTEM_PROMPT` in `+server.ts`.
- **Conversation memory:** the widget already sends the last messages as
  `history`; the endpoint forwards up to 10. Nothing is stored server-side.

## Environment variables

Set these in the Vercel project (Settings → Environment Variables), and in
`.env` for local dev. Both are server-side only — no `PUBLIC_` prefix.

| Var | Required | Notes |
|-----|----------|-------|
| `OPENROUTER_API_KEY` | yes | Create at https://openrouter.ai/keys |
| `OPENROUTER_MODEL` | no | Defaults to `openai/gpt-4o-mini`. Cheaper: `google/gemini-flash-1.5` |

If `OPENROUTER_API_KEY` is missing the endpoint returns HTTP 503 and the
widget shows "The assistant is not configured yet."

## Test locally

```bash
npm run dev
curl -s -X POST http://localhost:5173/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"What services does INDQ offer?","sessionId":"test-1"}' | jq
```

Expected: `{ "success": true, "answer": "...", "sessionId": "test-1", ... }`

## Cost

Roughly $0.0003–0.0005 per reply with `gpt-4o-mini` (the knowledge file is
~1,800 tokens of input each call). ~5,000 replies/month ≈ $2. Trim
`knowledge.txt` or switch model to reduce it.

## Updating the knowledge

Edit `src/lib/server/knowledge.txt` — keep it factual, no invented prices or
client names — commit, and redeploy. That's the whole workflow.

## Logging questions to a Google Sheet

Every answered question (and every error) is appended to a Google Sheet, so
you can see what visitors ask and where the bot falls short. Controlled by
`GOOGLE_SHEET_WEBHOOK_URL` + `GOOGLE_SHEET_TOKEN`
([src/lib/server/sheetLog.ts](../src/lib/server/sheetLog.ts)). If the URL is
blank, logging is silently skipped and nothing else changes.

### One-time setup

1. Create a Google Sheet (e.g. "INDQ chatbot log").
2. **Extensions → Apps Script**. Delete the sample code and paste:

   ```javascript
   // Must match GOOGLE_SHEET_TOKEN in the site's environment.
   const TOKEN = 'CHANGE_ME_to_a_long_random_string';

   function doPost(e) {
     try {
       const data = JSON.parse(e.postData.contents);
       if (TOKEN && data.token !== TOKEN) {
         return json_({ ok: false, error: 'bad token' });
       }
       const ss = SpreadsheetApp.getActiveSpreadsheet();
       const sheet = ss.getSheetByName('Log') || ss.insertSheet('Log');
       if (sheet.getLastRow() === 0) {
         sheet.appendRow(['Timestamp', 'Session', 'Question', 'Answer', 'Model', 'Status']);
       }
       sheet.appendRow([
         new Date(),
         data.sessionId || '',
         data.question || '',
         data.answer || '',
         data.model || '',
         data.status || ''
       ]);
       return json_({ ok: true });
     } catch (err) {
       return json_({ ok: false, error: String(err) });
     }
   }

   function json_(obj) {
     return ContentService.createTextOutput(JSON.stringify(obj))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. Set `TOKEN` to a long random string.
4. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access:
   **Anyone**. Deploy, authorise, and copy the **Web app URL** (ends in `/exec`).
5. Set the env vars (local `.env` and Vercel):
   ```
   GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/AKfy.../exec"
   GOOGLE_SHEET_TOKEN="the same long random string as TOKEN"
   ```

### Notes

- The logging call is capped at 2 s and never breaks a chat reply — if the
  sheet is slow or down, the visitor still gets their answer.
- "Who has access: Anyone" means anyone with the `/exec` URL can POST; the
  `TOKEN` check is what stops randoms from writing rows. Keep the URL private.
- To change the columns, edit the `appendRow` calls in the script (and delete
  the header row so it regenerates).
- Redeploying the script (after code changes) needs **Manage deployments →
  edit → Version: New version**, or the URL keeps running the old code.
