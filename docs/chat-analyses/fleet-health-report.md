---
slug: /chat-analyses/fleet-health-report
sidebar_label: Weekly fleet health report
sidebar_position: 3
description: "A weekly health report for 24 client chatbots: KPIs, day-by-day recovery, per-bot status and next week's actions."
---

# Weekly Fleet Health Report: Nov 2–8, 2026

Nov 10, 2026 · Avalynn Circe

## At a glance

**In one sentence:** our clients’ assistants had a bumpy start to the week but finished healthy; two shared changes caused most of the problems and both were fixed by Thursday, but one client still has leads waiting on their IT team.

**A rough start, a healthy finish, and one client issue still open**

| | Number | What it means | Status |
| --- | --- | --- | --- |
| 🟡 | **14 of 24** | Assistants fully healthy: 8 recovering and being watched, 2 need action this week | Recovering |
| 🟢 | **18,420** | Conversations this week: more visitors chatted than the week before | Up 2.6% |
| 🔴 | **38** | Leads waiting on one client: their system login expired; their IT team must reissue it | Action needed |

**What this means**

- **Customers felt it for about three days.** Some visitors were sent to the wrong place or could not reach a person. Everything was back to normal by Nov 5.
- **Volume is healthy.** More people used the assistants than last week, so demand is not the issue.
- **One open item is outside our control.** A client’s system login expired, and 38 leads will deliver as soon as their IT team renews it.

**What we need from you**

| Ask | Why | Who |
| --- | --- | --- |
| Escalate the expired login with the client’s leadership if not fixed by Nov 11 | 38 people are waiting for a call back | Account manager |
| Approve automatic alerts for sudden drops in performance | This week’s problems took a day to notice | Platform lead |

**How to read the status colors:** **Healthy** = meeting every target. **Watch** = recovering or one number slightly off; no action needed from leadership. **At risk** = affecting customers now and needs attention.

*Everything below this point is the detail for the teams doing the work.*

## Summary

*All client names are anonymized for privacy.*

The fleet ended the week healthy after a rough first half: routing accuracy fell to 82% on Nov 3 and recovered to 91% by Nov 7, and live-agent handoff success recovered from 90.5% to 98.6%. Two shared changes caused most of the damage, and both were fixed by Nov 5.

- **Prompt template v15** went to 6 behavioral health bots on Nov 2 and buried the routing rule; v16 restored it on Nov 5.
- **Handoff webhook time-zone bug** hit 4 Central-time bots after daylight saving ended; fixed Nov 4.
- **Still open:** MM-04’s CRM sync has failed since Nov 7, with 38 leads queued.

**Fleet:** 24 bots: 10 behavioral health (BH), 8 senior living (SL), 6 multi-site medical (MM). **Status:** 14 healthy, 8 watch, 2 at risk.

## Key numbers vs last week

Volume rose 2.6% while quality slipped on every routing and handoff measure; all of the slip traces to Nov 2–4.

| KPI | Oct 26–Nov 1 | Nov 2–8 | Change | Target |
| --- | --- | --- | --- | --- |
| Conversations | 17,960 | 18,420 | +2.6% | n/a |
| Widget availability | 99.99% | 99.97% | −0.02 pts | ≥ 99.9% |
| Routing accuracy (QA sample, 25 chats per bot) | 91% | 87% | −4 pts | ≥ 90% |
| Live-agent handoff success | 98.6% | 95.7% | −2.9 pts | ≥ 98% |
| GenAI fallback rate (no confident answer) | 5.9% | 6.8% | +0.9 pts | ≤ 7% |
| Containment (resolved without an agent) | 66% | 64% | −2 pts | ≥ 60% |
| Answers citing flagged or stale content | 0.2% | 0.9% | +0.7 pts | ≤ 0.5% |
| CRM sync success | 99.6% | 96.1% | −3.5 pts | ≥ 99.5% |
| Median bot response time | 1.7 s | 1.8 s | +0.1 s | ≤ 2.5 s |
| Thumbs-up rate (rated chats) | 84% | 82% | −2 pts | ≥ 80% |

Four KPIs missed target: routing accuracy, handoff success, stale-content answers and CRM sync.

## Day by day

Handoff success recovered the day after the webhook fix; routing accuracy took one more day after template v16, because QA samples lag by a day.

**Both measures recovered within a day of their fixes** (fleet-wide daily rates; targets: routing 90%, handoff 98%)

| Day | Routing accuracy | Handoff success | Note |
| --- | --- | --- | --- |
| Nov 2 | 84% | 90.5% | |
| Nov 3 | 82% | 91.2% | Routing low point |
| Nov 4 | 85% | 93.8% | Webhook time-zone fix |
| Nov 5 | 88% | 98.4% | Template v16 published |
| Nov 6 | 90% | 98.7% | |
| Nov 7 | 91% | 98.9% | |
| Nov 8 | 91% | 98.6% | |

Routing accuracy is scored on a daily sample of 25 chats per bot; handoff success is measured on every escalation.

## Every assistant at a glance

Two bots are at risk and eight are on watch; every watch bot traces to one of the two shared changes except SL-06. Thresholds: routing ≥ 90%, handoff ≥ 98%, fallback ≤ 7%.

