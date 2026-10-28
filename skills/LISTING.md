# Agensi listing draft

For Avalynn to approve. Nothing here has been submitted.

## Title

Editorial Standards: AI Tell Checker for Editors

Alternative, keeping the brand up front: Circe Editorial Standard: AI Tell Checker for Editors

## Tags

editing, writing, documentation, style guide, AI detection, resumes, MCP

(See NOTES.md question 6 on the "AI detection" tag.)

## Price

Left blank. See NOTES.md, "Pricing".

## Description

Your agent can write. This skill teaches it to edit.

Editorial Standards checks a draft against the Circe Editorial Standard, a published rule set for the patterns that read as machine-generated, and walks you through the fixes. Each finding carries a rule ID, the offending span with its line and column, a severity, and a suggested fix. You choose whether to apply everything, apply by severity, or review one at a time. The skill re-checks after every pass and stops when the text is clean or when only the patterns you marked as deliberate remain.

What it catches: em dashes, hedges, hollow intensifiers, trailing contrast clauses, negate-then-elevate constructions, throat-clearing openers, trailing bows, so-what gloss, chatty asides, implied inferior baselines, trailing minimizers, and 31 resume cliches. 13 rules enforced from a 28-rule standard, with the rules that need a human reader named so the agent knows where its judgment starts.

```text
Before: It's not just code, it's craft. We built it in practice.
After:  We built it on the Xerxes portal and two client sites.
```

Two rules of conduct are built in. The agent never changes a claim under cover of a style fix; a factual problem is raised separately. And a pattern you call intentional stays, with a note, on every later pass.

Works on docs, READMEs, blog posts, release notes, resumes, cover letters, and bios. Resume mode turns on the cliche rule and reviews one finding at a time, so nothing in your own voice changes without your say.

Requires circe-mcp, a free and open-source MCP server that does the detection with deterministic rules and no LLM calls. Install it with one command: https://github.com/avalynn-circe/circe-mcp#install. The skill's README covers setup for Claude Code, Claude Desktop, Cursor, and self-hosting.

## Reply to Joeri Brons (brons.joeri@agensi.io)

Hi Joeri,

Thanks for reaching out about circe-mcp. I am going ahead with a listing on Agensi. The skill is called Editorial Standards: it pairs the circe-mcp server with a SKILL.md that tells an agent when to run a check, how to present the findings by severity with rule IDs and fixes, and how to re-check until a draft is clean. The package is ready to upload and I plan to submit it through the Creator Dashboard this week once my Stripe connection is set up. One question before I do: does your scan accept an install line such as `npx -y circe-mcp` in a README, given that the skill itself contains no code? I would rather know in advance than fail the review on it.

Avalynn
