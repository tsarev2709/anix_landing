import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  buildGroundedReply,
  classifyGroundingIntent,
  groundingAliasMatches,
  groundingSearchSignature,
  inferGroundingVertical,
  sanitizePublicReply,
  sourcesFromCases,
} from '../supabase/functions/_shared/ai-grounding.mjs';

const catalog = JSON.parse(
  await fs.readFile(new URL('../data/ai-public-cases.json', import.meta.url), 'utf8')
);
const evaluation = JSON.parse(
  await fs.readFile(new URL('../data/ai-rag-eval-cases.json', import.meta.url), 'utf8')
);
const morphologyMigration = await fs.readFile(
  new URL('../supabase/migrations/011_ai_case_morphology_and_prompt_v6.sql', import.meta.url),
  'utf8'
);

assert.match(morphologyMigration, /create or replace function public\.ai_search_signature/);
assert.match(morphologyMigration, /length\(token\) > 5 then left\(token, 5\)/);
assert.match(morphologyMigration, /query\.signature @> public\.ai_search_signature/);
assert.match(morphologyMigration, /anix-consultant-v6/);

const cases = catalog.cases.map((item) => ({
  display_name: item.displayName,
  title: item.title,
  summary: item.summary,
  task: item.task,
  solution: item.solution,
  result: item.result,
  public_url: item.publicUrl,
  vertical: item.vertical,
  exact_match: false,
  assets: [
    { kind: 'case_page', label: 'Открыть кейс', url: item.publicUrl },
    ...(item.videoUrl
      ? [{ kind: 'video', label: 'Смотреть видео', url: item.videoUrl }]
      : []),
  ],
}));

assert.equal(
  inferGroundingVertical(['Расскажи про кейсы с фармкомпаниями'], '/'),
  'medicine'
);

for (const form of ['Мосфарма', 'Мосфарму', 'Мосфарме', 'Мосфармой']) {
  assert.equal(
    groundingAliasMatches(`Расскажи подробнее про ${form}`, 'Мосфарма'),
    true,
    `Russian case form was not matched: ${form}`
  );
}
const resolveCatalogCase = (query) =>
  catalog.cases.find((item) =>
    [item.displayName, ...(item.aliases || [])].some((alias) =>
      groundingAliasMatches(query, alias)
    )
  );
assert.equal(resolveCatalogCase('Подробнее про Мосфарму')?.slug, 'mosfarma');
assert.equal(resolveCatalogCase('Что сделали для Гемотеха?')?.slug, 'hemotech-ai');
assert.equal(resolveCatalogCase('Расскажи про Aventis'), undefined);
for (const [query, alias] of [
  ['Что сделали для Гемотеха?', 'Гемотех'],
  ['Подробнее об Авинейре', 'Авинейро'],
  ['Расскажите о Мултоне', 'Мултон'],
  ['Какой результат у Бородина?', 'Бородино'],
]) {
  assert.equal(groundingAliasMatches(query, alias), true, `Alias was not matched: ${query}`);
}
assert.equal(groundingAliasMatches('Расскажи про Aventis', 'Мосфарма'), false);
assert.deepEqual(groundingSearchSignature('Мосфарма и Мосфарму'), ['мосфа', 'и']);

const pharmaIntent = classifyGroundingIntent({
  message: 'Расскажи про ваши кейсы с фармкомпаниями',
  recentUserMessages: [],
  pagePath: '/',
});
assert.equal(pharmaIntent.mode, 'case');
assert.equal(pharmaIntent.vertical, 'medicine');
assert.equal(pharmaIntent.broadCatalog, true);

const pharmaCases = cases.filter((item) => item.vertical === 'medicine');
const pharmaReply = buildGroundedReply(pharmaIntent, pharmaCases);
assert.match(pharmaReply.reply, /Hemotech AI/);
assert.match(pharmaReply.reply, /Мосфарма/);
assert.match(pharmaReply.reply, /Авиандр/);
assert(!/Aventis|Orion Pharma/i.test(pharmaReply.reply));

const mosfarma = pharmaCases.find((item) => item.display_name === 'Мосфарма');
mosfarma.exact_match = true;
const detailReply = buildGroundedReply(
  classifyGroundingIntent({ message: 'Расскажи подробнее про Мосфарму' }),
  [mosfarma]
);
assert.match(detailReply.reply, /Задача:/);
assert.match(detailReply.reply, /Решение:/);
assert.match(detailReply.reply, /Результат:/);

const unknownReply = buildGroundedReply(
  classifyGroundingIntent({ message: 'Расскажи про кейс Aventis' }),
  []
);
assert.match(unknownReply.reply, /нет подтверждённого кейса/);
assert(!unknownReply.reply.includes('studio.anix-ai.pro/aventis'));

const priceReply = buildGroundedReply(
  classifyGroundingIntent({ message: 'Сколько стоит минута ролика?' }),
  []
);
assert.match(priceReply.reply, /300 тыс\./);
assert.match(priceReply.reply, /1,5 млн ₽/);

const missingFile = buildGroundedReply(
  classifyGroundingIntent({ message: 'Пришли PDF по Мосфарме' }),
  [mosfarma]
);
assert.match(missingFile.reply, /нет файла/);
assert.equal(missingFile.sources[0].url, 'https://t.me/anix_helper');

const videoIntent = classifyGroundingIntent({ message: 'Отправь видео по Мосфарме' });
assert.equal(videoIntent.mode, 'source');
const videoReply = buildGroundedReply(videoIntent, [mosfarma]);
assert(videoReply.sources.some((item) => item.kind === 'video'));

const publicSources = sourcesFromCases([mosfarma], { includeVideos: true });
assert(publicSources.some((item) => item.kind === 'case_page'));
assert(publicSources.every((item) => /^https:\/\//.test(item.url)));

const sanitized = sanitizePublicReply(
  'Бюджет кейса — 900 000 ₽.\nКонтакт: client@example.com, +7 999 123-45-67, @private_client.\nПишите @anix_helper.'
);
assert(!/900 000|example\.com|999 123|private_client/.test(sanitized));
assert.match(sanitized, /@anix_helper/);

assert(evaluation.cases.length >= 80);
for (const scenario of evaluation.cases) {
  const actual = classifyGroundingIntent({
    message: scenario.input,
    recentUserMessages: scenario.history || [],
    pagePath: scenario.pagePath || '/',
  });
  assert.equal(actual.mode, scenario.mode, `Wrong mode for: ${scenario.input}`);
  assert.equal(
    actual.vertical,
    scenario.vertical,
    `Wrong vertical for: ${scenario.input}`
  );
  if (scenario.providesContact) {
    assert.equal(actual.providesContact, true, `Contact missed: ${scenario.input}`);
  }
  if (scenario.caseAlias) {
    assert.equal(
      groundingAliasMatches(
        [...(scenario.history || []), scenario.input].join(' '),
        scenario.caseAlias
      ),
      true,
      `Case alias missed: ${scenario.input}`
    );
  }
}

console.log(`AI grounding policy tests passed: ${evaluation.cases.length} scenarios`);
