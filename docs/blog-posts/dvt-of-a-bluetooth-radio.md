---
slug: /blog-posts/dvt-of-a-bluetooth-radio
title: "DVT of a Bluetooth Radio"
sidebar_label: "DVT of a Bluetooth Radio"
sidebar_position: 10
description: "Design verification testing for Bluetooth Low Energy and Bluetooth Classic. Eval boards versus call boxes, power sag, bit error rate measurement, and what the Auracast shift means for new designs."
---

# DVT of a Bluetooth Radio

Originally written for F3 Wireless.

_Bluetooth Low Energy and Bluetooth Classic share a name and almost nothing else. The DVT setup, the reference equipment, and the choices about which variant to support all depend on which one is in the product._

Bluetooth design verification looks like the DVT cycle for any other regular radio at the hardware level: conducted and radiated transmit power, conducted and radiated receive sensitivity, frequency reference accuracy. The complications are protocol-specific and equipment-specific, and they are different for Bluetooth Low Energy than for Bluetooth Classic.

## Two radios, one name

Bluetooth Low Energy (BLE) and Bluetooth Classic share a name and very little else. They use different physical-layer modulations, different channel structures, different framing, and different application-layer protocols. A radio designed for one does not handle the other without a second radio block, and a product that supports both typically integrates a dual-mode chip that contains two separate radios on the same die.

Bluetooth Classic is a frequency hopper across 79 channels in the 2.4 GHz ISM band, with built-in support for application profiles (Hands-Free, Headset, Human Interface Device, Advanced Audio Distribution, and so on). It is the older standard and remains in use for high-bandwidth, latency-sensitive audio applications and for backward compatibility with the long tail of installed Classic devices.

Bluetooth Low Energy is a different radio that lives in the same band. The physical layer is GFSK with channel hopping across 40 channels, with the lower channels reserved for advertising and connection establishment. The application layer is built around the Generic Attribute Profile (GATT), which is fundamentally different from the Classic profile model. BLE is designed for low duty cycle, low power operation; the radio spends most of its time off.

New product designs almost always use BLE. Bluetooth Classic appears in new designs only when interoperability with legacy hardware requires it, most commonly in automotive applications where the installed base of Classic headsets and phones is too large to ignore.

## The eval board as a reference

A Bluetooth DVT cycle requires a reference radio: a known-good transmitter that produces a calibrated stimulus for receive sensitivity measurements, and a known-good receiver that captures and reports on the device under test's transmissions. Several options work.

A vendor evaluation board (eval board) for the same radio family or a closely related family is often the most practical starting point. Bluetooth chip vendors (Nordic, Silicon Labs, Texas Instruments, STMicroelectronics, and others) supply eval boards with firmware that exposes direct-test-mode commands. Direct Test Mode (DTM) is a Bluetooth-specification feature that lets the radio transmit a defined pattern continuously and lets the receiver count received packets and report bit error rates. The interface is standardized; an eval board running DTM can serve as a reference against any other DTM-capable radio.

The advantage of an eval board is cost and availability: a few hundred dollars, available from the chip vendor, and ready to use without specialized configuration. The disadvantage is that the eval board's transmit power varies with temperature and time, which has to be compensated for or the receive sensitivity measurements drift.

A protocol-aware vector signal generator or a cellular call box licensed for Bluetooth testing (Rohde & Schwarz and Keysight both offer this) produces a fully calibrated reference signal that does not drift. The cost is higher, but the measurement is cleaner. For design verification on a product expected to go through certification, the calibrated reference is the right tool. For early prototype characterization, an eval board is enough.

## Power sag and how to handle it

Eval boards produce a transmit power that depends on the temperature of the power amplifier. The first second of a continuous transmission may produce a different power than the tenth second, and the difference can be three dB or more by the time the amplifier reaches thermal equilibrium. When the eval board is the reference for a receive sensitivity measurement, this drift propagates directly into the measurement.

Two techniques handle the problem. The first is closed-loop power control: a power meter monitors the eval board's output continuously, and a variable attenuator between the eval board and the device under test adjusts to compensate for any drift. The attenuator can be electronically controlled and driven by a script that holds the delivered power at the target value across the full duration of the measurement.

