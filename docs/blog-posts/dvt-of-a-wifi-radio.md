---
slug: /blog-posts/dvt-of-a-wifi-radio
title: "DVT of a Wi-Fi Radio"
sidebar_label: "DVT of a Wi-Fi Radio"
sidebar_position: 11
description: "Design verification testing for Wi-Fi. Why a consumer access point is not a reference, what nonlinear modulation does to the power amplifier, and when high-power Wi-Fi makes sense."
---

# DVT of a Wi-Fi Radio

Originally written for F3 Wireless.

_Wi-Fi is the first radio many engineers encounter where the modulation has amplitude content. The implications for the power amplifier, the test setup, and the trade-off between data rate and range are all consequences of that one fact._

Wi-Fi design verification starts the same way every radio DVT cycle starts: conducted and radiated transmit power, conducted and radiated receive sensitivity, frequency reference accuracy. The complications come from the modulation. Wi-Fi is the first radio technology many engineers encounter where the transmit signal has amplitude content, and that single difference drives the equipment requirements, the power amplifier design, and the architecture of the test setup.

## A consumer AP is not a reference

A common first instinct in Wi-Fi DVT is to test the product against a consumer access point. The access point is at hand, the device under test connects to it, throughput can be measured, and the result feels like progress. The result is not a test.

A consumer access point is not a piece of calibrated test equipment. Its transmit power is not closed-loop controlled. The power varies with temperature, with channel, with the modulation being negotiated, and from one unit to the next. There is no path between the access point's claimed transmit power and the actual signal arriving at the device under test that anyone has characterized to a tenth of a dB. The same product tested against two access points of the same model will produce different receive sensitivity numbers.

A consumer access point can be useful for early functional checks (does the radio associate, does it pass traffic). It is not a reference transmitter, and Wi-Fi DVT requires a reference transmitter for any measurement that has to be trusted.

The reference transmitter for Wi-Fi DVT is either a vector signal generator with Wi-Fi waveform capability (Keysight, Rohde & Schwarz, and Anritsu all produce instruments that meet the requirement) or a Wi-Fi-licensed call box that operates as both stimulus and analyzer. The generator produces a defined modulation on a defined channel at a defined power, calibrated and stable, against which the device under test can be characterized properly.

## Modulation, QAM, and OFDM

The 802.11b standard, the slowest and oldest Wi-Fi PHY, uses BPSK and QPSK modulations at 1 and 2 Mbps. The data is encoded in phase only; the signal amplitude is constant. Every Wi-Fi PHY after 802.11b adds modulations that encode data in both phase and amplitude.

Quadrature amplitude modulation (QAM) encodes data in a two-dimensional constellation of points distinguished by phase and amplitude. 16-QAM uses 16 constellation points and carries four bits per symbol. 64-QAM uses 64 points and carries six bits per symbol. 256-QAM, 1024-QAM, and higher orders are used in modern Wi-Fi standards to push throughput higher. Each step up the constellation packs more bits into each symbol and requires a higher signal-to-noise ratio at the receiver to demodulate without errors.

The relationship is direct: 802.11b at 1 Mbps achieves a reference receive sensitivity in the mid −90s dBm. 802.11ac at 256-QAM over a 160 MHz channel achieves reference sensitivity around −73 to −75 dBm. The faster the data rate, the higher the required SNR, and the shorter the useful range. A Wi-Fi link does not have a single range; it has a range that varies by 20 dB or more depending on which modulation the link is currently using.

Orthogonal frequency-division multiplexing (OFDM) is the channel-access scheme used in 802.11a, 802.11g, 802.11n, 802.11ac, and 802.11ax. OFDM spreads the data across many narrow subcarriers in parallel, with each subcarrier carrying its own QAM-modulated symbol. The composite signal is the sum of the subcarriers, and its envelope varies dramatically over time even when the individual subcarriers are well-behaved.

## Crest factor and the power amplifier

