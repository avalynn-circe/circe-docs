---
slug: /white-papers/tickets-for-second-language-readers
sidebar_label: "Tickets for second-language readers"
sidebar_position: 3
description: "Ticket rules for a team that mostly reads English as a second language: short sentences, tables, plain results."
---

# Writing tickets for a team that reads English as a second language

By Avalynn Circe, Botco CX. Written 2026-11-10 from the team's Linear conventions.
No client names appear in this paper. The examples marked "invented" were written for this paper.

## The problem in two sentences

- Most people who may pick up a Botco ticket read English as a second language. First languages include Spanish, Portuguese, French and Urdu.
- Long English prose costs them effort. Bullets and short sentences cost less.

## The rules

| Rule | Reason |
|---|---|
| Short sentences. One idea per bullet. | Less to hold in mind at once. |
| No idioms, no phrasal verbs, no figures of speech. | They do not translate. |
| Active voice. Common words. | Easier to parse. |
| Tables for before and after values and for test results. | A reader can scan them. |
| State results plainly: "correct", "still blocked". | No story to follow. |
| Shared product terms are fine: InstaStack, Data Submit, Goal card, block, intent. Define anything else. | The team already knows them. |
| No em dashes. | A simple punctuation set. |

These rules apply to ticket comments. They do not apply to chat or leadership reports.

## An invented example

Before:

> So I dug into this and it looks like the card kicked off before the attribute landed, which is why the zip came back empty.

After:

- The zip code was empty.
- The card ran before the attribute was saved.
- I confirmed this in the logs.

## The ticket structure

**Finished CX ticket.** Assign to the QA lead. Status: In Review. The QA lead tests and owns the production deploy. Do not move a ticket to him until the work is done.

**Fix handoff: two comments.** Use this only when you changed a bot.

1. Comment 1, the deep dive. Do not tag anyone. It lists what was wrong, what changed (bot, block, card, field, old and new value), how it was tested (a table), and what is left.
2. Comment 2, the summary. Tag the QA lead. A few bullets with the bottom line. End with "Deep dive above."

Reason for two comments (decided 2026-09-12): the tag sends the notification. It should point to a short summary. The QA lead should not need to open a long technical comment to find what to do.

On an analysis ticket there is nothing to put under "What I changed". Do not post the template. Give the finding itself.

**Engineering bug ticket** (the standard from BOT-5862, 2026-08-27):

- Create it on the Botco App team (prefix BOT-). Status: Triage. Assigned to the engineering lead.
- The title states the failing behavior only. Never a suspected cause. Never a fix. A theory in a title becomes a conclusion for the next person.
- Put any proposed remedy in a comment.
- Include three items that were usually missing: the InstaStack collection, every turn of the conversation in order (user text and bot reply), and what you already tried and ruled out.
- Priority Urgent only when business accounts are at immediate risk of churning, no workaround exists, and it cannot wait until tomorrow or Monday. Most bugs are Medium.

## A file for a future AI session

On a long investigation, attach `AI-READ-ME-FIRST.md` to the ticket. It has eight sections: bottom line, where things are, what changed, source trust map, verified claims with provenance, retractions and dead ends, runnable commands, open threads. Date every claim. Say in the header that anything old must be checked again.

Do not do this for routine fixes. An old file is worse than no file.

## Limits of this paper

- These are team rules. No reading test was done. The figure "about 90% of readers" comes from the convention text. We did not measure it.
- We did not check whether the rules improved response time or reduced questions on tickets.
- The invented example shows the rule. It is not a real ticket.

## Sources

- Botco Linear conventions: comment style, handoff, ticket templates.
- Engineering bug ticket standard, BOT-5862 (2026-08-27).
- Two-comment decision, 2026-09-12.
