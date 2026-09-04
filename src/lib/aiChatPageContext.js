const CASE_PAGES = {
  clappy: { name: 'Clappy', vertical: 'b2b' },
  'hemotech-ai': { name: 'Hemotech AI', vertical: 'medicine' },
  tpes: { name: 'ТПЭС', vertical: 'b2b' },
  'mfti-endowment': { name: 'Эндаумент-фонд МФТИ', vertical: 'b2b' },
  mosfarma: { name: 'Мосфарма', vertical: 'medicine' },
  'multon-partners': { name: 'Мултон Партнерс', vertical: 'hse' },
  aviandr: { name: 'Авиандр', vertical: 'medicine' },
  'little-prince': { name: 'Маленький принц', vertical: 'cinema' },
  borodino: { name: 'Бородино', vertical: 'cinema' },
};

const PAGE_PROFILES = {
  medicine: {
    kind: 'service',
    vertical: 'medicine',
    label: 'Medicine',
    intro:
      'Вы изучаете направление Pharma и MedTech. Могу подобрать похожие кейсы, формат или способ объяснить медицинскую тему.',
    options: [
      'Покажите сильные фармкейсы Anix',
      'Как визуализировать механизм действия препарата?',
      'Как сохранить научную точность?',
      'Что сделать для врачебной конференции?',
    ],
  },
  hse: {
    kind: 'service',
    vertical: 'hse',
    label: 'HSE',
    intro:
      'Вы изучаете решения Anix для HSE. Могу подобрать формат для правил безопасности, онбординга или обучения сотрудников.',
    options: [
      'Покажите кейсы Anix по охране труда',
      'Что лучше: ролики, карточки или маскот?',
      'Как сделать инструктаж заметным?',
      'Как собрать HSE-кампанию?',
    ],
  },
  animation: {
    kind: 'service',
    vertical: 'b2b',
    label: 'Анимация',
    intro:
      'Могу помочь выбрать визуальный формат для сложного продукта, технологии, продажи или обучения.',
    options: [
      'Как объяснить сложный B2B-продукт?',
      'Что лучше: ролик или презентация?',
      'Как выбрать между 2D и AI-видео?',
      'Сколько стоит минута ролика?',
    ],
  },
  cases: {
    kind: 'catalog',
    vertical: null,
    label: 'Кейсы Anix',
    intro:
      'Здесь собраны публичные кейсы Anix. Могу найти похожий проект, разобрать результат или подобрать кейс под вашу задачу.',
    options: [
      'Покажите кейсы с измеримым результатом',
      'Подберите кейс для сложного B2B-продукта',
      'Какие есть проекты для фармы?',
      'Какие есть проекты для HSE?',
    ],
  },
  process: {
    kind: 'process',
    vertical: null,
    label: 'Подход Anix',
    intro:
      'Могу объяснить, почему визуальные истории работают, как устроен процесс Anix и какой формат подойдёт вашей задаче.',
    options: [
      'Как Anix начинает работу над сложной темой?',
      'Что нужно подготовить для старта?',
      'Как выбрать подходящий формат?',
      'Покажите кейсы с результатами',
    ],
  },
  pricing: {
    kind: 'pricing',
    vertical: null,
    label: 'Цены Anix',
    intro:
      'Вы изучаете стоимость и условия работы Anix. Могу объяснить состав сметы, подобрать уровень продукта или подготовить следующий шаг для закупки.',
    options: [
      'Какой пилот подойдёт моей задаче?',
      'Что входит в стоимость?',
      'Как проходят правки и приёмка?',
      'Что передать службе закупок?',
    ],
  },
  team: {
    kind: 'team',
    vertical: null,
    label: 'Команда Anix',
    intro:
      'Могу рассказать о компетенциях команды, подходе к сложным темам и релевантных проектах Anix.',
    options: [
      'В чём экспертиза команды Anix?',
      'Как вы работаете со сложной фактурой?',
      'Какие проекты делали для B2B?',
    ],
  },
  default: {
    kind: 'home',
    vertical: null,
    label: 'Anix Studio',
    intro:
      'Опишите, что нужно объяснить. Я подберу формат, релевантные кейсы и полезный следующий шаг.',
    options: [
      'Подберите формат под мою задачу',
      'Покажите кейсы с результатами',
      'Как объяснить сложный продукт?',
      'Как выбрать между 2D и AI-видео?',
      'Сколько стоит минута ролика?',
    ],
  },
};

export function normalizeAiChatPath(value = '/') {
  const clean = String(value || '/')
    .split('?')[0]
    .split('#')[0]
    .replace(/\/+$/, '');
  return clean || '/';
}

function profileForPath(path) {
  if (
    path === '/medicine' ||
    path.startsWith('/medicine/') ||
    path.startsWith('/cases/medicine')
  ) {
    return PAGE_PROFILES.medicine;
  }
  if (
    path === '/hse' ||
    path.startsWith('/hse/') ||
    path.startsWith('/cases/hse')
  ) {
    return PAGE_PROFILES.hse;
  }
  if (path === '/stoimost') return PAGE_PROFILES.pricing;
  if (path === '/animation' || path === '/ai-video') {
    return PAGE_PROFILES.animation;
  }
  if (path === '/why_it_works') return PAGE_PROFILES.process;
  if (path === '/ceo') return PAGE_PROFILES.team;
  if (path.startsWith('/cases')) return PAGE_PROFILES.cases;
  return PAGE_PROFILES.default;
}

export function resolveAiChatPageContext({
  pathname = '/',
  title = '',
  heading = '',
} = {}) {
  const path = normalizeAiChatPath(pathname);
  const match = path.match(/^\/cases\/([^/]+)$/);
  const caseSlug = match?.[1] || '';
  const casePage = CASE_PAGES[caseSlug];

  if (casePage) {
    return {
      path,
      kind: 'case',
      vertical: casePage.vertical,
      caseSlug,
      caseName: casePage.name,
      label: `Кейс «${casePage.name}»`,
      title: String(title || '').slice(0, 300),
      heading: String(heading || '').slice(0, 300),
      intro: `Вы смотрите кейс «${casePage.name}». Могу разобрать задачу, решение, результат или показать подтверждённые материалы.`,
      options: [
        `Какая была задача в кейсе «${casePage.name}»?`,
        `Что Anix сделал в кейсе «${casePage.name}»?`,
        `Какой результат у кейса «${casePage.name}»?`,
        `Где посмотреть кейс «${casePage.name}» и видео?`,
      ],
    };
  }

  const profile = profileForPath(path);
  return {
    path,
    ...profile,
    caseSlug: '',
    caseName: '',
    title: String(title || '').slice(0, 300),
    heading: String(heading || '').slice(0, 300),
  };
}

export function currentAiChatPageContext() {
  if (typeof window === 'undefined') {
    return resolveAiChatPageContext();
  }
  return resolveAiChatPageContext({
    pathname: window.location.pathname,
    title: document.title,
    heading: document.querySelector('h1')?.textContent || '',
  });
}

export const AI_CHAT_CASE_PAGES = CASE_PAGES;
