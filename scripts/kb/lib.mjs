// Shared helpers for the knowledge base audit and draft scripts.
// No dependencies: the front matter in this repository is flat YAML
// (scalars and one-line lists), and this parser reads only that subset.

import {readFileSync, readdirSync} from 'node:fs';
import {join, relative} from 'node:path';

export const KB_DIR = 'docs/quillon';
export const CHANGES_DIR = 'kb-changes';
export const DUE_SOON_DAYS = 14;
export const STATUSES = ['current', 'ai-draft', 'archived'];

// Pages that describe the knowledge base itself. The audit skips them.
export const META_FLAG = 'kb_meta';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Split a Markdown file into its front matter object and body. */
export function parseFrontMatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) return {data: {}, body: text};
  const data = {};
  for (const raw of match[1].split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, '');
    if (!line.trim()) continue;
    const kv = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!kv) throw new Error(`Unsupported front matter line: "${raw}"`);
    data[kv[1]] = parseValue(kv[2].trim());
  }
  return {data, body: match[2]};
}

function parseValue(value) {
  if (value === '') return '';
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => unquote(item.trim()))
      .filter(Boolean);
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+$/.test(value)) return Number(value);
  return unquote(value);
}

function unquote(value) {
  if (/^(['"]).*\1$/.test(value)) return value.slice(1, -1);
  return value;
}

/** Serialize a flat object back to front matter, keys in the given order. */
export function stringifyFrontMatter(data) {
  const lines = Object.entries(data).map(([key, value]) => {
    if (Array.isArray(value)) return `${key}: [${value.join(', ')}]`;
    if (typeof value === 'string' && /[:#\[\]]/.test(value)) return `${key}: "${value}"`;
    return `${key}: ${value}`;
  });
  return `---\n${lines.join('\n')}\n---\n`;
}

/** Parse YYYY-MM-DD as a UTC date. Returns null when the string is not a valid date. */
export function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

export function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

export function daysBetween(from, to) {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

/** Today in UTC, or KB_TODAY when set (tests and reproducible reports use it). */
export function today(env = process.env) {
  if (env.KB_TODAY) {
    const fixed = parseDate(env.KB_TODAY);
    if (!fixed) throw new Error(`KB_TODAY must be YYYY-MM-DD, got "${env.KB_TODAY}"`);
    return fixed;
  }
  return parseDate(new Date().toISOString().slice(0, 10));
}

function listMarkdown(dir) {
  let names;
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  return names.filter((name) => name.endsWith('.md') && name !== 'README.md').sort().map((name) => join(dir, name));
}

/** Read every Markdown file in a folder as {path, data, body}. */
export function readFolder(dir, root = process.cwd()) {
  return listMarkdown(join(root, dir)).map((file) => {
    const {data, body} = parseFrontMatter(readFileSync(file, 'utf8'));
    return {path: relative(root, file), data, body};
  });
}
