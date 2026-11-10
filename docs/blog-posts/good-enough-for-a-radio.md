---
slug: /blog-posts/good-enough-for-a-radio
title: "What “Good Enough” Means for a Radio"
sidebar_label: "What “Good Enough” Means for a Radio"
sidebar_position: 6
description: "Link budget thinking, fade margin, the relationship between data sheet numbers and shippable performance."
---

# What “Good Enough” Means for a Radio

Originally written for F3 Wireless.

_Link budget thinking, fade margin, and the relationship between the chip's data sheet, the design's measurements, and the requirements that decide whether a product ships._

A radio either does its job in the product or it does not. The threshold for doing the job is rarely the number printed on a chip's data sheet. It is the number the link budget requires, which depends on what the product is, how it will be used, and what environment it will operate in. Defining “good enough” for a radio means resolving those questions before the first measurement is taken.

## Range is measured in dB

A common starting point for a customer specification is a range in meters or feet. “The product needs to work at 100 meters.” Range stated in distance is incomplete on its own. The achievable range depends on what is in the path between the two endpoints, what the operating environment does to the signal, and how much margin the design carries against the worst case.

The unit that captures all of this is the decibel. A link budget accumulates transmit power, antenna gains at both ends, path loss across the operating range, and a margin for variation. The result is a number in dB. If the link budget closes with margin to spare, the range is achievable. If it does not, the range is not achievable regardless of what the requirements document specifies.

:::note[The 6 dB rule]

Every 6 dB of additional margin doubles the achievable range. Every 6 dB lost halves it. The relationship comes from the inverse square law governing free space propagation: a factor of two in distance is a factor of four in power, which is 6 dB.

:::

## Free space is not the real world

Free space path loss describes propagation in a vacuum. The real world adds attenuation from obstacles (walls, doors, people, vehicles), reflection from surfaces (metal, glass, water), and multipath effects when the direct signal and reflected signals arrive at the receiver with different phase relationships.

Multipath fading is the dominant effect in most indoor and mixed environments. Reflections can arrive in phase with the direct path, adding to the signal, or out of phase, canceling part of it. Cancellation can produce fades of 20 to 30 dB in the worst cases, and the location of the fade can shift with small movements of the transmitter, the receiver, or anything in the path.

A link budget that does not include a fade margin describes a radio that works under controlled conditions and fails in normal use. The standard allowance is 20 to 30 dB of fade margin for indoor or mixed environments, less for outdoor line-of-sight, more for environments with heavy obstruction or reflection.

The implication for range specification: a 100-meter requirement in an open field is a different design from a 100-meter requirement in an office building with metal-framed walls. The first might close with a 20 dB fade margin. The second might require 30 dB or more and a different antenna configuration. Treating them as the same requirement produces a product that meets one and fails the other.

## What the data sheet says and what the radio does

A radio chip's data sheet specifies receive sensitivity under defined conditions: a specific modulation, a specific data rate, a specific reference bit error rate, measured at the chip's antenna pin. These numbers describe the radio's intrinsic performance.

A radio integrated into a product loses some of that performance to implementation. PCB traces between the radio and the antenna have loss. Matching networks have loss. Component tolerances stack. Two to four dB of total implementation loss is typical and expected. A radio that measures 3 dB below the data sheet number is performing normally.

Six dB of loss is a conversation. The cause might be a PCB layout that can be improved, an antenna match that can be tuned, or a component substitution that recovers some margin. Whether to pursue the fix depends on what the link budget needs.

Twenty dB of loss indicates a design problem that requires investigation. The radio is not meeting its specifications in any meaningful sense. The cause is usually interference from elsewhere in the product (a switching regulator, a digital clock, an unshielded interface) degrading the receiver, or an antenna that is grossly mismatched to the radio.

The data sheet number is the ceiling. The link budget is the requirement. Performance between the two is shippable if the link budget closes.

## Defining the use case

The link budget calculation requires inputs that come from the use case, not from the radio specification. Three questions resolve most of them.

What is the operating environment? Open outdoor space, indoor commercial, indoor residential, industrial with heavy metal structures, vehicular: each implies a different fade margin, sometimes a different antenna design, and sometimes a different choice of radio technology entirely.

What is the operating range, and is it symmetric? A device that needs to receive at 100 meters but only transmit at 10 meters has a different link budget than one that needs symmetric range. Many radio links are inherently asymmetric, because the two endpoints have different transmit power and antenna characteristics. A custom controller talking to a high-power transmitter in a product can hear the product across a useful distance, while the product can hear the controller only at much closer range. The system range is the shorter of the two.

What is the failure tolerance? A product that occasionally drops a connection is acceptable in some applications and unacceptable in others. The required fade margin scales with how reliable the link needs to be.

The answers determine the link budget. The link budget determines whether the measured radio performance is good enough.

## Good enough is a business decision

The technical question (does this radio meet the link budget) has a clear answer. The business question (is this radio good enough to ship) sometimes does not align with it.

A radio that closes the link budget with 2 dB of margin can be improved with another four to six weeks of engineering work to recover an additional 3 dB. Whether to do that work depends on the ship date, the cost of the additional engineering, the volume implications of better performance, and the competitive position of the product. None of these are RF questions.

The engineering role is to produce the measurements and the link budget, and to explain what an additional 3 dB would cost in time and effort and what it would buy in range or reliability. The decision about whether to spend the cost belongs to the customer, who carries the business consequences of either choice.

A radio that meets the link budget is good enough to ship. A radio that exceeds the link budget by a comfortable margin is good enough to ship now and improve later. A radio that does not meet the link budget is not good enough to ship in any version of the product that the link budget describes.
