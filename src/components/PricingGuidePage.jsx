import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Layers3,
  Mail,
  MessageCircle,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';
import logo from '../images/logoanix.png';
import SiteFooter from './SiteFooter';
import './PricingGuidePage.css';

const telegramUrl = 'https://t.me/anix_helper';
const emailUrl = 'mailto:studio@anix-ai.pro';

const estimateLines = [
  {
    title: 'Разбор задачи',
    text: 'Аудитория, площадка, целевое действие, исходные материалы и ограничения.',
  },
  {
    title: 'Сценарий и раскадровка',
    text: 'Логика объяснения, драматургия, текст, сцены и точки согласования.',
  },
  {
    title: 'Визуальная разработка',
    text: 'Стиль, персонажи, ключевые кадры, схемы и проверка читаемости.',
  },
  {
    title: 'Производство',
    text: 'Анимация, монтаж, звук, титры и финальная сборка мастер-ролика.',
  },
  {
    title: 'Проверка и управление',
    text: 'Научный или HSE-контур, два раунда консолидированных правок, контроль сроков.',
  },
  {
    title: 'Адаптации и передача',
    text: 'Версии под согласованные форматы, каналы, LMS, конференцию или digital.',
  },
];

const comparisonRows = [
  {
    name: 'Один ролик',
    scope: 'Одна задача, одна основная аудитория и один мастер.',
    use: 'Пилот, запуск одного сообщения, проверка визуального языка.',
    price: 'от 350–400 тыс. ₽',
  },
  {
    name: 'Серия',
    scope:
      'Несколько тем в общей стилистике, повторно используемые элементы и адаптации.',
    use: 'Портфель препаратов, набор рисков, onboarding-модуль.',
    price: 'от 900 тыс. ₽',
  },
  {
    name: 'Кампания',
    scope:
      'Мастер-материал, система каналов, календарь выпусков и регулярные обновления.',
    use: 'Launch, годовая коммуникация, несколько аудиторий или объектов.',
    price: 'от 1,5 млн ₽',
  },
];

const approvalRisks = [
  {
    risk: 'Нет одного валидатора',
    effect:
      'Комментарии противоречат друг другу, версия возвращается на предыдущий этап.',
    control: 'До старта фиксируем ответственного за финальное содержание.',
  },
  {
    risk: 'Правки приходят частями',
    effect: 'Каждый новый пакет заново сдвигает монтаж и озвучку.',
    control: 'Собираем один консолидированный список на раунд.',
  },
  {
    risk: 'Меняется утверждённая логика',
    effect: 'Новые claims, правила или аудитория требуют новых сцен.',
    control:
      'Считаем это изменением объёма и отдельно оцениваем до производства.',
  },
  {
    risk: 'Нужна срочность или много версий',
    effect: 'Появляется параллельное производство и дополнительная проверка.',
    control:
      'Фиксируем форматы и дату в смете, срочность считаем отдельной строкой.',
  },
];

