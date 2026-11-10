---
slug: /chat-analyses/post-mortem
sidebar_label: "Post-mortem: routing failure"
sidebar_position: 1
description: "A SEV-2 post-mortem for a behavioral health chatbot: three overlapping causes, a 2x2 reproduction and the safeguards that followed."
---

# Sample Post-Mortem: Appointment Bot Routing Failure

Nov 10, 2026 · Avalynn Circe

## At a glance

<!-- vale Circe.TrailingContrast = NO -->
**In one sentence:** for three days, one client’s website assistant gave some visitors out-of-date insurance information and sent others to a contact form instead of a live person. It is fixed, and we are asking for approval of four safeguards so it does not happen again.
<!-- vale Circe.TrailingContrast = YES -->

**Fixed in three days; four safeguards need approval**

| | Number | What it means | Status |
| --- | --- | --- | --- |
| 🟢 | **58** | Visitors given wrong info (plus 60 sent to the wrong place when asking for staff) | Fixed Nov 5 |
| 🟡 | **30–40** | Potential patients lost (22 already recovered by the client admissions team) | Partly recovered |
| 🔴 | **4** | Safeguards to approve: testing and alerts so this cannot quietly happen again | Decision needed |

**What happened, in plain terms**

- **Old information got in.** The assistant read an insurance page the client had archived, and repeated it to visitors.
- **A wording change backfired.** An edit to the assistant’s instructions made it less likely to hand insurance questions to the right form.
- **The clock was an hour off.** When daylight saving time ended, the “are we open?” check was wrong, so some visitors were turned away while staff were available.

**What we need from you**

| Decision | Why it matters | Effort |
| --- | --- | --- |
| Require a quick standard test before any instruction change goes live | Would have caught the main problem before any visitor saw it | About 2 hours per change |
| Lock the core rules so everyday edits cannot move them | Stops this exact mistake from coming back | One-time project, about 3 weeks |
| Review website changes about insurance, prices or hours before the assistant learns them | Prevents out-of-date answers | About 15 minutes per change |
| Alert the team when leads or form completions drop sharply | Spots problems in hours, not days | One-time setup |

*Everything below this point is the technical detail for the teams doing the work.*

## Summary and impact

*All client names are anonymized for privacy.*

From Nov 2 to Nov 5, 2026, the web assistant for Client A (a six-location behavioral health provider) gave outdated insurance answers and misrouted live-agent handoffs. Three independent changes overlapped in the same week, so the symptoms looked like one bug but had three causes.

| Measure | Baseline (Oct 19–Nov 1) | Incident (Nov 2–5) |
| --- | --- | --- |
| Insurance questions routed to the Verify Insurance flow | 78% | 34% |
| Verify Insurance form completions | 31% of insurance chats | 12% of insurance chats |
| Chats citing a payer the client no longer accepts | 0 | 58 |
| Chats sent to the after-hours form while agents were online (5–6 pm CT) | 0 | 41 |
| Chats queued for live agents before agents were online (7–8 am CT) | 0 | 19 (median wait 47 min) |

**Severity:** SEV-2. No PHI was exposed, but prospective patients received incorrect coverage information and an estimated 30–40 admissions leads were lost or delayed.

**Status:** Resolved Nov 6, 2026. Follow-up actions tracked below.

## How the assistant works

Each visitor message hits the flow router first; only messages with no flow match fall through to the GenAI layer, which answers from retrieved knowledge and can trigger flows or a handoff itself.

**Architecture (anonymized).** Numbered items are where each of the three causes entered.

| Component | What it does | Connects to |
| --- | --- | --- |
| Chat widget | Visitor messages from the client website | Flow router |
| Flow router | Intents, flows, variables; picks a path per message | Verify Insurance flow; GenAI answer layer (no flow match) |
| Verify Insurance flow | Structured form, started by the router or the AI layer | CRM integration (submit) |
| **(2) GenAI answer layer** | System prompt + retrieved context; can call routes | Knowledge index (retrieve chunks); Handoff webhook |
| **(1) Knowledge index** | Site crawl + uploaded docs, chunked for search | Logs and traces |
| **(3) Handoff webhook** | Business-hours check, then live agent or after-hours form | Live agent console (in hours) |
| Live agent console | Admissions staff pick up escalated chats | None |
| CRM integration | Leads and form data to the admissions system | Logs and traces (events) |
| Logs and traces | Transcripts, retrieval logs, request traces | None |

The three causes sat on three different paths, which is why no single test or alert caught them: (1) stale content entered the knowledge index, (2) a prompt edit weakened the AI layer's routing, and (3) the handoff webhook misread business hours.

