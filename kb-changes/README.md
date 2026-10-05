# Change notes

One file per product change. The knowledge base audit reads these.

- `date` and `areas` are required. Any page sharing an area and last reviewed before `date` shows as "Changed since review."
- Add `title`, `slug`, `owner`, `audience`, and `description` to let `scripts/kb/draft.mjs` draft a new page from the note.

This README has no front matter, so the audit skips it.
