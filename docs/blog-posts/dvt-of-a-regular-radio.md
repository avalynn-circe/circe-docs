---
slug: /blog-posts/dvt-of-a-regular-radio
title: "DVT of a Regular Radio"
sidebar_label: "DVT of a Regular Radio"
sidebar_position: 7
description: "What design verification testing looks like for a standard non-cellular, non-GPS radio. Measurements, equipment, environment, and pass criteria."
---

# DVT of a Regular Radio

Originally written for F3 Wireless.

_Design verification testing for Bluetooth, Wi-Fi, LoRa, Zigbee, and other radios with predictable behavior under direct control. What gets measured, how, and what the results have to mean._

A regular radio is a non-cellular, non-GPS radio with predictable behavior under direct control. Bluetooth, Bluetooth Low Energy, Wi-Fi, LoRa, Zigbee, proprietary sub-GHz protocols, and most custom radio designs fall in this category. The category is defined by what the radio will do on command: transmit when told to transmit, on a specified frequency, at a specified power, with a specified modulation, for as long as instructed. Radios that lack this kind of control require dedicated equipment and different procedures.

Design verification test for a regular radio measures four things: conducted transmit power, conducted receive sensitivity, radiated transmit power, and radiated receive sensitivity. Frequency reference accuracy is verified and tuned as part of the same process. These measurements characterize the radio's performance against the requirements written for the design.

## Direct radio control

DVT requires putting the radio under test into states it does not enter during normal operation. Continuous unmodulated transmit on a specified frequency. Continuous modulated transmit with a specified packet pattern. Receive mode with packet error rate or bit error rate reporting enabled. These modes are not part of the application firmware. They are exposed by the radio chip's vendor-supplied test interface, usually through AT commands, an HCI test command set, or a vendor-specific debug mode.

If the radio is buried under an application stack that does not expose these modes, DVT cannot proceed. The radio has to be addressable directly. This is a firmware concern as much as a hardware concern, and it is best resolved before the first board spins by confirming with the chip vendor that the test modes are accessible and documented for the chosen part.

## Conducted measurements

Conducted measurements connect the radio's RF output to a calibrated instrument through a cable, isolating the radio from the antenna and the environment. The device under test exposes a coaxial connector at the antenna feed (a U.FL or similar test point added for this purpose) or has a small coax soldered to the antenna trace.

<!-- vale Circe.TrailingContrast = NO -->
For conducted transmit power, the radio is commanded into transmit mode at a specified frequency and power setting. A power meter at the other end of the cable reads the actual transmitted power. The expected accuracy of the measurement is a tenth of a dB or better. A spectrum analyzer can substitute for the power meter when spectral content (harmonics, spurious emissions, occupied bandwidth) is also being characterized in the same measurement, with the understanding that spectrum analyzer power accuracy is typically one to two dB rather than tenths.
<!-- vale Circe.TrailingContrast = YES -->

For conducted receive sensitivity, a signal generator drives the radio's input through the cable. The signal generator is set to the radio's operating frequency and modulation, and its output power is decreased in steps until the radio's measured packet error rate or bit error rate crosses the reference threshold. The output power at that threshold is the conducted receive sensitivity, in dBm.

The reference threshold depends on the radio. A bit error rate of one in 10,000 is a common reference for Bluetooth and similar protocols. Faster data rate radios often reference one in a million. Wi-Fi commonly uses a 10% packet error rate. The reference is whatever the radio's data sheet specifies, so that the measured number is comparable to the published number.

## Radiated measurements

Radiated measurements characterize the radio as installed in the product, with the antenna in place, the enclosure closed, and the rest of the device powered and operating. The device under test sits in an anechoic chamber. A calibrated measurement antenna in the chamber connects to the test instrument outside.

For radiated transmit power, the radio is commanded into the same continuous transmit mode used for the conducted measurement. The instrument reads the received power at the measurement antenna. Free space path loss between the device and the measurement antenna is known from the chamber geometry, antenna gains are known from calibration, and the radiated transmit power is computed from the received reading.

For radiated receive sensitivity, the chamber is run in reverse. A calibrated signal source feeds the measurement antenna, the device under test reports its received signal quality, and the source power is stepped down until the radio crosses its reference threshold. The radiated receive sensitivity is the source power at threshold, adjusted for path loss and antenna gain.

:::note[Where interference becomes visible]

A clean conducted measurement followed by a radiated measurement 10 dB worse is a sign that the radio is being desensitized by something inside the device. The usual suspects are switching regulator harmonics in the receive band, high-speed digital clocks coupling through the PCB, and noisy interfaces (USB, Ethernet, motor drivers) radiating broadband energy. Identifying which is responsible is a separate debugging exercise; the radiated measurement is what surfaces the problem.

:::

## Frequency reference

The transmit frequency of any radio is set by a reference oscillator, usually a crystal, sometimes a temperature-compensated crystal oscillator (TCXO), occasionally an oven-controlled crystal oscillator (OCXO) for higher precision. The reference frequency has a tolerance, and the radio's transmit frequency inherits it.

DVT measures the actual transmit frequency on a spectrum analyzer or frequency counter and compares it to the commanded frequency. If the reference is off, the radio is off, and the magnitude of the error matters for both regulatory compliance and link performance. Wi-Fi is especially sensitive: a poorly tuned crystal does not necessarily prevent the radio from connecting, but it produces flaky behavior, increased packet loss, and connection drops that worsen over time as the crystal ages further off frequency.

Where the design includes load capacitors on the crystal (the typical case), DVT includes tuning those capacitor values to bring the reference frequency to its nominal value. The tuned values become part of the bill of materials. Manufacturing test verifies that the tuned values produce the expected frequency on each unit, catching cases where the wrong component value was placed or a component was omitted.

## Pass criteria

DVT produces measurements. The pass criterion for each measurement is the requirement written for the design, not the chip's data sheet. A radio measuring 3 dB below its data sheet is performing as expected once normal implementation losses are accounted for, and is a pass if the link budget closes. A radio measuring at the data sheet but failing the link budget is a fail. The data sheet is a reference point; the design requirement is the gate.

DVT is complete when every requirement bound to a measurement has a result, and every result is either a pass or a documented failure with a defined response. Skipping any of the four core measurements leaves the design's performance partially uncharacterized. Skipping all of them produces a product that cannot be evaluated against its requirements at all.
