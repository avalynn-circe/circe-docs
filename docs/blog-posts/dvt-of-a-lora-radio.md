---
slug: /blog-posts/dvt-of-a-lora-radio
title: "DVT of a LoRa Radio"
sidebar_label: "DVT of a LoRa Radio"
sidebar_position: 12
description: "Design verification testing for LoRa products. Chirp modulation, coding gain, the receive sensitivity floor that makes isolation a real problem, and FCC Part 15.247 implications."
---

# DVT of a LoRa Radio

Originally written for F3 Wireless.

_LoRa trades data rate for receive sensitivity, and the trade is dramatic. The sensitivity floor that makes long-range deployment possible also makes the test setup difficult, because the receiver hears everything._

LoRa is a proprietary chirp spread spectrum modulation from Semtech, designed for long-range, low-data-rate applications. The radio's defining characteristic is receive sensitivity well below what any narrow-band radio at the same data rate can achieve. The sensitivity is what makes LoRa useful for asset tracking, agricultural sensors, utility metering, and other applications where range matters and data volume does not. It is also what makes LoRa design verification harder than any other unlicensed radio in the same band.

## Chirp modulation and coding gain

Chirp modulation encodes data in the rate and direction of a frequency sweep. Each symbol is a chirp (a signal that sweeps linearly across a defined bandwidth), and the starting frequency of the chirp encodes which symbol is being sent. The receiver correlates the incoming signal against the known chirp pattern and extracts the symbol from the correlation peak.

The correlation process provides processing gain. A LoRa symbol spread across many chirp periods can be recovered from a noise floor that would bury a narrow-band signal carrying the same information. The trade-off is data rate: the more spreading, the lower the throughput. LoRa lets the designer choose the spreading factor, which sets the trade-off explicitly.

A higher spreading factor produces more coding gain and lower data rate. Spreading factor 7 is the fastest LoRa configuration and produces the least gain. Spreading factor 12 is the slowest and produces the most. The difference between the two is approximately 15 dB of receive sensitivity, achieved at the cost of approximately 32 times lower throughput. Designers pick the spreading factor based on the link budget the application requires.

## The sensitivity floor

Typical LoRa receive sensitivity ranges from around −120 dBm at spreading factor 7 to below −137 dBm at spreading factor 12. The lower bound is comparable to land mobile radio with narrow channelization and high-precision frequency references, achieved without any of the calibration overhead of land mobile.

For context, the thermal noise floor in a 125 kHz channel (a common LoRa bandwidth) is around −123 dBm at room temperature. A LoRa receiver operating at spreading factor 12 recovers signals 14 dB below the thermal noise floor. The signal is not visible on a spectrum analyzer at any meaningful sweep speed. The only way to confirm that the receiver is working is to feed it a known signal and check that it demodulates correctly.

:::note[Why this matters for DVT]

A LoRa receiver does not care about noise that would dominate any other radio's measurements. Interference at −110 dBm, which a Wi-Fi or Bluetooth receiver would ignore as background, is well above the LoRa signal at spreading factor 12. The test environment has to be quieter than the signal being measured, which means quieter than the noise floor of a typical RF lab bench.

:::

## The isolation problem

Receive sensitivity measurements rely on being able to set the transmitter's signal level low enough that the receiver loses the link. For most radios, this means turning the transmitter's output power down or adding attenuation between the transmitter and the receiver until the link breaks. For LoRa, both ends of that recipe fail.

The transmitter side fails because eval boards and reference radios do not turn down far enough. A LoRa eval board's minimum transmit power is typically −5 dBm to 0 dBm. Even with 100 dB of attenuation between transmitter and receiver, a 0 dBm transmitter still delivers −100 dBm to the receiver, which is 35 dB above the receiver's sensitivity threshold at spreading factor 12. The link does not break.

The isolation side fails because the receiver hears everything. A LoRa receiver placed in a shielded enclosure with the transmitter placed in a separate shielded enclosure, connected by 70 dB of coaxial attenuation, will still demodulate the signal that leaks between the enclosures. Replacing the coax with terminators and moving the boxes to opposite ends of a lab does not break the link either. The receiver hears the transmitter through enough of the lab environment that direct isolation is not sufficient.

<!-- vale Circe.TrailingContrast = NO -->
The setup that works is two test cells in separate screen rooms, with the transmitter driven by a programmable signal generator rather than an eval board. The signal generator turns its output down to −70 dBm or lower with calibrated accuracy, and the receiver then sees the attenuated signal through the path's loss budget, with the rooms providing the isolation that the test cells alone cannot.
<!-- vale Circe.TrailingContrast = YES -->

## Signal source requirements

A LoRa-capable signal generator is the right reference for receive sensitivity measurements. A signal generator with baseband modulation input and the right waveform definition can produce a calibrated LoRa signal at any chosen spreading factor, bandwidth, and coding rate, with output power adjustable down to noise-floor levels. Rohde & Schwarz SMB and similar instruments are common choices.

An eval board running the transmit side of a real LoRa link works for early development but fails at the DVT stage for the reason described above. The eval board's transmit power is not finely adjustable at the low end of its range, and the eval board is not designed to operate as a precision reference transmitter. The eval board is a development tool. The signal generator is a measurement tool. Both have their place, and the LoRa DVT cycle needs both.

For protocol-level testing (LoRaWAN application layer, join procedures, downlink response handling), a different reference is required: a LoRaWAN gateway and network server that the device under test attaches to. Protocol verification is separate from RF DVT and uses different equipment.

## FCC Part 15.247 and the hybrid problem

In the United States, LoRa in the 902 to 928 MHz band typically certifies under FCC Part 15.247, which covers digital modulation and frequency-hopping spread spectrum systems. LoRa is unusual under this rule because its modulation does not fit cleanly into either category. Some LoRa configurations meet the bandwidth requirements for digital modulation directly; others are slow enough that they need to incorporate frequency hopping to satisfy the rule.

The implication for DVT is that the regulatory configuration affects the radio's operating modes. A LoRa product that frequency-hops to meet Part 15.247 has to be characterized in its hopping configuration, not in a continuous-transmit mode that would not be allowed in production. Some chip vendors expose test modes that are useful for DVT but produce emissions that the production configuration would not produce, and these test modes can fail certification if accidentally enabled.

The practical guidance: confirm with the chip vendor or with the certification lab which test modes are appropriate for DVT and which are not, before designing the test plan. Otherwise the DVT cycle can pass cleanly on a mode that the certification cycle will reject.

European certification under ETSI EN 300 220 has a different rule structure and different duty-cycle constraints. Products targeting both markets need DVT plans that cover the relevant operating modes in each, which is best resolved by deciding the certification strategy before the design freezes.