## Timeline

All times Central. The three changes landed within 48 hours of each other; detection took three days because each symptom was first treated as a separate ticket.

| When | Event |
| --- | --- |
| Oct 30, 3:10 pm | Client A updates its insurance page. The 2024 version moves to an archive URL that stays in the sitemap. |
| Oct 31, 2:00 am | Scheduled knowledge re-crawl ingests both the current and the archived insurance pages. **(Cause 1)** |
| Nov 1, 2:00 am | Daylight saving time ends. The handoff webhook still applies a fixed UTC−5 offset. **(Cause 3)** |
| Nov 2, 10:45 am | CX publishes a revised GenAI system prompt that adds tone guidance and moves the routing rule below the knowledge block. **(Cause 2)** |
| Nov 2, 5:05 pm | First visitor receives the after-hours form while two agents are online. |
| Nov 3, 9:20 am | Client A admissions lead reports “the bot sent people to voicemail yesterday evening.” Ticket opened as a handoff bug. |
| Nov 3, 2:40 pm | Second ticket: a visitor was told a payer is in network that the client dropped in 2025. Logged as a content issue. |
| Nov 4, 8:15 am | Weekly analytics review shows Verify Insurance form completions down from 31% to 14%. Tickets linked; incident declared SEV-2. |
| Nov 4, 11:30 am | Archived insurance page excluded from the index; re-index completed 12:10 pm. |
| Nov 4, 4:00 pm | Webhook switched to the account’s IANA time zone (America/Chicago); verified at the 5 pm boundary. |
| Nov 5, 10:00 am | Prompt ordering restored after regression testing (see Prompt Analysis sample). Route rate recovers to 76% within 24 hours. |
| Nov 6, 9:00 am | Incident resolved; client debrief held. |

## How we found the causes

Seven methods were used; no single one explained the incident, but together they separated three causes and ruled out two suspected ones (a model version change and a CRM outage).

<!-- vale Circe.TrailingContrast = NO -->
| Method | Question it answered | Key finding |
| --- | --- | --- |
| Transcript review (412 chats, Nov 2–5, coded against a 6-point rubric) | What exactly went wrong for visitors? | 58 wrong-payer answers, 60 misrouted handoffs, 71 insurance chats answered in free text instead of routed |
| Funnel analytics by hour of day | When does it fail? | Handoff failures clustered only at 5–6 pm and 7–8 am CT, the edges of business hours |
| Retrieval log analysis (top-5 chunks per answer) | Why were payer answers wrong? | The archived 2024 insurance page ranked in the top 3 for 53 of 58 wrong answers (91%) |
| Log and trace queries | What did the handoff webhook compute? | Traces showed `local_hour` one hour ahead of real Central time since Nov 1 |
| Config version diff (prompt v14 vs v15) | What changed in the AI layer? | Routing rule moved from position 2 to position 6, after a 1,800-token knowledge block |
| Controlled reproduction in staging (2×2 test, below) | Which change caused which symptom? | Prompt order alone cut route rate by 40 points; stale content alone caused wrong payers |
| Client and agent interviews (3 admissions staff) | What did people see that logs missed? | Agents saw empty queues at 5 pm and assumed low traffic; visitors called the main line instead |
<!-- vale Circe.TrailingContrast = YES -->

**Sample webhook trace query** (Loki, anonymized labels):

```
{service="handoff-webhook", client="client-a"}
  | json
  | decision="after_hours"
  | line_format "{{.ts}} utc_hour={{.utc_hour}} local_hour={{.local_hour}}"
```

**Controlled reproduction.** 40 scripted insurance questions were run 3 times each against every combination of prompt version and index state. Percentages are the share of runs that routed to the Verify Insurance flow, with wrong-payer answers in parentheses.

| Prompt version | Index without archived page | Index with archived page |
| --- | --- | --- |
| v14 (routing rule early) | 81% (0 wrong) | 79% (11 wrong) |
| v15 (routing rule late) | 41% (0 wrong) | 36% (19 wrong) |

<!-- vale Circe.TrailingContrast = NO -->
The two causes are largely independent: prompt order drives routing, index content drives accuracy, and stale content does more harm when the bot answers instead of routing.
<!-- vale Circe.TrailingContrast = YES -->

## Why it happened

The incident had three root causes and one shared contributing factor: no check ran on the paths that changed.

**Cause 1: Stale content in the knowledge index.**

