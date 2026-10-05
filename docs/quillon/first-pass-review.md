---
title: Run first-pass review with AI tagging
description: Let Quillon suggest responsiveness and privilege tags on a review set, then check the suggestions it is least sure of.
owner: review-squad
audience: [internal, client]
areas: [review]
status: current
last_reviewed: 2026-08-20
review_every: 90
sidebar_position: 20
---

# Run first-pass review with AI tagging

AI tagging suggests a first-pass tag for every document in a review set. After this page you can start a tagging run and work the queue of documents that need a person's call.

## Before you start

You need the **Matter admin** role to start a run. **Reviewers** can accept or change suggestions.

The review set must finish processing. A document still in processing shows a gray clock icon in the **Status** column.

## How suggestions work

Quillon reads each document and suggests one of three tags, with a confidence score from 0 to 1.

| Suggested tag | Meaning |
|---|---|
| Responsive | Likely falls within the document requests. |
| Not responsive | Likely falls outside them. |
| Potentially privileged | May contain attorney-client communication or work product. |

Suggestions at or above 0.80 confidence apply as provisional tags. Suggestions below 0.80 go to the **Needs a decision** queue.

A suggestion of **Potentially privileged** always goes to the queue, at any confidence. Privilege calls stay with a person.

## Steps

1. Open the review set and select **AI tagging**.
2. Select **Start run**. Large sets take about one hour per 50,000 documents.
3. When the run finishes, open **Needs a decision**.
4. For each document, select **Accept** to keep the suggestion, or choose a different tag.
5. Provisional tags become final when a reviewer accepts them or when a **Matter admin** selects **Confirm provisional tags** on the review set.

## Limits

- AI tagging reads text. Image-only files without OCR text go straight to **Needs a decision**.
- Tags apply to one review set. A document in two review sets carries a separate tag in each.