const procurementFaq = [
  {
    question:
      'Можно ли заключить договор с ООО и пройти проверку службы закупок?',
    answer:
      'Да. Работаем от ООО «АНИКС». Передаём карточку организации, реквизиты и стандартный комплект документов для проверки контрагента. Дополнительный перечень согласуем с закупкой до старта.',
  },
  {
    question: 'Работаете ли вы по NDA и с конфиденциальными материалами?',
    answer:
      'Да. NDA можно подписать до передачи брифа. В производство берём только согласованный набор материалов, а публикацию кейса обсуждаем отдельно.',
  },
  {
    question: 'Можно ли провести закупку через конкурс или тендер?',
    answer:
      'Да. Заполняем анкету поставщика и готовим техническую часть предложения. Для точного сравнения просим закрепить в ТЗ аудиторию, длительность, форматы, число итераций, порядок проверки и состав передаваемых материалов.',
  },
  {
    question: 'Как устроена оплата?',
    answer:
      'Для обычного проекта базовая схема — 70% предоплаты и 30% после приёмки мастер-материала. Для серии или кампании делим бюджет на этапы. Точная схема фиксируется в договоре и календарном плане.',
  },
  {
    question: 'Что входит в цену, а что оплачивается отдельно?',
    answer:
      'Входит согласованный объём сценария, визуальной разработки, производства, проверки и два раунда консолидированных правок. Новые сцены, другая аудитория, дополнительные форматы, срочность, съёмка, перевод, новая озвучка и передача рабочих исходников считаются отдельно, если их нет в смете.',
  },
  {
    question: 'Кому принадлежат права на готовые материалы?',
    answer:
      'Объём передаваемых прав, территории, срок и каналы использования фиксируем в договоре до начала работ. Передача или лицензирование готового материала действует после полной оплаты. Сторонние лицензии отмечаем отдельно.',
  },
  {
    question: 'Как проходят правки и приёмка?',
    answer:
      'В базовый объём входят два раунда консолидированных правок: по сценарию/раскадровке и по собранному материалу. Заказчик назначает одного ответственного, собирает комментарии всех подразделений и передаёт единый список.',
  },
  {
    question: 'Кто отвечает за медицинскую или HSE-корректность?',
    answer:
      'Anix переводит утверждённую логику в ясный визуальный материал и организует профильную проверку в согласованном объёме. Исходные claims, инструкции и финальное содержательное утверждение остаются у назначенного валидатора заказчика.',
  },
  {
    question: 'Как фиксируются сроки?',
    answer:
      'Календарь прикладываем к смете. Обычный ролик длительностью около минуты делаем за 7 дней от старта сценария до готового мастера, если материалы переданы, валидатор доступен, а обратная связь приходит в согласованные окна.',
  },
  {
    question: 'Что получает заказчик в конце?',
    answer:
      'Мастер-файл и все перечисленные в смете версии, титры или субтитры, а также материалы для согласованных каналов. Для HSE отдельно можем передать пакет для LMS, QR-страницу, тесты и таблицу ответов.',
  },
];

