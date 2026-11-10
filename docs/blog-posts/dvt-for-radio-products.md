---
slug: /blog-posts/dvt-for-radio-products
title: "Design Verification Test for Radio Products"
sidebar_label: "Design Verification Test for Radio Products"
sidebar_position: 5
description: "What design verification testing is, what it measures, what equipment it requires, and how the results are interpreted."
---

# Design Verification Test for Radio Products

Originally written for F3 Wireless.

_What DVT measures, what equipment it requires, and how the results are interpreted against the requirements written for the design._

Design verification testing proves that a design meets its requirements. For a radio product, that means measuring what the radio actually does once it is built into the product, and comparing those measurements against the requirements written for the design.

DVT is distinct from manufacturing test. DVT runs once, on the design. Manufacturing test runs on every unit that comes off the line. The two answer different questions and use different procedures.

## What gets measured

Four measurements form the core of radio DVT: conducted transmit power, conducted receive sensitivity, radiated transmit power, and radiated receive sensitivity. Frequency reference accuracy is the standard fifth measurement, with crystal tuning performed as part of DVT and verified again in manufacturing.

Conducted measurements isolate the radio from the antenna. A coax cable connects the device's RF output (or the test point where the antenna would attach) to a calibrated instrument. Conducted results describe the radio in isolation: the chip, the matching network, and the PCB traces between them.

Radiated measurements describe the product as it will ship. The antenna is in place. The enclosure is closed. The other electronics in the device are powered and operating. Radiated transmit power and receive sensitivity capture the combined effect of every design choice that influences RF performance, including interference from the rest of the product. A microcontroller clock harmonic falling in the receive band shows up here. An enclosure that detunes the antenna shows up here. Switching noise from a regulator shows up here.

## Equipment

A general-purpose radio DVT setup includes a calibrated signal generator, a power meter, and a spectrum analyzer. The signal generator provides a controlled stimulus for receive sensitivity measurements. The power meter measures transmit power to tenths of a dB. The spectrum analyzer measures spectral content, including unwanted emissions and harmonics.

Two radio technologies require dedicated equipment. Cellular DVT requires a base station simulator (a call box), because a cellular radio does not transmit on command; it transmits in response to a network. GPS DVT requires a multi-channel GPS signal generator, because the live constellation produces signals that vary with time, weather, and satellite position, and DVT requires a repeatable stimulus.

Bluetooth, Wi-Fi, and LoRa DVT can be performed with the general-purpose set, with caveats on each. Wi-Fi receive sensitivity tests benefit from a vector signal generator capable of producing the relevant modulations. LoRa's very high receive sensitivity (often below −120 dBm) requires careful isolation between transmitter and receiver. Bluetooth Low Energy can be tested against an evaluation board configured as a reference transmitter, with a power meter monitoring the eval board's output continuously, since transmit power on most eval boards sags by several dB as the power amplifier warms up.

## Environment

Radiated measurements require physical isolation from external signals and from internal reflections. Two structures provide this.

A screen room (an RF-shielded enclosure, sometimes called a Faraday cage) blocks signals from outside. The interior remains reflective, so signals inside the room bounce off the walls and create standing waves. Screen rooms are used for conducted measurements, for cellular and other tests that do not require radiation pattern accuracy, and as outer enclosures for nested setups.

An anechoic chamber adds RF-absorbing foam (typically pyramidal cones backed by ferrite tile) to the interior surfaces of a screen room. Inside, signals from the device under test do not reflect off the walls. Anechoic chambers are required for radiated measurements where the radiation pattern, polarization, or absolute gain must be characterized accurately.

:::note[Isolation at extremes]

For radios with extremely high receive sensitivity, isolation between the test transmitter and the device under test can require placing the two in separate enclosures, sometimes in separate rooms. LoRa receivers can hear a transmitter through 70 dB of attenuation, through coax terminators, and across a laboratory floor.

:::

## Interpretation

A radio that measures within a few dB of its component data sheet is performing normally. Implementation losses of two to four dB are typical, accounting for PCB traces, matching networks, and component tolerances.

The data sheet number is rarely the binding requirement. The binding requirement is the link budget for the product's use case. Link budget arithmetic accumulates transmit power, antenna gains at both ends, free-space path loss across the operating range, and an allowance for multipath fading (commonly 20 to 30 dB for indoor or mixed environments). Every 6 dB of margin doubles the achievable range; every 6 dB lost halves it.

A DVT result is interpreted against the link budget, not against the component data sheet. A radio measuring 3 dB below data sheet that closes the link budget with margin is shippable. A radio measuring at the data sheet that fails to close the link budget is not.

## Relationship to certification

DVT is separate from regulatory certification (FCC, CE, and equivalents). Certification tests a subset of the same measurements, applied to a specific configuration, by an accredited lab, against the limits in the applicable regulation. A radio that passes DVT may still fail certification on a parameter DVT did not examine. A radio that passes certification may still fail DVT if the certification configuration differs from the production configuration.

A pre-certified module carries an FCC grant for the module under defined installation conditions. The grant does not transfer to arbitrary installations. DVT on the integrated product remains necessary regardless of the module's certification status, because the measurements that matter are properties of the integrated product, not properties of the module.
