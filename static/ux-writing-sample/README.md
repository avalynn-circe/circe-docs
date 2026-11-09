# Ovenbird UX writing sample

A self-contained UX writing portfolio piece by Avalynn Circe. Six screens for Ovenbird, a fictional asset manager, rewritten for individual investors, financial advisors and institutional clients.

## What's in it

- **Workbench:** six screens (onboarding, market drop alert, failed transfer, advisor empty state, RMD explainer page, fee change email). Each one switches between Rewrite, Redline and Original, with numbered notes explaining every change.
- **Tone and audience variants:** the market alert changes with the size of the drop (3%, 8%, 20%), and the fee email is written three ways for three audiences.
- **Layers on demand:** accessibility notes, plus metadata with live character counts (push limits, email subject and preview text, title tag and meta description, a search result preview).
- **Reading grade:** Flesch-Kincaid grade, calculated in the browser from the full sentences on screen.
- **Voice and tone guide** for the fictional brand, and a **content critique** showing how Avalynn gives feedback.

## Add it to Circe Docs

1. Copy this folder to `static/ux-writing-sample/` in the circe-docs repo.
2. It will be served at `https://avalynn-circe.github.io/circe-docs/ux-writing-sample/`.
3. Link it from the docs index or portfolio page, and from `static/llms.txt` if you list pages there.

No build step. The page loads Google Fonts and saves the last screen viewed in localStorage; it works without either. Direct links to a screen work with a hash, for example `#market-drop` or `#fee-notice`.

## Notes

Ovenbird, its funds, balances and phone numbers (555 numbers) are invented. Nothing in the sample is investment, tax or legal advice. The RMD ages (73, or 75 for people born in 1960 or later) and the IRS divisor table values reflect the rules as of 2026.