1. Visitors were told a dropped payer was in network.
2. Retrieval returned the archived 2024 insurance page.
3. It outranked the current page because it listed every payer by name, matching more query terms.
4. It was indexed because the crawler follows the sitemap and the archive URL stayed in it.
5. No exclusion rule existed for archive paths, and re-crawls are not reviewed before going live.

**Cause 2: Routing instruction buried in the system prompt.**

<!-- vale Circe.TrailingContrast = NO -->
1. The AI layer answered insurance questions itself instead of starting the Verify Insurance flow.
2. In v15, the routing rule sat after the retrieved-knowledge block and the new tone guidance.
3. With long retrieved context in between, the model weighted “answer from the knowledge” over “route this.”
4. The edit was reviewed for wording, not tested for behavior.
5. There is no regression set of routing test questions run before a prompt is published.
<!-- vale Circe.TrailingContrast = YES -->

**Cause 3: Business hours computed with a fixed offset.**

<!-- vale Circe.TrailingContrast = NO -->
1. Chats at 5–6 pm went to the after-hours form; chats at 7–8 am queued for agents who were not online.
2. The webhook computed local time as UTC−5.
3. Central time moved to UTC−6 on Nov 1 when daylight saving ended.
4. The offset was hard-coded during a spring 2026 rebuild instead of read from the account’s time zone.
5. Hours logic has no test that crosses a DST boundary.
<!-- vale Circe.TrailingContrast = YES -->

**Contributing factors**

- Monitoring alerts on chat volume and error rates, not on route rate or form completion, so a behavior shift stayed silent.
- Three tickets were triaged separately for 23 hours before anyone linked them.
- Prompt, knowledge and webhook changes have different owners and no shared change log.

## What we are doing about it

All three causes were fixed by Nov 5; the open items prevent the same class of failure on other client bots.

| Action | Type | Owner | Due | Status |
| --- | --- | --- | --- | --- |
| Exclude archive, legacy and dated paths from all crawls | Fix | Knowledge team | Nov 4 | Done |
| Restore routing rule to position 2 (prompt v16) | Fix | CX | Nov 5 | Done |
| Read business hours from the account’s IANA time zone | Fix | Integrations | Nov 4 | Done |
| Build a 40-question routing regression set per client; run before every prompt publish | Prevent | CX | Nov 20 | In progress |
| Move routing rules into a fixed prompt layer that edits cannot reorder (see Prompt Analysis) | Prevent | CX + Platform | Dec 4 | Not started |
| Add a diff review step for re-crawls that add or replace pages on pricing, insurance or hours | Prevent | Knowledge team | Nov 25 | Not started |
| Add DST-boundary tests to hours logic for all US time zones | Prevent | Integrations | Nov 18 | In progress |
| Alert when route rate or form completion drops 15+ points day over day | Detect | Platform | Nov 25 | Not started |
| Shared change log for prompt, knowledge and webhook changes per client | Detect | CX lead | Nov 15 | In progress |
| Notify Client A of affected visitors so admissions can follow up on the 58 wrong-payer chats | Repair | Account manager | Nov 7 | Done |

## Lessons learned

<!-- vale Circe.TrailingContrast = NO -->
- **Overlapping changes hide each other.** Three small changes in 48 hours produced one confusing picture. A shared change log would have pointed to all three on day one.
- **Test behavior, not wording.** The prompt edit read well and broke routing. A short regression set catches what a read-through cannot.
- **Where an instruction sits matters as much as what it says.** Rules that must always fire belong early and in a layer edits cannot move.
- **Measure outcomes, not just uptime.** Nothing was “down,” so nothing alerted. Route rate and form completion are the real health signals for a conversion bot.
- **What went well:** the 2×2 reproduction separated the causes in under two hours, and the client was told about affected visitors within a day of the incident being declared.
<!-- vale Circe.TrailingContrast = YES -->

## Glossary

| Term | Plain meaning |
| --- | --- |
| Routing | Sending a visitor to the right next step, such as a form or a person |
| Handoff | Passing a chat from the assistant to a live staff member |
| Knowledge index | The library of website pages and documents the assistant reads from |
| Re-crawl | The scheduled refresh where the assistant re-reads the client’s website |
| System prompt | The written instructions that tell the AI how to behave |
| Webhook | A small connector that checks something (like business hours) and reports back |
| Time-zone offset | The number of hours between local time and world standard time; it changes with daylight saving |
| Regression test | A fixed set of practice questions run before a change, to confirm nothing broke |
| SEV-2 | Our second-highest incident level: customers affected, but no data exposed |
