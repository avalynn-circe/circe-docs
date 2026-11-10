---
slug: /chat-analyses/prompt-analysis
sidebar_label: Prompt analysis
sidebar_position: 2
description: "A controlled test of prompt wording, ordering and layering that raised chatbot routing accuracy from 62% to 95%."
---

# Prompt Analysis: Structure, Ordering & Layering

Nov 10, 2026 · Avalynn Circe

## At a glance

**In one sentence:** we tested different ways of writing the assistant’s instructions, and the best version sends visitors to the right place 95 times out of 100 (up from 62), costs less to run, and is safer for the team to edit. We recommend adopting it.

**The recommended instructions are more accurate, cheaper and just as safe**

| | Number | What it means | Status |
| --- | --- | --- | --- |
| 🟢 | **95%** | Visitors sent the right way: insurance and booking requests reach the right next step | Up from 62% |
| 🟢 | **57%** | Shorter instructions: costs less per reply and answers faster (2.1 seconds) | Lower running cost |
| 🟢 | **100%** | Crisis messages escalated: every safety message reached a person on the first reply | Held steady |

**What we learned, in plain terms**

<!-- vale Circe.TrailingContrast = NO -->
- **Say it simply.** Plain instructions with a one-line reason beat formal, legal-style wording, the same way a new hire follows a clear brief better than a policy manual.
- **Put the must-follow rules first, and repeat them at the end.** When the rules came after a long block of reference material, the assistant often forgot them, like a key instruction buried on page 10.
- **Build instructions from reusable blocks.** Instead of one long document, the assistant gets only the blocks it needs for each type of conversation, like a checklist matched to the task.
<!-- vale Circe.TrailingContrast = YES -->

**What we need from you**

| Decision | Why it matters | Effort |
| --- | --- | --- |
| Adopt the new instructions for Client A now | Fixes the problem behind the recent incident | Ready to go; about 1 day |
| Pilot on two more clients before rolling out to all | Confirms the gains hold beyond one client | About 2 weeks |
| Require the standard test before any instruction change goes live | Catches mistakes before visitors see them | About 2 hours per change |

*Everything below this point is the technical detail for the teams doing the work.*

## Technical summary

*All client names are anonymized for privacy.*

The layered, rules-first prompt routed 95% of test messages correctly versus 62% for the production prompt, while using 57% fewer prompt tokens. This analysis tested three structural choices for Client A’s GenAI answer layer after a routing failure (see the sample post-mortem):

1. **Language:** plain instructions vs complex, formal phrasing.
2. **Order of operations:** where rules, knowledge and tone sit in the prompt.
3. **Layering:** one monolithic prompt vs prompt parts stored in variables and assembled per conversation path.

| Finding | Effect on routing accuracy |
| --- | --- |
| Plain language with a one-line reason beat complex phrasing | +12 points |
| Routing rules before retrieved knowledge, restated at the end, beat rules after knowledge | +31 points |
| Layered prompt assembled by path matched or beat the best monolithic prompt | +2 points, 57% fewer tokens |

Safety escalation recall stayed at 100% in every variant except one ordering, which is ruled out.

## How we tested

Every variant ran against the same 120-message test set in a staging copy of Client A’s bot, three runs each, so each cell below is 360 graded responses.

**Test set** (written from anonymized real transcripts):

| Path | Messages | What “correct” means |
| --- | --- | --- |
| Insurance | 30 | Starts the Verify Insurance flow; never confirms coverage itself |
| Admissions | 30 | Starts the callback flow and collects name and phone |
| General program questions | 30 | Answers from the knowledge index without routing |
| Safety or crisis | 15 | Gives the crisis line and escalates to a live agent immediately |
| Out of scope | 15 | Declines briefly and offers the main menu |

**Metrics**

- **Routing accuracy:** share of messages sent down the correct path, including correctly *not* routing.
- **Answer accuracy:** general answers graded against the source page (correct, partial, wrong).
- **Safety recall:** share of the 15 crisis messages escalated on the first turn. Anything under 100% disqualifies a variant.
- **Tone score:** 1–5 rubric (warm, plain, 8th-grade reading level), scored by two reviewers; disagreements settled by a third.
- **Prompt tokens and p50 latency:** cost and speed per response.

**Held constant:** same model and version, temperature 0.3, same knowledge index (archive pages excluded), same retrieval settings (top 5 chunks).

## Test 1: How we word it (plain vs complex language)

Plain instructions with a one-line reason won on every metric; complex phrasing lowered routing accuracy and made the bot itself sound stiff. All three variants used the same content and the same rules-first order.

**Variant A: Complex**

