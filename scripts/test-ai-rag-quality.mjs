import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const catalog = JSON.parse(
  await fs.readFile(new URL('../data/ai-public-cases.json', import.meta.url), 'utf8')
);

assert.equal(catalog.schemaVersion, 1);
assert.equal(catalog.cases.length, 10);
assert.equal(new Set(catalog.cases.map((item) => item.slug)).size, 10);

const requiredCases = [
  'hemotech-ai',
  'mosfarma',
  'aviandr',
  'multon-partners',
  'tpes',
  'mfti-endowment',
];
for (const slug of requiredCases) {
  assert(catalog.cases.some((item) => item.slug === slug), `Missing ${slug}`);
}

const forbidden = /(?:₽|\bруб(?:ль|ля|лей)?\b|\bцен[аы]\b|\bбюджет\b|\bтелефон\b|\be-?mail\b)/i;
for (const item of catalog.cases) {
  assert.match(item.publicUrl, /^https:\/\/studio\.anix-ai\.pro\/cases\/[a-z0-9-]+\/$/);
  assert(!forbidden.test(JSON.stringify(item)), `${item.slug} contains private/commercial data`);
  assert(item.task && item.solution && item.result, `${item.slug} lacks evidence fields`);
  assert(item.aliases.includes(item.displayName), `${item.slug} lacks canonical alias`);
  const normalizedAliases = item.aliases.map((alias) =>
    alias
      .toLowerCase()
      .replaceAll('ё', 'е')
      .replace(/[^a-zа-я0-9]+/gi, ' ')
      .trim()
  );
  assert.equal(
    new Set(normalizedAliases).size,
    normalizedAliases.length,
    `${item.slug} contains aliases that collide after normalization`
  );
}

const medicine = catalog.cases.filter((item) => item.vertical === 'medicine');
assert.deepEqual(
  medicine.map((item) => item.slug),
  ['hemotech-ai', 'mosfarma', 'aviandr']
);
assert(medicine.some((item) => item.aliases.includes('Гемотех')));
assert(medicine.some((item) => item.aliases.includes('Мосфарма')));
assert(!catalog.cases.some((item) => /aventis|orion pharma/i.test(JSON.stringify(item))));

console.log(`RAG catalog quality passed: ${catalog.cases.length} verified public cases`);
