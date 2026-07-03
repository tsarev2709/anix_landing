import React, { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  Camera,
  ExternalLink,
  FileVideo,
  HardHat,
  Mail,
  MessageCircle,
  MonitorPlay,
  Pill,
  PlayCircle,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video,
  Workflow,
} from 'lucide-react';
import './App.css';
import './StudioLanding.css';
import logo from './images/logoanix.png';
import agrotechCaseImage from './images/cases/agrotech.webp';
import bondarchukCaseImage from './images/cases/bondarchuk.webp';
import borodinoCaseImage from './images/cases/borodino.webp';
import clappyCaseImage from './images/cases/clappy.webp';
import factoryDirectorCaseImage from './images/cases/factory-director.webp';
import hemoCaseImage from './images/cases/hemotech-ai.webp';
import koloboxCaseImage from './images/cases/kolobox.webp';
import littlePrinceCaseImage from './images/cases/little-prince.webp';
import mftiCaseImage from './images/cases/mfti-endowment.webp';
import mosfarmaCaseImage from './images/cases/mosfarma.webp';
import multonCaseImage from './images/cases/multon-partners.webp';
import startechCaseImage from './images/cases/startech.webp';
import tpesCaseImage from './images/cases/tpes.webp';
import yurrobotCaseImage from './images/cases/yurrobot.webp';

const CookieBanner = React.lazy(() => import('./components/CookieBanner'));

const telegramUrl = 'https://t.me/anix_helper';
const showreelUrl =
  'https://vkvideo.ru/video_ext.php?oid=-174933827&id=456239051&hash=8a2d51037c33a713&hd=3&autoplay=1';
const videoFolderUrl =
  'https://drive.google.com/drive/folders/1XzaVX00V5xukMZwEF9Vb_WCbco2M7erA';

const directions = [
  {
    title: 'Продажи сложных B2B-продуктов',
    text: 'Explainer-ролики, visual sales kits и контент для первого касания, демо, конференций и follow-up.',
    icon: Workflow,
    href: '#cases',
  },
  {
    title: 'Фарма, MedTech и biotech',
    text: 'Механизм действия, доверие врачей, маскоты препаратов, конференционные ролики и серии материалов.',
    icon: Pill,
    href: '/medicine/',
  },
  {
    title: 'Охрана труда и HSE',
    text: 'Видео-onboarding, Life Saving Rules, QR-сценарии, карточки, маскоты и кампании для сотрудников.',
    icon: HardHat,
    href: '/hse/',
  },
  {
    title: 'Режиссура событий и AI-ролики',
    text: 'Единая концепция мероприятия: съемка, звук, монтаж, экранный контент и AI-визуалы.',
    icon: Camera,
    href: '#rch',
  },
];

const proofMetrics = [
  { value: '15%+', label: 'средний рост конверсии в КП' },
  { value: 'x10', label: 'ERV у ролика фонда МФТИ' },
  { value: '30%', label: 'рост отклика в кейсе ТПЭС' },
  { value: '3-7 дней', label: 'для быстрых форматов' },
];

const services = [
  {
    title: 'Стратегия и драматургия',
    text: 'Разбираем воронку, аудитории, возражения и один ключевой сценарий, который должен стать понятным.',
    icon: Brain,
  },
  {
    title: 'AI-продакшен и анимация',
    text: 'Собираем визуальный язык, ролик, монтаж, звук, адаптации и материалы вокруг основного видео.',
    icon: Sparkles,
  },
  {
    title: 'Запуск в каналах',
    text: 'Готовим версии для сайта, конференции, рассылки, Telegram, экранов, QR-точек и презентаций.',
    icon: MonitorPlay,
  },
  {
    title: 'Метрики и повтор',
    text: 'Смотрим отклик, досмотры, охваты, лиды и усиливаем те связки, которые реально двигают сделку.',
    icon: BarChart3,
  },
];

