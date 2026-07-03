import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  ClipboardList,
  LineChart,
  MessageCircle,
  PlayCircle,
  Presentation,
  ShieldCheck,
} from 'lucide-react';
import './HsePage.css';
import logo from '../images/logoanix.png';
import heroImage from '../images/hse/hse-hero.jpg';
import onboardingImage from '../images/hse/hse-onboarding.jpg';
import ruleTaraImage from '../images/hse/hse-rule-tara.jpg';
import ruleLabImage from '../images/hse/hse-rule-lab.jpg';
import ventilationImage from '../images/hse/hse-ventilation.jpg';

const telegramUrl = 'https://t.me/anix_helper';

const painPoints = [
  {
    title: 'Инструкции не пробивают внимание',
    text: 'Текстовые регламенты, плакаты и комиксы быстро превращаются в фон, особенно на площадках с высокой операционной нагрузкой.',
    icon: Activity,
  },
  {
    title: 'Правила объясняют заново',
    text: 'HSE-команда тратит часы на повторяющиеся объяснения для новичков, подрядчиков, сервисных бригад и временного персонала.',
    icon: ClipboardList,
  },
  {
    title: 'Нет повторных касаний',
    text: 'Один инструктаж редко переводит знание в поведение: правила нужно возвращать в поле внимания короткими понятными сценами.',
    icon: Brain,
  },
  {
    title: 'Сложно видеть вовлеченность',
    text: 'Без QR, тестов и простой аналитики не ясно, кто дошёл до материала, что посмотрел и какие темы требуют усиления.',
    icon: LineChart,
  },
];

const formats = [
  {
    title: 'Преддопусковой onboarding',
    text: '5-7 микро-роликов, тест, QR-доступ и подтверждение прохождения для одной категории людей на одном объекте.',
    icon: ShieldCheck,
  },
  {
    title: 'Life Saving Rules',
    text: 'Карточки, короткие анимации и истории по LSR, которые можно раскладывать по зонам риска и внутренним каналам.',
    icon: CheckCircle2,
  },
  {
    title: 'Пожарная безопасность',
    text: 'Сценарии про эвакуацию, огнетушители, вентиляцию, горячие работы и поведение в нештатной ситуации.',
    icon: Activity,
  },
  {
    title: 'Годовые HSE-кампании',
    text: 'Единая система тем, визуальный стандарт, календарь касаний, обновления под сезонные риски и реальные происшествия.',
    icon: Presentation,
  },
  {
    title: 'Сопроводительные материалы',
    text: 'Памятки, тексты для рассылок, страницы под QR, мини-тесты и короткие сообщения для экранов на объекте.',
    icon: ClipboardList,
  },
  {
    title: 'Драматургичная инфографика',
    text: 'Не таблицы ради отчёта, а сцены: ситуация, ошибка, последствие, правильное действие и причина, почему это важно.',
    icon: PlayCircle,
  },
];

const pilotSteps = [
  'Выбираем объект, категорию людей и 5-7 критических правил.',
  'Разбираем инструкции, LSR, действующие регламенты и реальные ситуации.',
  'Пишем короткие сценарии в логике: ситуация, ошибка, как правильно.',
  'Производим ролики, карточки, QR-страницу, тест и материалы для запуска.',
  'Передаём пакет, помогаем с размещением и собираем первые метрики.',
];

const cases = [
  {
    name: 'Мултон Партнерс',
    label: 'система HSE-коммуникации',
    text: 'Разработали визуальную систему для правил охраны труда: персонаж коммуникации, карточки, короткие анимации и сценарии касаний.',
  },
  {
    name: 'Юнипро',
    label: 'QR + мини-ролики по правилам',
    text: 'Собрали предложение по системе напоминаний: ролики, QR-коды, превью в зонах, повторные контакты и аналитика просмотров.',
  },
  {
    name: 'ANIX Studio',
    label: 'сложные B2B-коммуникации',
    text: 'Команда выпускников МФТИ и бизнес-школы Сбера, участники Sber500, RB Young Awards, конкурса "Новаторы Москвы" и ТОП-100 перспективных стартапов.',
  },
];

const lifeSavingRuleCards = [
  {
    code: 'LSR',
    title: 'Общая карточка Life Saving Rules',
    file: 'lsr-overview',
  },
  { code: 'A-01', title: 'Сценарий A-01', file: 'lsr-a-01' },
  { code: 'A-02', title: 'Сценарий A-02', file: 'lsr-a-02' },
  { code: 'A-03', title: 'Сценарий A-03', file: 'lsr-a-03' },
  { code: 'A-04', title: 'Сценарий A-04', file: 'lsr-a-04' },
  { code: 'LSR-05', title: 'Карточка LSR 05', file: 'lsr-05' },
  { code: 'LSR-06', title: 'Карточка LSR 06', file: 'lsr-06' },
  { code: 'LSR-07', title: 'Карточка LSR 07', file: 'lsr-07' },
  { code: 'LSR-08', title: 'Карточка LSR 08', file: 'lsr-08' },
  { code: 'LSR-09', title: 'Карточка LSR 09', file: 'lsr-09' },
  { code: 'LSR-10', title: 'Карточка LSR 10', file: 'lsr-10' },
  { code: 'LSR-11', title: 'Карточка LSR 11', file: 'lsr-11' },
  { code: 'LSR-12', title: 'Карточка LSR 12', file: 'lsr-12' },
  { code: 'LSR-13', title: 'Карточка LSR 13', file: 'lsr-13' },
  { code: 'LSR-14', title: 'Карточка LSR 14', file: 'lsr-14' },
];

