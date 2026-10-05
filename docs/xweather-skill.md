---
title: Building a Weather-Aware AI Skill with Xweather + Claude
sidebar_label: Weather-aware AI skill
description: Connect Vaisala Xweather's live MCP server to Claude, then write a Claude Skill that turns conditions and forecasts into ranked outdoor-activity recommendations, driven by an editable parameter file.
---

# Building a Weather-Aware AI Skill with Xweather + Claude

A build walkthrough: connect Vaisala Xweather's live MCP server to Claude, then write a Claude Skill that turns current conditions and forecasts into ranked outdoor-activity recommendations, driven by an editable parameter file you control.

*MCP · Xweather API · Claude Skills*

:::note What you'll build
A skill that answers "what can I do outside today?" (or "is it a good day for dirt-biking this weekend?") by pulling live weather from Xweather and matching it against a pre-defined activity matrix. The matrix is a plain text file you edit. The heart of the tutorial is showing you how to write it.
:::

## What is MCP?

**Model Context Protocol (MCP)** is an open standard that lets AI assistants connect to external tools and data sources. You configure a server endpoint once, and your AI assistant can call it directly, on demand, as part of any conversation.

Xweather ships a live MCP server at `https://mcp.api.xweather.com/mcp`. Point any MCP-compatible client at it, and your AI assistant can answer questions like:

- What are current conditions in St. Paul?
- What can I do outside today?
- Is it a good day for dirt-biking this weekend?
- How much rain fell here in the last 12 hours?

## Prerequisites