const featuredCases = [
  {
    name: 'Clappy',
    area: 'B2B2C explainer',
    result: 'отклик вырос в несколько десятков раз',
    text: 'Сложный продукт для пользователей и производств превратили в короткую понятную историю. После запуска появились первые пилоты.',
    image: clappyCaseImage,
    href: 'https://drive.google.com/file/d/1EYWBYlhSgIK4Wd4F0nTKR1kQxYhXGc5j/view',
  },
  {
    name: 'Hemotech AI',
    area: 'MedTech / AI-диагностика',
    result: 'ролик стал частью бренда',
    text: 'Снизили недоверие к инновационному продукту через минималистичный ролик-визитку для врачей, клиник и конференций.',
    image: hemoCaseImage,
    href: 'https://drive.google.com/file/d/1Q6RQlNbAKBGugpo-MH1-_6omwwnmPQ8E/view',
  },
  {
    name: 'ТПЭС',
    area: 'Промышленный B2B',
    result: '+30% к отклику',
    text: 'Заменили 50-страничные презентации роликом, который быстро показывает проблему, решение и миссию энергоэффективности.',
    image: tpesCaseImage,
    href: 'https://drive.google.com/file/d/1BgJs_mKyvEVtDlWeaXGY9rmFjPKrTes5/view',
  },
  {
    name: 'Эндаумент-фонд МФТИ',
    area: 'PR и узнаваемость',
    result: 'Telegram x2, сайт x3, ERV x10',
    text: 'Перевели реальные фотографии МФТИ в теплую анимационную систему, которая стала инфоповодом и частью коммуникаций фонда.',
    image: mftiCaseImage,
    href: '#cases',
  },
  {
    name: 'Мосфарма',
    area: 'Фарма / ТВ-реклама',
    result: 'ролик прошел требования Первого канала',
    text: 'Сохранили бренд-персонажей, но сделали их живее и теплее, чтобы реклама препарата вызывала доверие.',
    image: mosfarmaCaseImage,
    href: 'https://drive.google.com/file/d/1Uw9e-ZFzg9AVK8NnoN_EHwfR0ZPvD_M0/view',
  },
  {
    name: 'Мултон Партнерс',
    area: 'HSE / Life Saving Rules',
    result: 'маскот и карточки стали системой',
    text: 'С нуля разработали персонажа кампании и визуальный формат, который делает правила охраны труда заметнее и живее.',
    image: multonCaseImage,
    href: '/hse/',
  },
];

const compactCases = [
  {
    name: 'Kolobox',
    text: 'Переупаковали спорное восприятие доставки излишков еды в дружелюбный, яркий образ.',
    image: koloboxCaseImage,
    href: 'https://drive.google.com/file/d/1eI5mODOu-mJ54QLPM_q0YuUP9bWjLN5k/view',
  },
  {
    name: 'ЮРРОБОТ',
    text: '15-секундный ролик для Telegram-чатов юристов с прогнозом сильной конверсии в заявку.',
    image: yurrobotCaseImage,
    href: 'https://drive.google.com/file/d/1bwItNtWXY-IfIrG910jVYGbsOH9BJukR/view',
  },
  {
    name: 'Little Prince',
    text: 'Имиджевый ролик-фантазия за один день, который собрал сотни отзывов от индустрии.',
    image: littlePrinceCaseImage,
    href: 'https://drive.google.com/file/d/1xIOgHxhhloGtBRtrnwp3xpV9AkShUNqT/view',
  },
  {
    name: 'АгроТех',
    text: 'Сюжетный ролик для хакатона, который победил в зрительском голосовании.',
    image: agrotechCaseImage,
    href: '#cases',
  },
  {
    name: 'Стартех',
    text: 'Переупаковка продукта под региональные B2B-компании и ролик для продаж.',
    image: startechCaseImage,
    href: '#cases',
  },
  {
    name: 'Бондарчук',
    text: 'За 4 часа собрали кинематографичный прототип сцены с актерскими лицами.',
    image: bondarchukCaseImage,
    href: 'https://drive.google.com/file/d/1wnRsoYIgio_MilkNFRlEBuTfgJfzx25d/view',
  },
  {
    name: 'Бородино',
    text: 'Исторически подготовленный ультрареалистичный ролик с вниманием к костюмам, быту и атмосфере.',
    image: borodinoCaseImage,
    href: 'https://drive.google.com/file/d/1d2iXB33lqPgG3Y0M4e216nzw2QYGmssP/view',
  },
  {
    name: 'Factory Director',
    text: 'Конференционный ролик на базе маскота, который стал визитной карточкой бренда.',
    image: factoryDirectorCaseImage,
    href: '#cases',
  },
];

