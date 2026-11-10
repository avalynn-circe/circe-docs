---
slug: /blog-posts/what-f3-is-and-is-not
title: "What F3 Is and What F3 Is Not"
sidebar_label: "What F3 Is and What F3 Is Not"
sidebar_position: 1
description: "The engagement model. Work for hire, customer-owned IP, the contrast with ODM lock-in, and what happens at the end of an engagement."
---

# What F3 Is and What F3 Is Not

Originally written for F3 Wireless.

_The engagement model: work for hire, customer-owned IP, the contrast with ODM lock-in, and what happens to the relationship after the certified prototype._

F3 is a wireless research-and-development engineering firm. Companies engage F3 to design connected products from concept through certified prototype, using F3's engineers, lab, and certification expertise. The engagement ends when the prototype is certified. F3 does not manufacture, does not handle volume production, and does not retain rights to what it builds for a customer. This article describes how the engagement works, what makes the model different from common alternatives, and what the customer owns at the end.

## Work for hire

F3's standard business model is work for hire, billed by the hour, the way a law firm or an accounting firm bills. The customer pays for the engineers' time and the lab time required to produce a certified prototype. Whatever F3 develops on the customer's dime is the customer's intellectual property. Schematic capture, PCB layout files, firmware source, custom antenna designs, test fixtures, certification documentation: all owned by the customer outright, with no licensing terms, no reservation of rights, and no ongoing royalty obligation.

The exception is the body of reusable engineering blocks that F3 has accumulated across hundreds of prior developments. Standard radio drivers, FreeRTOS configurations for common microcontroller families, logging frameworks, communication-stack implementations, and similar generic infrastructure are not customer-specific. F3 reuses them across engagements, which compresses the schedule and reduces the labor hours the customer pays for. The customer's design uses these blocks; the customer does not own them exclusively. Anything application-specific (the business logic, the protocol customizations, the product-specific behavior) is the customer's.

The boundary is the same boundary that exists at any product company that uses internal platform code across multiple products. The customer-specific portion of the design belongs to the customer. The platform that supports it belongs to the firm that built and maintains the platform.

## The ODM contrast

The most common alternative to work-for-hire wireless development is engaging an original design manufacturer (ODM). An ODM designs a product, owns the design, and manufactures the product on the customer's behalf, typically pricing the development effort as a relatively small non-recurring engineering fee and recovering its investment through margin on the manufactured units.

The ODM model has internal logic. The development NRE is low, often a few hundred thousand dollars for a product that would cost a million or more to develop on a work-for-hire basis. The development cost looks attractive in isolation. The cost is recovered through a 30 to 40 percent margin on the cost of goods on every unit manufactured, multiplied by the lifetime volume of the product. For a product with significant volume, the ODM model is the more expensive of the two over the product's life.

The other implication of the ODM model is lock-in. The ODM owns the design, which means the design cannot be manufactured anywhere except at the ODM's chosen facility. Tooling, test fixtures, and supply relationships sit with the ODM. A customer that wants to change manufacturers, dual-source, regionalize production, or negotiate harder on unit price has no leverage; the design cannot move.

Work for hire produces the opposite outcome. The customer owns the design at the end of the engagement and can manufacture it anywhere, at any number of facilities, at any time. The development cost is higher up front. The lifetime cost, and the strategic optionality, sit with the customer.

## Manufacturing flexibility

A customer that owns a certified design can place it with any contract manufacturer in the world. The same design can be produced at multiple facilities simultaneously: a plant in Brazil supplying the South American market without import tariffs, a plant in the Czech Republic supplying Europe, a plant in Taiwan or Mexico supplying North America. Manufacturing geography becomes a business decision driven by tariffs, lead times, labor costs, and supply chain considerations, not a constraint imposed by the design owner.

F3 does not have a manufacturing arm and does not steer customers to a preferred contract manufacturer. Customers select their own manufacturing partners. F3 will support the selection process, will help with manufacturing readiness, and will engage with the chosen contract manufacturer during the pilot production cycle, all billed by the hour. F3's relationship with the contract manufacturer ends when the customer's manufacturing relationship begins.

## Ongoing support

After the certified prototype, F3's relationship with the customer ends by default. The customer takes the design, manufactures the product, sells it, and operates it on its own schedule. F3 is not involved in any of that work unless the customer engages F3 for additional effort.

Customers do engage F3 for additional effort, regularly. Production-line manufacturing testers (calibrated test stations that verify each unit's radio performance as it comes off the line) are a common follow-on engagement. Field-issue investigation, design refresh for a second-generation product, additional certification work for new markets, and recurring help with manufacturing process changes are others. Each is billed by the hour against a defined scope. None of them is a retainer or a recurring license.

The engagement model is one direction in this respect. F3 does not impose ongoing relationships. The customer initiates a return engagement when there is something specific to do.

## The scope F3 covers

F3's competence covers what is required to take a connected-product concept to a certified prototype. Within that scope: system architecture, RF design, circuit design and layout for wireless and embedded electronics, firmware development for the application and the radio interface, antenna integration and (when necessary) custom antenna design, lab validation through full DVT cycles, certification support, and the manufacturing-readiness work that prepares a design for the contract manufacturer.

Outside the scope: integrated circuit development (F3 does not design silicon), manufacturing operations (F3 does not run production lines), distribution and logistics (F3 does not handle inventory or fulfillment), and ongoing operations of fielded products (F3 does not provide tier-one customer support for shipped devices). Customers needing any of these services engage other providers; F3 will work alongside them where the scopes intersect.

The model is built around a specific gap: companies that need wireless engineered correctly before production, without building an internal wireless R&D department. F3 occupies that gap and operates within it.