const lifeSavingRuleAsset = (fileName, extension) =>
  `${process.env.PUBLIC_URL || ''}/hse/life-saving-rules/${fileName}.${extension}`;
export default function HsePage() {
  return (
    <main className="hse-page">
      <Helmet>
        <title>ANIX HSE - видео и кампании по охране труда</title>
        <meta
          name="description"
          content="ANIX создает преддопусковой видео-onboarding, серии креативов, карточки Life Saving Rules, QR-материалы и годовые кампании по охране труда для производственных компаний."
        />
        <link rel="canonical" href="https://studio.anix-ai.pro/hse" />
        <meta
          property="og:title"
          content="ANIX HSE - видео и кампании по охране труда"
        />
        <meta
          property="og:description"
          content="Переводим правила безопасности в понятные визуальные истории, микро-ролики, карточки, QR-страницы, тесты и кампании для HSE-команд."
        />
        <meta property="og:url" content="https://studio.anix-ai.pro/hse" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section
        className="hse-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(8, 13, 12, 0.96) 0%, rgba(8, 13, 12, 0.9) 38%, rgba(8, 13, 12, 0.34) 68%, rgba(8, 13, 12, 0.72) 100%), url(${heroImage})`,
        }}
      >
        <nav className="hse-nav" aria-label="ANIX HSE">
          <a className="hse-logo" href="/" aria-label="ANIX Studio">
            <img src={logo} alt="ANIX" />
          </a>
          <a className="hse-nav-link" href="#contact">
            Обсудить HSE-пилот
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </nav>

        <div className="hse-hero-content">
          <p className="hse-eyebrow">
            Охрана труда / HSE / Промышленная безопасность
          </p>
          <h1>
            Видео-onboarding и креативные кампании, которые переводят правила
            безопасности в поведение
          </h1>
          <p className="hse-lead">
            ANIX собирает серии материалов для отделов охраны труда:
            микро-ролики, карточки Life Saving Rules, QR-страницы, тесты,
            инфографику, тексты для внутренних каналов и годовые кампании под
            реальные риски объекта.
          </p>
          <div className="hse-hero-actions">
            <a
              className="hse-button hse-button-primary"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" size={20} />
              Разобрать пилот
            </a>
            <a className="hse-button hse-button-secondary" href="#formats">
              <PlayCircle aria-hidden="true" size={20} />
              Что можно собрать
            </a>
          </div>
        </div>
      </section>

      <section className="hse-signal-strip" aria-label="Формат пилота">
        <div>
          <span>01</span>
          <strong>Один объект</strong>
          <p>
            Фокусируемся на конкретной площадке, группе и ближайшем выходе
            людей.
          </p>
        </div>
        <div>
          <span>02</span>
          <strong>5-7 микро-роликов</strong>
          <p>Короткие сцены по критическим правилам вместо длинной лекции.</p>
        </div>
        <div>
          <span>03</span>
          <strong>QR + тест + отчёт</strong>
          <p>
            Простой доступ, проверка усвоения и базовая аналитика прохождения.
          </p>
        </div>
      </section>

      <section className="hse-band hse-band-muted">
        <div className="hse-section-head">
          <p className="hse-eyebrow">Почему это нужно HSE-команде</p>
          <h2>
            Правила безопасности проигрывают не потому, что они неважные. Их
            просто плохо видят, плохо помнят и редко проживают как ситуацию.
          </h2>
        </div>
        <div className="hse-grid hse-pain-grid">
          {painPoints.map(({ title, text, icon: Icon }) => (
            <article className="hse-card" key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hse-showcase">
        <div className="hse-showcase-copy">
          <p className="hse-eyebrow">От инструкции к сцене</p>
          <h2>
            Мы показываем не пункт регламента, а момент, где человек может
            ошибиться.
          </h2>
          <p>
            Сотрудник видит конкретную ситуацию: что он собирается сделать, где
            появляется риск, чем это заканчивается и какое действие нужно
            выбрать. Так техника безопасности становится не абстрактной нормой,
            а узнаваемым рабочим эпизодом.
          </p>
          <ul className="hse-check-list">
            <li>
              <CheckCircle2 aria-hidden="true" /> сценарии под производство,
              склад, лабораторию, ремонт, подрядчиков
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" /> визуальные акценты на
              опасность, запрет и правильное действие
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" /> версии под телефон, экраны,
              презентации, LMS и внутренние каналы
            </li>
          </ul>
        </div>
        <div className="hse-image-grid" aria-label="Примеры HSE-визуалов ANIX">
          <img
            className="hse-image-large"
            src={onboardingImage}
            alt="Видео-onboarding по безопасности на планшете"
            loading="lazy"
          />
          <img
            src={ruleTaraImage}
            alt="Анимационная сцена с правилом безопасной работы"
            loading="lazy"
          />
          <img
            src={ruleLabImage}
            alt="Анимационная сцена проверки состава на производстве"
            loading="lazy"
          />
          <img
            src={ventilationImage}
            alt="Анимационная сцена по вентиляции и пожарной безопасности"
            loading="lazy"
          />
        </div>
      </section>

      <section className="hse-band hse-lsr-module" id="life-saving-rules">
        <div className="hse-section-head hse-lsr-head">
          <p className="hse-eyebrow">Life Saving Rules</p>
          <h2>Реальные карточки LSR уже подключены к веб-модулю</h2>
          <p>
            Короткие анимационные карточки сжаты под веб, лежат в
            public/hse/life-saving-rules и загружаются лениво через постеры.
            Пользователь видит весь набор правил, а само видео стартует только
            по запросу.
          </p>
        </div>
        <div className="hse-lsr-grid" aria-label="Карточки Life Saving Rules">
          {lifeSavingRuleCards.map((card, index) => (
            <article
              className={`hse-lsr-card ${index === 0 ? 'hse-lsr-card-featured' : ''}`}
              key={card.file}
            >
              <div className="hse-lsr-media">
                <video
                  src={lifeSavingRuleAsset(card.file, 'mp4')}
                  poster={lifeSavingRuleAsset(card.file, 'webp')}
                  controls
                  muted
                  playsInline
                  preload="none"
                  aria-label={`${card.title}: ${card.code}`}
                />
              </div>
              <div className="hse-lsr-card-copy">
                <span>{card.code}</span>
                <h3>{card.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="hse-band" id="formats">
        <div className="hse-section-head">
          <p className="hse-eyebrow">Что можем собрать</p>
          <h2>От преддопускового модуля до годовой кампании по охране труда</h2>
        </div>
        <div className="hse-grid hse-format-grid">
          {formats.map(({ title, text, icon: Icon }) => (
            <article className="hse-card hse-format-card" key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hse-band hse-pilot">
        <div className="hse-pilot-copy">
          <p className="hse-eyebrow">Первый продукт</p>
          <h2>
            Пилот без тяжёлой интеграции: быстро проверить пользу на одном
            объекте
          </h2>
          <p>
            Стартуем с ограниченного модуля, который можно купить и запустить
            без перестройки всей системы обучения. Обязательные процедуры,
            нормативная ответственность и утверждение содержания остаются в
            контуре клиента; ANIX отвечает за драматургию, визуальный язык,
            производство и упаковку материалов.
          </p>
        </div>
        <ol className="hse-process-list">
          {pilotSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="hse-band hse-proof">
        <div className="hse-section-head">
          <p className="hse-eyebrow">Опыт и доверие</p>
          <h2>Мы уже продавали HSE-коммуникации и сложные B2B-визуалы</h2>
        </div>
        <div className="hse-grid hse-case-grid">
          {cases.map((item) => (
            <article className="hse-case" key={item.name}>
              <span>{item.label}</span>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="hse-recognition" aria-label="Признание ANIX">
          <span>Sber500</span>
          <span>RB Young Awards</span>
          <span>Новаторы Москвы</span>
          <span>ТОП-100 перспективных стартапов</span>
          <span>МФТИ</span>
        </div>
      </section>

      <section className="hse-expert-band">
        <div>
          <ShieldCheck aria-hidden="true" />
          <h2>Экспертность по охране труда встроена в процесс</h2>
          <p>
            Мы работаем вместе с HSE-службой клиента и профильными экспертами:
            проверяем смысл, не берём на себя нормативную ответственность за
            допуск, фиксируем правила правок и не превращаем пилот в бесконечное
            согласование.
          </p>
        </div>
        <ul>
          <li>содержание предоставляет и утверждает служба клиента</li>
          <li>внешний эксперт может рецензировать сценарии и формулировки</li>
          <li>правки, форматы и объём работ ограничены заранее</li>
          <li>масштабирование идёт после измеримого пилота</li>
        </ul>
      </section>

      <section className="hse-final" id="contact">
        <div className="hse-final-inner">
          <p className="hse-eyebrow">Следующий шаг</p>
          <h2>
            Выберите одну группу людей и один риск. Мы покажем, как из этого
            собрать HSE-пилот.
          </h2>
          <p>
            Напишите, что сейчас сильнее всего нагружает вашу HSE-команду:
            подрядчики, новые сотрудники, пожарная безопасность, LSR, повторные
            нарушения, склад, лаборатория или сезонная кампания. Мы предложим
            формат, состав материалов и первый сценарий.
          </p>
          <a
            className="hse-button hse-button-primary"
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle aria-hidden="true" size={20} />
            Написать в Telegram
          </a>
        </div>
      </section>
    </main>
  );
}