const rchStack = [
  {
    title: 'Режиссерская концепция',
    text: 'Собрали событие как цельное высказывание, а не набор разрозненных роликов и экранов.',
    icon: FileVideo,
  },
  {
    title: 'Съемка и звук',
    text: 'Сняли материалы в высоком качестве, продумали звук, темп и ощущение присутствия.',
    icon: Video,
  },
  {
    title: 'Монтаж и AI-визуалы',
    text: 'Собрали ролики, монтажные связки и AI-части так, чтобы они работали на одну драматургию.',
    icon: Scissors,
  },
];

const process = [
  'Находим, где аудитория теряет смысл: в письме, демо, конференции, инструкции или внутренней коммуникации.',
  'Фиксируем одну управляемую задачу: продуктовый сценарий, препарат, правило безопасности, событие или PR-инфоповод.',
  'Пишем драматургию, визуальный язык и формат выдачи до продакшена, чтобы не раздувать scope.',
  'Производим ролик и адаптации: горизонталь, вертикаль, экран, рассылка, презентация, QR-страница или карточки.',
  'Помогаем встроить материал в канал и смотрим, где он дает отклик, лиды, досмотр или вовлечение.',
];

const partnerPages = [
  {
    title: 'ANIX Medicine',
    text: 'Отдельная страница для фармы, MedTech, biotech, врачей, препаратов, маскотов и visual sales kits.',
    href: '/medicine/',
    icon: Stethoscope,
  },
  {
    title: 'ANIX HSE',
    text: 'Отдельная страница для охраны труда: video-onboarding, LSR, QR, тесты, карточки и кампании.',
    href: '/hse/',
    icon: ShieldCheck,
  },
];

function DirectionCard({ item }) {
  const Icon = item.icon;

  return (
    <a className="sr-direction" href={item.href}>
      <Icon aria-hidden="true" />
      <span>{item.title}</span>
      <p>{item.text}</p>
      <ArrowRight aria-hidden="true" />
    </a>
  );
}

function FeaturedCase({ item }) {
  return (
    <article className="sr-case">
      <a className="sr-case-media" href={item.href}>
        <img src={item.image} alt={`Кейс ANIX: ${item.name}`} loading="lazy" />
      </a>
      <div className="sr-case-copy">
        <p>{item.area}</p>
        <h3>{item.name}</h3>
        <strong>{item.result}</strong>
        <span>{item.text}</span>
      </div>
    </article>
  );
}