1. **A free Xweather developer account.** Sign up at [signup.xweather.com/developer](https://signup.xweather.com/developer). The free tier is plenty for building and testing. You'll authorize this account when you connect. No keys get copied into Claude (more on that below).
2. **A Claude plan that supports custom connectors.** Custom Connectors are available on Claude Pro, Max, Team, and Enterprise. That's all you need on the Claude side. The connection is point-and-click, no config files.

## Connect Xweather to Claude

Claude reaches remote MCP servers through **Custom Connectors**. You give Claude the server's name and URL, nothing else. Authentication is handled by Xweather itself: when you click **Connect**, Claude hands you off to Xweather's own sign-in, you authorize there, and the token round-trips back automatically. **No `client_id` or `client_secret` is ever typed into Claude or stored in a config file.**

1. **Open Settings → Connectors** in Claude, and click **Add custom connector**.
2. **Fill in two fields**: a name and the Xweather MCP URL. Leave everything else at its default; you are *not* entering credentials here.

   ```text title="Custom connector"
   Name:   Xweather
   URL:    https://mcp.api.xweather.com/mcp
   ```

3. **Click Connect.** Claude opens Xweather's authorization page. Sign in with your Xweather developer account and approve access. This is where your credentials live: on Xweather's side, tied to your account.
4. **You're done.** Xweather's tools now appear in Claude's connected tools. Test it: *"What can I do outside today?"*

:::tip Why there's no key field
Because authorization happens on Xweather's interface (an OAuth-style handoff), there's no secret to paste, no config file to leak, and nothing to rotate inside Claude. Revoke access any time from your Xweather account. If you ever see instructions telling you to paste a concatenated `client_id_client_secret` into the connector, that's the older local-bridge pattern. You don't need it for the hosted server.
:::

:::note Plan requirements
Custom Connectors require a Claude Pro, Max, Team, or Enterprise plan.
:::

## The tools this skill uses

The Xweather server exposes a couple dozen tools. The activity skill leans on three; the rest (air quality, lightning, tropical systems, road weather, historical data) are there when you want to extend it.

| Tool | What it returns |
|---|---|
| `xweather_get_current_weather` | A snapshot for one location: temperature, feels-like, humidity, wind + gust, precip, snow, visibility, cloud cover, UV, and a day/night flag. Crucially, it also returns any active `alerts` and `impacts` (e.g. an air-quality alert) inline, so one call covers the "now" case end to end. |
| `xweather_get_forecast_weather` | Daily or day/night forecasts up to ~15 days out. Highs/lows, precip and probability, max wind, and a coded summary per period. This is what powers "this weekend" and "tomorrow" questions. |
| `xweather_get_aggregated_weather_conditions` | Statistical roll-ups (sum/avg/min/max) over a time window, with optional filters. The skill uses it for backward-looking gates, such as "sum the precip over the previous 12 hours" to decide whether dirt-bike trails are too wet. |

:::note Naming
Tool names shown are the ones the server presents to the client. If your client lists them under a server prefix (like `Xweather:xweather_get_current_weather`), that prefix is the connector name. The tool is the same.
:::

## How the skill works

A **Claude Skill** is a folder Claude loads when a task matches it. At minimum it's one file, `SKILL.md`, holding a description (the trigger) and instructions (the workflow). Resources can live alongside it. Ours is two files:

```text title="Folder"
outdoor-activity-matcher/
├── SKILL.md                      # trigger + workflow
└── references/
    └── activity-matrix.md        # the parameter file you edit
```

The **description** in the frontmatter is what makes Claude reach for the skill. It lists the phrasings to catch and the defaults to assume:

```yaml title="SKILL.md, frontmatter"
---
name: outdoor-activity-matcher
description: >-
  Checks weather via the Xweather MCP server and recommends outdoor
  activities that fit the conditions, matching against a pre-defined
  activity matrix. Use whenever someone asks what they can do outside,
  or whether a specific activity suits the weather. "what can I do
  outside today?", "is it a good day for dirt-biking this weekend?".
  Handles right-now (current conditions) and future windows
  ("tomorrow", "this weekend") via forecast, and both open-ended
  shortlists and single named activities. Default city is St. Paul, MN
  when none is named. Always cite Xweather as the source.
---
```

The body is a short, ordered workflow: **(1)** resolve the city (default St. Paul), **(2)** resolve the timeframe (now vs. a forecast day) and mode (full shortlist vs. one named activity), **(3)** pull weather from Xweather, **(4)** match conditions against the parameter file, **(5)** return a ranked answer with reasons, cautions, substitution commentary, and the source line.

## Creating the parameter file

This is the part worth getting right. The parameter file separates *policy* (which conditions suit which activity) from *workflow* (how Claude fetches and formats). Keeping it in its own file means you tune the recommendations by editing a table, with no rewriting of logic.

### The gate model

Each activity is a list of **gates**: thresholds the current conditions must clear. An activity **fits** only when every gate passes. A gate marked *caution* still passes but attaches a caveat to the output. That's the whole rule. Temperatures are always **feels-like** (not raw air temp), and thresholds are written in °F/mph with °C/kph in brackets so the same file serves US and metric cities.

```md title="references/activity-matrix.md, two entries"
**Kite flying**
Gates: wind 8–24 mph [13–39 kph] sustained (sweet spot 10–18),
gust ≤ 30 [48] · no precip · daylight · open space.
St. Paul: open field at Como Lake or Hidden Falls flats.

**Dirt-biking (trail / OHV)**
Gates: feels-like 50–92°F [10–33°C] · no precip now · gust ≤ 30 mph
[48 kph] · daylight · no heavy rain in the previous 12 hours.
Recent-rain gate: 12-hr precip ≤ 0.25 in [6 mm] = good ·
0.25–0.5 in = caution, muddy/rutted · > 0.5 in = skip, too wet.
St. Paul: nearest designated OHV / dirt-bike trail area.
```

Notice kite flying *wants* wind: a gate can require a condition as well as cap one. That's deliberate: a good matrix surfaces non-obvious options. Build in a few activities that thrive in "bad" weather (kites in wind, reflection photography in drizzle, aurora-watching on cold clear nights) and the skill stops defaulting to "go for a walk."

### The backward-looking gate

Most gates read the current snapshot. Dirt-biking needs *history*: trails ruined by last night's rain look fine on a sunny morning. That gate is powered by `xweather_get_aggregated_weather_conditions`. Sum `precip_in` from 12 hours ago to now and compare against the thresholds. For a forecast day, read the precip in the periods leading into it instead. This is the pattern to copy any time "what happened recently" matters as much as "what's happening now."

:::note Two honest caveats to bake in
The current-weather feed reports *falling* snow, not snowpack depth, so winter activities should state the assumption ("assuming snow on the ground"). And only name specific local spots for cities you know (St. Paul, here); for anywhere else, name a *type* of place ("a calm lake," "a river bluff") so the skill never invents a trailhead.
:::

### Adding your own activity

Copy this shape, pick the gates that matter, set thresholds, and mark anything advisory as *caution*:

```md title="Template"
**[Activity name]**
Gates: feels-like [lo]–[hi]°F [°C] · wind ≤ [n] mph [kph] ·
[precip rule] · [daylight? visibility? UV caution?] ·
[any backward-looking or special gate].
[Local spot for your default city, or a place *type*.]
```

## Matching & output

At run time Claude reads the matrix, checks each activity's gates against the Xweather data, and ranks the survivors best-first (more gates cleared with margin = higher). An air-quality alert caps high-exertion picks; a thunderstorm alert excludes open water and exposed ground. Two output shapes:

- **Shortlist** for open questions: a ranked set of good calls plus a short "maybe skip" list.
- **Single-activity verdict** when one activity is named: a straight good / marginal / no, with the numbers behind it and the better day if today's a miss.

Two behaviors are required every time. First, **substitution commentary**: when a gate fails, read the *reason* as a pointer to what the day is good for ("no wind for a kite, but that still air makes the water glass-flat, so paddle instead"). Second, **source attribution**: every answer ends by crediting Xweather, since that's where the data came from.

## Example output

An open-ended question, answered against live conditions (note the air-quality alert shaping the picks, and the source line):

```text title='Claude · "what can I do outside today?"'
St. Paul right now: Sunny, feels like 87°F. Light SE wind
(3 mph), dry, UV 4. ⚠ Moderate air-quality alert active.

Good calls
• Lake beach swim & lounge: hot and clear is its window;
  low exertion suits the air alert. Lake Phalen Beach.
• Mississippi paddle: 3 mph wind = glass-flat water. Hidden Falls.
• Disc golf: fits cleanly; dead-calm air won't push your discs.

Maybe skip
• Trail run: 87°F is over the cap and hard breathing during an
  air-quality alert is the thing to avoid. Swim or paddle instead.
• Kite: only 3 mph; nothing to fly. That same still air is why
  the water's glass-flat, though.

Source: Xweather.
```

And a single named activity against the forecast:

```text title='Claude · "is it a good day for dirt-biking this weekend?"'
Dirt-biking in St. Paul, this weekend: ✅ Good, both days.

• Trails will be dry: zero rain Sat/Sun and none Friday night,
  so the 12-hour rule clears with room to spare.
• Highs near 80°F both days; Saturday gustier (~14 mph),
  Sunday calmer (~9 mph).
• Pick Sunday for the mellower ride.

Source: Xweather forecast.
```

## Install & use the skill

The folder you just wrote isn't live until it's in your Claude account. Installing a custom skill is a few clicks, no config files.

1. **Enable Code execution and file creation.** In Claude's **Settings → Capabilities**, turn it on. Skills are gated behind this capability. Without it, an uploaded skill won't run.
2. **Zip the folder.** Compress the `outdoor-activity-matcher/` directory so the folder sits at the root of the archive (not nested inside another folder). A `.skill` file is this ZIP with a different extension. If an uploader accepts only `.zip`, rename it.
3. **Upload it.** Go to **Customize → Skills**, click the upload / "+" option, and select your ZIP. On Pro, Max, and Free plans you upload to your own account; on Team and Enterprise, an owner enables Skills at the organization level first, then members upload their own. Toggle the skill on once it appears.
4. **Confirm the Xweather connector is connected** (the [earlier step](#connect-xweather-to-claude)). The skill is instructions only. It calls Xweather's tools at run time, so it needs that connector live to do anything.

:::tip Using it
Once it's toggled on you don't invoke it by hand. "What can I do outside today?" pulls it in automatically when the request matches the description. You can also force it: *"use my outdoor-activity skill for this weekend."* Full reference: [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude).
:::

## Use cases

The "live data via MCP, matched against an editable parameter file" pattern isn't weather-specific. Swap the activity matrix for any ruleset and the same skeleton handles:

### Logistics and operations

*"Check conditions at all three distribution centers and flag any with weather advisories active."* The assistant makes three tool calls and surfaces only the ones with alerts, with no dashboard tab-switching.

### Outdoor events

*"Is there lightning activity within 20 miles of the venue, and when does it clear?"* Xweather exposes Vaisala's lightning detection network as its own tool, a one-call gate you can add to the matrix for any "is it safe to be out" question.

### Field operations

*"Pull the next 48-hour forecast for all active job sites and flag any that trip our work-stop policy."* The work-stop policy *is* a parameter file: thresholds in, fits and flags out.

---

Built by [Avalynn Circe](https://avalynncirce.com/). Weather data from [Vaisala Xweather](https://xweather.com). Xweather API reference: [xweather.com/docs/weather-api](https://www.xweather.com/docs/weather-api).
