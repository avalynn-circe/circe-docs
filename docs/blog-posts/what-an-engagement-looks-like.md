---
slug: /blog-posts/what-an-engagement-looks-like
title: "What a Wireless Engagement Looks Like"
sidebar_label: "What a Wireless Engagement Looks Like"
sidebar_position: 2
description: "From requirements document to certified prototype. The specialists involved, the artifacts produced, and the way hours and outcomes are tracked across the engagement."
---

# What a Wireless Engagement Looks Like

Originally written for F3 Wireless.

_From the first requirements conversation to the certified prototype: the specialists involved, the artifacts produced, the way hours are tracked, and what shows up in the customer's hands at each stage._

A wireless product engagement is a sequence of stages: requirements, architecture, design, build, verify, certify, hand off. Each stage produces specific artifacts, involves specific specialists, and consumes a predictable share of the total labor hours. The total labor for a moderately complex connected product typically runs three to four thousand hours, spread across a team of six to eight specialists, over nine to twelve months of calendar time. This article walks through what happens in each stage and what the customer sees at each milestone.

## Requirements first

An engagement begins with a product requirements document. The document captures what the product is supposed to do, what it has to interoperate with, what its physical and environmental constraints are, what its target manufacturing geography and volume are, and what its commercial constraints look like. Cost targets, ship dates, certification markets, and second-source requirements all belong in the requirements document.

The requirements document is the foundation for everything that follows. Each requirement in the document has to be testable, meaning there has to be a defined test that produces a pass or fail result against the requirement. A requirement that cannot be tested is not a requirement; it is an aspiration, and aspirations cannot be verified at the end of the engagement. The discipline of writing testable requirements catches ambiguity early, before the design has been built around an interpretation that turns out to be wrong.

The requirements document is also where business constraints become technical decisions. A requirement that the product must support 100 meters of range in an office environment implies a link budget, an antenna configuration, and possibly a choice among radio technologies. A requirement that the product must achieve a specific BOM target implies constraints on which radios, which microcontrollers, and which auxiliary components are in scope. These translations happen during the requirements conversation, with the engineering team explaining trade-offs and the customer making the decisions that match the business case.

## Who actually works on the product

A connected-product engagement typically involves six to eight specialists working in coordination. The roles:

System engineer. Owns the architecture, manages the requirements, interfaces with the customer, and coordinates the technical work across disciplines. Active throughout the engagement.

RF engineer. Designs the radio circuit, selects the radio components, sizes the matching networks and antenna interface, runs the radiated and conducted DVT measurements, and resolves the RF performance issues that emerge during integration. Most active in the early design and the DVT cycles.

Electronics engineer. Designs the non-RF portion of the circuit (power, microcontroller interface, sensors, motor or actuator drivers, USB, Ethernet, and so on). Coordinates with the RF engineer on shared boundaries (clock noise, switching regulator interference, ground topology). Active during schematic capture and first-prototype debugging.

PCB layout technician. Places the components and routes the traces. RF layout is a specialized skill; a poor layout can degrade radio performance by 10 dB or more regardless of how good the circuit is. The layout role is typically a senior specialist with hundreds or thousands of radio designs behind them.

Mechanical engineer. Designs the enclosure, the antenna integration, the user-facing surfaces, and the thermal management. The enclosure affects RF performance (detuning the antenna, providing or failing to provide shielding) and the mechanical engineer works with the RF engineer on the choices that affect both.

Firmware engineer (one to three, depending on application complexity). Writes the embedded software that runs on the product. The work splits between the board support package (drivers for the microcontroller's peripherals) and the application layer (the product-specific behavior). Application firmware scales with product complexity; a four-page requirements document can produce a forty-page firmware requirements document.

Application developer (when the product has a companion app). Writes the iOS, Android, or web application that pairs with the product. Active in parallel with the firmware team, with coordination on the protocol between them.

Each of these specialists is a permanent member of F3's staff, working full-time across multiple engagements simultaneously. The customer's product is one of several each specialist is touching in any given week.

## Hours, not headcount

The customer pays for the specialists' hours on the engagement, not for their salaries. A PCB layout technician might spend 80 hours on a particular product's printed circuit board layout, then move to the next engagement. The customer pays for the 80 hours, gets the work of a senior specialist with deep experience in radio layout, and does not carry the cost of that specialist when there is nothing for them to do.

The economics are different from hiring full-time. A startup or a large company that needs the same work done internally would have to either find a layout specialist with the right experience (rare, expensive, and slow to hire) or train one over years. Either path is more expensive than paying for the hours of an experienced specialist who already exists.

Each specialist's time on an engagement is tracked against a defined scope and an estimate produced during the requirements phase. The estimate is not a fixed price; it is a target that F3 commits to working against, with variances explained in the weekly status updates that the customer receives. A variance from the estimate that is large enough to matter is communicated before it is incurred, with the cause explained and the options for addressing it presented.

## Architecture and trade-offs

After the requirements are agreed, the system engineer produces an architecture: which microcontroller, which radio, which auxiliary components, which firmware platform, which application architecture. The architecture is the first place where the requirements become design choices, and it is where most of the trade-offs that affect cost, schedule, and performance get resolved.

Architecture review is an interactive process with the customer. A choice between two radio technologies (say, Wi-Fi versus BLE for a remote-control application) has implications for range, throughput, battery life, BOM cost, and the user experience. The engineering team explains the implications. The customer makes the choice. Documentation of the choice and its rationale becomes part of the engagement record, so that later questions about why the product was built a particular way have a defined answer.

:::note[Why architecture is the leverage point]

Most of the cost and schedule of a product are determined by architecture choices made in the first few weeks. A wrong architecture choice can be fixed later, but the fix is expensive. The architecture phase is the cheapest place to be wrong and the cheapest place to change direction.

:::

## Build, measure, iterate

With architecture agreed, the design proceeds through schematic capture, PCB layout, firmware development, and mechanical design in parallel. The first prototype boards arrive a few weeks after schematics are finalized. The first iteration of design verification begins immediately.

The DVT cycle on a first prototype almost always surfaces issues. An experienced team aims for three or so significant issues on a first prototype in a known product class; less experienced teams produce first prototypes with many more. Each issue gets characterized in the lab, root-caused, and resolved through a design change, a layout change, a component change, or a firmware change. The cycle repeats on the next prototype build.

Most products converge in two to four prototype iterations. A particularly difficult design may take more. The number of iterations depends on the complexity of the product, the experience of the team, and how much of the design is reused from prior engagements versus built from scratch.

## Certification and handoff

Once the design is converged and performing against the requirements, the engagement enters the certification phase. F3 prepares the design for the certification labs (FCC, CE, PTCRB or GCF for cellular products, plus any operator-specific approvals required for cellular), produces the documentation the labs need, and supports the lab visits. Certification typically takes four to eight weeks, depending on how many bodies are involved and how the lab schedules align.

When certification is complete, the design files (schematics, layout, firmware source, BOM, manufacturing documentation, test fixtures, certification reports) are handed to the customer. The customer engages a contract manufacturer (or several) and begins pilot production. F3 supports the pilot production if engaged to do so, helping resolve any manufacturing-process issues that emerge during the first build runs.

The engagement ends when the customer has a certified, manufacturable design in hand and the production process is stable. F3 hands off and steps back. The customer owns the design, owns the certifications, and owns the manufacturing relationships. Future work happens at the customer's initiative on a defined scope, billed by the hour as it occurs.
