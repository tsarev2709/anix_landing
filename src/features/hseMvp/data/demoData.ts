import { foodProductionTrainingModules } from './foodProductionTrainingModules';

const publicAsset = (path: string) => `${process.env.PUBLIC_URL || ''}${path}`;
const lsrAsset = (file: string, ext: 'mp4' | 'webp') =>
  publicAsset(`/hse/life-saving-rules/${file}.${ext}`);

export const HSE_MVP_SYSTEM_NAME =
  'ANIX. Единая визуальная система обучения по охране труда';

export const HSE_MVP_PRODUCT_DESCRIPTION =
  'Дополнительный цифровой инструмент обучения, коммуникации и проверки понимания правил безопасности для сотрудников и подрядчиков производственных организаций.';

export const HSE_MVP_DISCLAIMER =
  'Решение не заменяет обязательный инструктаж по охране труда и не является юридическим допуском к работам.';

export const demoCompany = {
  id: 'food-site-1',
  name: 'Пищевая производственная площадка №1',
  industry: 'Пищевая промышленность',
  site: 'Линия розлива и склад готовой продукции',
};

export const demoEmployee = {
  id: 'demo-employee',
  fullName: 'Демо-сотрудник',
  department: 'Производство',
  role: 'Сотрудник смены',
};

export const lsrFiles = [
  ['lsr-overview', 'LSR', 'Общая карточка Life-saving rules'],
  ['lsr-a-01', 'A-01', 'Остановись перед началом опасной операции'],
  ['lsr-a-02', 'A-02', 'Проверь разрешение и условия выполнения работ'],
  ['lsr-a-03', 'A-03', 'Используй средства индивидуальной защиты'],
  ['lsr-a-04', 'A-04', 'Сообщай о небезопасной ситуации'],
  ['lsr-05', 'LSR-05', 'Не обходи защитные блокировки'],
  ['lsr-06', 'LSR-06', 'Работай только исправным инструментом'],
  ['lsr-07', 'LSR-07', 'Соблюдай порядок движения и маркировку зон'],
  ['lsr-08', 'LSR-08', 'Не находись под подвешенным грузом'],
  ['lsr-09', 'LSR-09', 'Контролируй источники энергии перед обслуживанием'],
  ['lsr-10', 'LSR-10', 'Поддерживай порядок на рабочем месте'],
  ['lsr-11', 'LSR-11', 'Останавливай работу при угрозе жизни и здоровью'],
  ['lsr-12', 'LSR-12', 'Проверяй ограждения и знаки безопасности'],
  ['lsr-13', 'LSR-13', 'Действуй по маршрутам эвакуации при сигнале'],
  ['lsr-14', 'LSR-14', 'Фиксируй и передавай информацию о происшествиях'],
];

const lifeSavingCards = lsrFiles.map(([file, ruleCode, title], index) => ({
  id: `lsr-card-${index + 1}`,
  title,
  shortText:
    index === 0
      ? 'Общий обзор набора ключевых правил безопасности для производственной площадки.'
      : 'Разберите короткую визуальную ситуацию, риск и безопасное действие сотрудника.',
  ruleCode,
  riskTag:
    index % 4 === 0
      ? 'организация работ'
      : index % 4 === 1
        ? 'СИЗ и поведение'
        : index % 4 === 2
          ? 'опасная зона'
          : 'коммуникация',
  image: lsrAsset(file, 'webp'),
  video: lsrAsset(file, 'mp4'),
  altText: `${title}. Короткая анимационная карточка Life-saving rules`,
  version: 'LSR-2026.1',
}));

const slipCards = [
  {
    id: 'slip-1',
    title: 'Обозначьте пролив и опасную зону',
    shortText:
      'Если обнаружен пролив, остановите движение рядом, выставьте знак и сообщите ответственному.',
    ruleCode: 'SLIP-01',
    riskTag: 'скользкие поверхности',
    image: lsrAsset('lsr-overview', 'webp'),
    altText:
      'Плейсхолдер карточки о скользкой поверхности и обозначении опасной зоны',
    version: 'FALL-2026.1',
  },
  {
    id: 'slip-2',
    title: 'Уберите пролив безопасным способом',
    shortText:
      'Используйте подходящий инвентарь, не создавайте новый риск и не оставляйте мокрый участок без контроля.',
    ruleCode: 'SLIP-02',
    riskTag: 'уборка проливов',
    image: lsrAsset('lsr-a-02', 'webp'),
    altText: 'Плейсхолдер карточки о безопасной уборке проливов',
    version: 'FALL-2026.1',
  },
  {
    id: 'slip-3',
    title: 'Передвигайтесь по разрешенным маршрутам',
    shortText:
      'Смотрите на покрытие, держитесь поручней и не переносите груз так, чтобы он закрывал обзор.',
    ruleCode: 'SLIP-03',
    riskTag: 'перемещение',
    image: lsrAsset('lsr-a-03', 'webp'),
    altText: 'Плейсхолдер карточки о безопасном перемещении по площадке',
    version: 'FALL-2026.1',
  },
];

