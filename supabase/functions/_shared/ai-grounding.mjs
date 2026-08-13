const TELEGRAM_URL = 'https://t.me/anix_helper';

const CASE_WORDS =
  /(?:кейс|проект|клиент|портфолио|пример|работал|сделал|создал|компани)/i;
const DETAIL_WORDS =
  /(?:подробнее|детал|задач|решени|результат|показател|вырос|что сделали|как сделали|что получилось|подход использовал|работе с)/i;
const LIST_WORDS =
  /(?:кейсы|проекты|клиенты|компании|назови|перечисли|несколько|примеры|какие|три|ссылки)/i;
const SOURCE_WORDS =
  /(?:ссылк|где.*посмотреть|покажи|открой|источник)|(?:видео.*(?:есть|найд|смотр))|(?:(?:дай|отправь|пришли|скинь)\s+.*(?:видео|материал))/i;
const FILE_WORDS =
  /(?:файл|pdf|документ|бриф|скачать|исходник|договор)|(?:(?:отправь|пришли|скинь|дай)\s+.*(?:презентац|коммерческ.*предложен))/i;
const PRICE_WORDS = /(?:цен[а-я]*|стоимост|сколько.*стои|бюджет|прайс)/i;
const CONTACT_WORDS =
  /(?:контакт|телефон|почт|e-?mail|связаться|свяж|написать вам|напишите мне|кому написать|менеджер|номер.*(?:директор|клиент)|(?:директор|клиент).*номер)/i;

const CASE_PAGE_CONTEXT = {
  clappy: { name: 'Clappy', vertical: 'b2b' },
  'hemotech-ai': { name: 'Hemotech AI', vertical: 'medicine' },
  tpes: { name: 'ТПЭС', vertical: 'b2b' },
  'mfti-endowment': { name: 'Эндаумент-фонд МФТИ', vertical: 'b2b' },
  mosfarma: { name: 'Мосфарма', vertical: 'medicine' },
  'multon-partners': { name: 'Мултон Партнерс', vertical: 'hse' },
  aviandr: { name: 'Авиандр', vertical: 'medicine' },
  'little-prince': { name: 'Маленький принц', vertical: 'cinema' },
  borodino: { name: 'Бородино', vertical: 'cinema' },
  rchk: { name: 'РЧК', vertical: 'events' },
};

