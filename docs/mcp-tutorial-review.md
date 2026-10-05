---
title: Reviewing the MCP server tutorial as the developer it was written for
sidebar_label: MCP tutorial review
description: A technical accuracy and teaching review of the official "Build an MCP server" quickstart. Ten findings, one rewritten section, and the tests behind it.
---

# Reviewing the MCP server tutorial as the developer it was written for

A technical accuracy and teaching review of [Build an MCP server](https://modelcontextprotocol.io/docs/2026-07-28/develop/build-server), the official Model Context Protocol quickstart, focused on the Python and TypeScript tabs. Ten findings, one rewritten section, and the tests behind it.

*Avalynn Circe, September 2026. Reviewed against the 2026-07-28 documentation.*

## Summary

The tutorial gets a working weather server running in each of eight languages, and its warning about stdout corrupting STDIO servers prevents the most common first failure. The problems start when something goes wrong. The Python tab reports timeouts, rate limits, bad input, and unsupported locations with the same message, so neither the learner nor the model can tell what happened. The tabs also build different tools under the same names, and the page explains how MCP works only after the learner has finished building.

Severity key:

- **Blocks**: a learner following the steps hits a failure they can't diagnose.
- **Misleads**: the code runs but teaches an inaccurate pattern or result.
- **Gap**: something a working developer needs that the page leaves out.

## Findings

### R-01 Every Python failure produces the same message

**Blocks.** Python tab, `make_nws_request` and `get_alerts`.

```python {2}
except Exception:
    return None
...
return "Unable to fetch alerts or no alerts found."
```

The helper catches every exception and returns `None`. The tool then returns one string for a timeout, a rate limit, an invalid state code, and an empty result. The page's own troubleshooting section lists three causes for a failed forecast; the code gives the learner no way to tell which one occurred. The model receives the same string and can only guess what to tell the user.

**Fix:** raise a named error with a reason, and return that reason from the tool. See the [rewrite](#rewrite-python-error-handling) below.

### R-02 Python sends unrounded coordinates and won't follow a redirect

**Blocks.** Python tab, `get_forecast`.

The TypeScript tab rounds coordinates with `toFixed(4)` before calling `/points`. The Python tab passes them through unchanged. The HTTP client the Python tab uses does not follow redirects by default, so if the API answers a high-precision request with a redirect to the rounded URL, `raise_for_status()` raises, the helper returns `None`, and the learner sees "Unable to fetch forecast data for this location" for a valid US location.

:::info To confirm
Tested: httpx2 2.13.0 defaults to `follow_redirects=False`, and a mocked 301 raises `HTTPStatusError`. To confirm against the live API: request `/points` with six decimal places and check the status code.
:::

**Fix:** round to four decimals, as the TypeScript tab does, and pass `follow_redirects=True` to the client.

### R-03 Python is the only tab that doesn't normalize the state code

**Misleads.** Python tab, `get_alerts`.

The TypeScript, Ruby, Rust, and Go tabs uppercase the state before building the URL. Python inserts the input as given. If a user or the model passes `mn`, the result depends on whether the API accepts lowercase, and any rejection surfaces as the generic message from R-01.

**Fix:** `state.strip().upper()`, plus a two-letter check that returns a usable message.

### R-04 TypeScript reports 0°F as "Unknown"

**Misleads.** TypeScript tab, forecast formatting.

```ts
`Temperature: ${period.temperature || "Unknown"}°...`
```

`||` falls back on any falsy value, and `0` is falsy. A zero-degree forecast in Minnesota or Alaska prints as Unknown. The interface already types `temperature` as optional, so the intended check is for a missing value.

**Fix:** `period.temperature ?? "Unknown"`. Nullish coalescing falls back only on `null` and `undefined`.

### R-05 The tabs build different tools under the same names

**Misleads.** All tabs.

A team that follows two tabs gets two servers that answer the same question differently:

| Behavior | Python | TypeScript |
|---|---|---|
| Alerts endpoint | `/alerts/active/area/{state}` | `/alerts?area={state}`, labeled "Active alerts" |
| Alert fields | description, instructions | status, headline; no instructions |
| Forecast periods | first 5 | all returned |
| Forecast text | `detailedForecast` | `shortForecast` |

:::info To confirm
Compare the two alert endpoints for the same state. The TypeScript endpoint is not filtered to active alerts by name, and its output is labeled as active.
:::

**Fix:** define the tool contract once (endpoint, fields, period count) and hold every tab to it.

### R-06 Python assumes the forecast URL is present

**Misleads.** Python tab, `get_forecast`.

```python
forecast_url = points_data["properties"]["forecast"]
```

A response without that key raises `KeyError` inside the tool. The TypeScript tab checks the same value with optional chaining and returns a message. Learners comparing tabs will read the Python version as the simpler equivalent.

**Fix:** `points_data.get("properties", {}).get("forecast")` and a message when it's missing.

### R-07 The "complete code" link doesn't match the tutorial

**Misleads.** Python tab, repository link.

The tutorial's Python tools return plain strings. The linked repository's README describes tools that declare output schemas and return structured content, using a `RootModel` wrapper for the alerts list. A learner who checks their work against the repo will find code the page never explained.

**Fix:** either teach structured output in the tutorial or link to a tagged version of the repo that matches it.

### R-08 Tool descriptions leave out the constraint the model needs most

**Gap.** Python and TypeScript tabs, tool descriptions.

The description is what the model reads when it decides whether to call a tool. Neither tab says the forecast tool supports US locations only; TypeScript mentions it only in an error message after the call has failed. The Kotlin tab puts the constraint in the description. With it there, the model can tell a user asking about Lisbon that this server can't help.

**Fix:** teach this explicitly: descriptions carry scope, units, and input format, because they are the model's only documentation.

### R-09 The explanation of how MCP works comes after the build

**Gap.** Page structure.

The first instruction warns that stdout output corrupts JSON-RPC messages, before the page has said what those messages are. "What's happening under the hood" appears after installation, coding, and configuration. A learner who hits a problem midway has no model of the system to reason from.

**Fix:** move the six-step request flow to the top and show one real JSON-RPC exchange (a `tools/call` request and its result). The stdout warning then explains itself.

### R-10 The Java tab can't be completed from the page

**Gap.** Java tab, `WeatherService`.

Both tool method bodies are comments describing what they return. A Spring Boot developer following the page must leave it for the linked repository to write working code. Every other tab is complete on the page.

**Fix:** include the method bodies, or state at the top of the tab that the page is an outline of the linked sample.

## Rewrite: Python error handling

This rewrite addresses R-01 through R-03. Each failure returns a message that tells the learner and the model what happened and what to try. The tool docstring states the input format, because the SDK turns it into the description the model reads (R-08). Logging goes to stderr through the `logging` module, following the tutorial's own guidance.

```python title="Tutorial"
async def make_nws_request(url: str) -> dict[str, Any] | None:
    headers = {"User-Agent": USER_AGENT,
               "Accept": "application/geo+json"}
    async with httpx2.AsyncClient() as client:
        try:
            response = await client.get(
                url, headers=headers, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except Exception:
            return None

@mcp.tool()
async def get_alerts(state: str) -> str:
    """Get weather alerts for a US state.

    Args:
        state: Two-letter US state code (e.g. CA, NY)
    """
    url = f"{NWS_API_BASE}/alerts/active/area/{state}"
    data = await make_nws_request(url)

    if not data or "features" not in data:
        return "Unable to fetch alerts or no alerts found."

    if not data["features"]:
        return "No active alerts for this state."
    ...
```

```python title="Rewritten"
class NWSError(Exception):
    """A failure the model can explain to the user."""

async def make_nws_request(url: str) -> dict[str, Any]:
    headers = {"User-Agent": USER_AGENT,
               "Accept": "application/geo+json"}
    async with httpx2.AsyncClient(follow_redirects=True) as client:
        try:
            response = await client.get(
                url, headers=headers, timeout=30.0)
        except httpx2.TimeoutException:
            raise NWSError("The National Weather Service did "
                           "not respond within 30 seconds.")
        except httpx2.RequestError as exc:
            logger.error("NWS request failed: %s", exc)
            raise NWSError("Could not reach the National "
                           "Weather Service.")

    if response.status_code == 404:
        raise NWSError("No data for that location. Only US "
                       "locations are supported.")
    if response.status_code == 429:
        raise NWSError("The National Weather Service is rate "
                       "limiting requests. Try again in a minute.")
    if response.status_code >= 400:
        logger.error("NWS returned %s for %s",
                     response.status_code, url)
        raise NWSError("The National Weather Service returned "
                       f"an error (HTTP {response.status_code}).")
    return response.json()

@mcp.tool()
async def get_alerts(state: str) -> str:
    """Get active weather alerts for a US state.

    Args:
        state: Two-letter US state code, such as CA or NY.
               US states only.
    """
    code = state.strip().upper()
    if len(code) != 2 or not code.isalpha():
        return (f"'{state}' is not a two-letter US state "
                "code. Use a code such as MN or TX.")
    try:
        data = await make_nws_request(
            f"{NWS_API_BASE}/alerts/active/area/{code}")
    except NWSError as err:
        return str(err)

    features = data.get("features", [])
    if not features:
        return f"No active weather alerts for {code}."
    return "\n---\n".join(format_alert(f) for f in features)
```

### Test results

Run against mocked NWS responses with httpx2 2.13.0.

| Input and response | Tutorial returns | Rewrite returns |
|---|---|---|
| "mn", no alerts | Depends on API case handling | No active weather alerts for MN. |
| "Minnesota" | Unable to fetch alerts or no alerts found. | 'Minnesota' is not a two-letter US state code. Use a code such as MN or TX. |
| "TX", HTTP 429 | Unable to fetch alerts or no alerts found. | The National Weather Service is rate limiting requests. Try again in a minute. |
| "TX", 301 redirect | Unable to fetch alerts or no alerts found. | Follows the redirect and returns the result. |
| "TX", one alert, no instructions | Formatted alert | Formatted alert with "No specific instructions provided" |

## Method

I read the Python and TypeScript tabs in full as a developer following them for the first time, then compared their behavior with the Ruby, Rust, Go, Kotlin, Java, and C# tabs. Findings are rated by what a learner would experience. Claims about client behavior were tested in code; claims that depend on the live National Weather Service API are marked with a verification step.

---

Avalynn Circe, full-stack developer and author of [JavaScript: The Parts](https://leanpub.com/jsparts). [AvalynnCirce.com](https://avalynncirce.com/)