const guideContent = {
  medicine: {
    eyebrow: 'Цены / Pharma Launch System',
    title: 'Сколько стоит ролик для фармкомпании',
    lead: 'Цена зависит не только от хронометража. В смету входят научная логика, сценарий, медицинская анимация, согласование и версии для каналов, где материал будет работать.',
    accent: 'medicine',
    parentHref: '/medicine',
    parentLabel: 'Решения для фармы',
    facts: [
      ['от 400 тыс. ₽', 'пилот'],
      ['7 дней', 'обычный срок ролика 1 минута'],
      ['2 раунда', 'консолидированных правок'],
    ],
    tiers: [
      {
        label: 'Входной продукт',
        title: 'Пилот',
        price: 'от 400 тыс. ₽',
        text: 'Одна задача по одному препарату и одна основная аудитория.',
        items: [
          'смысловая и научная сессия',
          'сценарий и визуальная концепция',
          'мастер-ролик в согласованном формате',
          'одна точка медицинской проверки',
          'два раунда консолидированных правок',
        ],
      },
      {
        label: 'Основной продукт',
        title: 'Мастер-материал',
        price: 'от 700 тыс. ₽',
        text: 'Полноценный ролик для запуска, MoA, конференции или работы с врачами.',
        items: [
          'механизм действия или доказательная история',
          'детальная раскадровка и визуальная разработка',
          'ролик около одной минуты',
          'базовые версии под согласованные каналы',
          'научная проверка и управляемая приёмка',
        ],
      },
      {
        label: 'Масштабирование',
        title: 'Кампания или серия',
        price: 'от 1,5 млн ₽',
        text: 'Мастер-ролик и система адаптаций для нескольких касаний или продуктов.',
        items: [
          'серия под препарат или портфель',
          'версии для врачей, пациентов, конференций и digital',
          'единая визуальная система',
          'короткие ролики, карточки, слайды и обложки',
          'календарь выпуска и дальнейших обновлений',
        ],
      },
    ],
    scopeTitle: 'Что меняет стоимость фармролика',
    scopeItems: [
      'сложность механизма действия и число научных источников',
      'число аудиторий: врач, пациент, медпред, закупщик',
      '2D, 3D, персонажная анимация или их сочетание',
      'количество сцен, адаптаций, языков и форматов',
      'число medical/legal согласующих и скорость обратной связи',
    ],
    notIncluded: [
      'утверждение рекламных claims за заказчика',
      'медиа-размещение и закупка рекламного инвентаря',
      'съёмка, актёры, перевод и дополнительная озвучка без строки в смете',
      'рабочие исходники и новые версии, не перечисленные в договоре',
      'пересборка утверждённой концепции под новую аудиторию',
    ],
    examples: [
      { label: 'Кейс Авиандр', href: '/cases/aviandr' },
      { label: 'Кейс Мосфарма', href: '/cases/mosfarma' },
      { label: 'Кейс Hemotech AI', href: '/cases/hemotech-ai' },
    ],
  },
  hse: {
    eyebrow: 'Цены / HSE Onboarding Module',
    title: 'Сколько стоит видео по охране труда',
    lead: 'Стоимость складывается из сценария реального риска, производства роликов, вопросов для проверки, QR-доступа и подготовки материалов к вашей LMS или внутренней системе.',
    accent: 'hse',
    parentHref: '/hse',
    parentLabel: 'Решения по охране труда',
    facts: [
      ['от 350 тыс. ₽', 'пилот одного сценария'],
      ['5–7', 'коротких модулей в системе'],
      ['от 150 тыс. ₽/мес.', 'обновление библиотеки'],
    ],
    tiers: [
      {
        label: 'Входной продукт',
        title: 'Пилот одного сценария',
        price: 'от 350 тыс. ₽',
        text: 'Один объект, одна группа людей и один критический сценарий риска.',
        items: [
          'разбор правила и реальной ситуации',
          'сценарий «ошибка — последствие — действие»',
          'короткий мастер-ролик',
          'проверочные вопросы',
          'QR-доступ или передача файла',
        ],
      },
      {
        label: 'Основной продукт',
        title: 'Onboarding-модуль',
        price: 'от 900 тыс. ₽',
        text: '5–7 коротких модулей для новичков или подрядчиков на объекте.',
        items: [
          'объектно-адаптированные сценарии',
          'серия роликов в общей системе',
          'тестирование и логика прохождения',
          'QR-доступ или пакет для LMS',
          'два раунда консолидированных правок',
        ],
      },
      {
        label: 'Поддержка',
        title: 'Обновление библиотеки',
        price: 'от 150 тыс. ₽ в месяц',
        text: 'Регулярно обновляем действующие материалы при изменении инструкций и рисков.',
        items: [
          'актуализация текста и сцен',
          'новые микро-модули в существующем стиле',
          'адаптации под другие объекты и группы',
          'обновление тестов и QR-страниц',
          'плановая производственная очередь',
        ],
      },
    ],
    scopeTitle: 'Что меняет стоимость HSE-видео',
    scopeItems: [
      'число рисков, правил, объектов и категорий персонала',
      'нужны ли реальные локации, оборудование и СИЗ в кадре',
      'ролик, серия, тесты, QR-страница или интеграционный пакет',
      'число языков, форматов и версий для подрядчиков',
      'порядок HSE-проверки и количество согласующих',
    ],
    notIncluded: [
      'замена обязательного инструктажа и нормативных процедур',
      'ответственность за допуск сотрудника на объект',
      'разработка тяжёлой LMS или глубокой интеграции без отдельного ТЗ',
      'неограниченные правки и новые риски после утверждения сценария',
      'обещание снизить травматизм на заранее заданный процент',
    ],
    examples: [
      { label: 'Кейс Мултон Партнерс', href: '/cases/multon-partners' },
      { label: 'Открыть HSE-демо', href: '/hse/mvp' },
      { label: 'Все HSE-кейсы', href: '/cases/hse' },
    ],
  },
};

