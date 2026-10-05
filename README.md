# Circe Docs

A docs-as-code site: Markdown in Git, built and checked by GitHub Actions, deployed to GitHub Pages. The site publishes technical writing by Avalynn Circe, developer and documentation engineer, and enforces the Circe Editorial Standard on every push with a custom Vale style.

Live site: https://avalynn-circe.github.io/circe-docs/

## What runs on a push

| Trigger | Workflow | What happens |
|---|---|---|
| Pull request | `quality.yml` | Vale lints the prose. Docusaurus builds the site. lychee checks outbound links. No deploy. |
| Push to `main` | `quality.yml` and `deploy.yml` | The same three checks, then a build and deploy to GitHub Pages. |

A failed check blocks the merge. A failed build on `main` leaves the last good deploy in place.

### Prose: Vale with the Circe style

`.vale.ini` points Vale at `styles/Circe`, where each rule is one YAML file. Severity follows the standard's three tiers.

| Tier in the standard | Vale level | Effect in CI |
|---|---|---|
| MUST AVOID | `error` | Fails the job. |
| SHOULD AVOID | `warning` | Prints in the log. The job passes. |
| MAY AVOID | `suggestion` | Prints in the log. The job passes. |

| Rule | File | Level | Catches |
|---|---|---|---|
| CES-P-001 No em dashes | `EmDash.yml` | error | The em dash character (U+2014). |
| CES-C-008 No trailing contrast clauses | `TrailingContrast.yml` | error | `rather than`, `instead of`, `not only`, `not just`. |
| Implied inferior baselines | `InferiorBaseline.yml` | warning | `in practice`, `real`. The standard rates this MUST AVOID. It starts at warning because `real` has false positives. |
| CES-Q-001 Hedges | `Hedges.yml` | warning | `just`, `actually`, `really`. |
| CES-Q-002 Hollow intensifiers | `Intensifiers.yml` | warning | `genuinely`, `truly`, `deeply`. |

The CI job runs Vale twice. The first run uses `--no-exit` and prints every alert at every level. The second run uses `--minAlertLevel=error` and fails only on error-level alerts.

CES-C-008 has an exception: a contrast stays when the alternative is factual information the reader needs, such as a migration ("moved from MS Access to SQL Server"). Mark a justified exception inline and Vale skips it:

```markdown
<!-- vale Circe.TrailingContrast = NO -->
The team moved the reports from MS Access to SQL Server rather than rewriting them.
<!-- vale Circe.TrailingContrast = YES -->
```

Vale skips fenced code blocks in Markdown. Code comments are not linted.

### Links

Two tools cover two kinds of link.

- Docusaurus fails the build on any internal link or anchor that points nowhere. `docusaurus.config.ts` sets `onBrokenLinks`, `onBrokenAnchors`, and `onBrokenMarkdownLinks` to `throw`.
- lychee requests every outbound URL in `docs/` and this README and fails the job on a dead one. `lychee.toml` holds the settings.

### Agent-readable index

`static/llms.txt` is served at the site root. It lists each page with a one-line description so an AI agent can find the docs without crawling.

## Known limits

Five rules in the standard need human judgment and stay out of the linter: throat-clear (CES-C-003), trailing bow (C-004), so-what gloss (C-005), pronouncement (C-006), and vague perfection (V-004). A clean Vale run means the mechanical rules pass. It does not mean the page meets the standard.

## Run the checks locally

Requirements: Node.js 20 or later, [Vale](https://vale.sh/docs/install), and [lychee](https://lychee.cli.rs/installation/).

```bash
npm install          # once
npm start            # local preview with live reload
npm run lint         # Vale, error level only (the CI gate)
npm run lint:report  # Vale, every level
npm run links        # lychee on docs/ and README.md
npm run build        # production build into build/
npm run check        # lint, typecheck, build
```

## Layout

```
.github/workflows/   deploy.yml and quality.yml
docs/                one Markdown file per page
styles/Circe/        one Vale rule per file
static/llms.txt      agent-readable page index
.vale.ini            Vale configuration
lychee.toml          link checker configuration
docusaurus.config.ts site configuration
sidebars.ts          page order
```

## Add a page

1. Create `docs/<slug>.md` with a `title` and `description` in the front matter.
2. Add the slug to `sidebars.ts`.
3. Add a line to `static/llms.txt`.
4. Open a pull request. The checks run on it.
