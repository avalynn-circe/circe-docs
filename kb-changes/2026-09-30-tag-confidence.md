---
title: Adjustable confidence threshold for AI tagging
date: 2026-09-30
areas: [review]
owner: review-squad
---

Release 26.10 makes the AI tagging threshold adjustable per review set.

- Matter admins set the threshold on the review set's AI tagging panel, from 0.50 to 0.95. The default stays 0.80.
- Changing the threshold after a run re-sorts existing suggestions. It does not rerun tagging.
- Potentially privileged suggestions still always go to Needs a decision.
