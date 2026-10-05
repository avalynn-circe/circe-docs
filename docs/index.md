---
title: Circe Docs
slug: /
description: Technical writing by Avalynn Circe, developer and documentation engineer, published from Markdown in Git.
---

# Circe Docs

Technical writing by Avalynn Circe, developer and documentation engineer. Every page on this site is a Markdown file in a Git repository. A push builds the site, lints the prose against the Circe Editorial Standard, checks every link, and deploys to GitHub Pages.

## Pages

- [Building a Weather-Aware AI Skill with Xweather + Claude](./xweather-skill.md). A tutorial on the Model Context Protocol (MCP), Claude Skills, the Vaisala Xweather MCP server, and an activity-matrix parameter file.
- [Reviewing the MCP server tutorial as the developer it was written for](./mcp-tutorial-review.md). A technical accuracy and teaching review of the official "Build an MCP server" quickstart. Ten findings, a rewritten Python section, and a test results table.

## How the site is checked

| Check | Tool | Outcome on failure |
|---|---|---|
| Prose follows the Circe Editorial Standard | Vale, custom `Circe` style | Error-level rules fail the build. Warning-level rules report. |
| Internal links and anchors resolve | Docusaurus `onBrokenLinks: 'throw'` | Build fails. |
| Outbound links respond | lychee | Build fails. |

The source repository explains each rule and how to run the checks locally.
