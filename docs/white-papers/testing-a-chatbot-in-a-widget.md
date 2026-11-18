---
slug: /white-papers/testing-a-chatbot-in-a-widget
sidebar_label: "Testing a chatbot in a widget"
sidebar_position: 5
description: "One widget test proves little. Eight rules for runs you can trust, each traced to the result it saved."
---

# Testing a chatbot in a widget so the result can be trusted

By Avalynn Circe, Botco CX. Written 2026-11-10 from session records.
Client names are changed. Bot, deployment and user ids are removed. Dates, times, counts and ticket ids are real.

## The problem in two sentences

- One widget test run proves little. The bot can route the same sentence to two different blocks on the same day.
- Each rule below exists because a test result was lost, wrong or not repeatable without it.

## The method

<!-- vale Circe.TrailingContrast = NO -->
1. Turn on debug mode in the widget playground, under the "Behavior" tab.
2. Run each test at least three times.
3. Between runs, use "Clear chat" in the three-dot menu of the chat header. It gives a new user ID and reloads the widget.
4. After the reload, wait about 12 seconds for the welcome message before you type.
5. Wait for the bot answer before you clear the chat. It can take 15 to 30 seconds.
6. Confirm each run with the block name in the debug output and with Loki counts per 10 seconds.
7. Report the count for every run, not only the total.
8. Record which pod served each run. See the pod paper.
<!-- vale Circe.TrailingContrast = YES -->

## Where each rule comes from

| Rule | Date set | Evidence |
|---|---|---|
| Use "Clear chat" | 2026-08-27 and 2026-09-04 (the habit). Verified 2026-09-30. | Each Clear chat gave a new user ID. "Restart Chat" keeps the same user and all attributes. Unmount, mount and open does not start a fresh chat. Editing the stored user id does not work. "Save History" restores the old chat on reload. |
| At least three runs | 2026-10-06 | The same sentence went to the Legacy block at 14:05 and to the FAQ block at 21:30 on one day (CX-2818, about 2026-09-04). A first test on 2026-10-05 had 1 event of each kind. It was noted as a small test. |
| Wait 12 seconds after the reload | 2026-10-06 | Messages typed before the welcome loads can be lost. This happened 4 times in one session. Loki shows no events for lost messages. An earlier loss was on 2026-09-04. |
| Wait for the answer before clearing | 2026-10-06 | In run B1, the answer had not appeared when the chat was cleared. |
| Block name plus Loki counts | 2026-10-06 | Run B1 showed no block name. Loki matched it. A fourth run was added to have three confirmed. |
| Debug mode | 2026-10-06 | Found under the "Behavior" tab. |
| Check the pod | 2026-09-04 | A saved fix still failed because the pod ran an older config. See the pod paper. |

## Worked example

Client I, sandbox deployment, ticket CX-3012, 2026-10-06 (03:54 to 04:03 UTC). Seen in the widget and in logs.

- Test A: ask a question, then click "No". Goal "No - Helpful" should fire.
- Test B: ask a question that the knowledge base cannot answer. A fallback and a knowledge base miss should fire.

| Run | Block in debug | Goal "No - Helpful" | Fallback | KB miss |
|---|---|---|---|---|
| A1, A2, A3 | INTENT_GENAI_NO_WHAT_NEXT | 1 each | 0 | 0 |
| B1 | Not seen | 0 | 1 | 1 |
| B2, B3, B4 | INTENT_GENAI_NO_ANSWER | 0 each | 1 each | 1 each |

- Totals: 3 goals, 4 fallback events, 4 knowledge base misses.
- Before the fix, the ticket test counted 2 and 2.

A second example, Client E, ticket CX-3080, 2026-10-08, round 2 on the new pod. Each of 48 runs started from a cleared chat.

- "Adult Schedule link text on other questions": round 1, 24 of 129. Round 2, 0 of 129.
- "InstaStack with source": 99 of 129, then 127 of 129.
- Note from the session: the router varies between runs, so test again after any change.

## When the method failed

| Case | What happened |
|---|---|
| Stale pod, Client F, CX-3092, 2026-10-19 | The first run was served by the old pod while a new one started. It did not count. The tests began when only the new pod was ready. 3 of 3 passed. |
| Three clean runs do not clear a rare bug, Client H, CX-3299, 2026-11-05 | Sandbox 3 of 3 and production 3 of 3 were correct. The earlier failure was 1 in 8 first turns over 30 days on production. Three correct runs do not clear production. |
| Variation inside three runs, Client R3, 2026-10-28 | 1 of 3 runs failed. The model asked for a phone number after it had all six fields. |
| An untested path, Client H, 2026-11-05 | The logs showed the real sender skipped the menu. The widget test used the menu. |
| Widget problems | Clicks missed after the window size changed (2026-10-06). The three-dot menu needed a second click (2026-10-19). A tab ignored clicks after a lost connection (2026-10-22). The playground showed no chat bubble after a reload on 2026-11-05. A new Chrome window fixed it. The cause was not found. |
| Other traps | Quick Reply cards block typing. Sandbox test events count on the client dashboard. Log lines for form tasks are cut at about 640 characters. A search with the wrong letter case returned "nothing". |

## Not known

- The source of "15 to 30 seconds". It was first written on 2026-10-06 with no measurement shown.
- A software release note says Clear Chat no longer leaves visitors on a blank, locked chat window (engineering id 6026). The note has no date or version. We do not know if the 12-second wait is still needed. It was not tested.
- The same notes say the widget reconnects and resends a message if the bot does not reply within 25 seconds. We did not check how this affects test timing.

## Sources

- Sessions for CX-698, CX-2818, CX-3012, CX-3038, CX-3048, CX-3080, CX-3092, CX-3299 and a 2026-10-22 migration pilot.
- A memory note from 2026-09-30 about fresh chats.
