---
slug: /blog-posts/project-risk-and-who-carries-it
title: "Project Risk and Who Carries It"
sidebar_label: "Project Risk and Who Carries It"
sidebar_position: 4
description: "Tariffs, chip shortages, regulatory changes, and design unknowns. Why product development risk is structurally the customer's, not the engineering firm's."
---

# Project Risk and Who Carries It

Originally written for F3 Wireless.

_Product development is structurally risky. Components disappear, tariffs change, regulations move, and first prototypes surface problems no one predicted. Who absorbs the cost when those things happen is a contractual decision worth making explicitly._

Every product development program carries risk. A component goes end-of-life mid-design. A tariff changes the BOM cost overnight. A foreign government restricts an export the design depends on. A regulatory body issues new requirements that the certification has to meet. A first prototype reveals an interaction nobody anticipated. None of these events is rare; some version of one of them affects almost every program. The question worth answering before the engagement starts is who absorbs the cost when they happen.

## Where project risk comes from

Product development risk comes from a small number of recurring sources.

Component availability. A microcontroller selected at the start of the engagement is allocated to longer-lead orders by the time the design is ready to manufacture. A radio chip's distributor cuts off the small-volume channel. A connector is discontinued. Each of these requires either a redesign around an available alternative or a delay until the original part is available again. Neither option is free.

Trade policy. Tariffs on specific components or specific manufacturing geographies can change the BOM cost by 20 or 30 percent in a single rule change. A product designed against one tariff structure may not be commercially viable against another. Designs that need to move between manufacturing geographies, or that depend on components sourced from regions subject to export restrictions, are most exposed.

Regulatory change. FCC rules, cellular standards, and industry-specific certifications evolve. A product designed against one set of rules may face additional requirements before it can be sold under a new set. Cellular carrier certification programs change their test plans. New radio standards become available that affect competitive positioning.

Design discovery. Every first prototype surfaces issues that were not predictable from the schematic or the simulation. Some of these are routine (a matching network that needs to be retuned, a layout adjustment that recovers a few dB of sensitivity). Others are not. A chosen microcontroller may turn out to be incompatible with a chosen radio in some specific mode, and the resolution may require either a different microcontroller or a different radio. The team only discovers which one is the problem by building the first prototype.

Application complexity expansion. The product the customer described at the beginning of the engagement is rarely the product the customer needs by the middle of it. Application firmware, in particular, has a tendency to expand: a four-page requirements document at the start of the engagement can produce a forty-page firmware specification by the time the application is being built out. The added scope is usually legitimate and necessary; it is also work that was not in the original estimate.

## Risk follows upside

The party that captures a project's upside is the party that carries its risk. This is a general principle of how risk and reward align, and it applies to product development cleanly.

The customer of a product development engagement captures the entire commercial upside of the product. If the product sells well, the customer makes the money. If the product becomes a market leader, the customer captures the strategic value. The engineering firm sees none of that upside; the firm is paid for its hours regardless of how the product performs commercially.

Symmetrically, the customer carries the downside. If the product runs into a component-availability problem that requires a redesign, the additional engineering hours cost the customer money. If a tariff change makes the BOM uneconomic, the cost of redesigning around it is the customer's. If a first prototype reveals a problem that requires a third prototype iteration, the additional cycle is on the customer's account. The engineering firm does the additional work and bills for it. The work itself is not free, and there is no version of the engagement in which the additional work happens without someone paying for it.

Reversing the alignment would require the engineering firm to participate in the upside. A firm that bears the cost of unforeseen redesigns would, to be sustainable, need a share of the product's revenue or margin. That model exists (it is approximately the ODM model), and it comes with the consequences described elsewhere: the firm owns the design, the firm controls the manufacturing, and the customer loses the optionality of moving the design freely.

## Why the hourly model fits

The hourly billing model is structured around the alignment between risk and upside. The customer pays for the time the engineering team spends on the engagement, including the time spent responding to events the team did not predict. The estimate at the start of the engagement is a target the team commits to working against, not a fixed cost the team commits to delivering at any price. The communication norm that accompanies the model is transparency. A variance from the estimate that is large enough to matter is surfaced before it is incurred. The customer learns about the cost of a redesign before the redesign starts, with the options presented and the trade-offs explained, so that the customer can make an informed decision about whether to proceed.

Customers who prefer the predictability of a fixed-price contract sometimes find this disorienting. The compensating predictability of the hourly model is in the other direction: the customer knows exactly what is being worked on, exactly how much it has cost so far, and exactly what the team is doing about anything that has gone wrong. A fixed-price contract hides this information inside the contract; an hourly contract surfaces it weekly.

## What can be mitigated

Risk cannot be eliminated. It can be reduced through choices made early in the engagement.

Component selection that favors widely-used, multi-source parts reduces availability risk. A microcontroller from a major vendor with a known long lifecycle is safer than a part from a smaller vendor with uncertain support. A radio chip with a clear successor in the same family is safer than a sole-source part.

Designs that can accommodate component substitutes with minimal change (matching networks designed to tolerate part variation, firmware abstracted from the specific radio chip) are easier to repair when a component disappears.

<!-- vale Circe.TrailingContrast = NO -->
Early certification engagement reduces regulatory risk. A team that has done the certification math during the architecture phase, rather than discovering it during the certification cycle, can structure the design to pass on the first attempt rather than the third.
<!-- vale Circe.TrailingContrast = YES -->

Realistic requirements documents reduce scope-creep risk. A requirements document that captures the full application from the start, with acknowledged unknowns explicit, is harder to drift from than one that captures only what the customer was sure of at the beginning.

:::note[Mitigation is not elimination]

Every design decision that reduces risk has a cost: a more expensive component, a more conservative architecture, a longer planning phase. Mitigation is appropriate where the cost is justified by the risk reduction. It is not appropriate to apply uniformly to every decision; that produces over-engineered, over-budget products that do not ship.

:::

## The alternative models

<!-- vale Circe.TrailingContrast = NO -->
Fixed-price contracts for product development exist. They work badly. The engineering firm has to price in a contingency that covers the worst plausible outcome, which makes the contract expensive in the typical case where the worst case does not materialize. If the worst case does materialize, the firm has to absorb the cost rather than do the work, which incentivizes shortcuts that the customer would not want if the customer understood the trade-off.
<!-- vale Circe.TrailingContrast = YES -->

Equity-based engagements (the engineering firm takes a share of the product company in exchange for development work) align the firm with the upside but produce other distortions. The firm becomes a partial owner of every customer, with the attendant conflicts of interest, and the firm has limited capacity for additional engagements because each new equity-based engagement adds permanent overhead.

ODM relationships transfer the design to the firm and recover cost through manufacturing margin. The firm absorbs more development risk than it would in a work-for-hire engagement, in exchange for design ownership and manufacturing lock-in. The customer trades upfront cost for long-term flexibility.

Work-for-hire with hourly billing is none of these. The firm takes no risk on the product's commercial performance, the customer pays for what gets done as it gets done, and the customer carries the upside and the downside of the program. Each model fits some customers better than others. The right one for a given customer depends on what the customer wants to optimize for.
