---
slug: /white-papers/naive-bot-health-numbers
sidebar_label: "Why naive health numbers are wrong"
sidebar_position: 2
description: "A board printed 60% unanswered. Measured correctly, 3.2% of sessions hit any dead end. Ten ways the simple count fails."
---

# Why naive bot health numbers are wrong

By Avalynn Circe, Botco CX. Written 2026-11-10 from the weekly health report method and its known-issues file.
Client names are changed. Bot, deployment and tenant ids are removed. Numbers and dates are copied from the method files. They were not re-run for this paper.

## The problem in two sentences

- The weekly board printed "60% unanswered" for one bot. Measured correctly, 3.2% of its sessions hit any dead end, and 0.5% hit a real knowledge base gap.
- The 60% was a ratio of two different groups of events. It led to a High priority ticket (CX-2786) and two investigation sessions.

## What "unanswered" means

- It means one thing: the bot had no grounded answer for that turn.
- This is often correct. A user says "hi", or asks an HR bot about the weather. A good bot declines.
- A high rate is not a failure. It depends on the bot and its scope.

## The same bots, two rates

Window: 2026-08-09 to 2026-09-08 (30 days).

| Bot | User-impact rate | Knowledge base coverage rate |
|---|---|---|
| Reference bot 1 | 0.31% (35 users, 11,294 sessions) | about 9% |
| Reference bot 2 | 0.80% (14 users, 1,749 sessions) | 53% |

- Both bots are rated good by the team.
- The coverage rate moves between 9% and 53%. The user-impact rate stays between 0.3% and 0.8%.
- Cause: the coverage rate has a small denominator, and its makeup differs by bot.
- The third reference bot had about 6 exchanges per week. Its "35%" should not have been printed.

## Ten ways the simple count is wrong

| # | What goes wrong | Size, where stated | Fix |
|---|---|---|---|
| 1 | Wrong marker. The phrase "STATIC FALLBACK" also appears in prompt text logged on most requests. | About 50 times too high | Count only the error line written by the InstaStack card in the production namespace. |
| 2 | Every log line of a request carries the endpoint name. | About 36 times too high, and uneven | Count distinct request ids. Do not divide by 2. |
| 3 | Sandbox and test bots run in the production cluster. | Two accounts showed false problems | Use a roster check per deployment. The sandbox flag is advisory only. It was wrong in the records. |
| 4 | The account list was built from traffic. A bot with none had no row. | The first run listed 18 accounts. The true number was 26. | Build the list from bots running in production. A silent bot then shows as zero. |
| 5 | Two groups of events were divided. Fallbacks from a menu "No Match" block were counted with knowledge base misses. | For one bot, 64 of 73 events were No Match | Split by which card fired. Never sort tags by name. Tag names are free text. |
| 6 | "Messages" counts every emission, not user actions. | 49,661 lines, 23,278 user actions (about 2.1 times) | Use the user-action count when you say "user messages". |
| 7 | A percentage on very small numbers. | 12 exchanges in a week were shown as 60% | Under 20 exchanges, print the count and "n/a". |
| 8 | The client dashboard card is wired wrongly. | Reported as 10 of 23 deployments on 2026-09-01. Other runs reported 13 of 29, and about 28%. We did not recompute these. | Run the card wiring audit each week. It shows whose dashboard is wrong and in which direction. |
| 9 | Ranking bots by week-over-week change too early. | A 2 to 4 point move on 20 to 30 conversations is noise | Mark change as provisional until about 6 to 8 weeks of history. Lead with volume loss. |
| 10 | Comparing across a runtime change. Release 4.2 changed three measures, bot by bot, from 2026-10-13. | Not sized | Never read a week-over-week change across a bot's runtime change. Past reports are not corrected. |

## What the method reports

1. **User-impact rate** (the headline): users who hit a dead end, divided by sessions with user input.
2. **Knowledge base coverage rate** (diagnostic only).
3. **Card wiring audit** (the most useful for action).

The user-impact rate has a known limit. The numerator counts users. The denominator counts sessions. A user who returns counts once. The rate is slightly low. State this when you report it.

## Not measured

- Whether an answer is correct. This needs a person to read it.
- A system error rate. Error logs hold thousands of routine lines per bot per day. They are not a clean signal.

## Limits of this paper

- The figures are copied from the method files. They were not run again.
- Item 8 has three different figures in the source files. They come from different runs.
- The note about the sandbox flag in the method (wrong in both directions) differs from a working note that says it errs in one direction only. We did not resolve this.

## Sources

- Weekly health method, version 3 (2026-09-08), known-issues file, and the release 4.2 note (2026-10-13).
- Ticket CX-2786.
