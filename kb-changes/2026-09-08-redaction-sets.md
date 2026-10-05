---
title: Redact privileged text with redaction sets
slug: redaction-sets
date: 2026-09-08
areas: [redaction]
owner: discovery-squad
audience: [internal, client]
description: Group redactions by reason, apply them to a production, and burn them into the produced images.
---

Redaction sets ship in release 26.9.

- Reviewers can create named redaction sets inside a matter. Each set has one reason: Attorney-client, Work product, or Personal information.
- In the viewer, Redact now asks which set a redaction belongs to.
- On a production, the matter admin picks which sets to apply. Redactions burn into images; each box is labeled with its set's reason.
- Documents with attorney-client or work product redactions show as Redacted on the privilege log.
- Natives with redactions get imaged at production.
- Permissions: Reviewer can draw redactions. Matter admin applies sets to a production.
