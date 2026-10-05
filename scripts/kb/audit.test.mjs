// Tests for the knowledge base audit. Run with: npm run kb:test
// Each test builds a throwaway repository layout in a temp folder.

import assert from 'node:assert/strict';
import {mkdirSync, mkdtempSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {test} from 'node:test';
import {audit, renderIssue, renderReport} from './audit.mjs';
import {parseDate, parseFrontMatter} from './lib.mjs';

const AS_OF = parseDate('2026-10-05');

const BASE = {
  title: 'Page',
  description: 'A page.',
  owner: 'review-squad',
  audience: '[internal]',
  areas: '[review]',
  status: 'current',
  last_reviewed: '2026-09-20',
  review_every: 90,
};

function repo({pages = {}, changes = {}}) {
  const root = mkdtempSync(join(tmpdir(), 'kb-'));
  mkdirSync(join(root, 'docs/quillon'), {recursive: true});
  mkdirSync(join(root, 'kb-changes'), {recursive: true});
  const write = (dir, files) => {
    for (const [name, {body = '# Page\n', ...fields}] of Object.entries(files)) {
      const fm = Object.entries(fields)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      writeFileSync(join(root, dir, name), `---\n${fm}\n---\n\n${body}`);
    }
  };
  write('docs/quillon', pages);
  write('kb-changes', changes);
  return root;
}

const stateOf = (result, name) => result.pages.find((page) => page.path.endsWith(name)).state;

test('front matter parser reads scalars, numbers, booleans, and lists', () => {
  const {data, body} = parseFrontMatter('---\na: hello\nb: 90\nc: true\nd: [x, y]\ne: "q: r"\n---\nBody');
  assert.deepEqual(data, {a: 'hello', b: 90, c: true, d: ['x', 'y'], e: 'q: r'});
  assert.equal(body, 'Body');
});

test('a recently reviewed page is current', () => {
  const result = audit({root: repo({pages: {'a.md': BASE}}), asOf: AS_OF});
  assert.deepEqual(result.errors, []);
  assert.equal(stateOf(result, 'a.md'), 'current');
});

test('review dates drive due soon and overdue', () => {
  const root = repo({
    pages: {
      'soon.md': {...BASE, last_reviewed: '2026-07-10'}, // due 2026-10-08
      'late.md': {...BASE, last_reviewed: '2026-06-01'}, // due 2026-08-30
    },
  });
  const result = audit({root, asOf: AS_OF});
  assert.equal(stateOf(result, 'soon.md'), 'dueSoon');
  assert.equal(stateOf(result, 'late.md'), 'overdue');
});

test('a change note in a shared area flags pages reviewed before it', () => {
  const root = repo({
    pages: {
      'old.md': {...BASE, last_reviewed: '2026-09-01'},
      'new.md': {...BASE, last_reviewed: '2026-10-01'},
      'other.md': {...BASE, areas: '[permissions]', last_reviewed: '2026-09-01'},
    },
    changes: {'c.md': {title: 'Change', date: '2026-09-30', areas: '[review]'}},
  });
  const result = audit({root, asOf: AS_OF});
  assert.equal(stateOf(result, 'old.md'), 'changed');
  assert.equal(stateOf(result, 'new.md'), 'current');
  assert.equal(stateOf(result, 'other.md'), 'current');
});

test('a change note dated after the audit date does not flag anything yet', () => {
  const root = repo({
    pages: {'a.md': BASE},
    changes: {'c.md': {title: 'Future', date: '2026-12-01', areas: '[review]'}},
  });
  assert.equal(stateOf(audit({root, asOf: AS_OF}), 'a.md'), 'current');
});

test('an AI draft is reported as unverified', () => {
  const root = repo({
    pages: {
      'draft.md': {...BASE, status: 'ai-draft', last_reviewed: undefined, drafted_from: 'kb-changes/c.md'},
    },
  });
  assert.equal(stateOf(audit({root, asOf: AS_OF}), 'draft.md'), 'unverified');
});

test('an AI-drafted page cannot be current without a verifier and date', () => {
  const root = repo({pages: {'a.md': {...BASE, drafted_from: 'kb-changes/c.md'}}});
  const {errors} = audit({root, asOf: AS_OF});
  assert.equal(errors.length, 2);
  assert.match(errors.join('\n'), /verified_by/);
  assert.match(errors.join('\n'), /verified_on/);
});

test('a current page with a TODO(verify) marker fails', () => {
  const root = repo({pages: {'a.md': {...BASE, body: '# Page\n\nTODO(verify): which role?\n'}}});
  assert.match(audit({root, asOf: AS_OF}).errors.join('\n'), /TODO\(verify\)/);
});

test('missing fields, bad dates, and bad statuses are schema errors', () => {
  const root = repo({
    pages: {
      'a.md': {...BASE, owner: undefined},
      'b.md': {...BASE, last_reviewed: '2026-02-30'},
      'c.md': {...BASE, status: 'draft'},
    },
  });
  const errors = audit({root, asOf: AS_OF}).errors.join('\n');
  assert.match(errors, /a\.md: missing "owner"/);
  assert.match(errors, /b\.md: "last_reviewed" must be a date/);
  assert.match(errors, /c\.md: "status" must be one of/);
});

test('an archived page must be unlisted and dated', () => {
  const root = repo({pages: {'a.md': {...BASE, status: 'archived'}}});
  const errors = audit({root, asOf: AS_OF}).errors.join('\n');
  assert.match(errors, /archived_on/);
  assert.match(errors, /unlisted: true/);
});

test('meta pages and change-note READMEs are skipped', () => {
  const root = repo({pages: {'index.md': {title: 'Overview', kb_meta: true}}});
  writeFileSync(join(root, 'kb-changes/README.md'), '# Change notes\n');
  const result = audit({root, asOf: AS_OF});
  assert.deepEqual(result.errors, []);
  assert.equal(result.pages.length, 0);
});

test('the report lists the most urgent page first; the issue groups by owner', () => {
  const root = repo({
    pages: {
      'fine.md': {...BASE, title: 'Fine'},
      'late.md': {...BASE, title: 'Late', owner: 'discovery-squad', last_reviewed: '2026-01-01'},
    },
  });
  const result = audit({root, asOf: AS_OF});
  const report = renderReport(result);
  assert.ok(report.indexOf('Late') < report.indexOf('Fine'));
  const issue = renderIssue(result);
  assert.match(issue, /### discovery-squad/);
  assert.doesNotMatch(issue, /review-squad/);
  assert.equal(renderIssue(audit({root: repo({pages: {'a.md': BASE}}), asOf: AS_OF})), '');
});