```
In circumstances wherein the user's inquiry pertains, whether explicitly or
implicitly, to matters of insurance coverage, benefits eligibility, or payer
participation, the assistant shall refrain from rendering determinations and
shall instead initiate the designated verification workflow.
```

**Variant B: Plain**

```
If the visitor asks about insurance, coverage or cost, start the Verify
Insurance flow. Do not say whether a plan is accepted.
```

**Variant C: Plain + reason**

```
If the visitor asks about insurance, coverage or cost, start the Verify
Insurance flow. Do not say whether a plan is accepted.
Why: accepted plans change often, and the admissions team must confirm them.
```

| Variant | Routing accuracy | Answer accuracy | Tone score (1–5) | Prompt tokens |
| --- | --- | --- | --- | --- |
| C: Plain + reason | 91% | 87% | 4.4 | 3,420 |
| B: Plain | 88% | 86% | 4.3 | 3,310 |
| A: Complex | 79% | 84% | 3.1 | 3,880 |

**What we saw in transcripts**

- Complex phrasing missed indirect insurance questions (“How much will this cost me?”) because the model matched the formal terms literally.
- The bot mirrored the prompt’s register: Variant A answers averaged an 11th-grade reading level versus 7th grade for B and C.
- The one-line reason in C helped edge cases most: “Do you take Medicaid?” routed 100% of the time, versus 83% in B, because the model understood *why* it should not answer.

## Test 2: What comes first (order of operations)

Putting routing and safety rules before the retrieved knowledge, then restating the routing rule at the very end, gave the best routing (93%) and kept safety at 100%. All four orders used Variant C language and identical content; only the position of each section changed.

| Order | Sequence | Routing accuracy | Safety recall | Tone score |
| --- | --- | --- | --- | --- |
| O4: Rules first + reminder | Rules → Role → Tone → Knowledge → Rule reminder | 93% | 100% | 4.4 |
| O1: Rules first | Role → Rules → Tone → Knowledge | 91% | 100% | 4.4 |
| O2: Knowledge first (production v15) | Role → Knowledge → Rules → Tone | 62% | 100% | 4.3 |
| O3: Rules last | Role → Tone → Knowledge → Rules | 48% | 93% | 4.5 |

**Retrieved-context length drives the gap.** Splitting results by how much knowledge was retrieved shows that order barely matters for short context and matters a great deal for long context.

| Order | Routing, under 500 knowledge tokens | Routing, over 1,500 knowledge tokens |
| --- | --- | --- |
| O4 | 95% | 91% |
| O1 | 94% | 87% |
| O2 | 86% | 39% |
| O3 | 81% | 22% |

**What we saw in transcripts**

<!-- vale Circe.TrailingContrast = NO -->
- In O2 and O3, long knowledge blocks pulled the model into “answer mode”: it summarized the insurance page instead of starting the flow.
- O3 missed one crisis message that arrived alongside a long insurance question; the model answered the insurance part first. That single miss disqualifies O3.
- The end-of-prompt reminder in O4 is short (two sentences, about 40 tokens) and recovered most of the long-context loss.
- Tone guidance placed last (O3) scored slightly higher on tone, but not enough to justify the routing loss.
<!-- vale Circe.TrailingContrast = YES -->

## Test 3: Building from reusable blocks (prompt layering)

Storing each part of the prompt in its own variable and assembling only what the current path needs beat the best monolithic prompt on routing (95% vs 93%) and cut prompt size by 57%. It also made the prompt safe to edit: tone and FAQ changes no longer move the routing rules.

**Each prompt is assembled from fixed layers plus one path layer.** The flow router sets `active_path` and `is_open` on every message; the assembler then fills nine slots in this fixed order:

| Slot | Variable | Loaded | Purpose |
| --- | --- | --- | --- |
| 1 | `safety_rules` | Always | Crisis escalation |
| 2 | `routing_rules` | Always | When to start a flow |
| 3 | `core_identity` | Always | Role and scope |
| 4 | `path_layer` | Chosen by `active_path` | One of: `path_insurance`, `path_admissions`, `path_general`, `path_fallback` |
| 5 | `client_facts` | Always | Locations, hours, phone |
| 6 | `after_hours_notice` | Only if `is_open` = false | After-hours message |
| 7 | `tone_profile` | Always | Voice and reading level |
| 8 | `knowledge_context` | Retrieved per message | Relevant website content |
| 9 | `routing_reminder` | Always | Restates routing rules |

This is the O4 order from Test 2. Only slot 4 changes by path, and slots 6 and 8 appear only when needed.

**Assembly template** (pseudo-config):

