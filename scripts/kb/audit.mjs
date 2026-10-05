// Knowledge base audit. Reads every page in docs/quillon and every change
// note in kb-changes, then reports each page's lifecycle state.
//
//   node scripts/kb/audit.mjs --check    Fail (exit 1) on schema errors or an unverified AI draft.
//   node scripts/kb/audit.mjs --report   Write docs/quillon/doc-health.md, the dashboard page.
//   node scripts/kb/audit.mjs --issue    Print the review queue as Markdown, for a GitHub issue.
//
// Set KB_TODAY=YYYY-MM-DD to audit as of a fixed date.

import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {
  CHANGES_DIR,
  DUE_SOON_DAYS,
  KB_DIR,
  META_FLAG,
  STATUSES,
  addDays,
  daysBetween,
  formatDate,
  parseDate,
  readFolder,
  today,
} from './lib.mjs';

// Lifecycle states, most urgent first. The dashboard and the issue sort by this order.
export const STATES = {
  unverified: {label: 'Unverified AI draft', action: 'Verify or reject the draft before merge.'},
  changed: {label: 'Changed since review', action: 'Review against the change note.'},
  overdue: {label: 'Overdue', action: 'Review the page and update last_reviewed.'},
  dueSoon: {label: 'Due soon', action: 'Schedule a review.'},
  current: {label: 'Current', action: ''},
  archived: {label: 'Archived', action: ''},
};
const ORDER = Object.keys(STATES);

const REQUIRED = ['title', 'description', 'owner', 'audience', 'areas', 'status'];

/** Schema errors for one page. An empty array means the page is valid. */
export function validatePage(page) {
  const {data, path} = page;
  const errors = [];
  const fail = (message) => errors.push(`${path}: ${message}`);

  for (const key of REQUIRED) {
    if (data[key] === undefined || data[key] === '') fail(`missing "${key}"`);
  }
  for (const key of ['audience', 'areas']) {
    if (data[key] !== undefined && (!Array.isArray(data[key]) || data[key].length === 0)) {
      fail(`"${key}" must be a non-empty list, for example [internal, client]`);
    }
  }
  if (data.status !== undefined && !STATUSES.includes(data.status)) {
    fail(`"status" must be one of ${STATUSES.join(', ')}; got "${data.status}"`);
  }

  if (data.status === 'current' || data.status === 'archived') {
    if (!parseDate(data.last_reviewed)) fail('"last_reviewed" must be a date (YYYY-MM-DD)');
    if (!Number.isInteger(data.review_every) || data.review_every < 1) {
      fail('"review_every" must be a whole number of days');
    }
  }

  // A page that started as an AI draft keeps its trail: where it came from and who verified it.
  if (data.drafted_from !== undefined && data.status === 'current') {
    if (!data.verified_by) fail('AI-drafted page is "current" without "verified_by"');
    if (!parseDate(data.verified_on)) fail('AI-drafted page is "current" without a "verified_on" date');
  }
  if (data.status === 'ai-draft' && !data.drafted_from) {
    fail('"ai-draft" pages must name their source change note in "drafted_from"');
  }

  // The draft prompt marks open facts with TODO(verify). None may survive into a published page.
  if (data.status === 'current' && /TODO\(verify\)/.test(page.body ?? '')) {
    fail('"current" page still contains a TODO(verify) marker');
  }

  if (data.status === 'archived') {
    if (!parseDate(data.archived_on)) fail('archived page needs an "archived_on" date');
    if (data.unlisted !== true) fail('archived page needs "unlisted: true" so search and the sidebar drop it');
  }
  return errors;
}

/** Lifecycle state for one valid page, given the change notes and the audit date. */
export function assessPage(page, changes, asOf) {
  const {data} = page;
  if (data.status === 'archived') return {state: 'archived'};
  if (data.status === 'ai-draft') return {state: 'unverified'};

  const reviewed = parseDate(data.last_reviewed);
  const due = addDays(reviewed, data.review_every);

  // Event-driven staleness: a product change in one of the page's areas, dated after its last review.
  const triggers = changes.filter(
    (change) =>
      parseDate(change.data.date) > reviewed &&
      parseDate(change.data.date) <= asOf &&
      change.data.areas.some((area) => data.areas.includes(area)),
  );
  if (triggers.length > 0) return {state: 'changed', due, triggers};

  const remaining = daysBetween(asOf, due);
  if (remaining < 0) return {state: 'overdue', due};
  if (remaining <= DUE_SOON_DAYS) return {state: 'dueSoon', due};
  return {state: 'current', due};
}

