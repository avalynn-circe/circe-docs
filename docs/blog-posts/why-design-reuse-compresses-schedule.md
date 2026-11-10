---
slug: /blog-posts/why-design-reuse-compresses-schedule
title: "Why Design Reuse Compresses the Schedule"
sidebar_label: "Why Design Reuse Compresses the Schedule"
sidebar_position: 3
description: "Most of a connected product is built from blocks that have been built before. What reuses cleanly, what does not, and how the boundary affects the customer's IP."
---

# Why Design Reuse Compresses the Schedule

Originally written for F3 Wireless.

_Most of a connected product is built from blocks that have been built before. What reuses cleanly, what does not, and where the line falls between platform IP and customer IP._

A connected product looks unique from the outside. On the inside, most of it is built from blocks that the engineering team has built before, often dozens or hundreds of times. The difference between a nine-month engagement and a twenty-four-month engagement is largely the share of the product that can come from those existing blocks, versus the share that has to be built from scratch for this specific customer.

## Most products are built from blocks

A typical connected product breaks down into a handful of layers. A microcontroller with its associated power supply and clocking. A radio (or several), with matching networks and antenna interfaces. Sensors or actuators specific to the application. A board support package (drivers for the microcontroller's peripherals and the external chips). A real-time operating system or scheduler. Communication stacks for the radios and any wired interfaces. An application layer that implements the product's specific behavior. A manufacturing test fixture and the firmware that runs it.

Of these layers, most are common across many products. The microcontroller is almost always one of a handful of families (Nordic, STMicroelectronics, Microchip, Espressif, Silicon Labs, Texas Instruments, Renesas, depending on the application). The radio is usually one of a smaller set of widely-used chips. FreeRTOS, Zephyr, or a similar RTOS handles scheduling. The Wi-Fi stack, the Bluetooth stack, and the cellular AT-command interface are vendor-supplied. The drivers for serial flash, sensors, displays, and the other common chips on a board are either vendor-supplied or have been written before.

When a customer arrives with a product concept, the engineering team's first task is matching the concept to the existing blocks. A product built around a chip the team has used before, on an OS the team has supported before, with radios the team has tested before, can move quickly. The blocks are tested, the integration patterns are known, and the time to a working first prototype is short.

## What reuses cleanly

Several categories of work reuse without modification across engagements.

Vendor-supplied code. The board support package from a microcontroller vendor, the radio driver from a chip vendor, the reference RTOS port, the cellular modem AT-command interface: all delivered by the chip vendors, used as-is or with minor configuration, and not owned by anyone in the engagement. Most products use this code without writing custom alternatives.

Generic infrastructure. Logging frameworks, configuration storage, firmware update mechanisms, event dispatchers, watchdog management, telemetry uploaders: these solve problems that every connected product faces, and the solutions are not application-specific. An engineering team that has built dozens of products has a library of these blocks that work the same way across the next one.

Standard protocol implementations. The J1939 communication layer for heavy-truck applications. The CAN-bus interface for vehicle electronics. The Modbus interface for industrial controls. The LoRaWAN stack for IoT deployments. The MQTT client for cloud telemetry. These protocols have published specifications, and an implementation that conforms to the specification works the same regardless of the application running on top of it.

Hardware design patterns. The matching network topology for a specific radio chip on a specific PCB stackup. The antenna placement rules that avoid hand-loading effects on a wearable device. The shielding layout that keeps a switching regulator out of the GPS receive band. The thermal management approach for a high-power transmitter. These patterns are not code or schematics that get copied directly; they are the engineering judgments that get applied consistently across products that share the relevant constraints.

## What does not reuse

Application-specific work does not reuse. The business logic that defines what the product does is, by definition, specific to this product and this customer. A telematics unit that talks to a vehicle over J1939 uses the standard J1939 stack, but the specific commands (read door locks, read seat belts, read fuel level) are application-specific. A medical device that uses BLE for data transfer uses the standard BLE stack, but the GATT profile that defines its specific characteristics is application-specific.

The boundary matters legally as well as technically. Application-specific work belongs to the customer; reusable infrastructure does not. An engineering firm that reuses its own libraries across multiple customers does so without granting any one customer exclusive rights to the libraries, because the libraries are not built for that customer. The customer pays for the time the team spends integrating the libraries into the customer's product, and owns the integration. The libraries themselves remain the firm's platform.

This is not unusual. A product company with multiple products treats its internal platforms the same way: each product uses the platform, but no one product owns it. The work-for-hire model with reuse is the external version of the same arrangement.

## The platform-vs-customer boundary

The line between platform IP and customer IP is the line between code or design that works the same regardless of the application, and code or design that is specific to the application.

A driver for an SPI flash chip is platform IP. The driver reads and writes blocks of flash; the meaning of what is in the blocks is application-specific, and the driver does not care. The driver works the same on every product that uses that flash chip.

The data structure that defines what gets stored in flash and how the application reads it back is customer IP. The structure is application-specific; it encodes the product's business logic. A different product would store different data with different organization. The structure is owned by the customer who commissioned it.

The boundary is sometimes clear and sometimes requires judgment. A general-purpose firmware-update mechanism is platform IP. A firmware-update mechanism that handles a customer-specific over-the-air protocol with custom authentication and rollback semantics is customer IP. The engineering team explains the boundary during the engagement, the customer agrees to the categorization in the contract, and the categorization holds for the duration of the work.

:::note[The customer is not paying for the library]

The reused blocks are not what the customer pays for. The customer pays for the time it takes to apply the blocks to the customer's product, plus the time required to build the customer-specific portions. The reuse compresses the cost; it does not eliminate it.

:::

## The schedule math

A connected product built entirely from scratch (a microcontroller family the team has not used, a radio the team has not integrated, drivers that have not been written, an RTOS port that has not been done, an antenna interface that has not been characterized) takes around twenty-four to thirty-six months for a team without previous experience in the relevant pieces. Most of that time is spent learning the components, fixing first-attempt issues, and converging on patterns that the team will then have available for future products.

The same product, built by a team with prior experience on the chosen components and a library of reusable infrastructure, takes nine to twelve months. The total labor hours are similar in the customer-specific portions; the difference is the time saved on the parts that are common across products.

A new customer choosing components that match the engineering team's experience gains the schedule compression directly. A new customer with hard reasons to use unfamiliar components does not. The architecture conversation at the start of an engagement is the place where these decisions get made, and the trade-off between component choice and schedule duration is a conversation worth having explicitly.
