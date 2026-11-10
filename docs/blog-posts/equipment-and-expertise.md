---
slug: /blog-posts/equipment-and-expertise
title: "What Equipment Does and Doesn’t Tell You About a Firm"
sidebar_label: "What Equipment Does and Doesn’t Tell You About a Firm"
sidebar_position: 15
description: "Anyone with capital can buy a spectrum analyzer. Equipment is the floor of what a wireless engineering firm needs, not the ceiling. What separates a firm worth hiring from one that just has the gear."
---

# What Equipment Does and Doesn’t Tell You About a Firm

Originally written for F3 Wireless.

_Anyone with capital can buy a spectrum analyzer. The instrument list is the floor of what a wireless engineering firm needs, not the ceiling. The harder question is what the firm does with it._

Anyone with enough capital can buy a Formula One race car and drive it once around the track without crashing. The car is not the driver. The same logic applies to a wireless engineering firm. The instrument list (the anechoic chambers, the call boxes, the signal generators, the spectrum analyzers) is the equipment any serious firm needs to do the work. It is not what makes the firm capable of doing it.

## Equipment is the floor

A wireless engineering firm without the equipment is not in the business. Renting lab time externally limits the firm to whatever iteration cycle the external lab can support, which is too slow for any program with a real schedule. Owning the equipment is a prerequisite. The instruments enable the work; they do not perform it.

What the equipment list communicates is whether the firm has cleared the threshold of seriousness: anechoic chambers and screen rooms for radiated work, call boxes for cellular, multi-channel signal generators for GNSS, vector signal analyzers and generators for the modulations the firm supports, antenna measurement systems for radiation pattern characterization. A firm without these is asking the customer to fund the equivalent of a rented-lab cycle, which is the same problem the customer would have had hiring engineers and renting time externally. The firm has to clear this floor to be worth engaging.

Above the floor, equipment is uninformative. Two firms with identical instrument lists can produce entirely different results on the same product. The variable is the engineering, not the inventory.

## Three issues vs. thirty

The most useful indicator of a wireless engineering team's experience is what happens with a first prototype. A team that has not done many radio products produces a first prototype with thirty significant issues. A team with twenty-five years of experience producing radio products produces a first prototype with three significant issues, on average, in the same product class.

The difference is not that the experienced team makes fewer mistakes. The difference is that the experienced team avoids the mistakes that the inexperienced team has not yet learned to avoid. The PCB stackup that desensitizes the receiver. The matching network topology that loses three dB to component tolerances. The antenna position that detunes when the user holds the device. The clock harmonic that falls in the GPS band. The motor controller switching frequency that radiates into the Wi-Fi band. Each of these is a problem that an experienced engineer recognizes before the schematic is finalized, and a problem that an inexperienced team discovers during DVT, or worse, after units have shipped.

## Mitigations have to compound

The cost of a high-issue-count first prototype is not a multiple of the cost of a low-issue-count one. The cost is exponential, because radio performance problems do not respond to partial fixes.

A receiver with three independent sources of desensitization (say, the motor controller, the switching regulator, and a USB clock harmonic) does not improve when only one is mitigated. The other two still dominate the noise floor, and the radio still performs at the same level. The mitigation is only visible once all three are addressed, which means the engineer cannot tell from the measurement which of the three was the bigger contributor, and cannot iterate on the worst offender first. Every mitigation has to be applied before any of them produces a visible improvement.

The implication for a team with thirty issues is that thirty mitigations have to be designed, implemented, and verified before the radio's performance moves. The implication for a team with three is that three mitigations are enough. The schedule difference is not 10x; it is closer to 30x once the debugging time is included, because each additional issue increases the debugging difficulty for every other issue.

:::note[Why this is the central question]

The number of issues a first prototype has is what determines whether the program ships on time or doesn't. Equipment counts get you to the test bench. What happens at the bench is what determines whether the schedule survives.

:::

## What to look for in a firm

Beyond the equipment list, a few questions separate firms that have done wireless work seriously from firms that have not. The questions are not trick questions; the answers are easy to give if the firm has the experience and difficult to fake if it does not.

How many radio products has the firm completed in the last five years? The number gives a rough indication of how much pattern-recognition the team has accumulated. A firm that has finished twenty products has seen most of the failure modes; a firm that has finished two has seen a small subset.

What is the firm's first-prototype yield? An honest answer acknowledges that no first prototype is perfect, and gives a sense of how close to perfect the team typically gets. A firm claiming first-prototype perfection is either inexperienced or untruthful.

What happens when a customer's program runs into a problem that the firm did not anticipate? The answer should describe a process: characterize the issue, identify the cause, propose alternatives, communicate trade-offs, agree on a path forward. A firm that promises that problems will not happen is promising something no engineering firm can deliver.

What is the relationship between the firm and the customer's IP? In a work-for-hire engagement, the customer should own the IP outright. In an ODM relationship, the firm typically retains rights to the design and recovers its investment through unit margin on manufacturing. Both models exist for legitimate reasons. The customer should know which model applies before signing, because the implications for manufacturing flexibility, second-source options, and long-term cost structure are large.

The instrument list is a hygiene check. The answers to these questions are what tell you whether the firm is worth engaging.
