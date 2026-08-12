const TELEGRAM_URL = 'https://t.me/anix_helper';

const CASE_WORDS =
  /(?:кейс|проект|клиент|портфолио|пример|работал|сделал|создал|компани)/i;
const DETAIL_WORDS =
  /(?:подробнее|детал|задач|решени|результат|что сделали|как сделали)/i;
const LIST_WORDS =
  /(?:кейсы|проекты|клиенты|компании|назови|перечисли|несколько|примеры|какие|три|ссылки)/i;
const SOURCE_WORDS =
  /(?:ссылк|где посмотреть|покажи|открой|материал|источник|видео)/i;
const FILE_WORDS =
  /(?:файл|pdf|презентац|документ|бриф|скачать|отправь|пришли)/i;
const PRICE_WORDS = /(?:цен[аы]|стоимост|сколько стоит|бюджет|прайс)/i;
const CONTACT_WORDS =
  /(?:контакт|телефон|почт|e-?mail|связаться|свяж|написать вам|менеджер)/i;

export function normalizeGroundingText(value) {
  return String(value || '')
    .toLowerCase()
    .replaceAll('ё', 'е')
    .replace(/[^a-zа-я0-9@]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function inferGroundingVertical(messages = [], pagePath = '') {
  const combined = normalizeGroundingText(
    `${messages.slice(-4).join(' ')} ${pagePath}`
  );
  if (
    /(?:фарм|medtech|medicine|медицин|препарат|врач|диагност|гемотех|hemotech|мосфарма|авинейро|авиандр)/.test(
      combined
    )
  ) {
    return 'medicine';
  }
  if (/(?:hse|охран.*труд|безопасност|инструктаж|onboarding|мултон|multon)/.test(combined)) {
    return 'hse';
  }
  if (/(?:событи|выступлен|шоу|конференц|рчк)/.test(combined)) return 'events';
  if (/(?:кино|cinema|историчес|бородино|маленький принц)/.test(combined)) {
    return 'cinema';
  }
  if (/(?:b2b|промышлен|технолог|продукт|продаж|тпэс|tpes|clappy|клаппи)/.test(combined)) return 'b2b';
  return null;
}

export function classifyGroundingIntent({ message, recentUserMessages = [], pagePath = '' }) {
  const cleanMessage = normalizeGroundingText(message);
  const providesContact =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(String(message || '')) ||
    /(?:https?:\/\/t\.me\/|@)[A-Za-z][A-Za-z0-9_]{4,31}/i.test(String(message || '')) ||
    /(?:\+?\d[\d\s().-]{8,}\d)/.test(String(message || ''));
  const recent = recentUserMessages
    .map(normalizeGroundingText)
    .filter(Boolean)
    .slice(-3);
  const vertical = inferGroundingVertical([...recent, cleanMessage], pagePath);

  if (PRICE_WORDS.test(cleanMessage)) {
    return { mode: 'price', vertical, broadCatalog: false };
  }
  if (CONTACT_WORDS.test(cleanMessage)) {
    return { mode: 'contact', vertical, broadCatalog: false, providesContact };
  }
  if (SOURCE_WORDS.test(cleanMessage)) {
    return {
      mode: 'source',
      vertical,
      broadCatalog: LIST_WORDS.test(cleanMessage) && !DETAIL_WORDS.test(cleanMessage),
    };
  }
  if (FILE_WORDS.test(cleanMessage)) {
    return { mode: 'file', vertical, broadCatalog: false };
  }
  if (
    CASE_WORDS.test(cleanMessage) ||
    DETAIL_WORDS.test(cleanMessage) ||
    /расскажи про/.test(cleanMessage) ||
    recent.some((item) => CASE_WORDS.test(item))
  ) {
    return {
      mode: 'case',
      vertical,
      broadCatalog: LIST_WORDS.test(cleanMessage) && !DETAIL_WORDS.test(cleanMessage),
    };
  }
  return { mode: 'general', vertical, broadCatalog: false };
}

function assetsOf(item) {
  if (Array.isArray(item?.assets)) return item.assets;
  try {
    const parsed = JSON.parse(item?.assets || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeHttpUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}

export function sourcesFromCases(cases = [], options = {}) {
  const includeVideos = options.includeVideos === true;
  const includeDocuments = options.includeDocuments === true;
  const result = [];
  for (const item of cases) {
    const fallback = {
      kind: 'case_page',
      label: `Кейс: ${item.display_name || item.title}`,
      title: item.display_name || item.title,
      url: safeHttpUrl(item.public_url),
    };
    const assets = assetsOf(item);
    const selected = assets.filter((asset) => {
      if (asset?.kind === 'case_page') return true;
      if (asset?.kind === 'video') return includeVideos;
      if (asset?.kind === 'document') return includeDocuments;
      return false;
    });
    for (const asset of selected.length ? selected : [fallback]) {
      const url = safeHttpUrl(asset?.url);
      if (!url) continue;
      result.push({
        kind: String(asset?.kind || 'case_page'),
        label: String(asset?.label || fallback.label),
        title: String(item.display_name || item.title || ''),
        url,
      });
    }
  }
  return result.filter(
    (item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index
  );
}

function caseListReply(cases) {
  const selected = cases.slice(0, 5);
  if (!selected.length) return null;
  return [
    'Вот подтверждённые публичные кейсы Anix:',
    ...selected.map(
      (item, index) =>
        `${index + 1}. ${item.display_name}. ${item.summary}\nРезультат: ${item.result}`
    ),
  ].join('\n\n');
}

function caseDetailReply(item) {
  return [
    `${item.display_name}: ${item.summary}`,
    `Задача: ${item.task}`,
    `Решение: ${item.solution}`,
    `Результат: ${item.result}`,
  ].join('\n\n');
}

export function buildGroundedReply(intent, cases = []) {
  if (intent?.mode === 'price') {
    return {
      reply:
        'Ориентир по стоимости — от 300 тыс. до 1,5 млн ₽ за минуту готового ролика. Итог зависит от сложности сценария, визуального стиля, количества сцен и требований к производству. Для точной оценки оставьте заявку на сайте или напишите @anix_helper.',
      sources: [
        { kind: 'contact', label: 'Написать Anix в Telegram', title: 'Anix', url: TELEGRAM_URL },
      ],
      reason: 'approved_price_policy',
    };
  }
  if (intent?.mode === 'contact') {
    return {
      reply:
        'Личными контактами клиентов и команды в чате не делимся. Связаться с Anix можно через форму заявки на сайте или в Telegram: @anix_helper.',
      sources: [
        { kind: 'contact', label: 'Написать Anix в Telegram', title: 'Anix', url: TELEGRAM_URL },
      ],
      reason: 'contact_policy',
    };
  }

  const exactCases = cases.filter((item) => item?.exact_match === true);
  const selectedCases = exactCases.length ? exactCases : cases;

  if (intent?.mode === 'file') {
    const documents = sourcesFromCases(selectedCases, { includeDocuments: true }).filter(
      (item) => item.kind === 'document'
    );
    if (documents.length) {
      return {
        reply: 'Нашёл подтверждённые файлы по запросу. Они прикреплены к ответу.',
        sources: documents,
        reason: 'verified_documents',
      };
    }
    return {
      reply:
        'В подтверждённых материалах нет файла, который можно безопасно отправить по этому запросу. Запросите его через форму заявки на сайте или напишите @anix_helper.',
      sources: [
        { kind: 'contact', label: 'Запросить материал в Telegram', title: 'Anix', url: TELEGRAM_URL },
      ],
      reason: 'missing_document',
    };
  }

  if (intent?.mode === 'source') {
    if (!selectedCases.length) {
      return {
        reply:
          'В подтверждённых материалах нет ссылки по этому запросу. Можно уточнить её через форму заявки на сайте или у @anix_helper.',
        sources: [
          { kind: 'contact', label: 'Уточнить у Anix', title: 'Anix', url: TELEGRAM_URL },
        ],
        reason: 'missing_source',
      };
    }
    return {
      reply:
        exactCases.length === 1
          ? caseDetailReply(exactCases[0])
          : caseListReply(selectedCases),
      sources: sourcesFromCases(selectedCases, { includeVideos: true }),
      reason: exactCases.length === 1 ? 'exact_case_source' : 'case_sources',
    };
  }

  if (intent?.mode === 'case') {
    if (!selectedCases.length) {
      return {
        reply:
          'В публичных материалах Anix нет подтверждённого кейса с таким названием. Не буду придумывать детали. Можно уточнить у команды через форму заявки или @anix_helper.',
        sources: [
          { kind: 'contact', label: 'Уточнить у Anix', title: 'Anix', url: TELEGRAM_URL },
        ],
        reason: 'unknown_case',
      };
    }
    return {
      reply:
        exactCases.length === 1 && !intent.broadCatalog
          ? caseDetailReply(exactCases[0])
          : caseListReply(selectedCases),
      sources: sourcesFromCases(
        exactCases.length === 1 && !intent.broadCatalog ? exactCases : selectedCases
      ),
      reason: exactCases.length === 1 && !intent.broadCatalog ? 'exact_case' : 'case_list',
    };
  }

  return null;
}

export function structuredCaseContext(cases = []) {
  if (!cases.length) return 'Подтверждённых структурированных кейсов по запросу нет.';
  return cases
    .slice(0, 8)
    .map(
      (item, index) =>
        `[CASE ${index + 1}] ${item.display_name}\nВертикаль: ${item.vertical}\nЗадача: ${item.task}\nРешение: ${item.solution}\nРезультат: ${item.result}\nПубличная страница: ${item.public_url}`
    )
    .join('\n\n');
}

export function sanitizePublicReply(value) {
  const withoutCommercialLines = String(value || '')
    .split('\n')
    .filter((line) => !/(?:₽|\bруб(?:ль|ля|лей)?\.?|\$|€)/i.test(line))
    .join('\n');
  return withoutCommercialLines
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '')
    .replace(/https?:\/\/t\.me\/(?!anix_helper\b)[A-Za-z][A-Za-z0-9_]{4,31}/gi, '')
    .replace(/@(?!anix_helper\b)[A-Za-z][A-Za-z0-9_]{4,31}/g, '')
    .replace(/(?:\+?\d[\d\s().-]{8,}\d)/g, (candidate) =>
      candidate.replace(/\D/g, '').length >= 10 ? '' : candidate
    )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/ {2,}/g, ' ')
    .trim();
}

export const GROUNDING_POLICY_PROMPT = `
Публичная политика Anix:
- факты о кейсах, клиентах и результатах бери только из VERIFIED CASES и KNOWLEDGE CONTEXT;
- не придумывай клиентов, результаты, ссылки, файлы и контакты;
- личные контакты не раскрывай; направляй в форму заявки или @anix_helper;
- файл можно предлагать только когда он явно перечислен среди подтверждённых материалов;
- если спрашивают цену, единственный разрешённый ориентир: от 300 тыс. до 1,5 млн ₽ за минуту, в зависимости от сложности;
- Qwen не принимает бизнес-решения за пользователя и не меняет правила создания заявки.
`;
