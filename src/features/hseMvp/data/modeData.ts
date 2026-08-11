export const hseDepartments = [
  {
    id: 'all-employees',
    title: 'Все сотрудники',
    description:
      'Общий набор обязательных модулей для сотрудников и подрядчиков площадки.',
    headcount: 128,
    progress: 76,
    requiredModuleIds: [
      'life-saving-rules',
      'slips-and-falls',
      'electrical-safety',
    ],
    riskTags: ['общие правила', 'скользкие поверхности', 'электробезопасность'],
  },
  {
    id: 'production-lines',
    title: 'Производство и технологические линии',
    description:
      'Операторы линии розлива, сменные сотрудники, зоны мойки и упаковки.',
    headcount: 46,
    progress: 72,
    requiredModuleIds: [
      'life-saving-rules',
      'slips-and-falls',
      'electrical-safety',
    ],
    riskTags: ['влажные зоны', 'оборудование', 'движение по проходам'],
  },
  {
    id: 'warehouse',
    title: 'Склад и внутренняя логистика',
    description:
      'Паллеты, тара, погрузочно-разгрузочные работы и перемещение по складу.',
    headcount: 24,
    progress: 68,
    requiredModuleIds: ['life-saving-rules', 'slips-and-falls'],
    riskTags: ['проходы', 'погрузка', 'паллеты'],
  },
  {
    id: 'technical-service',
    title: 'Техническая служба / ремонт / энергетики',
    description:
      'Сотрудники, работающие рядом с электрощитами, кабелями и зонами обслуживания.',
    headcount: 18,
    progress: 81,
    requiredModuleIds: ['life-saving-rules', 'electrical-safety'],
    riskTags: ['электробезопасность', 'обесточивание', 'опасная зона'],
  },
  {
    id: 'sanitation',
    title: 'Санитарная обработка / мойка / CIP',
    description:
      'Влажные зоны, моющие средства, шланги, проливы и уборка после обработки.',
    headcount: 16,
    progress: 64,
    requiredModuleIds: [
      'life-saving-rules',
      'slips-and-falls',
      'electrical-safety',
    ],
    riskTags: ['мокрый пол', 'моющие средства', 'влажное оборудование'],
  },
  {
    id: 'quality-lab',
    title: 'Лаборатория контроля качества',
    description:
      'Лабораторные сотрудники, перемещение проб и работа рядом с оборудованием.',
    headcount: 10,
    progress: 90,
    requiredModuleIds: ['life-saving-rules', 'slips-and-falls'],
    riskTags: ['перемещение', 'проливы', 'маркировка зоны'],
  },
  {
    id: 'office',
    title: 'Офис и административный персонал',
    description:
      'Посещение производственных зон, базовые правила поведения и маршруты.',
    headcount: 9,
    progress: 83,
    requiredModuleIds: ['life-saving-rules'],
    riskTags: ['посещение производства', 'маршруты', 'инструктаж'],
  },
  {
    id: 'contractors',
    title: 'Подрядчики и посетители',
    description:
      'Сервисные бригады, временные работы, правила допуска и коммуникации.',
    headcount: 14,
    progress: 57,
    requiredModuleIds: [
      'life-saving-rules',
      'slips-and-falls',
      'electrical-safety',
    ],
    riskTags: ['подрядчики', 'зоны работ', 'сообщение ответственному'],
  },
];

export const showcaseJurySteps = [
  'Откройте витринный контур.',
  'Перейдите в организацию «Пищевая производственная площадка №1».',
  'Выберите отдел и обязательный модуль.',
  'Откройте урок, затем пройдите тест.',
  'Скачайте подтверждение прохождения.',
  'Откройте кабинет специалиста и посмотрите аналитику.',
  'Проверьте интеграции, поддержку и тестовый Supabase-ready контур.',
];

export const hseModeCards = [
  {
    id: 'showcase',
    title: 'Витринный демополигон',
    description:
      'Презентационный контур с готовыми демоданными. Позволяет быстро показать обучение, тесты, учет прохождения, аналитику и рекомендации без регистрации.',
    button: 'Открыть витринный контур',
    path: '/hse/mvp/showcase',
    badge: 'Витринный режим · демоданные',
  },
  {
    id: 'test',
    title: 'Тестировочный контур',
    description:
      'Рабочий контур с Supabase: регистрация сотрудников по рабочей почте, авторизация, роли, сохранение прохождений, событий и результатов в базе данных.',
    button: 'Открыть тестировочный контур',
    path: '/hse/mvp/test',
    badge: 'Тестировочный режим · Supabase',
  },
];

export const testModeEnvKeys = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_ALLOWED_EMAIL_DOMAINS',
  'VITE_TEST_ADMIN_EMAIL',
];

export const getDepartmentById = (departmentId: string) =>
  hseDepartments.find((department) => department.id === departmentId) ||
  hseDepartments[0];