export function normalizeGroundingText(value) {
  return String(value || '')
    .toLowerCase()
    .replaceAll('ё', 'е')
    .replace(/[^a-zа-я0-9@]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SEARCH_STEM_LENGTH = 5;

export function groundingSearchSignature(value) {
  return [
    ...new Set(
      normalizeGroundingText(value)
        .split(' ')
        .filter(Boolean)
        .map((token) =>
          token.length > SEARCH_STEM_LENGTH
            ? token.slice(0, SEARCH_STEM_LENGTH)
            : token
        )
    ),
  ];
}

export function groundingAliasMatches(query, alias) {
  const queryTokens = new Set(groundingSearchSignature(query));
  const aliasTokens = groundingSearchSignature(alias);
  return (
    aliasTokens.length > 0 &&
    aliasTokens.every((token) => queryTokens.has(token))
  );
}

export function groundingPageContext(pagePath = '/') {
  const path =
    String(pagePath || '/')
      .split('?')[0]
      .split('#')[0]
      .replace(/\/+$/, '') || '/';
  const caseSlug = path.match(/^\/cases\/([^/]+)$/)?.[1] || '';
  const casePage = CASE_PAGE_CONTEXT[caseSlug];
  if (casePage) {
    return {
      path,
      kind: 'case',
      vertical: casePage.vertical,
      caseSlug,
      caseName: casePage.name,
      label: `Кейс «${casePage.name}»`,
    };
  }
  if (path === '/medicine' || path.startsWith('/cases/medicine')) {
    return {
      path,
      kind: 'service',
      vertical: 'medicine',
      caseSlug: '',
      caseName: '',
      label: 'Pharma и MedTech',
    };
  }
  if (path === '/hse' || path.startsWith('/cases/hse')) {
    return {
      path,
      kind: 'service',
      vertical: 'hse',
      caseSlug: '',
      caseName: '',
      label: 'HSE и охрана труда',
    };
  }
  if (path === '/animation' || path === '/ai-video') {
    return {
      path,
      kind: 'service',
      vertical: 'b2b',
      caseSlug: '',
      caseName: '',
      label: 'Визуальные форматы Anix',
    };
  }
  if (path.startsWith('/cases')) {
    return {
      path,
      kind: 'catalog',
      vertical: null,
      caseSlug: '',
      caseName: '',
      label: 'Каталог кейсов Anix',
    };
  }
  if (path === '/why_it_works') {
    return {
      path,
      kind: 'process',
      vertical: null,
      caseSlug: '',
      caseName: '',
      label: 'Подход и процесс Anix',
    };
  }
  if (path === '/ceo') {
    return {
      path,
      kind: 'team',
      vertical: null,
      caseSlug: '',
      caseName: '',
      label: 'Команда Anix',
    };
  }
  return {
    path,
    kind: 'home',
    vertical: null,
    caseSlug: '',
    caseName: '',
    label: 'Anix Studio',
  };
}

export function groundingPageContextText(pageContext = {}) {
  const lines = [
    `Текущая страница: ${pageContext.label || 'Anix Studio'} (${pageContext.path || '/'}).`,
  ];
  if (pageContext.vertical)
    lines.push(`Направление страницы: ${pageContext.vertical}.`);
  if (pageContext.caseName) {
    lines.push(
      `Посетитель прямо сейчас смотрит публичный кейс «${pageContext.caseName}».`
    );
    lines.push(
      'Короткие вопросы без названия кейса относятся к этому кейсу, пока пользователь явно не сменил тему.'
    );
  }
  lines.push(
    'Используй страницу как контекст намерения, но факты подтверждай только VERIFIED CASES и KNOWLEDGE CONTEXT.'
  );
  return lines.join('\n');
}

export function groundingRetrievalQuery(
  query = '',
  currentMessage = '',
  pageContext = {}
) {
  if (!pageContext?.caseName) return String(query || '');
  const mentionsAnotherCase = Object.values(CASE_PAGE_CONTEXT).some(
    (item) =>
      item.name !== pageContext.caseName &&
      groundingAliasMatches(currentMessage, item.name)
  );
  if (mentionsAnotherCase) return String(query || '');
  return `${String(query || '').trim()}\nТекущий кейс: ${pageContext.caseName}`.trim();
}

export function inferGroundingVertical(messages = [], pagePath = '') {
  const combined = normalizeGroundingText(
    `${messages.slice(-4).join(' ')} ${pagePath}`
  );
  if (
    /(?:фарм|medtech|medicine|медицин|препарат|врач|диагност|гемотех|хемотех|hemotech|мосфарм|авинейр|авиандр)/.test(
      combined
    )
  ) {
    return 'medicine';
  }
  if (
    /(?:hse|охран.*труд|безопасност|инструктаж|жизненно важн.*правил|onboarding|онбординг|мултон|multon)/.test(
      combined
    )
  ) {
    return 'hse';
  }
  if (/(?:событи|выступлен|шоу|конференц|рчк)/.test(combined)) return 'events';
  if (/(?:кино|cinema|историчес|бородин|маленьк.*принц)/.test(combined)) {
    return 'cinema';
  }
  if (
    /(?:b2b|промышлен|технолог|продукт|продаж|тпэс|tpes|clappy|клаппи|мфти|физтех|эндаумент)/.test(
      combined
    )
  )
    return 'b2b';
  return null;
}

export function classifyGroundingIntent({
  message,
  recentUserMessages = [],
  pagePath = '',
}) {
  const cleanMessage = normalizeGroundingText(message);
  const providesContact =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(String(message || '')) ||
    /(?:https?:\/\/t\.me\/|@)[A-Za-z][A-Za-z0-9_]{4,31}/i.test(
      String(message || '')
    ) ||
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
      broadCatalog:
        LIST_WORDS.test(cleanMessage) && !DETAIL_WORDS.test(cleanMessage),
    };
  }
  if (FILE_WORDS.test(cleanMessage)) {
    return { mode: 'file', vertical, broadCatalog: false };
  }
  if (
    CASE_WORDS.test(cleanMessage) ||
    DETAIL_WORDS.test(cleanMessage) ||
    /расскажи (?:про|о работе с)/.test(cleanMessage) ||
    (vertical && /расскажи (?:о|об)\s/.test(cleanMessage)) ||
    recent.some((item) => CASE_WORDS.test(item))
  ) {
    return {
      mode: 'case',
      vertical,
      broadCatalog:
        LIST_WORDS.test(cleanMessage) && !DETAIL_WORDS.test(cleanMessage),
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

function cleanCardText(value, maxLength = 1600) {
  return String(value || '')
    .trim()
    .slice(0, maxLength);
}

export function publicCaseCards(cases = [], limit = 3) {
  const exactCases = cases.filter((item) => item?.exact_match === true);
  const selected = (exactCases.length ? exactCases : cases).slice(
    0,
    exactCases.length ? 1 : Math.max(1, Math.min(Number(limit) || 3, 5))
  );
  return selected.map((item) => {
    const assets = assetsOf(item);
    const imageUrl = safeHttpUrl(
      assets.find((asset) => asset?.kind === 'image')?.url
    );
    const links = assets
      .filter((asset) => ['case_page', 'video'].includes(asset?.kind))
      .map((asset) => ({
        kind: cleanCardText(asset?.kind, 50),
        label: cleanCardText(asset?.label, 120) || 'Открыть материал',
        url: safeHttpUrl(asset?.url),
      }))
      .filter((asset) => asset.url);
    const publicUrl = safeHttpUrl(item?.public_url);
    if (publicUrl && !links.some((link) => link.url === publicUrl)) {
      links.unshift({
        kind: 'case_page',
        label: 'Открыть кейс',
        url: publicUrl,
      });
    }
    return {
      id: cleanCardText(item?.id, 64),
      slug: cleanCardText(item?.slug, 100),
      name: cleanCardText(item?.display_name || item?.title, 240),
      vertical: cleanCardText(item?.vertical, 50),
      category: cleanCardText(item?.category, 120),
      summary: cleanCardText(item?.summary),
      task: cleanCardText(item?.task),
      solution: cleanCardText(item?.solution),
      result: cleanCardText(item?.result),
      image_url: imageUrl,
      links: links.slice(0, 3),
    };
  });
}

export function suggestedFollowUps({
  intent = {},
  cases = [],
  pageContext = {},
  currentMessage = '',
} = {}) {
  const exactCase = cases.find((item) => item?.exact_match === true);
  const current = normalizeGroundingText(currentMessage);
  let candidates;

  if (exactCase || pageContext.caseName) {
    const name = exactCase?.display_name || pageContext.caseName;
    const hasVideo = assetsOf(exactCase).some(
      (asset) => asset?.kind === 'video'
    );
    candidates = [
      `Какая была задача в кейсе «${name}»?`,
      `Что именно Anix сделал в кейсе «${name}»?`,
      `Какой получился результат у кейса «${name}»?`,
      hasVideo
        ? `Покажите видео кейса «${name}»`
        : `Покажите похожие кейсы Anix`,
    ];
  } else if (intent.mode === 'price') {
    candidates = [
      'От чего зависит стоимость?',
      'Помогите подобрать формат под задачу',
      'Что нужно для точной оценки?',
    ];
  } else if ((intent.vertical || pageContext.vertical) === 'medicine') {
    candidates = [
      'Покажите похожие фармкейсы',
      'Как сохранить научную точность?',
      'Какой формат подойдёт врачам?',
    ];
  } else if ((intent.vertical || pageContext.vertical) === 'hse') {
    candidates = [
      'Покажите похожие HSE-кейсы',
      'Что лучше: ролики, карточки или маскот?',
      'Как превратить правила в кампанию?',
    ];
  } else if ((intent.vertical || pageContext.vertical) === 'events') {
    candidates = [
      'Покажите кейсы для мероприятий',
      'Как собрать экранный контент в одну историю?',
      'Что можно сделать для выступления руководителя?',
    ];
  } else {
    candidates = [
      'Подберите похожий кейс',
      'Какой формат подойдёт моей задаче?',
      'Что нужно подготовить для старта?',
    ];
  }

  return [...new Set(candidates)]
    .filter((value) => normalizeGroundingText(value) !== current)
    .slice(0, 3);
}

export function shouldOfferProjectHandoff({
  message = '',
  intent = {},
  commercialReadiness = '',
} = {}) {
  if (['qualified', 'ready'].includes(commercialReadiness)) return true;
  if (intent?.providesContact || intent?.mode === 'price') return true;
  const clean = normalizeGroundingText(message);
  return /(?:нам нужен|нам нужна|нам нужно|мы хотим|хотим сделать|нужно сделать|хочу заказать|нужно запустить|есть срок|дедлайн|для нашей компании|для нашего продукта)/i.test(
    clean
  );
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
    (item, index, all) =>
      all.findIndex((candidate) => candidate.url === item.url) === index
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
        {
          kind: 'contact',
          label: 'Написать Anix в Telegram',
          title: 'Anix',
          url: TELEGRAM_URL,
        },
      ],
      reason: 'approved_price_policy',
    };
  }
  if (intent?.mode === 'contact') {
    return {
      reply:
        'Личными контактами клиентов и команды в чате не делимся. Связаться с Anix можно через форму заявки на сайте или в Telegram: @anix_helper.',
      sources: [
        {
          kind: 'contact',
          label: 'Написать Anix в Telegram',
          title: 'Anix',
          url: TELEGRAM_URL,
        },
      ],
      reason: 'contact_policy',
    };
  }

  const exactCases = cases.filter((item) => item?.exact_match === true);
  const selectedCases = exactCases.length ? exactCases : cases;

  if (intent?.mode === 'file') {
    const documents = sourcesFromCases(selectedCases, {
      includeDocuments: true,
    }).filter((item) => item.kind === 'document');
    if (documents.length) {
      return {
        reply:
          'Нашёл подтверждённые файлы по запросу. Они прикреплены к ответу.',
        sources: documents,
        reason: 'verified_documents',
      };
    }
    return {
      reply:
        'В подтверждённых материалах нет файла, который можно безопасно отправить по этому запросу. Запросите его через форму заявки на сайте или напишите @anix_helper.',
      sources: [
        {
          kind: 'contact',
          label: 'Запросить материал в Telegram',
          title: 'Anix',
          url: TELEGRAM_URL,
        },
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
          {
            kind: 'contact',
            label: 'Уточнить у Anix',
            title: 'Anix',
            url: TELEGRAM_URL,
          },
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
          {
            kind: 'contact',
            label: 'Уточнить у Anix',
            title: 'Anix',
            url: TELEGRAM_URL,
          },
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
        exactCases.length === 1 && !intent.broadCatalog
          ? exactCases
          : selectedCases
      ),
      reason:
        exactCases.length === 1 && !intent.broadCatalog
          ? 'exact_case'
          : 'case_list',
    };
  }

  return null;
}

export function structuredCaseContext(cases = []) {
  if (!cases.length)
    return 'Подтверждённых структурированных кейсов по запросу нет.';
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
    .replace(
      /https?:\/\/t\.me\/(?!anix_helper\b)[A-Za-z][A-Za-z0-9_]{4,31}/gi,
      ''
    )
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