const electricalCards = [
  {
    id: 'electric-1',
    title: 'Не работайте с поврежденным кабелем',
    shortText:
      'Остановите использование оборудования, обозначьте место и сообщите ответственному лицу.',
    ruleCode: 'EL-01',
    riskTag: 'электробезопасность',
    image: lsrAsset('lsr-10', 'webp'),
    altText: 'Плейсхолдер карточки о поврежденном электрическом кабеле',
    version: 'EL-2026.1',
  },
  {
    id: 'electric-2',
    title: 'Соблюдайте порядок обесточивания',
    shortText:
      'Перед обслуживанием убедитесь, что источник энергии отключен и исключено случайное включение.',
    ruleCode: 'EL-02',
    riskTag: 'обесточивание',
    image: lsrAsset('lsr-11', 'webp'),
    altText: 'Плейсхолдер карточки о порядке обесточивания оборудования',
    version: 'EL-2026.1',
  },
  {
    id: 'electric-3',
    title: 'Не заходите в зону обслуживания без допуска',
    shortText:
      'Держитесь вне огражденной зоны и дождитесь подтверждения специалиста технической службы.',
    ruleCode: 'EL-03',
    riskTag: 'опасная зона',
    image: lsrAsset('lsr-12', 'webp'),
    altText: 'Плейсхолдер карточки о зоне технического обслуживания',
    version: 'EL-2026.1',
  },
];