| Bot | Vertical | Conversations | Routing | Handoff success | Fallback | Status | Note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BH-03 | Behavioral health | 1,310 | 71% | 84.2% | 8.9% | 🔴 At risk | SEV-2 incident (Client A); all fixes live Nov 5 |
| MM-04 | Multi-site medical | 600 | 89% | 99.1% | 6.0% | 🔴 At risk | CRM sync failing since Nov 7; 38 leads queued |
| BH-05 | Behavioral health | 1,020 | 77% | 88.9% | 7.0% | 🟡 Watch | Template v15 and time-zone bug |
| BH-01 | Behavioral health | 1,240 | 79% | 98.9% | 6.4% | 🟡 Watch | Template v15, Nov 2–5 |
| BH-04 | Behavioral health | 860 | 80% | 98.7% | 6.1% | 🟡 Watch | Template v15, Nov 2–5 |
| BH-07 | Behavioral health | 690 | 81% | 98.8% | 6.6% | 🟡 Watch | Template v15, Nov 2–5 |
| BH-09 | Behavioral health | 650 | 82% | 99.2% | 6.3% | 🟡 Watch | Template v15, Nov 2–5 |
| SL-02 | Senior living | 760 | 90% | 89.5% | 6.0% | 🟡 Watch | Time-zone bug, Nov 1–4 |
| MM-01 | Multi-site medical | 780 | 91% | 90.3% | 6.8% | 🟡 Watch | Time-zone bug, Nov 1–4 |
| SL-06 | Senior living | 720 | 89% | 99.0% | 11.4% | 🟡 Watch | Four new menu buttons with no matching knowledge |
| BH-06 | Behavioral health | 740 | 93% | 99.3% | 4.8% | 🟢 Healthy | |
| BH-02 | Behavioral health | 980 | 92% | 99.1% | 5.2% | 🟢 Healthy | |
| BH-10 | Behavioral health | 600 | 92% | 99.4% | 5.0% | 🟢 Healthy | |
| BH-08 | Behavioral health | 910 | 91% | 99.0% | 5.5% | 🟢 Healthy | |
| SL-03 | Senior living | 700 | 94% | 99.6% | 4.9% | 🟢 Healthy | |
| SL-01 | Senior living | 820 | 93% | 99.5% | 5.8% | 🟢 Healthy | |
| SL-07 | Senior living | 640 | 93% | 99.3% | 5.1% | 🟢 Healthy | |
| SL-04 | Senior living | 690 | 92% | 99.1% | 6.2% | 🟢 Healthy | |
| SL-08 | Senior living | 620 | 92% | 99.2% | 5.4% | 🟢 Healthy | |
| SL-05 | Senior living | 650 | 91% | 98.9% | 5.7% | 🟢 Healthy | |
| MM-05 | Multi-site medical | 560 | 93% | 99.4% | 5.3% | 🟢 Healthy | |
| MM-02 | Multi-site medical | 700 | 92% | 99.0% | 6.5% | 🟢 Healthy | |
| MM-06 | Multi-site medical | 540 | 91% | 99.0% | 5.9% | 🟢 Healthy | |
| MM-03 | Multi-site medical | 640 | 90% | 98.8% | 6.9% | 🟢 Healthy | |

## Problems and changes this week

One SEV-2, one open SEV-3 and five fleet changes this week. Full write-up of the SEV-2 is in the sample post-mortem.

| Date | Item | Bots | Detail |
| --- | --- | --- | --- |
| Nov 7 | SEV-3 opened: CRM sync failure | MM-04 | Client’s CRM API token expired; 38 leads queued and retrying. Waiting on client admin to reissue. |
| Nov 6 | Knowledge refresh | SL-06 | Added answers for 2 of 4 new menu topics; 2 still need client content. |
| Nov 5 | Template v16 published | 6 BH bots | Routing rule restored to position 2 and restated at the end of the prompt. |
| Nov 4 | Webhook time-zone fix | BH-03, BH-05, SL-02, MM-01 | Business hours now read from each account’s IANA time zone instead of a fixed offset. |
| Nov 4 | Crawl exclusion rule | All 24 | Archive, legacy and dated paths excluded; 3 bots re-indexed, 41 stale pages removed. |
| Nov 4 | SEV-2 declared | BH-03 | Wrong-payer answers and misrouted handoffs (Client A). Resolved Nov 6. |
| Nov 2 | Template v15 published | 6 BH bots | Added tone guidance; moved the routing rule below the knowledge block. Rolled back by v16. |

## Watchlist and actions for next week

The goal for Nov 9–15 is all 24 bots back to Healthy, with MM-04’s queued leads delivered first.

- [ ] **MM-04:** get the reissued CRM token from the client admin and confirm all 38 queued leads land (Account manager, by Nov 11)
- [ ] **SL-06:** collect client content for the 2 remaining menu topics; target fallback under 7% (CX, by Nov 13)
- [ ] **6 BH bots on v16:** confirm a full week at or above 90% routing before moving them off watch (CX QA, Nov 15)
- [ ] **BH-05, SL-02, MM-01:** spot-check handoffs at the 8 am and 5–6 pm boundaries (Integrations, by Nov 12)
- [ ] **Fleet:** add day-over-day route-rate and form-completion alerts from the post-mortem (Platform, by Nov 25)
- [ ] **Fleet:** run the 40-question routing regression set before the next template publish (CX, ongoing)

**Next report:** Nov 17, covering Nov 9–15.

## Glossary

| Term | Plain meaning |
| --- | --- |
| Fleet | All 24 client assistants we run |
| Routing accuracy | Out of 100 chats, how many sent the visitor to the right next step |
| Handoff success | Out of 100 requests to talk to a person, how many reached one correctly |
| Fallback rate | How often the assistant could not find a confident answer |
| Containment | Share of chats the assistant fully handled without staff |
| Stale content | Out-of-date website pages the assistant should not use |
| CRM sync | Delivering each lead into the client’s own customer system |
| Template | A shared set of instructions used by several assistants at once |
| BH / SL / MM | Behavioral health, senior living and multi-site medical clients |
| SEV-2 / SEV-3 | Incident levels: SEV-2 affects customers; SEV-3 is smaller and contained |