Crest factor (also called peak-to-average power ratio, or PAPR) is the ratio between the instantaneous peak power of a signal and its average power. A constant-envelope signal like BPSK has a crest factor of 0 dB; the peak and the average are the same. QPSK with realistic filtering has a crest factor around 3 to 4 dB. OFDM signals have crest factors of 11 to 12 dB; the peaks of the composite waveform run far above the average power.

The implication for the power amplifier is direct. A radio that needs to transmit at an average power of 30 dBm (1 watt) using OFDM has to handle instantaneous peaks at 41 to 42 dBm (12 to 16 watts) without clipping. Clipping the peaks introduces nonlinear distortion that broadens the signal in the frequency domain and increases the error vector magnitude at the receiver. The power amplifier has to be linear across the full peak-to-average range, which means it has to be sized for the peaks, even though the average it delivers is much lower.

:::note[The amplifier penalty]

A power amplifier sized for 1 watt of OFDM transmit at 12 dB crest factor is a 16-watt linear amplifier. The same average power on a constant-envelope modulation would need a 1-watt amplifier. The size, cost, heat, and current consumption all scale with the peak power requirement, not the average.

:::

Pre-distortion is the technique that mitigates the cost. The transmit chain measures the amplifier's nonlinear transfer function and pre-distorts the signal feeding the amplifier so that the amplifier's distortion cancels the pre-distortion, leaving a linear output. Pre-distortion lets a smaller amplifier produce a clean signal at higher average power, at the cost of additional signal-processing complexity in the transmit chain. It has been standard in cellular modems for years and is now common in higher-end Wi-Fi designs.

## When high-power Wi-Fi is worth it

Consumer access points and Wi-Fi-enabled devices typically transmit at 15 to 18 dBm conducted average power. Enterprise access points may run a few dB higher, sometimes with multiple antennas and beamforming to extend coverage further. Pushing transmit power above 20 dBm is uncommon, and pushing above 27 dBm (the regulatory limit in many regions for unlicensed Wi-Fi bands) requires careful attention to compliance and dramatically increases BOM cost.

Customer specifications for Wi-Fi range often arrive without a corresponding specification for what is at the other end of the link. A high-transmit-power product talking to a standard phone is asymmetric: the product can reach the phone over a long distance, but the phone's 15 dBm transmitter cannot reach back. The system range is whichever direction is shorter, and a high-power transmitter is wasted if the receiver on the other end is standard.

High-power Wi-Fi makes sense when both ends of the link are under control. A custom controller talking to a custom product can run high power at both ends and achieve range that consumer hardware cannot. A product talking to phones, tablets, or off-the-shelf access points gains nothing from running high power, because the other end of the link is the bottleneck.

The BOM cost of a high-power Wi-Fi front-end (the linear amplifier, the closed-loop power control, the additional matching components, the thermal management) typically runs a few hundred dollars over a standard implementation. The decision to spend that cost is a business decision driven by the product use case, not a technical decision driven by the radio chip's capabilities.

## What to actually test

A full Wi-Fi DVT cycle covers every modulation the product will use, on every channel in the bands it supports. The fastest modulations have the worst receive sensitivity and the worst crest-factor implications for the amplifier. The slowest modulations have the best receive sensitivity but rarely matter for throughput.

The practical compression: test receive sensitivity at the slowest supported modulation (typically 1 Mbps or 6 Mbps depending on the PHY), because it sets the lowest signal the product can recover. Test transmit power and error vector magnitude at the fastest modulation the product is expected to use, because that sets the worst-case requirements on the transmit chain.

Test on at least one channel in each band the product supports. Wi-Fi performance varies across channels (front-end matching, antenna efficiency, regulatory limits, harmonic relationships with other clocks in the product), and a result on channel 6 in the 2.4 GHz band does not predict the result on channel 161 in the 5 GHz band. The full channel sweep can come later if specific channels show anomalies; the initial sweep should cover the bands.

The reference receive sensitivity numbers from the Wi-Fi specifications are the right comparison point, with the same caveat that applies to any radio: two to four dB of implementation loss is expected, more than that is a conversation, and twenty dB is a problem that needs to be debugged before the design proceeds.