const legacyDemoModules = [
  {
    id: 'life-saving-rules',
    title: 'Life-saving rules',
    description:
      'Ключевые правила безопасности, обязательные для сотрудников и подрядчиков на производственной площадке.',
    estimatedMinutes: 12,
    version: 'LSR-2026.1',
    status: 'published',
    progress: 0,
    cards: lifeSavingCards,
    questions: [
      {
        id: 'lsr-q1',
        type: 'single',
        text: 'Что нужно сделать, если визуальная карточка показывает небезопасную ситуацию?',
        relatedRuleCode: 'A-04',
        riskTag: 'коммуникация',
        recommendationRule: 'Сообщай о небезопасной ситуации',
        options: [
          { id: 'a', text: 'Продолжить работу, если задача срочная' },
          {
            id: 'b',
            text: 'Остановиться, оценить риск и сообщить ответственному',
            correct: true,
          },
          { id: 'c', text: 'Передать решение коллеге без фиксации' },
        ],
      },
      {
        id: 'lsr-q2',
        type: 'multi',
        text: 'Какие действия относятся к безопасному началу работ?',
        relatedRuleCode: 'A-02',
        riskTag: 'организация работ',
        recommendationRule: 'Проверь разрешение и условия выполнения работ',
        options: [
          { id: 'a', text: 'Проверить условия и разрешение', correct: true },
          {
            id: 'b',
            text: 'Убедиться, что СИЗ подходят задаче',
            correct: true,
          },
          { id: 'c', text: 'Начать быстрее, чтобы не задерживать смену' },
          { id: 'd', text: 'Уточнить границы опасной зоны', correct: true },
        ],
      },
      {
        id: 'lsr-q3',
        type: 'single',
        text: 'Что делать при угрозе жизни и здоровью?',
        relatedRuleCode: 'LSR-11',
        riskTag: 'остановка работ',
        recommendationRule: 'Останавливай работу при угрозе жизни и здоровью',
        options: [
          {
            id: 'a',
            text: 'Остановить работу и сообщить руководителю',
            correct: true,
          },
          { id: 'b', text: 'Дождаться конца смены' },
          { id: 'c', text: 'Продолжить, если риск кажется небольшим' },
        ],
      },
      {
        id: 'lsr-q4',
        type: 'multi',
        text: 'Какие признаки требуют внимания перед входом в рабочую зону?',
        relatedRuleCode: 'LSR-12',
        riskTag: 'опасная зона',
        recommendationRule: 'Проверяй ограждения и знаки безопасности',
        options: [
          { id: 'a', text: 'Отсутствует ограждение', correct: true },
          { id: 'b', text: 'Есть предупреждающий знак', correct: true },
          { id: 'c', text: 'Маршрут свободен и разрешен', correct: true },
          {
            id: 'd',
            text: 'Коллега прошел там раньше, значит можно игнорировать знаки',
          },
        ],
      },
      {
        id: 'lsr-q5',
        type: 'single',
        text: 'Что не является целью цифрового модуля?',
        relatedRuleCode: 'LSR',
        riskTag: 'правовой дисклеймер',
        recommendationRule: 'Решение не заменяет обязательный инструктаж',
        options: [
          { id: 'a', text: 'Помочь понять правила безопасности' },
          { id: 'b', text: 'Показать визуальные ситуации риска' },
          {
            id: 'c',
            text: 'Выдать официальный юридический допуск к работам',
            correct: true,
          },
        ],
      },
    ],
  },
  {
    id: 'slips-and-falls',
    title: 'Скользкие поверхности и падения',
    description:
      'Как предотвращать падения, обозначать опасные зоны, убирать проливы и безопасно перемещаться по производственной площадке.',
    estimatedMinutes: 7,
    version: 'FALL-2026.1',
    status: 'published',
    progress: 0,
    cards: slipCards,
    questions: [
      {
        id: 'slip-q1',
        type: 'single',
        text: 'Что сделать первым при обнаружении пролива?',
        relatedRuleCode: 'SLIP-01',
        riskTag: 'скользкие поверхности',
        recommendationRule: 'Обозначьте пролив и опасную зону',
        options: [
          {
            id: 'a',
            text: 'Обозначить опасную зону и предупредить коллег',
            correct: true,
          },
          { id: 'b', text: 'Пройти мимо, если пролив небольшой' },
          { id: 'c', text: 'Закрыть сменное задание без сообщения' },
        ],
      },
      {
        id: 'slip-q2',
        type: 'multi',
        text: 'Что снижает риск падения?',
        relatedRuleCode: 'SLIP-03',
        riskTag: 'перемещение',
        recommendationRule: 'Передвигайтесь по разрешенным маршрутам',
        options: [
          { id: 'a', text: 'Разрешенные маршруты', correct: true },
          { id: 'b', text: 'Нескользящая обувь', correct: true },
          { id: 'c', text: 'Груз, закрывающий обзор' },
          { id: 'd', text: 'Поручни на лестнице', correct: true },
        ],
      },
      {
        id: 'slip-q3',
        type: 'single',
        text: 'Когда можно снять знак опасной зоны?',
        relatedRuleCode: 'SLIP-02',
        riskTag: 'уборка проливов',
        recommendationRule: 'Уберите пролив безопасным способом',
        options: [
          {
            id: 'a',
            text: 'Когда участок очищен и безопасен для прохода',
            correct: true,
          },
          { id: 'b', text: 'Сразу после установки знака' },
          { id: 'c', text: 'Когда знак мешает проезду' },
        ],
      },
    ],
  },
  {
    id: 'electrical-safety',
    title: 'Электробезопасность',
    description:
      'Базовые правила безопасного поведения рядом с электрооборудованием, поврежденными кабелями и зонами технического обслуживания.',
    estimatedMinutes: 8,
    version: 'EL-2026.1',
    status: 'draft-ready',
    progress: 0,
    cards: electricalCards,
    questions: [
      {
        id: 'el-q1',
        type: 'single',
        text: 'Что делать при обнаружении поврежденного кабеля?',
        relatedRuleCode: 'EL-01',
        riskTag: 'электробезопасность',
        recommendationRule: 'Не работайте с поврежденным кабелем',
        options: [
          { id: 'a', text: 'Использовать кабель осторожно' },
          {
            id: 'b',
            text: 'Остановить использование и сообщить ответственному',
            correct: true,
          },
          { id: 'c', text: 'Самостоятельно перемотать изолентой без заявки' },
        ],
      },
      {
        id: 'el-q2',
        type: 'multi',
        text: 'Что важно перед обслуживанием оборудования?',
        relatedRuleCode: 'EL-02',
        riskTag: 'обесточивание',
        recommendationRule: 'Соблюдайте порядок обесточивания',
        options: [
          { id: 'a', text: 'Отключить источник энергии', correct: true },
          { id: 'b', text: 'Исключить случайное включение', correct: true },
          { id: 'c', text: 'Проверить только внешний вид панели' },
          {
            id: 'd',
            text: 'Следовать инструкции ответственного лица',
            correct: true,
          },
        ],
      },
      {
        id: 'el-q3',
        type: 'single',
        text: 'Можно ли заходить в огражденную зону обслуживания без подтверждения?',
        relatedRuleCode: 'EL-03',
        riskTag: 'опасная зона',
        recommendationRule: 'Не заходите в зону обслуживания без допуска',
        options: [
          { id: 'a', text: 'Да, если нужно быстро пройти' },
          {
            id: 'b',
            text: 'Нет, нужно дождаться подтверждения специалиста',
            correct: true,
          },
          { id: 'c', text: 'Да, если оборудование выключено визуально' },
        ],
      },
    ],
  },
];

