# Notes: packaging circe-mcp as the Editorial Standards skill

Findings from reading avalynn-circe/circe-mcp at commit 7a8bbb5 (2026-10-28), plus open questions. The skill folder is `skills/editorial-standards/` and the upload is `skills/editorial-standards.zip`.

## Name

Renamed from `circe-standard` to `editorial-standards` per the request. The folder, the frontmatter `name`, the zip, and the listing title all use the new name. The server keeps its name, circe-mcp, because that is the npm package the buyer installs.

## What the server exposes

| Tool | Input | Output |
|---|---|---|
| `check_text` | `text`; optional `severity`, `rules`, `ignore`, `includeOptional`, `checkCode` | `violations[]` with `ruleId`, `ruleName`, `severity`, `confidence`, `form`, `line`, `column`, `endLine`, `endColumn`, `offset`, `length`, `match`, `message`, `suggestion`, `fixable`, `related[]`; `counts`; `rulesRun` |
| `list_rules` | optional `severity` | `standard`, `version`, `rules[]` with `id`, `name`, `category`, `rating`, `severity`, `enabledByDefault`, `summary`, `forms` |
| `explain_rule` | `ruleId` | Full rule: `description`, `suggestion`, `exception`, `example`, `detector`, `tokens[]` |
| `fix_text` | `text`; optional `rules`, `ignore`, `includeOptional` | `text`, `applied[]`, `remaining[]` |
| `measure_text` | `text` | Word, sentence, and paragraph counts; per-paragraph rhythm, opener echo, specificity, density flags; exclamations; stacked superlatives |

Every tool returns a readable text report and the same result as `structuredContent`. All five are read-only and idempotent.

## Transport and how it runs

- Published on npm as `circe-mcp` 0.1.0 on 2026-10-07. `npx -y circe-mcp` works with nothing installed. Node 20 or later.
- Default transport is stdio. `circe-mcp http --port 3000` serves stateless Streamable HTTP at `/mcp`, bound to `127.0.0.1` unless `--host` is passed. No authentication layer.
- There is no hosted URL. Buyers run it locally or host it themselves (open question 2).
- Also a CLI: `check`, `fix`, `measure` on files, with `--fail-on` and `--json`.
- Listed in the MCP Registry as `io.github.avalynn-circe/circe-mcp`.

## Rules

- The rule set is bundled in the package at `rules/ces.yaml` and loaded at startup. Nothing is fetched at runtime.
- The server cites **CES v0.3**, not v0.1 as the handoff says. The skill and listing say v0.3.
- **13 rules are implemented**: P-001, Q-001, Q-002, C-001, C-002 (off by default), C-003, C-004, C-005, C-008, V-001 (off by default), V-006, V-007, V-008.
- **Documented in the standard but not in `check_text`**: C-006, C-007, V-002, V-003, V-004, V-005, S-002, P-002, N-001, and the A, S-001, T, L, N-002, N-003, K-001, K-002 sections. V-004, V-005, and S-002 have numbers in `measure_text`. DECISIONS.md D13 plans P-002, N-001, V-002, V-003, and the full Q-001 and Q-002 word lists for a later phase.
- Two deliberate downgrades are recorded in DECISIONS.md: the fragment form of V-007 ships at warning although the standard says MUST AVOID, and `not abstract` ships at warning because v0.3 does not list it.
- **No CSF (fiction) rules.** D11 says CSF follows as an optional rule set and nothing has started. The skill and listing do not mention CSF.
- The listing says "13 rules enforced from a 28-rule standard" so the count matches what a buyer gets.

## Secrets, paths, license

- No API keys, no tokens, and no hardcoded paths in the source. `publish.yml` uses OIDC trusted publishing, so no npm token is stored. `rules.ts` resolves the rules file relative to the module.
- `.gitignore` covers `node_modules`, `dist`, logs. Nothing sensitive is committed.
- MIT license is present in the repo and in `package.json`.
- The skill package holds no code, only Markdown. The README shows the standard `npx -y circe-mcp` install line from the server's own README. A strict scan could read that as "download and execute". The README also gives `npm install -g circe-mcp` as an alternative. If Agensi's scan flags the npx line, swap the order so the global install comes first.

## Checks run on the package

Every Markdown file in `skills/` was run through the built server:

```sh
node dist/cli.js check <files> --fail-on warning --include-optional
```

Result: no violations, optional rules included. A `grep` for U+2014 across `skills/` returns nothing.

## Pricing

Left blank for Avalynn. Comparable paid skills on marketplaces are one-time purchases, usually in the single-digit to low-double-digit dollar range. The server is free and MIT, so the skill is the only thing for sale. Options in question 3 below.

## Agensi flow

The Agensi site (agensi.io) does not resolve from this session's network, so the listing steps below come from the handoff, not from the page. Confirm against https://www.agensi.io/sell before submitting:

1. Create the Agensi account and connect Stripe (Avalynn does this herself).
2. Creator Dashboard, "Submit a Skill": upload `editorial-standards.zip`, set the price, add tags, paste the description from `LISTING.md`.
3. Review takes 24 to 48 hours.

Security scan pre-check against the eight points named in the handoff: no secrets (confirmed), no obfuscated code (no code at all), no download-and-execute shell commands run by the skill (the install line is documentation for a human, see above), no prompt-injection phrasing (the SKILL.md instructs the agent to stop and ask the user, never to override anything).

## Zip layout

```
editorial-standards.zip
  editorial-standards/
    SKILL.md
    README.md
    references/
      rules-summary.md
      examples.md
```

The skill folder sits at the root of the archive, which is what Claude.ai's skill upload expects. If Agensi wants `SKILL.md` itself at the archive root, re-zip from inside the folder:

```sh
cd skills/editorial-standards && zip -r ../editorial-standards-flat.zip .
```

## Open questions for Avalynn

1. **CSF.** Not in the server. Leave it out of the listing, or mention it as planned?
2. **Hosting.** No hosted URL exists. Buyers run `npx circe-mcp` locally. Stay with that, or stand up an HTTP instance (it needs an auth layer first)?
3. **Price.** Free skill with the free server, to drive circe-mcp adoption? Or a paid skill at a one-time price, since Agensi only takes a cut of what sells? A middle path: free on Agensi for the first month, then priced.
4. **Bundle.** A companion skill later, "Tell" (an AI-voice forensics explainer that teaches the patterns) or "Versify" (the poetry game)? "Tell" is the closer fit for the same buyer.
5. **Title.** The handoff's title was "Circe Standard: AI Tell Checker for Editors". With the rename the draft reads "Editorial Standards: AI Tell Checker for Editors". Keep "Circe" in the title for brand, or in the description only?
6. **The "AI detection" tag.** The skill removes tells; it does not classify text as AI-written. The tag will bring buyers who want a detector. Keep it for reach or drop it for accuracy?
7. **Rule wording.** Every rule name and example in the package is copied from `rules/ces.yaml` so the skill matches the server. Any wording change belongs in the server first.