```
PATH_LAYERS = {
  "insurance":  {{path_insurance}},
  "admissions": {{path_admissions}},
  "general":    {{path_general}}
}

prompt =
  {{safety_rules}}
  {{routing_rules}}
  {{core_identity}}
  PATH_LAYERS[{{active_path}}] or {{path_fallback}}
  {{client_facts}}
  if {{is_open}} == false: {{after_hours_notice}}
  {{tone_profile}}
  <knowledge>{{knowledge_context}}</knowledge>
  {{routing_reminder}}
```

**Example path layer** (`{{path_insurance}}`):

```
The visitor is asking about insurance or cost.
1. Thank them and say the admissions team checks every plan personally.
2. Start the Verify Insurance flow right away.
3. Do not say whether any plan is accepted, even if the knowledge mentions it.
Why: accepted plans change often, and the admissions team must confirm them.
```

**Monolithic vs layered** (both using O4 order and Variant C language):

| Metric | Monolithic | Layered |
| --- | --- | --- |
| Routing accuracy | 93% | 95% |
| Answer accuracy | 87% | 89% |
| Safety recall | 100% | 100% |
| Tone score (1–5) | 4.4 | 4.4 |
| Average prompt tokens | 3,460 | 1,480 |
| p50 latency | 2.9 s | 2.1 s |
| Simulated CX edits that moved routing by 5+ points | 4 of 10 | 0 of 10 |

**Failure-mode checks.** Layering adds one new risk: a variable that is empty or wrong.

- `active_path` empty (15 forced cases): the fallback layer plus the always-on routing rules handled 14 correctly; one insurance message was answered as general. A fix is listed under Recommendations.
- `is_open` wrong (10 forced cases): the after-hours notice appeared or vanished as expected; routing was unaffected because handoff logic lives in the webhook, not the prompt.
- Missing layer content (a variable set to blank text): the assembler now refuses to publish a prompt with an empty required slot.

## All results together

The three changes stack: each one adds accuracy on top of the last, and the combined configuration beats production v15 by 33 points on routing.

| Configuration | Language | Order | Structure | Routing | Answer accuracy | Safety | Tokens |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Production v15 | Mixed | O2 | Monolithic | 62% | 85% | 100% | 3,390 |
| + Plain language | C | O2 | Monolithic | 66% | 86% | 100% | 3,420 |
| + Rules-first order | C | O4 | Monolithic | 93% | 87% | 100% | 3,460 |
| + Layering (recommended) | C | O4 | Layered | 95% | 89% | 100% | 1,480 |

**By path, recommended configuration:** insurance 97%, admissions 96%, general 93%, out of scope 93%, safety 100%.

**Limits of this test.** One client, one model version and a 120-message set. Results should be re-checked on at least two other client bots, especially those with very different knowledge sizes, before becoming the platform default.

## Recommendations

Adopt the layered, rules-first, plain-language prompt for Client A now, and pilot it on two more clients before making it the default.

1. **Write instructions plainly, with a one-line reason.** Short sentences, everyday words, and a “Why:” line for any rule the model must not bend.
2. **Fix the order: rules first, knowledge late, reminder last.** Safety and routing rules go before role and tone; retrieved knowledge sits near the end inside clear tags; a two-sentence routing reminder closes the prompt.
3. **Store prompt parts as variables and assemble by path.** Keep safety, routing and the reminder in locked layers; let CX edit tone, client facts and path layers freely.
4. **Harden the fallback.** When `active_path` is empty, re-run intent detection once before falling back to `path_general`; this targets the one miss found in Test 3.
5. **Gate every publish on the regression set.** Run the 120-message set (or a 40-message quick set) before any prompt or layer change goes live; block publish if routing drops 3+ points or safety drops below 100%.
6. **Track route rate per path in production.** Alert on a 15-point day-over-day drop, the signal that was missing in the incident.

**Open questions**

- [ ] Should path layers be shared across clients in the same vertical, with only client facts varying?
- [ ] Who owns the locked layers: CX, Platform or a joint review?
- [ ] Does the rules-first order hold on the next model version? Re-run this test before upgrading.

## Glossary

| Term | Plain meaning |
| --- | --- |
| Prompt | The written instructions that tell the AI how to behave |
| Routing | Sending a visitor to the right next step, such as a form or a person |
| Routing accuracy | Out of 100 messages, how many went to the right place |
| Layer / variable | One reusable block of instructions, stored by name so it can be slotted in when needed |
| Path | The type of conversation, such as insurance, booking or a general question |
| Retrieved knowledge | The pieces of the client’s website the assistant looks up to answer a question |
| Tokens | The unit AI providers charge by; fewer tokens means lower cost and faster replies |
| Safety recall | Out of every crisis message, how many were passed to a person right away |
| Latency | How long the visitor waits for a reply |
