---
title: Set up an ethical wall
description: Screen named people from a matter so they cannot open it, search it, or see that it exists.
owner: platform-squad
audience: [internal]
areas: [permissions]
status: current
last_reviewed: 2026-09-10
review_every: 60
sidebar_position: 50
---

# Set up an ethical wall

An ethical wall screens named people from a matter, often because of a conflict of interest from earlier work. After this page you can create a wall and confirm it holds.

## Before you start

You need the **Workspace admin** role. Matter admins cannot create or remove walls.

## How a wall behaves

A wall overrides every role. A screened person cannot open the matter, find its documents in search, or see its name on the **Matters** page. This holds even if someone adds them to the matter later.

## Steps

1. Go to **Settings** and select **Ethical walls**.
2. Select **New wall** and choose the matter.
3. Add each screened person. Add the reason, for example "Prior representation of opposing party, 2023."
4. Select **Create wall**. Quillon removes any screened person who already had access and notifies the matter admins.
5. Select **Test access** and choose a screened person. Quillon reports what that person can see in the matter. The expected result is nothing.

## Audit

Every wall change records who made it, when, and the reason. Export the record from **Ethical walls** with **Export audit log**.
