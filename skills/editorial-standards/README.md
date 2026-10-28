# Editorial Standards skill

An agent skill that checks a draft against the Circe Editorial Standard and walks you through the fixes. The checking is done by circe-mcp, an open-source MCP server with deterministic rules and no LLM calls. The skill tells your agent when to run the checker, how to present what it finds, and what to leave untouched.

Ask for "make this sound less like AI", "remove the AI tells", "check this against the editorial standard", or "polish this resume", and the agent runs the check, groups the findings by severity with rule IDs and fixes, asks how you want to proceed, applies the fixes, and re-checks until the text is clean.

## What you need

- The circe-mcp server, connected to your agent (step 1).
- This skill, installed in your agent (step 2).
- Node.js 20 or later on the machine that runs the server.

## Step 1: connect circe-mcp

circe-mcp is published on npm and runs over stdio. Source and full docs: https://github.com/avalynn-circe/circe-mcp

**Claude Code**

```sh
claude mcp add circe-mcp -- npx -y circe-mcp
```

**Claude Desktop**

Add the server to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "circe-mcp": {
      "command": "npx",
      "args": ["-y", "circe-mcp"]
    }
  }
}
```

**Cursor, Windsurf, and other stdio clients** take the same command and arguments.

**Prefer a global install?** Run `npm install -g circe-mcp` once, then use `circe-mcp` as the command with no arguments.

**Hosting it yourself for a team.** The server also speaks Streamable HTTP:

```sh
npx circe-mcp http --port 3000
```

Point the client at `http://<host>:3000/mcp`. The server binds to `127.0.0.1` unless you pass `--host`, so put it behind your own proxy and authentication before exposing it.

**Check the connection.** Ask the agent to list the editorial rules. A connected server answers with "Circe Editorial Standard for Gen AI Content v0.3" and 13 rule IDs.

## Step 2: install the skill

The skill is the `editorial-standards` folder: `SKILL.md`, this README, and `references/`.

**Claude.ai**

1. In Settings, under Capabilities, turn on code execution and file creation. Skills need it.
2. Under Customize, open Skills and upload the zip. The `editorial-standards` folder must sit at the root of the archive.
3. Toggle the skill on.

**Claude Code**

Copy the folder to `~/.claude/skills/editorial-standards/` for every project, or to `.claude/skills/editorial-standards/` inside one project. New sessions pick it up.

**Other agents**

Any agent that reads the `SKILL.md` format can use the folder as is. Place it where that agent looks for skills.

## Step 3: use it

Paste a draft or point the agent at a file and ask for a check. Some phrasings that trigger the skill:

- "Check this against the editorial standard."
- "Make this sound less like AI."
- "Remove the AI tells from this blog post."
- "Clean up my cover letter."
- "Review this README before I publish it."

For a resume or cover letter the skill turns on the resume cliche rule, which is off by default. For text in your own voice it reviews one finding at a time, so nothing changes without your say.

Tell the agent when a pattern is deliberate. It will leave it, note it, and skip the rule on the next pass.

## Troubleshooting

- **"The checker is not connected."** The agent could not find the circe-mcp tools. Confirm the server is in your client's MCP configuration and restart the client. In Claude Code, `claude mcp list` shows it.
- **The skill does not trigger.** Name it: "use the editorial standards skill on this."
- **A finding is wrong.** Some hits are guesses and are marked with medium or low confidence. Say so and the agent moves on. `explain_rule` shows the full rule text and its exceptions.
- **An em dash fix reads badly.** The fixer uses a comma. Where the dash joined two full sentences, ask for a semicolon or a period.

## About the standard

The Circe Editorial Standard for Gen AI Content is a working draft by Avalynn Circe. It names the patterns that read as machine-generated and gives each one an ID, a severity, a reason, and a replacement strategy. circe-mcp 0.1.0 enforces 13 of its rules. `references/rules-summary.md` lists them and the ones that stay with a human reader.

circe-mcp is MIT licensed. This skill is distributed under the terms of the marketplace you bought it from.
