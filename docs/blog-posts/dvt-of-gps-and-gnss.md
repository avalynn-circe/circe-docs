---
slug: /blog-posts/dvt-of-gps-and-gnss
title: "DVT of GPS and GNSS Receivers"
sidebar_label: "DVT of GPS and GNSS Receivers"
sidebar_position: 9
description: "Design verification testing for satellite navigation receivers. Why the live constellation is not a test environment, what a GPS signal generator does, and how geofencing changes the firmware test loop."
---

# DVT of GPS and GNSS Receivers

Originally written for F3 Wireless.

_Why a parking lot is not a test environment, what a GPS signal generator does, and how firmware engineers test geofencing without driving anywhere._

A GNSS receiver is unusual among the radios in a connected product. It has no transmitter, no control over the source of its signal, and no way to repeat a test the same way twice using the live constellation. Design verification testing for GPS, Galileo, GLONASS, BeiDou, and the other satellite navigation systems requires a different approach from any other radio in the product.

## A receive-only radio

Global navigation satellite system receivers process signals broadcast from satellites in medium earth orbit. The constellations operate on slightly different frequencies and use different signal coding so receivers can distinguish among them. From the device's perspective, every GNSS technology presents the same problem: a very weak signal arriving from above, surrounded by terrestrial interference, with no way for the device to influence the source. F3 uses GNSS as the umbrella term for all of them; the receiver in a product typically supports several constellations at once.

<!-- vale Circe.TrailingContrast = NO -->
Because the receiver does not transmit, DVT covers only receive-side measurements. Conducted receive sensitivity and radiated receive sensitivity are the two core tests. There is no transmit power to characterize, no harmonics to sweep, no frequency reference to tune on the air side; the relevant frequency reference is whatever the receiver chip uses internally for downconversion, and it is verified through the receiver's reported behavior rather than measured directly.
<!-- vale Circe.TrailingContrast = YES -->

## The parking lot is not a test

A common failure mode in GNSS product development is to declare design verification complete because the receiver gets a fix in the company parking lot. The parking lot is open sky. There is no urban canyon, no multipath from a glass-walled building, no foliage attenuation, no body loss from a person carrying the device, no roof above the antenna, and the satellites in view are whatever the constellation happens to provide at that moment.

A receiver that gets a fix in an open parking lot has proven that it is not so broken that it cannot do the easiest possible thing. It has not proven that it will work indoors, under foliage, in a vehicle with a metal roof, or in a city with line-of-sight to half the sky blocked by buildings. Worse, the test is not repeatable. The satellite geometry shifts continuously, the ionospheric and tropospheric conditions vary with time and weather, and the signal-to-interference ratio in the parking lot depends on whatever cellular and Wi-Fi traffic is in the area that day. The next test under the same conditions produces different numbers.

A test that cannot be repeated is not a test. GNSS design verification requires a controlled signal source and a controlled environment.

## The GPS signal generator

The instrument that makes repeatable GNSS testing possible is a multi-channel GPS signal generator. The instrument synthesizes the downlink signals of multiple satellites simultaneously, with full control over the parameters that would otherwise be set by the constellation: which satellites are in view, where they are in the sky, what the simulated receiver position is, what date and time the receiver believes it is operating at, and how the simulated user moves through space over the course of the test.

A receiver needs signals from at least four satellites to compute a position fix. The signal generator has to produce all four simultaneously, with the correct timing relationships, on the correct frequencies, with the correct encoding for each constellation being simulated. A single-channel signal generator, or a software-defined radio configured to emit a GPS-like signal, is not adequate; the receiver will not get a fix without the multi-satellite geometry. Spirent and the major test equipment vendors produce instruments that meet this requirement. Some cellular call boxes (Rohde & Schwarz, for example) include GNSS signal generation as a licensed feature, which is useful for products that combine cellular and GNSS in the same DVT cycle.

The signal generator's output power is calibrated and adjustable in fractions of a dB across the full range required for sensitivity measurements. The output drives either a conducted path (cable to the receiver's antenna port) or a radiated path (a calibrated antenna in an anechoic chamber).

## Radiated receive sensitivity

Radiated receive sensitivity is the GNSS measurement that most closely predicts field behavior. The device under test sits in an anechoic chamber with the production antenna and enclosure. The measurement antenna in the chamber radiates the signal generator's simulated constellation. The signal level is reduced in steps until the receiver loses its ability to acquire or maintain a fix.

Reference GPS signal strength at the earth's surface is around −130 dBm for a typical satellite, below the thermal noise floor at the receiver's antenna. The receiver recovers the signal through the processing gain inherent to the spread-spectrum encoding of the GNSS signals. The implication for DVT is that interference from other electronics in the product can degrade GNSS performance without ever rising above the noise floor on a spectrum analyzer. The only way to see the degradation is a controlled radiated sensitivity measurement.

:::note[Why radiated, not conducted]

A device that passes a conducted receive sensitivity measurement can still fail in the field if the rest of the product radiates interference into the receive band when the antenna is connected. Radiated measurements with the device fully powered and operating, including charging, cellular activity, Wi-Fi hotspot operation, and any other concurrent functions, are what surface this kind of degradation.

:::

The full radiated cycle measures sensitivity in two regimes: with the device idle (only the GNSS receiver active) and with the device operating under realistic load. The difference between the two numbers is the desensitization caused by the rest of the product, and it is the number that predicts whether the device will hold a fix in normal use.

## Firmware testing and geofencing

Software that uses GNSS data needs its own form of verification. Geofencing is the typical example: an application defines a polygon of latitude and longitude points and triggers an action when the device crosses the boundary. The logic is straightforward. Testing it against the live constellation is not.

Without a signal generator, firmware verification of geofencing requires driving the device across the fence boundary, which limits the engineer to a small number of test runs per day and provides no way to reproduce a failure exactly. A signal generator changes the workflow. The engineer programs a trajectory at the desk, sets a start point and end point in latitude and longitude, defines a speed and a route, and runs the simulation. The receiver in the device behaves as if it were moving through the simulated trajectory. The geofence logic runs against the simulated positions exactly as it would against real ones.

Trajectories can be arbitrarily complex: a vehicle moving at highway speed, a pedestrian on a winding path, a delivery vehicle making multiple stops, a stationary device drifting through GNSS noise. The same trajectory can be replayed any number of times, with or without simulated impairments (loss of signal during a tunnel passage, increased multipath in an urban segment, intermittent constellation availability). Regression testing on geofence logic that took hours of road time per iteration becomes a process that runs unattended overnight.

The signal generator is the equipment that makes GNSS firmware development tractable for any team larger than one person. Without it, the firmware team is bottlenecked by the schedule of whoever has the car keys.
