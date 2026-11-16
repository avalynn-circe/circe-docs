---
title: "Patient-Facing Web Chatbot: User Stories"
sidebar_label: User stories
slug: /business-analysis/user-stories
description: Two epics and 12 user stories for a bilingual patient-facing web chatbot, each with Given, When, Then acceptance criteria, a priority, and traces to the companion BRD and FRD. Anonymized sample.
---

# Patient-Facing Web Chatbot: User Stories (Anonymized Sample)

November 16, 2026 · Avalynn Circe

Anonymized sample. The client, vendor, people, web addresses and system identifiers are replaced with generic descriptions.

## Document control

| Field | Value |
|---|---|
| Product | Patient-facing web chatbot |
| Customer | A regional autism services nonprofit |
| Platform | A conversational AI platform |
| Version | 1.0 |
| Built from | Patient-Facing Web Chatbot BRD and FRD, version 1.0 |

These stories turn the [BRD](pathname:///business-analysis/Patient-Facing-Chatbot-BRD-Anonymized-Sample.pdf) and [FRD](pathname:///business-analysis/Patient-Facing-Chatbot-FRD-Anonymized-Sample.pdf) into work a delivery team can build and test. Each story names who wants it, what they want and why. Each story lists its acceptance criteria as Given, When, Then, and traces to the requirement IDs in the companion documents. Priorities use the BRD's scale: P0 is required for launch, and P1 and P2 may follow in later releases.

## Epic 1: Start an inquiry and reach the team

A family or adult seeking services can start an inquiry at any hour, and every inquiry reaches the nonprofit's Salesforce in a form staff can follow up.

Traces to: BR-04, BR-05, BR-06, BR-07, BR-09, BR-20 · Objectives O1, O3

### US-01 Ask before collecting details

**Priority:** P0 · **Traces to:** BR-04, FR-3.1

As a parent visiting the website after hours, I want the bot to ask before it collects my details, so that I decide whether to share them.

- **Given** a visitor has asked to start an inquiry, **when** the inquiry workflow begins, **then** the first question asks whether they agree to share their details.
- **Given** the visitor declines, **when** they answer No, **then** the bot offers other ways to contact the nonprofit and asks no further inquiry questions.
- **Given** the visitor agrees, **when** they answer Yes, **then** the bot moves to the age check.

### US-02 Confirm the person contacting is an adult

**Priority:** P0 · **Traces to:** BR-09, FR-3.2, FR-3.3, FR-4.11

As the nonprofit's intake team, I want only adults to submit an inquiry, so that every lead comes from someone who can consent to services.

- **Given** the visitor has agreed to share details, **when** the age question appears, **then** it offers two buttons, "I am 18 or older" and "I am under 18", and asks for no date of birth.
- **Given** the visitor picks "I am 18 or older", **when** the lead is created, **then** the Age Verification field in Salesforce is True.
- **Given** the visitor picks "I am under 18", **when** they answer, **then** the bot shows "Please have a parent or legal guardian over 18 contact us for services." and ends the form.
- **Given** a parent is asking about a child, **when** they read the age question, **then** its wording makes clear it asks about the person contacting, not the child.

### US-03 Record who the inquiry is for

**Priority:** P0 · **Traces to:** BR-04, BR-05, FR-3.4, FR-3.5, FR-3.6, FR-3.7

As a caregiver asking on behalf of a family member, I want the bot to ask about my relationship to them in words that fit, so that staff know who needs services before they call me.

- **Given** the age check is passed, **when** the relationship question appears, **then** it is a button list that includes "Self" and "Other" and does not offer "Unknown".
- **Given** the visitor picks "Self", **when** they continue, **then** Relationship to Client is set to "Self", the client name fields are filled from the visitor's own name, and the client-name questions are skipped.
- **Given** the visitor picks a relationship such as "Uncle", **when** the client-name question appears, **then** it uses the inverse relationship, for example "your niece's or nephew's first name".
- **Given** the name questions are answered, **when** the bot addresses the visitor afterward, **then** it uses their first name or no name, never their last name.

### US-04 Choose how the team contacts me

**Priority:** P0 · **Traces to:** BR-04, FR-3.8, FR-3.9

As a parent, I want to choose email, phone or both, so that the team reaches me the way I prefer.

- **Given** the names are collected, **when** the contact question appears, **then** it offers Email, Phone and Both.
- **Given** the visitor declines to give an email or has none, **when** they say so, **then** the bot stops asking for an email.
- **Given** the visitor gives a phone number, **when** the bot moves on, **then** the SMS consent question comes after the phone question.
- **Given** any question in the workflow, **when** it is shown, **then** it carries no "step X of Y" numbering.

### US-05 Send a complete, usable lead to Salesforce

**Priority:** P0 · **Traces to:** BR-05, BR-20, FR-4.1, FR-4.2, FR-4.5, FR-4.6, FR-4.10, FR-4.13, FR-4.14

As the nonprofit's intake coordinator, I want every finished inquiry to arrive in Salesforce with the fields I need, so that I can call the family without asking the same questions again.

- **Given** the core inquiry questions are answered, **when** the visitor answers the contact and consent questions, **then** the bot creates one Lead in the nonprofit's Salesforce through the integration user.
- **Given** a field Salesforce requires was left blank, **when** the lead is created, **then** it carries the rule-based value from the FRD's required-field table, so Salesforce does not reject it.
- **Given** an answer maps to a Salesforce picklist, **when** the lead is created, **then** the value came from a button and matches the picklist value exactly.
- **Given** any lead created by the bot, **when** staff open it, **then** Lead Channel reads "Web Chatbot" and no field is logged twice.

### US-06 Keep the lead when a visitor leaves early

**Priority:** P0 · **Traces to:** BR-06, FR-4.3, FR-4.4

As the nonprofit's intake coordinator, I want a partial lead when a visitor gives a name and a way to reach them but does not finish, so that we can still follow up.

- **Given** a visitor has given a name plus an email or phone, **when** they leave before finishing, **then** a partial lead reaches Salesforce.
- **Given** a visitor finishes the core questions with an email or phone, **when** the lead is created, **then** it is not flagged as partial.
- **Given** the vendor has not yet tested each data-submit card, **when** a partial lead is created, **then** no notification email goes to the nonprofit's address.

### US-07 Tell the nonprofit when a lead fails to sync

**Priority:** P1 · **Traces to:** BR-07, FR-4.12, FR-6.7

As the nonprofit's IT and Salesforce administrator, I want an alert with the visitor's contact details whenever a lead fails to reach Salesforce, so that no family is lost to a sync error.

- **Given** a lead submit fails, **when** the failure is detected, **then** a notice goes to the nonprofit's lead-failure inbox.
- **Given** a failure notice, **when** staff read it, **then** it includes enough contact detail to follow up the lead by hand.
- **Given** a submit fails while the visitor is still in the chat, **when** the bot responds, **then** it keeps the lead data and shows the visitor a message they can recover from.

## Epic 2: Get the right answer, in the right language, safely

Every visitor gets an accurate answer or the right path, in English or Mexican Spanish, and the bot never acts as a clinician.

Traces to: BR-03, BR-10, BR-11, BR-15, BR-16 · Objectives O2, O4

### US-08 Use the bot in Spanish from start to finish

**Priority:** P0 · **Traces to:** BR-10, FR-1.6, FR-5.1, FR-5.2, FR-5.3, FR-5.4, FR-5.6, FR-5.7

As a Spanish-speaking parent, I want the whole conversation in Mexican Spanish, so that I get the same help as an English-speaking family.

- **Given** the welcome message, **when** a visitor picks the "Español" button or types in Spanish, **then** the conversation continues in Spanish.
- **Given** a Spanish session, **when** the visitor starts an inquiry, **then** the questions, order and branches match the English workflow step for step.
- **Given** a Spanish session, **when** any screen appears, **then** it shows no English system or loading text, and AI answers stay in Spanish.
- **Given** a Spanish answer to a picklist question, **when** the lead is created, **then** Salesforce stores the English picklist value.
- **Given** Spanish copy, **when** a reviewer checks it, **then** it uses Mexican Spanish phrasing, for example "primer nombre".

### US-09 Learn about a program before any form

**Priority:** P1 · **Traces to:** BR-03, FR-2.7, FR-2.8

As a parent who has heard of the preschool program, I want the bot to explain it before asking for my details, so that I know whether it fits my child.

- **Given** a visitor asks about the parent-training program, preschool or ABA, **when** the bot answers, **then** the answer says what the program is, how long it runs and what families get.
- **Given** the explanation, **when** the visitor has not asked to take a next step, **then** the bot does not open the inquiry form.
- **Given** the visitor asks how to enroll or get started, **when** the bot responds, **then** it offers the inquiry form.

### US-10 Send employers and partners to their own path

**Priority:** P1 · **Traces to:** BR-11, FR-1.5, FR-3.15, FR-6.4

As an employer interested in a partnership, I want a path built for organizations, so that I am not asked family intake questions.

- **Given** a visitor says they represent an employer or organization, **when** the bot routes them, **then** they enter the partner path and not family intake.
- **Given** the employer form, **when** it is shown, **then** it asks no age or date-of-birth question.
- **Given** a completed employer inquiry, **when** it is submitted, **then** it goes to the community services team and not the patient intake queue.

### US-11 Inform without diagnosing or promising eligibility

**Priority:** P0 · **Traces to:** BR-15, FR-2.9, FR-6.5

As the nonprofit's program lead, I want the bot to inform families without diagnosing or promising study eligibility, so that families get accurate expectations and the nonprofit avoids clinical harm.

- **Given** a visitor describes a child's behavior and asks whether it is autism, **when** the bot answers, **then** it gives general information and the next step to an evaluation, and does not diagnose.
- **Given** a visitor shares a screening score, **when** they ask what it means, **then** the bot does not interpret the result and offers a way to talk with staff.
- **Given** a visitor asks to join a research study, **when** the bot answers, **then** it gives study information and a handoff to the research team, and never says the visitor qualifies.

### US-12 Route a visitor in crisis to help

**Priority:** P0 · **Traces to:** BR-16, FR-2.10

As a visitor in crisis, I want the bot to point me to help right away, so that I reach the right resources quickly.

- **Given** a message that signals a crisis, **when** the bot responds, **then** it shows the nonprofit's crisis-response content before anything else.
- **Given** a crisis response, **when** it is shown, **then** it does not start or continue the inquiry form.
- **Given** a Spanish session, **when** a crisis message arrives, **then** the crisis-response content is in Spanish.

## Traceability

| Story | Business requirements | Functional requirements |
|---|---|---|
| US-01 Ask before collecting details | BR-04 | FR-3.1 |
| US-02 Confirm the person contacting is an adult | BR-09 | FR-3.2, FR-3.3, FR-4.11 |
| US-03 Record who the inquiry is for | BR-04, BR-05 | FR-3.4 to FR-3.7 |
| US-04 Choose how the team contacts me | BR-04 | FR-3.8, FR-3.9 |
| US-05 Send a complete, usable lead | BR-05, BR-20 | FR-4.1, FR-4.2, FR-4.5, FR-4.6, FR-4.10, FR-4.13, FR-4.14 |
| US-06 Keep the lead when a visitor leaves early | BR-06 | FR-4.3, FR-4.4 |
| US-07 Tell the nonprofit when a lead fails | BR-07 | FR-4.12, FR-6.7 |
| US-08 Use the bot in Spanish | BR-10 | FR-1.6, FR-5.1 to FR-5.4, FR-5.6, FR-5.7 |
| US-09 Learn about a program before any form | BR-03 | FR-2.7, FR-2.8 |
| US-10 Send employers and partners to their own path | BR-11 | FR-1.5, FR-3.15, FR-6.4 |
| US-11 Inform without diagnosing | BR-15 | FR-2.9, FR-6.5 |
| US-12 Route a visitor in crisis | BR-16 | FR-2.10 |

Not yet covered by a story: BR-01, BR-02, BR-08, BR-12, BR-13, BR-14, BR-17, BR-18 and BR-19. These cover answers and content upkeep, referral source, careers routing, clarifying questions, page-specific greetings, reporting and the HIPAA BAA.

## Open questions that affect these stories

- US-03: What placeholder does the nonprofit want stored for Relationship to Client when it is not known?
- US-10: Where do community-partner and employer leads go after the community services team?
- US-12: What exact crisis wording and resources does the nonprofit want the bot to give?
