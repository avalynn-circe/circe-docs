---
slug: /white-papers/investigating-a-chatbot-error
sidebar_label: "Investigating a chatbot error"
sidebar_position: 1
description: "A first cause named from one screen was wrong. The real cause was in a full day of production logs."
---

# Investigating a chatbot error across a fleet

By Avalynn Circe, Botco CX. Written 2026-11-10 from session records and ticket text.
Client names are changed. Bot, deployment, chat and user ids are removed. Dates, times, numbers and ticket ids are real.

## The problem in two sentences

- A user saw a generic error in one chat. The first cause we named came from one screen and was wrong.
- The real cause was in the production logs for the whole day, and in a config mismatch we had already seen.

## What happened

Case: Client A, Bot A, sandbox deployment, 2026-10-02 (UTC). Ticket: CX-3064.

| Time | Event | How we know |
|---|---|---|
| 19:32:43 | User answers "email" to "What is your preferred communication channel?" | Seen in logs |
| 19:32:52 | The InstaStack card calls the knowledge base. Result: HTTP 404, "No documents found for collection". The collection has 0 documents. It was created on 2026-09-09. | Seen in logs, read in config |
| 19:32 | The user sees: "It seems we are having a technical issue. Please try again." | Ticket text |
| 19:53 | The Chats attribute panel shows a help desk status code 401 and a JSON parse message. | Read on screen |
| 19:54 | First cause named: the help desk credential is wrong, expired or revoked. | Wrong |
| 20:00 | Instruction: check the prod logs, always. | |
| 20:02 | Correction: no help desk call appears in the logs for this chat after 19:28. | Seen in logs |
| 21:09 | Engineering finds the second cause: the runtime picks the API id by exact match on protocol and host. The card used one host. The API config used another. No match, so no Authorization header was sent. | Read in config, seen in pod log |

The pod log line: `HTTP [POST https://<client-a>.freshdesk.com/api/v2/tickets] is not configured for authorization`.
The API config base URL used `<client-a>.freshworks.com`.

A whole-day search on the same deployment found this line at 16:56, 16:59 and 17:50 on 2026-10-02. That search returned a truncated result (limit 3).

## There were two errors, not one

| Error | Explanation | Status |
|---|---|---|
| Chat error at 19:32:52: knowledge base 404 | The InstaStack card queried an empty collection. | Explained. Why "email" produced that path: inferred, not read. |
| Help desk calls with no authorization (16:56 to 17:50) | Host mismatch between the card and the API config. | Explained by engineering. |
| Knowledge base 404 at 17:48 for another user | Likely the same empty collection. | Not traced. |
| JSON parse message on 2026-10-01 in several chats (help desk status 200) | Probably the same help desk path. | Not traced. Inferred only. |

Not checked: whether other collections of this bot are also empty.

## What went wrong in the method

1. **A cause from one surface.** The first cause came from the attribute panel only. That panel can show old or mixed values. The prod logs were not read first.
2. **A mismatch seen and not tested.** At 19:56 to 19:59 two hosts were visible in one config. The note written was "I do not know which one the runtime uses." It was not tested. That mismatch was the cause of the second error.
3. **A search window that was too narrow.** The first help desk search covered 19:20 to 19:40, around one chat. That chat made no help desk call. An empty result for a narrow window proves nothing. A search for the word over the whole day would have found the line.
4. **An error called "not related" without evidence.** The ticket text says the 401 is "not related to this chat" and "not traced further". It should have said "not traced".
5. **The wrong advice followed from the wrong cause.** The requester was told to check the credential. The credential was probably fine. The host was wrong.

## The method that follows

1. Start with the production logs. Use them before any screen, panel or dashboard.
2. Search the symptom everywhere. Widen from one chat to the whole deployment and the whole day. Search for the log line of the failing call itself.
3. When two values should agree and do not, test it now. Do not write "check later".
4. If you do not know how a part works, say so once. Then read the code, read the logs, or ask.
5. Keep every error on a list until it is explained. Write "not traced", not "not related", until there is evidence.
6. Mark each claim: seen in logs, read in config, or inferred.

## Limits of this paper

- It describes one investigation. It is not a measured study.
- Times come from session transcripts. The log queries were not run again for this paper.
- The ticket CX-3064 text was not edited after 2026-10-02. No other ticket for this case was found.
- A second ticket, CX-3053 ("bot stalling" on the same client), was closed on 2026-09-30. Its cause was not found in the records. We did not link it to this case.

## Sources

- Session "GUI error information", 2026-10-02.
- Research method notes, 2026-10-02.
- Ticket CX-3064.
