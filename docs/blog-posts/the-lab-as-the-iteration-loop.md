---
slug: /blog-posts/the-lab-as-the-iteration-loop
title: "The Lab as the Iteration Loop"
sidebar_label: "The Lab as the Iteration Loop"
sidebar_position: 14
description: "Why owning the equipment in-house changes the schedule. Anechoic chambers, antenna measurement systems, screen rooms, and the iteration cycle they make possible."
---

# The Lab as the Iteration Loop

Originally written for F3 Wireless.

_Most companies developing a radio product for the first time rent lab time. The cost of that decision is not the lab bill. It is the iteration cycle._

A radio product development cycle is a sequence of iterations. Build, measure, learn, change, build again. The duration of each iteration is what determines how long the program takes and how many design decisions can be revisited before the ship date arrives. Iteration time is set almost entirely by how long it takes to get from a hypothesis to a measurement that confirms or refutes it.

## Iteration is the limiting factor

A team that owns the lab equipment can run an iteration in hours or minutes. A change to the firmware, the matching network, the antenna position, or the shielding gets validated in the same workday. The next iteration starts immediately. Three or four iterations in a day is normal; six or eight is possible when the changes are small and the tests are scripted.

A team that rents lab time runs iterations on the schedule of an outside facility. The team prepares the device under test, books a time slot, transports the equipment, runs whatever measurements fit into the available window, and packs out. Back at the office, the team reviews the data, plans the next change, and the cycle starts over with another booking request. Best case, an iteration takes a week. Typically it takes two.

The implication for the program is not subtle. A design that needs ten iterations to reach the required performance takes a fortnight in an in-house lab and ten weeks in a rented one. The longer cycle compounds every other decision: late iteration loops crowd against the certification cycle, against tooling decisions, against pilot production, against the ship date. Schedule slip almost always traces back to iterations that took longer than the program assumed.

## Anechoic chambers and screen rooms

Radiated measurements require a controlled RF environment. Two structures provide it, and serious wireless work needs both.

A screen room is a shielded enclosure that blocks signals from outside. The walls, floor, and ceiling are conductive (copper sheet or wire mesh) and bonded to ground. Inside a screen room, the cellular networks, Wi-Fi access points, microwave ovens, Bluetooth devices, and other RF sources in the surrounding building are attenuated by 60 to 100 dB or more, which is enough to let a sensitive measurement run without external interference. The interior of a screen room is reflective; signals generated inside bounce off the walls and create standing waves, which makes the screen room appropriate for conducted measurements and for the outer shielding of nested setups, but not for radiation pattern measurements.

An anechoic chamber is a screen room with RF-absorbing foam (pyramidal cones backed by ferrite tile) lining the interior surfaces. The foam absorbs radio energy that strikes it, eliminating the reflections that a bare screen room produces. Inside an anechoic chamber, a transmitter radiates outward into a controlled, low-reflection environment, and a receive antenna sees the direct path from the transmitter without significant multipath contamination. Radiation patterns, antenna gain, polarization, and other measurements that depend on a clean radiated environment are run inside an anechoic chamber.

Some measurements need both at once. A LoRa receiver placed in a single shielded enclosure can still hear a transmitter through whatever leakage paths exist; a transmitter in a separate enclosure, connected by cabling and surrounded by its own screen room, provides the isolation required to break the link and measure receive sensitivity properly. F3's lab supports nested setups of this kind, with chambers and screen rooms in arrangements that suit the measurement at hand.

## The antenna measurement system

Antenna characterization is its own category of measurement. An antenna in the product has a radiation pattern (which direction the energy goes), a gain (how concentrated the energy is in the preferred direction), an efficiency (how much of the input power becomes radiated power versus heat), and a polarization (the orientation of the electric field). All four matter for system performance, and none of them can be characterized from a single radiated transmit measurement. F3's antenna measurement system is a spherical near-field setup: the device under test sits on a rotating pillar at the center of a ring of measurement antennas, and a 360-degree spherical pattern is produced by combining the readings as the pillar rotates and the antennas switch.

The system completes a single-axis sweep in roughly a quarter of a second; the full spherical measurement takes a few minutes. Once captured, the pattern data can be analyzed for the metrics the application cares about: peak gain, average gain, total radiated power, radiation efficiency, and orientation-dependent behavior that affects how the product performs as the user moves it or as it is installed in different positions.

:::note[Why this matters]

Two antennas with the same peak gain can have very different radiation patterns. One may concentrate energy in a useful direction; the other may waste energy upward or downward where no receiver is listening. A radiated transmit power measurement at a single angle does not distinguish them. A full spherical pattern does.

:::

## Call boxes and signal generators

A radio DVT cycle requires reference equipment. The right reference depends on the radio. Cellular requires base station simulators (call boxes) that emulate the full network stack. GNSS requires multi-channel signal generators that simulate the satellite constellation. Wi-Fi and Bluetooth require vector signal generators or licensed call boxes that produce calibrated modulated signals at controlled power levels. LoRa requires signal generators that can produce LoRa waveforms across the spreading factors and bandwidths the product uses.

The equipment is expensive on a per-instrument basis and accumulates quickly. F3's lab supports cellular, Wi-Fi, Bluetooth, GNSS, and LoRa DVT cycles simultaneously, with the call boxes, signal generators, power meters, spectrum analyzers, and vector signal analyzers needed for all of them. The lab also supports compliance pre-screening, manufacturing test development, and antenna characterization on the same equipment base.

The reason to maintain the breadth is that products rarely have only one radio. A connected device typically combines cellular and Wi-Fi, or Wi-Fi and Bluetooth, or LoRa and GNSS, or some other combination, and the radios interact. A Wi-Fi transmitter can desensitize a cellular receiver. A cellular transmitter can desensitize a GNSS receiver. The interaction shows up in radiated measurements with all radios operating, which means the lab needs the equipment to drive and observe each radio simultaneously.

## Equipment is necessary, not sufficient

A lab with the right equipment can produce numbers. A lab with the right equipment and the right engineers can produce numbers that mean something. Wireless design verification is a process of producing measurements that the design team can act on, and producing actionable measurements requires interpreting them against the design's requirements, against the chip's data sheet, against the regulatory limits, and against the physics of the radio in question.

An anechoic chamber is not expertise. A call box is not expertise. A spherical antenna measurement system is not expertise. They are instruments that an experienced engineer uses to verify a design, and an inexperienced team using the same instruments will produce numbers that look the same and lead to different conclusions. The equipment is the floor of what a serious wireless development effort requires, not the ceiling.

The case for owning the equipment is not that the equipment is the work. The case is that owning the equipment removes a multi-week delay between each iteration and the next, which is the difference between a program that converges on a working design and a program that runs out of time.