The second technique is ovenizing: the eval board is placed inside a temperature-controlled enclosure and brought to a steady-state temperature (typically the upper end of the product's operating range) before the measurement begins. The power amplifier reaches thermal equilibrium and stays there, and the transmit power becomes stable enough that closed-loop compensation is not necessary.

Either technique is acceptable. The wrong choice is to ignore the drift, which produces receive sensitivity numbers that depend on how long the test ran and in what order the measurements were taken.

## Bit error rate and packet error rate

Receive sensitivity for Bluetooth is measured against a reference error rate. The Bluetooth specification defines reference sensitivity at a bit error rate of 0.1% (one error in 1,000 bits) for BLE, with the receiver achieving this at −70 dBm or better for the 1 Mbps PHY. Other PHYs and other Bluetooth variants have their own reference points.

Direct Test Mode lets the receiver report bit error rate directly when the transmitter sends a known fixed pattern (the all-zeros or pseudo-random sequences defined in the specification). When the pattern is known, the receiver can compare bit by bit and report the actual error count, and the measurement converges quickly.

Packet error rate is the alternative when bit-by-bit comparison is not available. A received packet either has no errors or has at least one error; the engineer counts good packets and bad packets to estimate the underlying bit error rate. The measurement takes longer because each bad packet is treated as a single sample regardless of how many bit errors it contains, and the statistics require more packets to converge to the same confidence.

:::note[When to use which]

<!-- vale Circe.TrailingContrast = NO -->
Bit error rate measurements with a fixed test pattern are faster and more precise. Packet error rate measurements are necessary when the radio's test interface does not expose bit-level data, or when the relevant requirement is specified in packets rather than bits. Both produce valid receive sensitivity numbers; the choice depends on what the radio supports and what the requirements ask for.
<!-- vale Circe.TrailingContrast = YES -->

:::

## Protocol-level verification

Bluetooth design verification has a layer above the RF measurements: the protocol stack. The radio can be physically correct and still fail in the field because the software stack does not handle the application correctly. Connection establishment timing, pairing and bonding, GATT service discovery, characteristic read and write behavior, and notification handling are all software concerns that need their own verification.

Protocol verification uses the same reference equipment as the physical-layer tests, with different firmware on the reference side. A vector signal analyzer or call box with a Bluetooth protocol license can emulate the peer device at the protocol layer, exchanging realistic traffic with the device under test and reporting on any deviations from the specification. Open-source protocol analyzers (running on inexpensive sniffer hardware) are useful for debugging specific issues but not for systematic verification.

The reason protocol verification matters in DVT is that software-stack issues do not always reproduce in functional testing. A subtle timing problem may pass functional tests against a few peer devices and fail in the field against a different peer, or fail intermittently under load. Catching the issue in DVT against a controlled reference is much less expensive than catching it through field returns.

## Auracast and LE Audio

LE Audio is the umbrella name for a set of additions to the Bluetooth Low Energy specification that bring audio applications (headsets, microphones, speakerphones, hearing aids) onto BLE. Auracast is the broadcast component: a transmitter can stream audio that any number of receivers can join without pairing, suited to public-address scenarios and multi-listener applications.

Until LE Audio, audio applications were the territory of Bluetooth Classic. Headsets, car kits, and Bluetooth speakers used the Hands-Free Profile or Advanced Audio Distribution Profile on Classic radios. LE Audio targets the same applications on BLE, with lower power consumption, lower latency in many cases, and the new broadcast model that Classic could not support.

<!-- vale Circe.TrailingContrast = NO -->
For new product designs, LE Audio resolves much of the historical reason to include Bluetooth Classic. A product that needs to handle audio can use LE Audio on a single BLE radio rather than a dual-mode chip, with a meaningful reduction in BOM cost, power consumption, and complexity. Compatibility with the installed base of Classic-only audio devices still requires Classic support, but for products talking to other new devices, BLE alone is enough.
<!-- vale Circe.TrailingContrast = YES -->

DVT for LE Audio extends the standard BLE measurements with verification of the new isochronous channels (BIS and CIS) that carry audio streams. The measurements are still receive sensitivity and transmit power, applied to the new PHY configurations and the new application contexts. The equipment requirements do not change substantially; what changes is the test plan.