function App() {
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);

  return (
    <main className="studio-refresh">
      <Helmet>
        <title>ANIX Studio - AI-видео, фарма, HSE и режиссура событий</title>
        <meta
          name="description"
          content="ANIX Studio создает AI-видео, ролики для сложных B2B-продуктов, фармы, MedTech, охраны труда, событий и внутренних коммуникаций."
        />
        <link rel="canonical" href="https://studio.anix-ai.pro/" />
        <meta property="og:title" content="ANIX Studio" />
        <meta
          property="og:description"
          content="Шоурил, кейсы и направления ANIX: sales enablement, фарма, MedTech, HSE и режиссура событий."
        />
        <meta property="og:url" content="https://studio.anix-ai.pro/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="sr-hero" id="top">
        <div className="sr-hero-shade" aria-hidden="true" />

        <nav className="sr-nav" aria-label="Навигация ANIX">
          <a className="sr-logo" href="#top" aria-label="ANIX Studio">
            <img src={logo} alt="ANIX" />
          </a>
          <div className="sr-nav-links">
            <a href="#cases">Кейсы</a>
            <a href="/medicine/">Medicine</a>
            <a href="/hse/">HSE</a>
            <a href="#contact">Контакты</a>
          </div>
        </nav>

        <div className="sr-hero-content">
          <p className="sr-eyebrow">
            AI video production / creative direction / sales enablement
          </p>
          <h1>ANIX Studio</h1>
          <p className="sr-hero-lead">
            Превращаем сложные продукты, препараты, правила безопасности и
            события в визуальные истории, которые быстро понимают клиенты,
            врачи, сотрудники, партнеры и участники мероприятий.
          </p>
          <div className="sr-actions">
            <a
              className="sr-button sr-button-primary"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Обсудить проект
            </a>
            <a
              className="sr-button sr-button-ghost"
              href={videoFolderUrl}
              target="_blank"
              rel="noreferrer"
            >
              <PlayCircle aria-hidden="true" />
              Все видео-кейсы
            </a>
          </div>
          <div className="sr-showreel-panel" aria-label="Главный showreel ANIX">
            <div className="sr-showreel-frame">
              {isShowreelOpen ? (
                <iframe
                  src={showreelUrl}
                  width="1280"
                  height="720"
                  title="ANIX showreel"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                  frameBorder="0"
                  allowFullScreen
                />
              ) : (
                <button
                  className="sr-showreel-poster"
                  type="button"
                  onClick={() => setIsShowreelOpen(true)}
                >
                  <PlayCircle aria-hidden="true" />
                  <span>Смотреть showreel</span>
                </button>
              )}
            </div>
            <div className="sr-showreel-caption">
              <span>Showreel</span>
              <p>
                Единый срез: AI-видео, анимация, маскоты, фарма, HSE и режиссура
                событий.
              </p>
            </div>
          </div>
          <div className="sr-proof-row" aria-label="Ключевые результаты">
            {proofMetrics.map((item) => (
              <div key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sr-direction-band" aria-label="Направления ANIX">
        <div className="sr-container sr-direction-grid">
          {directions.map((item) => (
            <DirectionCard item={item} key={item.title} />
          ))}
        </div>
      </section>

      <section className="sr-band sr-intro">
        <div className="sr-container sr-two-col">
          <div>
            <p className="sr-eyebrow">Что изменилось</p>
            <h2>ANIX больше не только про поддержку продаж</h2>
          </div>
          <div className="sr-rich-copy">
            <p>
              Продажи сложных продуктов остаются сильным ядром. Но портфель уже
              шире: фармкомпании, medtech, охрана труда, образовательные
              кампании, PR-инфоповоды, маскоты, кино-прототипы и режиссура
              событий.
            </p>
            <p>
              Поэтому новая главная страница показывает ANIX как студию новой
              анимации и AI-продакшена: от смысла и драматургии до ролика,
              адаптаций, запуска и измеримого эффекта.
            </p>
          </div>
        </div>
      </section>

      <section className="sr-band sr-services">
        <div className="sr-container">
          <div className="sr-section-head">
            <p className="sr-eyebrow">Какой продукт покупает клиент</p>
            <h2>Не просто красивое видео, а готовый visual asset под задачу</h2>
          </div>
          <div className="sr-service-grid">
            {services.map((item) => {
              const Icon = item.icon;
              return (
                <article className="sr-service" key={item.title}>
                  <Icon aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sr-band sr-cases" id="cases">
        <div className="sr-container">
          <div className="sr-section-head sr-section-head-row">
            <div>
              <p className="sr-eyebrow">Портфолио</p>
              <h2>Кейсы, где видео меняло понимание, доверие или отклик</h2>
            </div>
            <a
              className="sr-button sr-button-secondary"
              href={videoFolderUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink aria-hidden="true" />
              Папка с видео
            </a>
          </div>
          <div className="sr-case-grid">
            {featuredCases.map((item) => (
              <FeaturedCase item={item} key={item.name} />
            ))}
          </div>
          <div className="sr-compact-grid">
            {compactCases.map((item) => (
              <a className="sr-compact-case" href={item.href} key={item.name}>
                <span className="sr-compact-media">
                  <img
                    src={item.image}
                    alt={`Кейс ANIX: ${item.name}`}
                    loading="lazy"
                  />
                </span>
                <span className="sr-compact-title">{item.name}</span>
                <p>{item.text}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sr-band sr-rch" id="rch">
        <div className="sr-container sr-rch-layout">
          <div className="sr-rch-copy">
            <p className="sr-eyebrow">Необычный кейс</p>
            <h2>РЧК: мероприятие как единая режиссерская система</h2>
            <p>
              В этом проекте ANIX работал не как подрядчик на один ролик. Мы
              режиссировали событие: собрали общую концепцию, сняли материалы,
              продумали звук, монтаж, AI-ролики и экранный контент так, чтобы
              все элементы звучали как одна история.
            </p>
            <div className="sr-actions">
              <a
                className="sr-button sr-button-primary"
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle aria-hidden="true" />
                Обсудить событие
              </a>
              <a className="sr-button sr-button-ghost" href="#top">
                <PlayCircle aria-hidden="true" />
                Вернуться к шоурилу
              </a>
            </div>
          </div>
          <div className="sr-rch-stack">
            {rchStack.map((item) => {
              const Icon = item.icon;
              return (
                <article className="sr-rch-item" key={item.title}>
                  <Icon aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sr-band sr-pages">
        <div className="sr-container">
          <div className="sr-section-head">
            <p className="sr-eyebrow">Соседние страницы</p>
            <h2>Для новых направлений есть отдельные посадочные страницы</h2>
          </div>
          <div className="sr-page-grid">
            {partnerPages.map((item) => {
              const Icon = item.icon;
              return (
                <a className="sr-page-card" href={item.href} key={item.title}>
                  <Icon aria-hidden="true" />
                  <span>{item.title}</span>
                  <p>{item.text}</p>
                  <ArrowRight aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sr-band sr-process">
        <div className="sr-container sr-two-col">
          <div>
            <p className="sr-eyebrow">Процесс</p>
            <h2>
              Ограничиваем scope заранее, чтобы быстро доводить до результата
            </h2>
            <p className="sr-muted">
              Это особенно важно в фарме, HSE и корпоративных проектах: есть
              согласующие, эксперты, правила, каналы и риск бесконечных правок.
            </p>
          </div>
          <ol className="sr-process-list">
            {process.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sr-band sr-closing" id="contact">
        <div className="sr-container sr-closing-inner">
          <div>
            <p className="sr-eyebrow">Следующий шаг</p>
            <h2>Покажите нам сложный продукт, правило или событие</h2>
            <p>
              Мы вернемся с форматом: один ролик, серия, sales kit, HSE-пилот,
              pharma-визуал, маскот, конференционный ролик или режиссерская
              концепция мероприятия.
            </p>
          </div>
          <div className="sr-contact-actions">
            <a
              className="sr-button sr-button-primary"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Написать в Telegram
            </a>
            <a
              className="sr-button sr-button-secondary"
              href="mailto:anix.ai@yandex.ru"
            >
              <Mail aria-hidden="true" />
              anix.ai@yandex.ru
            </a>
          </div>
          <div className="sr-trust-list" aria-label="Признание ANIX">
            <span>
              <BadgeCheck aria-hidden="true" />
              Sber500
            </span>
            <span>
              <BadgeCheck aria-hidden="true" />
              RB Young Awards
            </span>
            <span>
              <BadgeCheck aria-hidden="true" />
              Новаторы Москвы
            </span>
            <span>
              <BadgeCheck aria-hidden="true" />
              выпускники МФТИ и бизнес-школы Сбера
            </span>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <CookieBanner />
      </Suspense>
    </main>
  );
}

export default App;
