---
name: editorial-standards
description: >-
  Checks a draft against the Circe Editorial Standard through the circe-mcp
  server and walks the writer through the fixes. Use when asked to edit,
  review, polish, or proofread a draft; to make text sound less like AI; to
  remove AI tells; to check against the Circe Standard or the editorial
  standard; to review docs, a README, or release notes; to clean up a resume
  or cover letter; or to polish a blog post, a bio, or an email before it ships.
  Flags em dashes, hedges, hollow intensifiers, trailing contrast clauses,
  negate-then-elevate constructions, throat-clearing openers, chatty asides,
  and resume cliches, each with a rule ID, the offending span, and a suggested
  fix. Requires the circe-mcp MCP server and stops with setup steps when the
  server is not connected.
---

# Editorial Standards

Check a draft against the Circe Editorial Standard (CES) with the circe-mcp server, then walk the writer through the fixes. The server does the detection. This skill decides what to send, how to present the findings, and what to leave untouched.

## Before you start

1. **Confirm the server is connected.** Look for the tools `check_text`, `fix_text`, `list_rules`, `explain_rule`, and `measure_text`. Clients prefix them with the server name, so `circe-mcp:check_text` and `mcp__circe-mcp__check_text` are the same tool. Call `list_rules` once as a handshake. It returns the standard's name and version.
2. **If the tools are missing or the handshake fails, stop.** Tell the user the checker is not connected and point them to the setup steps in `README.md`. Do not scan the text by eye and present the result as a check. A tool result and your own reading are different things, and the user needs to know which one they are looking at.
3. **Decide whose voice the text is in.** A resume, a cover letter, a bio, a personal essay, or anything the user will sign is their own voice. Docs, READMEs, blog posts, release notes, and marketing copy are working text. The mode changes step 3 below.

## Workflow

### 1. Send the text

Call `check_text` with the complete text in `text`. Send whole files. Line and column numbers in the result refer to the text you sent, so a fragment produces positions that point nowhere. Markdown is understood: fenced code, inline code, URLs, HTML tags, and comments are skipped, and front matter is checked.

Set options when they apply:

- **Resume or cover letter:** pass `includeOptional: true`. The resume cliche rule (CES-V-001) is off by default, and this is the text it exists for.
- **A pattern the user already called intentional:** pass its rule ID in `ignore`.
- **The user asked for blocking problems only:** pass `severity: "error"`.
- **The user wants code comments checked too:** pass `checkCode: true`.

### 2. Report the findings

Group violations by severity: errors first, then warnings, then suggestions. Inside a group, keep document order. For each violation show three things:

- the rule ID and rule name
- the position as `line:column` and the matched span in quotes
- the fix: the `suggestion` field for a fixable hit, or your own rewrite for the rest, labelled as a proposal

A violation may carry `related` entries where several rules matched the same span. Show the primary one and name the related IDs on the same line.

Confidence is part of the result. A hit marked `medium` or `low` is a guess: `real` as a plain adjective, or a temporal `just`, trips the pattern without breaking the rule. Say so and let the user rule on it. Call `explain_rule` when the user asks why a rule exists or when you need its exception text.

End the report with the counts line the tool returned. If the tool returned "No violations.", say so and offer `measure_text` for the judgment calls (see the last section).

### 3. Ask how to proceed

Offer three options:

1. Apply all fixes.
2. Apply by severity, errors first, then ask again.
3. Review one by one.

Default to option 3 for the user's own voice and option 2 for working text, pausing on every medium or low confidence hit either way. If the user already said to apply everything, skip the question.

### 4. Apply the fixes

- **Mechanical fixes go through `fix_text`.** It replaces an em dash with a comma and deletes hedges and hollow intensifiers, then returns the edited text, the list of edits, and what remains. Read every em dash fix that joined two independent clauses. The standard allows a semicolon or a new sentence there, and the fixer cannot tell which reads better.
- **Every other violation is a rewrite you draft**, following the rule's replacement strategy. Keep the claim and change the form. Rewrite the sentence, not the paragraph around it.
- **Honor the standard's exceptions.** A trailing contrast that carries facts the reader needs, such as a migration from one database to another, stays. Mark it with the rule ID in `ignore`, or wrap it in the text with `<!-- ces ignore CES-C-008 -->` and `<!-- ces end -->` so later runs skip it too.

### 5. Re-run and report

Call `check_text` again on the edited text with the same options. Report what remains, by severity. Stop when the count is zero, or when every remaining violation is one the user marked as intentional. List the intentional ones by rule ID in the final report so the next reader knows they were seen.

## Rules of conduct

- **Intentional patterns stay.** When the user says a pattern is deliberate, leave it, note it, and pass its rule ID in `ignore` on the next run.
- **Never change meaning.** A fix changes form. If a sentence's claim looks wrong, cannot be verified, or outruns its evidence, raise it under a separate "Factual" heading and leave the wording as it is. A style pass is not cover for editing a claim.
- **Keep the user's facts and vocabulary.** The cure for a cliche is the specific fact behind it. Ask for the fact when the user has not supplied it, and use a bracketed placeholder in the rewrite until they do. Do not invent an outcome to fill the gap.
- **Leave code alone** unless the user asked for `checkCode`.
- **Rewrites get checked too.** Step 5 catches a rewrite that trades one tell for another.

## What the checker cannot judge

Pattern matching catches stock phrasing. The rules that need a reader stay out of `check_text`: pronouncements (CES-C-006), manufactured intimacy (CES-V-002), scene-painting (CES-V-003), and vague perfection (CES-V-004). `measure_text` reports the numbers behind those calls, such as sentence rhythm per paragraph, opener echo, specifics per 100 words, and exclamation count, and leaves the verdict to you and the user. Run it on blog posts and essays after the check is clean. When you raise one of these, say it is your reading and not a tool result.

## References

- `references/rules-summary.md`: one line per rule the server enforces, plus the rules the standard documents that stay with a human reader.
- `references/examples.md`: before and after pairs from the standard.
- `README.md`: install and setup for the server and the skill.
