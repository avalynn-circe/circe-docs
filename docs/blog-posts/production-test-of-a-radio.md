---
slug: /blog-posts/production-test-of-a-radio
title: "Production Test of a Radio Product"
sidebar_label: "Production Test of a Radio Product"
sidebar_position: 13
description: "How manufacturing test for radio products differs from design verification, what gets checked on every unit, and what happens when production test is skipped or done wrong."
---

# Production Test of a Radio Product

Originally written for F3 Wireless.

_Manufacturing test for a radio product asks a different question than design verification. What gets checked on every unit, what does not, and the failure modes that show up when production test is skipped or done against the live network._

Design verification test (DVT) asks whether the design meets its requirements. Production test asks whether the individual unit coming off the line is a good copy of the verified design. The questions are different, the procedures are different, and confusing the two produces either products that ship broken or production lines that move too slowly to be commercially viable.

## A different question

DVT runs once. The design is tested against the full requirements document, with every measurement that the requirements call for, in conditions that fully characterize the design's behavior. The cycle takes weeks or months and produces a verified design ready for production.

Production test runs on every unit. The question is no longer whether the design works (DVT answered that). The question is whether this unit was built correctly: are all the components installed, are the right values placed, are the solder joints sound, is the antenna feed connected, is the radio functional at the level the design verified.

Production test does not need to re-verify the design's full performance. The design was already verified. What can change unit to unit is the manufacturing: a wrong component value placed, a component omitted, a solder joint that fails after thermal cycling, an assembly defect that lets the antenna feed contact a ground plane it should not touch. Production test catches manufacturing defects, not design issues.

## What gets checked

A production tester for a radio product checks a small set of measurements that, in combination, confirm the radio is functional and within tolerance. The measurements are chosen for speed and diagnostic value: they have to run quickly (a few seconds per unit at most) and they have to identify the failure mode when something is wrong.

Conducted transmit power on one or two channels. If the radio is producing the expected power at the expected frequency, most of the transmit chain is working. A unit that is 10 dB low has a problem in the power amplifier path, the matching network, or the antenna interface; the production tester flags it for rework before it ships.

Conducted receive sensitivity at a single power level. A signal is injected at a level a few dB above the design's nominal receive sensitivity, and the radio either demodulates it correctly or does not. A unit that fails this check has a problem in the receive chain. The production tester does not need to characterize the full sensitivity curve; it needs to confirm that the receiver works. Frequency reference check. The radio's transmit frequency is measured and compared to the expected value. A unit with the wrong crystal value, a missing load capacitor, or a damaged crystal will fail this check immediately, and the failure mode is clear from the magnitude of the error.

Antenna feed continuity, where the product design allows it. A simple impedance check on the antenna feed line catches assembly errors that prevent the radio from radiating, even when the radio itself is operating correctly.

The complete set runs in a few seconds per unit on a properly designed tester. Throughput rates of hundreds of units per hour are achievable for a single-radio product; multi-radio products take proportionally longer.

## Crystal verification

The crystal frequency reference is one of the most common production-side failure points in radio products. The crystal itself has a tolerance, and the load capacitors that set the operating frequency are sized during DVT to bring the reference to its nominal value. Manufacturing variation in any of these components shifts the frequency.

A unit shipped with a poorly tuned crystal does not necessarily fail to connect. It may work fine when new, with intermittent connection issues that worsen as the crystal ages further off frequency over months and years. Field-failure modes that present as flaky connectivity that resists firmware fixes, in products that worked correctly when shipped, often trace to crystals that were never verified at manufacturing.

:::note[The pattern in consumer Wi-Fi]

A meaningful share of consumer Wi-Fi access points on the market never have their crystals verified at manufacturing. The products work for the first year, drift further off frequency as the crystal ages, and reach the point where the access point cannot hold connections reliably. The cause is a manufacturing-test omission. The fix is a frequency check that takes a fraction of a second per unit.

:::

## Tests that are not tests

Several common approaches to production testing of radio products produce results that look like tests and are not.

The live-network check for cellular. A unit with a SIM card is powered up and tested against whatever cellular network is in range. The unit either attaches and passes traffic or it does not. The problem: the cell site is sometimes outside the manufacturing floor, in which case a unit with the antenna torn off can still attach. Other times the local network is congested or the carrier is having a service event, in which case a perfectly functioning unit fails the test. Neither result tells the production line anything useful about the unit being tested.

The Wi-Fi connect-to-an-access-point check. A unit is placed near an access point and the production line confirms it associates. The access point's transmit power is uncontrolled, its location relative to the test fixture is uncontrolled, and the result depends on whatever Wi-Fi traffic is in the area that hour. Units that fail the test sometimes have nothing wrong with them; units that pass the test sometimes have problems that would have shown up in a controlled measurement.

<!-- vale Circe.TrailingContrast = NO -->
The GPS-fix-in-the-parking-lot check, when used as a production test rather than as informal validation. A unit either sees enough satellites to get a fix in the open sky outside the factory, or it does not. The test does not distinguish between a unit that just barely manages a fix and a unit with full radio performance, and weather or constellation geometry can produce false failures on units that would work in the field.
<!-- vale Circe.TrailingContrast = YES -->

In each case, the underlying issue is the same: the production test is run against an uncontrolled signal source in an uncontrolled environment. A test in an uncontrolled environment is not a test.

## Designing the tester

A production tester for a radio product is a piece of dedicated hardware: a shielded fixture that connects to the unit under test through a controlled RF path, with calibrated instruments (power meter, signal generator, spectrum analyzer, or a vector signal analyzer that does all three) on the test bench side. The fixture also handles whatever DC power and digital interfaces the unit needs to come up and accept test commands.

The tester firmware is application-specific. It knows what unit is under test, what commands to send to put the radio into test mode, what measurements to take, and what limits to compare them against. The result for each unit is a pass-fail report plus the measured values logged for traceability.

A well-designed tester is also self-checking: a known reference unit can be inserted at the start of a shift to verify that the tester itself is operating correctly, and the calibration of the test equipment is verified on a defined schedule. Without this discipline, a drifting tester can silently start failing good units or passing bad ones.

The tester is built once, deployed at the contract manufacturer, and runs across the production run. Modifications happen when the product design changes (a new component requires updated test parameters) or when the contract manufacturer's process changes. Otherwise the tester is fixed infrastructure.

Building the tester is engineering work in its own right, often a separate engagement from the DVT phase of the product development. The tester engagement produces a tester that the contract manufacturer can operate, plus the documentation the manufacturer needs to run it. Once delivered and validated through pilot production, the tester runs for the life of the product, with maintenance and troubleshooting available as future engagements when needed.
