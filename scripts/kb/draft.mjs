// Draft a knowledge base page from a change note with Claude.
//
//   node scripts/kb/draft.mjs kb-changes/<note>.md            Call the API and write the draft page.
//   node scripts/kb/draft.mjs kb-changes/<note>.md --dry-run  Print the prompt. No API call.
//
// Environment: ANTHROPIC_API_KEY and ANTHROPIC_MODEL (a Claude model ID).
//
// The page lands with "status: ai-draft". audit.mjs --check fails on that status,
// so the draft cannot merge until a person verifies it and marks it current.

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {KB_DIR, META_FLAG, formatDate, parseFrontMatter, readFolder, stringifyFrontMatter, today} from './lib.mjs';

const PROMPT_FILE = fileURLToPath(new URL('./prompt.md', import.meta.url));

/** Build the system prompt and user message for one change note. */
export function buildPrompt(notePath, root = process.cwd()) {
  const note = parseFrontMatter(readFileSync(join(root, notePath), 'utf8'));
  for (const key of ['title', 'slug', 'owner', 'areas', 'audience']) {
    if (!note.data[key]) throw new Error(`${notePath} needs "${key}" in its front matter to draft a page`);
  }

  // Related pages give the model the product's vocabulary and the house page shape.
  const related = readFolder(KB_DIR, root).filter(
    (page) =>
      page.data[META_FLAG] !== true &&
      page.data.status === 'current' &&
      page.data.areas.some((area) => note.data.areas.includes(area)),
  );

  const system = readFileSync(PROMPT_FILE, 'utf8');
  const user = [
    `Write the knowledge base page "${note.data.title}" for the audiences: ${note.data.audience.join(', ')}.`,
    '',
    '<change_note>',
    note.body.trim(),
    '</change_note>',
    '',
    ...related.map((page) => `<related_page path="${page.path}">\n${page.body.trim()}\n</related_page>\n`),
    'Return only the page body in Markdown, starting with the H1 title. No front matter.',
  ].join('\n');
  return {note, system, user};
}

async function callClaude({system, user}, env = process.env) {
  if (!env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set');
  if (!env.ANTHROPIC_MODEL) throw new Error('ANTHROPIC_MODEL is not set (a Claude model ID)');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL,
      max_tokens: 4000,
      system,
      messages: [{role: 'user', content: user}],
    }),
  });
  if (!response.ok) throw new Error(`Claude API returned ${response.status}: ${await response.text()}`);
  const json = await response.json();
  return json.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
}

/** Front matter for a new draft. The audit blocks it until a person verifies it. */
export function draftFrontMatter(note, notePath, asOf) {
  return stringifyFrontMatter({
    title: note.data.title,
    description: note.data.description ?? note.data.title,
    owner: note.data.owner,
    audience: note.data.audience,
    areas: note.data.areas,
    status: 'ai-draft',
    drafted_from: notePath,
    drafted_on: formatDate(asOf),
    review_every: note.data.review_every ?? 90,
  });
}

async function main(argv) {
  const notePath = argv[2];
  if (!notePath) {
    console.error('Usage: node scripts/kb/draft.mjs kb-changes/<note>.md [--dry-run]');
    process.exit(2);
  }
  const prompt = buildPrompt(notePath);
  if (argv.includes('--dry-run')) {
    console.log(`=== system ===\n${prompt.system}\n=== user ===\n${prompt.user}`);
    return;
  }

  const out = `${KB_DIR}/${prompt.note.data.slug}.md`;
  if (existsSync(out)) throw new Error(`${out} exists. Drafts create new pages; edit existing pages by hand.`);
  const body = await callClaude(prompt);
  writeFileSync(out, `${draftFrontMatter(prompt.note, notePath, today())}\n${body}\n`);
  console.log(`Wrote ${out} (status: ai-draft)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv).catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