/** Run the whole audit. Returns {errors, pages, changes, asOf}. */
export function audit({root = process.cwd(), asOf = today()} = {}) {
  const pages = readFolder(KB_DIR, root).filter((page) => page.data[META_FLAG] !== true);
  const changes = readFolder(CHANGES_DIR, root);

  const errors = pages.flatMap(validatePage);
  for (const change of changes) {
    if (!parseDate(change.data.date)) errors.push(`${change.path}: change note needs a "date" (YYYY-MM-DD)`);
    if (!Array.isArray(change.data.areas) || change.data.areas.length === 0) {
      errors.push(`${change.path}: change note needs "areas", for example [review]`);
    }
  }
  if (errors.length > 0) return {errors, pages: [], changes, asOf};

  const assessed = pages
    .map((page) => ({...page, ...assessPage(page, changes, asOf)}))
    .sort((a, b) => ORDER.indexOf(a.state) - ORDER.indexOf(b.state) || a.path.localeCompare(b.path));
  return {errors, pages: assessed, changes, asOf};
}

function link(page) {
  // Links resolve from docs/quillon/doc-health.md, so a bare file name works.
  return `[${page.data.title}](./${page.path.split('/').pop()})`;
}

function note(page) {
  if (page.state === 'changed') {
    return `Change note: ${page.triggers.map((change) => `${change.data.title} (${change.data.date})`).join('; ')}`;
  }
  if (page.state === 'unverified') return `From \`${page.data.drafted_from}\``;
  if (page.state === 'archived') return `Archived ${page.data.archived_on}`;
  if (page.data.verified_by) return `AI draft, verified by ${page.data.verified_by} on ${page.data.verified_on}`;
  return '';
}

/** The dashboard page, as Markdown. */
export function renderReport({pages, asOf}) {
  const counts = ORDER.map((state) => [state, pages.filter((page) => page.state === state).length]).filter(
    ([, count]) => count > 0,
  );
  const rows = pages.map((page) => {
    const due = page.due ? formatDate(page.due) : '';
    return `| ${STATES[page.state].label} | ${link(page)} | ${page.data.owner} | ${page.data.last_reviewed ?? ''} | ${due} | ${note(page)} |`;
  });
  return `---
title: Doc health
sidebar_position: 2
description: Lifecycle state of every page in the Quillon sample knowledge base, generated at build time.
kb_meta: true
---

<!-- Generated by scripts/kb/audit.mjs --report. Edits here are overwritten on the next build. -->

# Doc health

Audit date: ${formatDate(asOf)}. The build regenerates this page from each page's front matter and the change notes in \`kb-changes/\`.

${counts.map(([state, count]) => `- **${STATES[state].label}:** ${count}`).join('\n')}

| State | Page | Owner | Last reviewed | Review due | Note |
|---|---|---|---|---|---|
${rows.join('\n')}

Page states are defined on the [overview](./index.md#what-each-state-means).
`;
}

/** The review queue for a GitHub issue, grouped by owner. Empty string when nothing needs action. */
export function renderIssue({pages, asOf}) {
  const open = pages.filter((page) => STATES[page.state].action);
  if (open.length === 0) return '';
  const owners = [...new Set(open.map((page) => page.data.owner))].sort();
  const sections = owners.map((owner) => {
    const lines = open
      .filter((page) => page.data.owner === owner)
      .map((page) => `- [ ] **${STATES[page.state].label}:** \`${page.path}\`. ${STATES[page.state].action}${note(page) ? ` ${note(page)}.` : ''}`);
    return `### ${owner}\n\n${lines.join('\n')}`;
  });
  return `Audit date: ${formatDate(asOf)}. ${open.length} page(s) need review.\n\n${sections.join('\n\n')}\n`;
}

function main(argv) {
  const mode = argv[2];
  const result = audit();
  if (result.errors.length > 0) {
    console.error(`Knowledge base audit found ${result.errors.length} schema error(s):`);
    for (const error of result.errors) console.error(`  ${error}`);
    process.exit(1);
  }

  if (mode === '--check') {
    for (const page of result.pages) console.log(`${STATES[page.state].label.padEnd(22)} ${page.path}`);
    const unverified = result.pages.filter((page) => page.state === 'unverified');
    if (unverified.length > 0) {
      console.error(
        `\n${unverified.length} AI draft(s) lack human verification. A reviewer sets "status: current", ` +
          `"verified_by", "verified_on", and "last_reviewed" after checking the page against its change note.`,
      );
      process.exit(1);
    }
    return;
  }
  if (mode === '--report') {
    const out = `${KB_DIR}/doc-health.md`;
    writeFileSync(out, renderReport(result));
    console.log(`Wrote ${out}`);
    return;
  }
  if (mode === '--issue') {
    process.stdout.write(renderIssue(result));
    return;
  }
  console.error('Usage: node scripts/kb/audit.mjs --check | --report | --issue');
  process.exit(2);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv);