function Header() {
  return (
    <header className="pricing-header">
      <nav
        className="pricing-header-inner"
        aria-label="Навигация по ценам Anix"
      >
        <a className="pricing-logo" href="/" aria-label="Anix Studio">
          <img src={logo} alt="Anix" />
        </a>
        <div className="pricing-nav-links">
          <a href="/medicine">Фарма</a>
          <a href="/hse">Охрана труда</a>
          <a href="/stoimost">Все цены</a>
          <a href="/stoimost#procurement">Закупкам</a>
        </div>
        <a className="pricing-header-cta" href="#website-lead-form">
          Получить смету
        </a>
      </nav>
    </header>
  );
}

function PriceCard({ item }) {
  return (
    <article className="pricing-tier-card">
      <span>{item.label}</span>
      <h3>{item.title}</h3>
      <strong>{item.price}</strong>
      <p>{item.text}</p>
      <ul>
        {item.items.map((entry) => (
          <li key={entry}>
            <CheckCircle2 aria-hidden="true" />
            {entry}
          </li>
        ))}
      </ul>
    </article>
  );
}

function Facts({ items }) {
  return (
    <div className="pricing-facts">
      {items.map(([value, label]) => (
        <div key={value}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function FaqSection() {
  return (
    <section className="pricing-section pricing-procurement" id="procurement">
      <div className="pricing-container pricing-procurement-layout">
        <div className="pricing-sticky-copy">
          <p className="pricing-eyebrow">Procurement FAQ</p>
          <h2>Что нужно закупке до запуска проекта</h2>
          <p>
            Короткие ответы про договор, права, оплату, приёмку, NDA и границы
            сметы. Их можно сразу переслать закупщику или юристу.
          </p>
        </div>
        <div className="pricing-faq-list">
          {procurementFaq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function HubPage() {
  const medicine = guideContent.medicine;
  const hse = guideContent.hse;

  return (
    <main className="pricing-page" data-variant="hub">
      <Header />
      <section className="pricing-hero pricing-container">
        <div>
          <p className="pricing-eyebrow">Цены Anix / фарма и HSE</p>
          <h1>Сколько стоит ролик для фармы и охраны труда</h1>
          <p className="pricing-lead">
            Здесь не цена «за минуту анимации», а понятная лестница продуктов:
            пилот, основной материал, серия или кампания. Состав и границы сметы
            видны до старта.
          </p>
          <div className="pricing-actions">
            <a className="pricing-button pricing-button-primary" href="#guides">
              <WalletCards aria-hidden="true" />
              Сравнить цены
            </a>
            <a
              className="pricing-button pricing-button-secondary"
              href="#procurement"
            >
              <FileCheck2 aria-hidden="true" />
              Вопросы закупки
            </a>
          </div>
        </div>
        <Facts
          items={[
            ['от 350 тыс. ₽', 'самый компактный пилот'],
            ['7 дней', 'обычный срок ролика 1 минута'],
            ['2 раунда', 'консолидированных правок'],
          ]}
        />
      </section>

      <section className="pricing-section pricing-guides" id="guides">
        <div className="pricing-container">
          <div className="pricing-section-head">
            <p className="pricing-eyebrow">Два ценовых гайда</p>
            <h2>Сначала выберите бизнес-задачу</h2>
          </div>
          <div className="pricing-guide-grid">
            <article className="pricing-guide-card pricing-guide-card-medicine">
              <PillMark />
              <span>Pharma Launch System</span>
              <h3>Ролики для фармкомпаний</h3>
              <p>
                MoA, доказательная база, материалы для врачей, конференций и
                кампаний. Научная проверка встроена в процесс.
              </p>
              <div className="pricing-guide-levels">
                {medicine.tiers.map((tier) => (
                  <div key={tier.title}>
                    <span>{tier.title}</span>
                    <strong>{tier.price}</strong>
                  </div>
                ))}
              </div>
              <a href="/medicine/price">
                Открыть фарма-гайд <ArrowRight aria-hidden="true" />
              </a>
            </article>
            <article className="pricing-guide-card pricing-guide-card-hse">
              <ShieldCheck aria-hidden="true" />
              <span>HSE Onboarding Module</span>
              <h3>Видео по охране труда</h3>
              <p>
                Реальные риски, короткие модули, тестирование, QR/LMS и
                обновление материалов при изменении инструкций.
              </p>
              <div className="pricing-guide-levels">
                {hse.tiers.map((tier) => (
                  <div key={tier.title}>
                    <span>{tier.title}</span>
                    <strong>{tier.price}</strong>
                  </div>
                ))}
              </div>
              <a href="/hse/price">
                Открыть HSE-гайд <ArrowRight aria-hidden="true" />
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="pricing-section pricing-estimate">
        <div className="pricing-container">
          <div className="pricing-section-head pricing-section-head-row">
            <div>
              <p className="pricing-eyebrow">Состав сметы</p>
              <h2>За что именно платит заказчик</h2>
            </div>
            <p>
              Доля каждой строки меняется от задачи. Но сама структура остаётся
              прозрачной: смысл, производство, проверка и передача результата.
            </p>
          </div>
          <div className="pricing-estimate-grid">
            {estimateLines.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-section pricing-comparison">
        <div className="pricing-container">
          <div className="pricing-section-head">
            <p className="pricing-eyebrow">Масштаб</p>
            <h2>Ролик, серия и кампания — это разные покупки</h2>
          </div>
          <div className="pricing-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Формат</th>
                  <th>Объём</th>
                  <th>Когда нужен</th>
                  <th>Ориентир</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.name}>
                    <th>{row.name}</th>
                    <td>{row.scope}</td>
                    <td>{row.use}</td>
                    <td>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="pricing-section pricing-risks">
        <div className="pricing-container">
          <div className="pricing-section-head">
            <p className="pricing-eyebrow">Риски согласования</p>
            <h2>Что обычно сдвигает сроки и бюджет</h2>
          </div>
          <div className="pricing-risk-grid">
            {approvalRisks.map((item) => (
              <article key={item.risk}>
                <h3>{item.risk}</h3>
                <p>{item.effect}</p>
                <strong>{item.control}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}

function PillMark() {
  return <BadgeCheck aria-hidden="true" />;
}

function Timeline() {
  const steps = [
    ['День 1', 'Бриф, материалы, цель и назначенный валидатор.'],
    ['Дни 2–3', 'Сценарий, раскадровка и первый консолидированный раунд.'],
    ['Дни 4–6', 'Визуальное производство, анимация, монтаж и звук.'],
    ['День 7', 'Финальная проверка, второй раунд и готовый мастер.'],
  ];

  return (
    <section className="pricing-section pricing-timeline">
      <div className="pricing-container">
        <div className="pricing-section-head pricing-section-head-row">
          <div>
            <p className="pricing-eyebrow">Типовой срок</p>
            <h2>Одна минута — обычно за одну неделю</h2>
          </div>
          <p>
            Срок работает, когда исходные материалы готовы, один валидатор
            принимает решения, а комментарии приходят в согласованные окна.
            Сложный 3D, съёмка и многоступенчатый review считаются отдельным
            календарём.
          </p>
        </div>
        <ol>
          {steps.map(([day, text]) => (
            <li key={day}>
              <Clock3 aria-hidden="true" />
              <strong>{day}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function DetailPage({ guide }) {
  return (
    <main className="pricing-page" data-variant={guide.accent}>
      <Header />
      <section className="pricing-hero pricing-container">
        <div>
          <a className="pricing-back" href={guide.parentHref}>
            <ArrowLeft aria-hidden="true" /> {guide.parentLabel}
          </a>
          <p className="pricing-eyebrow">{guide.eyebrow}</p>
          <h1>{guide.title}</h1>
          <p className="pricing-lead">{guide.lead}</p>
          <div className="pricing-actions">
            <a className="pricing-button pricing-button-primary" href="#tiers">
              <WalletCards aria-hidden="true" />
              Посмотреть уровни
            </a>
            <a
              className="pricing-button pricing-button-secondary"
              href="#website-lead-form"
            >
              <MessageCircle aria-hidden="true" />
              Получить смету
            </a>
          </div>
        </div>
        <Facts items={guide.facts} />
      </section>

      <section className="pricing-section pricing-tiers" id="tiers">
        <div className="pricing-container">
          <div className="pricing-section-head">
            <p className="pricing-eyebrow">Три уровня</p>
            <h2>От ограниченного пилота к системе материалов</h2>
          </div>
          <div className="pricing-tier-grid">
            {guide.tiers.map((item) => (
              <PriceCard item={item} key={item.title} />
            ))}
          </div>
          <p className="pricing-price-note">
            Все цены — стартовые ориентиры, не публичная оферта. Точная сумма
            появляется после брифа и фиксируется в смете.
          </p>
        </div>
      </section>

      <Timeline />

      <section className="pricing-section pricing-scope">
        <div className="pricing-container pricing-scope-grid">
          <article>
            <Layers3 aria-hidden="true" />
            <p className="pricing-eyebrow">Переменные сметы</p>
            <h2>{guide.scopeTitle}</h2>
            <ul>
              {guide.scopeItems.map((item) => (
                <li key={item}>
                  <CheckCircle2 aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </article>
          <article>
            <ShieldCheck aria-hidden="true" />
            <p className="pricing-eyebrow">Границы</p>
            <h2>Что не входит автоматически</h2>
            <ul>
              {guide.notIncluded.map((item) => (
                <li key={item}>
                  <CheckCircle2 aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="pricing-section pricing-examples">
        <div className="pricing-container pricing-examples-layout">
          <div>
            <p className="pricing-eyebrow">Кейсы и демонстрация</p>
            <h2>Посмотрите, как выглядит результат</h2>
          </div>
          <nav aria-label="Примеры работ">
            {guide.examples.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label} <ArrowRight aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="pricing-section pricing-procurement-link">
        <div className="pricing-container">
          <a href="/stoimost#procurement">
            <FileCheck2 aria-hidden="true" />
            <span>
              <strong>Передать закупке</strong>
              Договор, NDA, оплата, права, правки и приёмка — в одном FAQ.
            </span>
            <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <FinalCta />
      <SiteFooter />
    </main>
  );
}

function FinalCta() {
  return (
    <section className="pricing-final">
      <div className="pricing-container pricing-final-inner">
        <div>
          <p className="pricing-eyebrow">Точная смета</p>
          <h2>Пришлите задачу, материалы и дедлайн</h2>
          <p>
            Вернёмся с вариантом пилота, составом работ, сроком и границами
            правок.
          </p>
        </div>
        <div className="pricing-actions">
          <a
            className="pricing-button pricing-button-light"
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle aria-hidden="true" /> Telegram
          </a>
          <a
            className="pricing-button pricing-button-dark-outline"
            href={emailUrl}
          >
            <Mail aria-hidden="true" /> Email
          </a>
        </div>
      </div>
    </section>
  );
}

export default function PricingGuidePage({ path = window.location.pathname }) {
  const normalizedPath = path.replace(/\/+$/, '') || '/';
  if (normalizedPath === '/medicine/price') {
    return <DetailPage guide={guideContent.medicine} />;
  }
  if (normalizedPath === '/hse/price') {
    return <DetailPage guide={guideContent.hse} />;
  }
  return <HubPage />;
}
