---
title: Redact privileged text with redaction sets
description: Group redactions by reason, apply them to a production, and burn them into the produced images.
owner: discovery-squad
audience: [internal, client]
areas: [redaction]
status: current
drafted_from: kb-changes/2026-09-08-redaction-sets.md
drafted_on: 2026-09-09
verified_by: avalynn-circe
verified_on: 2026-09-12
last_reviewed: 2026-09-12
review_every: 90
sidebar_position: 60
---

# Redact privileged text with redaction sets

A redaction set groups redactions under one reason, such as attorney-client privilege or personal information. After this page you can create a set, redact text into it, and apply it to a production.

## Before you start

You need the **Reviewer** role to draw redactions and the **Matter admin** role to apply a set to a production.

## Steps

1. Open the matter and go to **Redaction sets**.
2. Select **New set**. Enter a name and choose a reason: **Attorney-client**, **Work product**, or **Personal information**.
3. Open a document in the viewer and select **Redact**.
4. Choose the set from the list, then drag over the text to redact.
5. When review is complete, go to **Productions** and open the production.
6. Under **Redactions**, select the sets to apply.
7. Select **Produce**. Quillon burns the redactions into the produced images and labels each box with the set's reason.

## Limits

- A document can carry redactions from more than one set. Each box shows its own reason.
- Redacted documents appear on the [privilege log](./privilege-log.md) as **Redacted** when the set's reason is attorney-client or work product.
- Native files with redactions are produced as images.
