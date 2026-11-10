---
slug: /blog-posts/fcc-with-pre-certified-modules
title: "FCC Certification with a Pre-Certified Module"
sidebar_label: "FCC Certification with a Pre-Certified Module"
sidebar_position: 16
description: "When a pre-certified radio module covers the integrated product's certification, when it does not, and what additional work is required either way."
---

# FCC Certification with a Pre-Certified Module

Originally written for F3 Wireless.

_A pre-certified module carries an FCC grant. The grant covers the module under defined installation conditions. The conditions do not automatically transfer to every product the module ends up in._

A pre-certified radio module simplifies FCC certification in many cases, and a common misreading of the policy is that it eliminates certification work entirely. The actual rule is more specific: the module's grant covers the module under defined installation conditions, and the integrating product inherits that coverage only if it stays within those conditions. Understanding what the conditions are and what falls outside them determines whether the integration is straightforward or requires additional certification work.

## What a modular grant covers

The FCC issues two kinds of grants for radio modules: full modular and limited modular. The categories appear in 47 CFR §15.212. A full modular grant means the module has been certified as a standalone radio assembly: it has its own shielding, its own antenna interface, its own power and signal conditioning, and it has been tested to meet the relevant emissions limits without depending on the host product for any of that. A limited modular grant covers a module that meets most of these requirements but depends on the host for one or more of them.

Either way, the grant is for the module. The grant identifier (the FCC ID printed on the module) belongs to the module manufacturer, and the module can be installed in a host product under the module's grant as long as the installation meets the conditions the grant specifies.

The integrating product (the device that contains the module) does not need its own intentional-radiator certification for the radio inside the module, in the case where the module's conditions are met. It still needs to meet the unintentional-emissions requirements (FCC Part 15 Subpart B for digital devices in the US) for the product as a whole, which is a separate test from the module's radio certification.

## The installation conditions

A modular grant comes with conditions. The conditions vary by module but typically include some combination of: the antenna type and gain that may be used, the antenna trace length and impedance, the shielding the module requires from the host, the host's power supply characteristics, the location of the module relative to other components, the host's enclosure requirements, and any labeling requirements that have to appear on the finished product.

The conditions are documented in the module's grant and in the module manufacturer's integration guide. The integrating product designer is responsible for reading both and confirming the integration stays within the documented bounds. A design that uses an antenna not listed in the grant, runs the antenna trace through a longer path than the grant allows, or fails to provide the shielding the module requires falls outside the modular certification.

When the integration stays within the conditions, the module's FCC ID appears on the finished product (usually with a "Contains FCC ID:" label), and the radio certification is complete. When the integration falls outside the conditions, the radio has to be re-certified as installed, under a Class II permissive change or a new grant.

## What changes the picture

Several integration choices move a design outside the modular grant's coverage.

Antenna substitution. The grant lists specific antennas (with type, gain, and connector) that may be used. Switching to a different antenna, even one with similar nominal specifications, requires verification that the new antenna does not push the system outside the certified emissions limits.

Higher-gain antennas. The grant typically allows antennas up to a specified maximum gain. A higher-gain antenna increases the effective radiated power and can push transmit emissions above the limits the module was certified against.

Multiple co-located radios. A host product that contains the certified module plus a second radio (Bluetooth, Wi-Fi, cellular) may face additional requirements under FCC rules on simultaneous transmission. The two radios in combination can produce intermodulation products and aggregate emissions that neither produces alone.

Host emissions that affect the module. The module's certification assumes a host that meets defined conditions. A host that radiates broadband noise into the module's receive band, or that introduces ground currents on the module's RF interface, can change the module's behavior enough that the original certification no longer applies.

:::note[The general rule]

The module's grant covers the module as certified. Changes to the installation, the antenna, the surrounding electronics, or the host's emissions profile can move the system outside the grant. The integration guide is the authoritative document for what stays inside and what does not.

:::

## Class II permissive change

When an integration falls outside the modular grant's conditions, the path forward is usually a Class II permissive change to the module's grant. The change is filed by the grantee (typically the module manufacturer, sometimes the integrator with the module manufacturer's authorization) and updates the grant to cover the new configuration.

A Class II change requires retesting the affected parameters at an accredited lab. The retest is narrower than a full new certification (only the parameters affected by the change need to be tested), but it is real lab work, with real lab costs, and a real schedule.

The decision tree for a typical integration: does the design stay within the module's documented conditions? If yes, no FCC work is required on the intentional radiator beyond labeling. If no, a Class II permissive change to the module's grant covers the deviation. If the deviation is large enough that a Class II change is not appropriate (substantially different antenna, substantially different operating conditions), a new modular grant or a non-modular intentional-radiator certification is the path.

## DVT is separate

One point that often gets lost in the certification conversation: design verification testing is separate from certification, and a pre-certified module does not reduce the need for DVT on the integrated product.

The module's certification verified the module against the FCC limits. The customer's DVT verifies the integrated product against the customer's requirements, which are different from the FCC limits and typically include things the FCC does not test (link budget closure, range under realistic conditions, receive sensitivity in the operating environment, performance with other radios in the product transmitting simultaneously).

A module that passes its certification can still produce a product that fails the customer's requirements once integrated. The host's switching regulators can desensitize the module's receiver, the host's clocks can produce harmonics in the receive band, the antenna integration can cost several dB of efficiency, and the enclosure can detune the antenna. None of these issues affect the module's certification; all of them affect whether the product works in the field.

DVT catches these issues. Skipping DVT because the module is pre-certified produces products that pass FCC and fail in the customer's hands. The pre-certified module is a convenience for the regulatory side of the program. It is not a substitute for engineering the radio integration correctly.