export const demoModules = [
  legacyDemoModules[0],
  ...foodProductionTrainingModules,
];

export const demoEmployeeRows = [
  {
    id: 'ivanov',
    name: 'Иванов И.И.',
    department: 'Производство',
    site: 'Линия розлива',
    moduleId: 'life-saving-rules',
    module: 'Life-saving rules',
    progress: 100,
    status: 'Пройден',
    score: 98,
    attempts: 1,
    duration: '11 мин',
    lastActivity: 'сегодня 10:24',
    riskTag: 'организация работ',
    recommendations: 'Поддерживать регулярные микронапоминания по LSR.',
  },
  {
    id: 'petrov',
    name: 'Петров П.П.',
    department: 'Склад',
    site: 'Погрузочно-разгрузочные работы',
    moduleId: 'slips-and-falls',
    module: 'Скользкие поверхности и падения',
    progress: 66,
    status: 'В процессе',
    score: 0,
    attempts: 0,
    duration: '5 мин',
    lastActivity: 'вчера 16:10',
    riskTag: 'скользкие поверхности',
    recommendations: 'Напомнить о завершении модуля.',
  },
  {
    id: 'sidorov',
    name: 'Сидоров С.С.',
    department: 'Техническая служба',
    site: 'Электрооборудование',
    moduleId: 'electrical-safety',
    module: 'Электробезопасность',
    progress: 100,
    status: 'Рекомендуется повторить',
    score: 67,
    attempts: 2,
    duration: '8 мин',
    lastActivity: 'сегодня 09:12',
    riskTag: 'электробезопасность',
    recommendations:
      'Повторить порядок обесточивания и правила сообщения ответственному лицу.',
  },
  {
    id: 'smirnova',
    name: 'Смирнова А.А.',
    department: 'Контроль качества',
    site: 'Лаборатория',
    moduleId: 'life-saving-rules',
    module: 'Life-saving rules',
    progress: 20,
    status: 'Просрочено',
    score: 0,
    attempts: 0,
    duration: '2 мин',
    lastActivity: '3 дня назад',
    riskTag: 'организация работ',
    recommendations: 'Назначить повторное уведомление.',
  },
  {
    id: 'kuznetsov',
    name: 'Кузнецов Д.В.',
    department: 'Подрядчик',
    site: 'Сервисная бригада',
    moduleId: 'electrical-safety',
    module: 'Электробезопасность',
    progress: 0,
    status: 'Не начат',
    score: 0,
    attempts: 0,
    duration: '0 мин',
    lastActivity: 'нет активности',
    riskTag: 'электробезопасность',
    recommendations:
      'Отправить приглашение на обучение перед выходом на объект.',
  },
];

export const courseCatalog = demoModules.map((module, index) => ({
  id: module.id,
  title: module.title,
  version: module.version,
  modulesCount: 1,
  cardsCount: module.cards.length,
  questionsCount: module.questions.length,
  updatedAt: index === 0 ? '03.07.2026' : '02.07.2026',
  status:
    module.status === 'published' ? 'Опубликован' : 'Готовится к публикации',
}));

export const competitionCriteria = [
  'обучение и оценка знаний',
  'учет прохождения',
  'анализ ошибок',
  'рекомендации специалисту',
  'интеграции CSV/XLSX/CRM/webhook-ready',
  'поддержка пользователя',
  'адаптивность и доступность',
  'использование AI-пайплайна ANIX для создания визуальных материалов',
];

export const getModuleById = (courseId: string) =>
  demoModules.find((module) => module.id === courseId) || demoModules[0];
