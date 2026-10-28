# Rules the server enforces

circe-mcp 0.1.0 enforces 13 rules from the Circe Editorial Standard for Gen AI Content (CES) v0.3. `error` follows the standard's MUST AVOID tier and `warning` its SHOULD AVOID tier. Two rules are off by default; pass `includeOptional: true` or name them in `rules` to run them. `fix_text` handles the rules marked fixable. Everything else is a rewrite.

| Rule | Name | Level | Default | Fixable | Catches |
|---|---|---|---|---|---|
| CES-P-001 | No em dashes | error | on | yes | The em dash character (U+2014). Becomes a comma. |
| CES-Q-001 | No reflexive hedges | warning | on | yes | `just`, `actually`, `really`. Temporal `just` and a contrastive `actually` in a heading are exceptions the checker cannot see. |
| CES-Q-002 | No hollow intensifiers | warning | on | yes | `genuinely`, `truly`, `deeply`. |
| CES-C-001 | No negate-then-elevate | warning | on | no | `It's not X, it's Y.`, `We don't do X. We do Y.`, `No X. No Y. Just Z.`, `What X really means is`. |
| CES-C-002 | No stylistic triple lists | warning | off | no | Three single lowercase words joined "A, B, and C". Proper nouns, numbers, and longer lists are skipped. |
| CES-C-003 | No throat-clearing runways | warning | on | no | `It's worth noting that`, `The key thing is`, `Here's how I'd approach it`, `It's important to note that`. |
| CES-C-004 | No trailing bows | warning | on | no | A closer after a comma: `, and that's what matters`, `, which is the whole point`. |
| CES-C-005 | No so-what gloss | warning | on | no | A sentence that tells the reader what to conclude: `That's no accident.`, `Which tells you everything you need to know.`, `is the same muscle as`. |
| CES-C-008 | No trailing contrast clauses | error | on | no | `rather than`, `instead of`, `not only`, `not just`. The phrases `go beyond`, `goes beyond`, `move beyond`, `far beyond`, and `well beyond` report as warnings. Exception: a contrast that carries facts the reader needs. |
| CES-V-001 | No resume cliches | warning | off | no | 31 stock phrases: `proven track record`, `hit the ground running`, `thought leader`, `results-driven`, `seamless`, `leverage`, and the rest. |
| CES-V-006 | No chatty asides | warning | on | no | `Let's dive in`, `Spoiler alert`, `Pro tip:`, `Buckle up`, `Long story short`, `Without further ado`. |
| CES-V-007 | No punchy flourishes | error | on | no | Implied inferior baselines: `in practice` (error), `not abstract` and `real` (warning). Fragments of three words or fewer after a long sentence (warning, low confidence). |
| CES-V-008 | No gratuitous trailing clauses | warning | on | no | Trailing minimizers: `alone` at the end of a clause, `merely`, `mere`. |

Sub-forms come back in the `form` field. An inferior baseline reports as CES-V-007 with `form: inferior-baseline`. A fragment reports with `form: fragment`.

When two rules match the same span, the most severe one is reported and the others appear under `related`. `It's not just code, it's craft.` reports once, as CES-C-008, with CES-Q-001 and CES-C-001 related.

# Rules the standard documents that stay with a reader

The standard has 28 rules in 10 categories. The ones below are not in `check_text`. Some have numbers in `measure_text`; the rest need a human.

| Rule | Name | Where it lives |
|---|---|---|
| CES-C-006 | No pronouncements (aphorisms such as "Simplicity scales") | Reader |
| CES-C-007 | Permitted explicit statement (the one short declarative a paragraph may keep) | Reader. The fragment detector in CES-V-007 cannot judge it. |
| CES-V-002 | No manufactured intimacy | Reader |
| CES-V-003 | No scene-painting in place of evidence | Reader |
| CES-V-004 | No vague perfection | `measure_text`: specifics per 100 words, `lowSpecificity` flag |
| CES-V-005 | No over-enthusiasm | `measure_text`: exclamation count, stacked superlatives |
| CES-S-002 | Paragraph density | `measure_text`: sentence count per paragraph, `dense` flag |
| CES-K-003 | Code comments follow the rules | `check_text` with `checkCode: true` |
| CES-P-002, N-001 | Straight quotes in prose, acronyms defined on first use | Planned for the server. Reader for now. |
| CES-A-001, A-002, S-001, T-001 to T-004, L-001, L-002, N-002, N-003, K-001, K-002 | Accuracy, structure, typography, links, naming, code | Reader. Not text patterns. |

Call `explain_rule` with any enforced ID for the full text: pattern, reasoning, replacement strategy, exceptions, example, and the tokens the checker uses.
