---
slug: /blog-posts/dvt-of-a-cellular-radio
title: "DVT of a Cellular Radio"
sidebar_label: "DVT of a Cellular Radio"
sidebar_position: 8
description: "Design verification testing for cellular products. Why live network testing is not a test, what a call box does, and what equipment a cellular DVT cycle requires."
---

# DVT of a Cellular Radio

Originally written for F3 Wireless.

_A cellular radio cannot be tested the way a Wi-Fi or Bluetooth radio is tested. It transmits only in response to a network, which means the test setup has to bring the network along._

Most radios transmit on command. A signal generator, a power meter, a spectrum analyzer, and a shielded environment are enough to characterize transmit power and receive sensitivity. A cellular radio does not work this way. A cellular radio is a network-controlled device: it transmits only when a base station tells it to, on the frequency the base station assigned, at the power the base station commanded. The design verification setup has to provide the base station.

## A radio that needs a network

The behavior is built into the cellular standards. A modem powers up, scans for cells, attaches to a network, and then negotiates uplink and downlink channels, timing, and transmit power with the base station. There is no command to make the modem transmit a continuous signal on a chosen frequency, the way there is for Wi-Fi or Bluetooth. The modem will not transmit without permission from the network it has attached to.

Most cellular modem vendors expose a non-signaling test mode (often called RF test mode, or by vendor-specific names) that bypasses the network attach and lets the modem transmit on a specified band, channel, and power. The test mode is the conducted-DVT equivalent of the AT-command transmit modes on a Bluetooth or Wi-Fi chip. It is the right tool for transmit power, harmonics, and occupied bandwidth measurements on the modem itself.

Test mode does not exercise receive sensitivity under realistic conditions. Receive sensitivity in cellular is a measurement of the modem's ability to demodulate a signal that carries network framing, scrambling, and reference symbols. A continuous unmodulated carrier from a signal generator does not produce a meaningful receive sensitivity number for an LTE or 5G receiver. The signal has to look like a base station.

## Why live network testing fails

Live network testing produces results that cannot be interpreted. The variables are not under the engineer's control.

A cellular product placed near a cell site will attach and pass throughput tests with the antenna disconnected. The signal at the modem is strong enough that the implementation does not matter. The product can ship with a broken antenna feed and pass the live network test.

The same product tested during a local event that congests the network will fail to attach, or attach with reduced throughput, for reasons that have nothing to do with the product. The cell site is overloaded, the radio resources are scarce, and the network refuses or downgrades the connection. A perfectly working product can fail a live network test.

Neither result tells the engineer anything about the design. The live network is not a controlled environment, and a test in an uncontrolled environment is not a test.

## The call box

The instrument that makes cellular DVT possible is a base station simulator, colloquially called a call box. The call box emulates a cellular base station: it transmits the downlink signal the modem expects to see, processes the modem's uplink in real time, and lets the engineer set the parameters that a live network would otherwise determine on its own. Cell ID, band, channel, transmit power, scheduling, fading profile, and impairments are all under direct control.

Major call box vendors include Rohde & Schwarz, Keysight, and Anritsu. The instruments are expensive, large, and band-specific in terms of which standards and features each license unlocks. A lab supporting cellular DVT for a range of products and bands maintains several call boxes; F3 operates six.

<!-- vale Circe.TrailingContrast = NO -->
A call box does the same job for cellular that a signal generator and signal analyzer do for a Wi-Fi or Bluetooth radio, with two differences. First, the call box is a closed-loop instrument: it simulates the full protocol stack, not just the RF layer, which is what makes meaningful receive sensitivity and throughput measurements possible. Second, the call box subsumes both the stimulus and the analyzer for cellular work; the modem under test communicates with the call box exactly as it would with a network, and the call box reports what came through.
<!-- vale Circe.TrailingContrast = YES -->

## What gets measured

Cellular DVT covers the same four core measurements as any radio DVT: conducted transmit power, conducted receive sensitivity, radiated transmit power, and radiated receive sensitivity. The technique differs because the call box is in the loop for both stimulus and analysis.

Conducted transmit power on a cellular modem is verified across every band the product is designed to support, and across the power control range the network can command. A modem operating at maximum power on band B2 has different thermal, distortion, and emissions behavior than the same modem operating at low power on band B71. Both have to be characterized.

Conducted receive sensitivity is measured against the reference sensitivity defined in the 3GPP specifications for the relevant air interface (LTE, NR, NB-IoT, LTE-M, and so on). The call box transmits the reference downlink signal, the modem decodes it, and the reference sensitivity threshold is the downlink power at which the modem just maintains the required throughput or block error rate.

Radiated measurements require an anechoic chamber and characterize the modem with its production antenna in the production enclosure. Radiated receive sensitivity is the cellular measurement that most directly predicts field behavior, because it captures every loss between the over-the-air signal and the modem's demodulator: antenna efficiency, enclosure detuning, body loss when the device is held or worn, and desensitization from other electronics inside the product.

## Environment

A cellular DVT setup requires shielding. The modem under test will attach to any live cellular signal it can hear, and a strong nearby cell site will overwhelm the call box's downlink unless the test environment is isolated. A shielded enclosure or screen room around the call box and the device under test is standard practice.

:::note[External interference is real]

A call box producing a precise downlink at one band can be desensitized by a strong external signal from another. Isolation is not optional for cellular work; a few dB of leak from a nearby carrier is enough to invalidate a sensitivity measurement.

:::

Radiated cellular measurements require an anechoic chamber large enough to support the bands in use, with measurement distance appropriate to the antenna size and the desired far-field condition. The chamber must also accommodate the device under test and any cabling that brings the call box's signal in and out without leakage.

## Operator and regulatory certification

Cellular products face a layered certification burden that other radios do not. Beyond FCC and CE, cellular devices typically require PTCRB certification (for North American carrier interoperability) or GCF certification (for European and global use), and individual mobile network operators add their own approval programs (AT&T, Verizon, T-Mobile, and so on).

Each certification body uses a defined test plan executed on calibrated equipment in accredited labs. The measurements overlap with DVT but are not identical: certification tests a fixed configuration against fixed limits, while DVT tests the design against the requirements written for it. A modem that passes DVT will not necessarily pass certification, and a modem that passes certification has only proven that the certified configuration meets the standard, not that any other configuration will.

DVT runs first. Certification follows DVT, on a design that has already been characterized and is expected to pass. Reversing the order produces certification failures that could have been caught earlier and at lower cost.
