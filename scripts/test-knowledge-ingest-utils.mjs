import assert from 'node:assert/strict';
import {
  meaningfulHtml,
  metadataFromUrl,
  semanticChunks,
} from './lib/knowledge-ingest-utils.mjs';

const extracted = meaningfulHtml(`
  <header>Меню и телефон</header>
  <main>
    <h1>Мосфарма</h1>
    <p>Создали визуальный язык для фармацевтического продукта.</p>
    <h2>Результат</h2>
    <p>Материал помогает быстро объяснить форму препарата врачам.</p>
    <form><button>Отправить заявку</button></form>
  </main>
  <footer>Контакты</footer>
`);
assert.match(extracted, /# Мосфарма/);
assert.match(extracted, /## Результат/);
assert(!/Меню|телефон|Отправить заявку|Контакты/.test(extracted));

const chunks = semanticChunks(
  `${extracted}\n\n${'Подробное описание решения. '.repeat(90)}`
);
assert(chunks.length > 1);
assert(chunks.every((item) => item.length >= 40 && item.length <= 1500));
assert(chunks.some((item) => item.startsWith('Мосфарма')));

assert.deepEqual(
  metadataFromUrl('https://studio.anix-ai.pro/cases/mosfarma/'),
  {
    vertical: 'medicine',
    page_type: 'case',
    case_slug: 'mosfarma',
    page_path: '/cases/mosfarma/',
  }
);
assert.equal(
  metadataFromUrl('https://studio.anix-ai.pro/cases/rchk/').vertical,
  'events'
);

console.log('Knowledge ingestion v2 tests passed');
