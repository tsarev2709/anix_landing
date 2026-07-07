import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  ExternalLink,
  HardHat,
  Mail,
  MessageCircle,
  MonitorPlay,
  Pill,
  PlayCircle,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Video,
  Workflow,
} from 'lucide-react';
import SiteFooter from './SiteFooter';
import WandOverlay from './WandOverlay';
import logo from '../images/logoanix.png';
import agrotechCaseImage from '../images/cases/agrotech.webp';
import bondarchukCaseImage from '../images/cases/bondarchuk.webp';
import borodinoCaseImage from '../images/cases/borodino.webp';
import clappyCaseImage from '../images/cases/clappy.webp';
import factoryDirectorCaseImage from '../images/cases/factory-director.webp';
import hemoCaseImage from '../images/cases/hemotech-ai.webp';
import koloboxCaseImage from '../images/cases/kolobox.webp';
import littlePrinceCaseImage from '../images/cases/little-prince.webp';
import mftiCaseImage from '../images/cases/mfti-endowment.webp';
import mosfarmaCaseImage from '../images/cases/mosfarma.webp';
import multonCaseImage from '../images/cases/multon-partners.webp';
import startechCaseImage from '../images/cases/startech.webp';
import tpesCaseImage from '../images/cases/tpes.webp';
import yurrobotCaseImage from '../images/cases/yurrobot.webp';
import visualThree from '../images/3.png';
import '../Design1TestPage.css';

const telegramUrl = 'https://t.me/anix_helper';
const showreelUrl =
  'https://vkvideo.ru/video_ext.php?oid=-174933827&id=456239051&hash=8a2d51037c33a713&hd=3&autoplay=1';
const videoFolderUrl =
  'https://drive.google.com/drive/folders/1XzaVX00V5xukMZwEF9Vb_WCbco2M7erA';

const heroLinks = {
  telegram: telegramUrl,
  cases: '#cases',
  videoFolder: videoFolderUrl,
  email: 'mailto:anix.ai@yandex.ru',
};

const metrics = [
  {
    value: '15%+',
    label: 'средний рост конверсии в КП',
    note: 'когда вместо длинного объяснения появляется нормальная визуальная история',
  },
  {
    value: 'x10',
    label: 'x10 рост вовлечения у ролика фонда МФТИ',
    note: 'теплая анимация сработала как инфоповод, а не просто как красивый файл',
  },
  {
    value: '+30%',
    label: 'к переходам и откликам в кейсе ТПЭС',
    note: 'потому что проблему стало видно быстрее, чем ее можно объяснить на 50 слайдах',
  },
  {
    value: '3–7 дней',
    label: 'для быстрых форматов',
    note: 'когда нужно не строить вечность, а быстро показать идею рынку или команде',
  },
];

const services = [
  {
    title: 'Объясняющие ролики для B2B',
    text: 'Когда продукт сложно объяснить с первого раза. Собираем историю, где проблема, решение и польза считываются быстро.',
    icon: Workflow,
  },
  {
    title: 'Фарма, медтех и медицина',
    text: 'Механизмы действия, доказательная база, маскоты препаратов, материалы для врачей и конференций.',
    icon: Pill,
  },
  {
    title: 'Охрана труда и HSE',
    text: 'Правила безопасности, жизненно важные правила, страницы по QR-коду, карточки и кампании для сотрудников. Чтобы человек заметил риск.',
    icon: HardHat,
  },
  {
    title: 'События и AI-ролики',
    text: 'Экранный контент, ролики, монтажные связки, AI-визуалы и режиссура события. Не набор красивостей, а одна история, которая держит зал.',
    icon: Camera,
  },
];

const mainCases = [
  {
    title: 'Clappy',
    category: 'B2B2C explainer',
    result: 'Отклик вырос в несколько десятков раз',
    text: 'До ролика продукт приходилось долго объяснять. Мы собрали короткую историю, где человек быстрее понимает, что происходит, зачем это нужно и почему этим вообще стоит пользоваться.',
    tags: 'explainer / продукт / первые пилоты',
    image: clappyCaseImage,
    href: 'https://drive.google.com/file/d/1EYWBYlhSgIK4Wd4F0nTKR1kQxYhXGc5j/view',
  },
  {
    title: 'Hemotech AI',
    category: 'MedTech / AI-диагностика',
    result: 'Ролик стал частью бренда',
    text: 'Задача была тонкая: показать инновационный медицинский продукт спокойно, без фейерверков и тревожного AI-пафоса. Чтобы врачи, клиники и партнеры не напрягались, а понимали.',
    tags: 'medtech / врачи / доверие',
    image: hemoCaseImage,
    href: 'https://drive.google.com/file/d/1Q6RQlNbAKBGugpo-MH1-_6omwwnmPQ8E/view',
  },
  {
    title: 'ТПЭС',
    category: 'Промышленный B2B',
    result: '+30% к отклику',
    text: 'Вместо 50-страничной презентации сделали ролик, который быстрее показывает проблему реактивных потерь, решение и миссию энергоэффективности. Иногда рынок надо не убеждать дольше, а объяснять яснее.',
    tags: 'промышленность / продажи / конференция',
    image: tpesCaseImage,
    href: 'https://drive.google.com/file/d/1BgJs_mKyvEVtDlWeaXGY9rmFjPKrTes5/view',
  },
  {
    title: 'Эндаумент-фонд МФТИ',
    category: 'PR и узнаваемость',
    result: 'Telegram x2, сайт x3, ERV x10',
    text: 'Мы взяли реальные фотографии МФТИ и перевели их в теплую анимационную систему. Получился не просто ролик, а инфоповод, который люди захотели пересылать.',
    tags: 'PR / анимационная система / охваты',
    image: mftiCaseImage,
    href: '#cases',
  },
  {
    title: 'Мосфарма',
    category: 'Фарма / ТВ-реклама',
    result: 'Ролик прошел требования Первого канала',
    text: 'Сохранили бренд-персонажей, но сделали их живее и теплее. В фарме доверие часто начинается с маленькой штуки: персонаж не должен выглядеть как пластиковый заложник брендбука.',
    tags: 'фарма / персонажи / ТВ',
    image: mosfarmaCaseImage,
    href: 'https://drive.google.com/file/d/1Uw9e-ZFzg9AVK8NnoN_EHwfR0ZPvD_M0/view',
  },
  {
    title: 'Мултон Партнерс',
    category: 'HSE / жизненно важные правила',
    result: 'Маскот и карточки стали системой',
    text: 'С нуля разработали персонажа кампании и визуальный формат для правил охраны труда. Чтобы безопасность не выглядела как скучный PDF, который все открыли, закрыли и забыли.',
    tags: 'HSE / маскот / карточки',
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
    text: '15 секунд для узких Telegram-чатов юристов: боль, польза и переход к заявке без лишней лекции.',
    image: yurrobotCaseImage,
    href: 'https://drive.google.com/file/d/1bwItNtWXY-IfIrG910jVYGbsOH9BJukR/view',
  },
  {
    name: 'Маленький принц',
    text: 'Имиджевый ролик-фантазия за один день, который попал в эмоцию профессионального сообщества.',
    image: littlePrinceCaseImage,
    href: 'https://drive.google.com/file/d/1xIOgHxhhloGtBRtrnwp3xpV9AkShUNqT/view',
  },
  {
    name: 'АгроТех',
    text: 'История с героиней, где агротех выглядит как сфера будущего, а не сухая отрасль из отчета.',
    image: agrotechCaseImage,
    href: '#cases',
  },
  {
    name: 'Стартех',
    text: 'Переупаковка продукта под региональные B2B-компании и ролик, который говорит с рынком проще.',
    image: startechCaseImage,
    href: '#cases',
  },
  {
    name: 'Бондарчук',
    text: 'За 4 часа собрали кинематографичный прототип сцены с актерскими лицами и нужной атмосферой.',
    image: bondarchukCaseImage,
    href: 'https://drive.google.com/file/d/1wnRsoYIgio_MilkNFRlEBuTfgJfzx25d/view',
  },
  {
    name: 'Бородино',
    text: 'Исторически подготовленный ролик с вниманием к форме, оружию, среде, звуку и масштабу битвы.',
    image: borodinoCaseImage,
    href: 'https://drive.google.com/file/d/1d2iXB33lqPgG3Y0M4e216nzw2QYGmssP/view',
  },
  {
    name: 'Factory Director',
    text: 'Конференционный ролик на базе маскота, который стал рабочей визитной карточкой бренда.',
    image: factoryDirectorCaseImage,
    href: '#cases',
  },
];

const reasons = [
  {
    number: '01',
    title: 'Сначала цель',
    text: 'Разбираемся, кто будет смотреть ролик, где теряется внимание и какую мысль человек должен унести.',
  },
  {
    number: '02',
    title: 'Потом драматургия',
    text: 'Даже у промышленного продукта или правила безопасности есть герой, конфликт и момент узнавания. Если их найти, человек смотрит внимательнее.',
  },
  {
    number: '03',
    title: 'Потом производство',
    text: 'Инструменты ускоряют производство, но не отменяют вкус, режиссуру, монтаж, научную проверку и ответственность за результат.',
  },
];

const processSteps = [
  {
    title: 'Собираем задачу',
    text: 'Где сейчас ломается понимание: в продаже, демо, инструкции, конференции, обучении или PR.',
  },
  {
    title: 'Фиксируем аудиторию',
    text: 'Кто будет смотреть: врач, сотрудник завода, закупщик, инвестор, клиент, участник события или внутренняя команда.',
  },
  {
    title: 'Пишем сценарий',
    text: 'Не просто текст диктора, а маршрут мысли: что человек видит, чувствует, понимает и делает дальше.',
  },
  {
    title: 'Собираем стиль и черновой ролик',
    text: 'Показываем визуальный язык, кадры, ритм и логику ролика до большого производства.',
  },
  {
    title: 'Производим',
    text: 'Создаём кадры, анимируем, монтируем, собираем звук и доводим до версии, которую уже можно показывать.',
  },
  {
    title: 'Адаптируем и запускаем',
    text: 'Горизонталь, вертикаль, экран, презентация, QR-страница, карточки, Telegram, сайт или конференция.',
  },
];

const directions = [
  {
    title: 'B2B и продажи',
    text: 'Объясняющие ролики, демо, конференции, презентационные видео и материалы после первого касания.',
    href: '#cases',
    icon: Workflow,
  },
  {
    title: 'Medicine',
    text: 'Фарма, медтех, препараты, механизмы действия, врачи, маскоты и визуальные материалы.',
    href: '/medicine/',
    icon: Stethoscope,
  },
  {
    title: 'HSE',
    text: 'Охрана труда, жизненно важные правила, страницы по QR-коду, карточки, маскоты и кампании для сотрудников.',
    href: '/hse/',
    icon: ShieldCheck,
  },
  {
    title: 'Команда и CEO',
    text: 'Кто собирает режиссуру, физтеховскую точность и бизнес-процесс внутри ANIX.',
    href: '/ceo/',
    icon: UserRound,
  },
  {
    title: 'События',
    text: 'Экранный контент, съемка, звук, монтаж, AI-визуалы и режиссура события как единой истории.',
    href: '#contact',
    icon: Video,
  },
];

const trustChips = [
  'Sber500',
  'RB Young Awards',
  'Новаторы Москвы',
  'выпускники МФТИ',
  'бизнес-школа Сбера',
  'кейсы для фармы, охраны труда, медтеха и промышленного B2B',
];

const navigationLinks = [
  { label: 'Кейсы', href: '#cases' },
  { label: 'Что делаем', href: '#services' },
  { label: 'Medicine', href: '/medicine/' },
  { label: 'HSE', href: '/hse/' },
  { label: 'CEO', href: '/ceo/' },
  { label: 'Процесс', href: '#process' },
  { label: 'Видео', href: '#video' },
  { label: 'Контакты', href: '#contact' },
];

const isExternalHref = (href) => /^https?:\/\//.test(href);
const wandTarget = (name) => (name ? { 'data-wand-target': name } : {});

function SmartLink({ href, className, children, ariaLabel }) {
  const isExternal = isExternalHref(href);

  return (
    <a
      className={className}
      href={href}
      aria-label={ariaLabel}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

function MetricCard({ item, wandTargetName }) {
  return (
    <article className="d1-metric-card" {...wandTarget(wandTargetName)}>
      <strong>{item.value}</strong>
      <h3>{item.label}</h3>
      <p>{item.note}</p>
    </article>
  );
}

function ServiceCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="d1-service-card">
      <div className="d1-icon-wrap">
        <Icon aria-hidden="true" />
      </div>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  );
}

function CaseCard({ item, wandTargetName }) {
  return (
    <article className="d1-case-card" {...wandTarget(wandTargetName)}>
      <SmartLink
        className="d1-case-image"
        href={item.href}
        ariaLabel={`Смотреть кейс ${item.title}`}
      >
        <img src={item.image} alt={`Кейс ANIX: ${item.title}`} loading="lazy" />
      </SmartLink>
      <div className="d1-case-body">
        <span className="d1-case-category">{item.category}</span>
        <h3>{item.title}</h3>
        <strong>{item.result}</strong>
        <p>{item.text}</p>
        <div className="d1-case-foot">
          <span>{item.tags}</span>
          <SmartLink className="d1-text-link" href={item.href}>
            Смотреть кейс
            <ArrowRight aria-hidden="true" />
          </SmartLink>
        </div>
      </div>
    </article>
  );
}

function CompactCaseCard({ item }) {
  return (
    <SmartLink
      className="d1-compact-case"
      href={item.href}
      ariaLabel={`Смотреть видео ${item.name}`}
    >
      <div className="d1-compact-media">
        <img src={item.image} alt={`Кейс ANIX: ${item.name}`} loading="lazy" />
      </div>
      <span className="d1-compact-title">{item.name}</span>
      <p>{item.text}</p>
      <ArrowRight aria-hidden="true" />
    </SmartLink>
  );
}

function ReasonCard({ item, wandTargetName }) {
  return (
    <article className="d1-reason-card" {...wandTarget(wandTargetName)}>
      <span>{item.number}</span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  );
}

function ProcessStep({ item, index }) {
  return (
    <li className="d1-process-step">
      <span>{String(index + 1).padStart(2, '0')}</span>
      <div>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
    </li>
  );
}

function DirectionCard({ item }) {
  const Icon = item.icon;

  return (
    <SmartLink className="d1-direction-card" href={item.href}>
      <div className="d1-icon-wrap d1-icon-wrap-light">
        <Icon aria-hidden="true" />
      </div>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      <ArrowRight aria-hidden="true" />
    </SmartLink>
  );
}

function VideoShowreel({ variant = 'hero', wandTargetName }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`d1-showreel d1-showreel-${variant}`}>
      <div className="d1-showreel-frame" {...wandTarget(wandTargetName)}>
        {isOpen ? (
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
            className="d1-showreel-poster"
            type="button"
            onClick={() => setIsOpen(true)}
          >
            <img src={visualThree} alt="Постер showreel ANIX" />
            <span className="d1-play">
              <PlayCircle aria-hidden="true" />
            </span>
            <span className="d1-showreel-label">Смотреть showreel</span>
            <span className="d1-showreel-tag">
              AI-видео / фарма / HSE / маскоты / события
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function Design1TestPage({ wandTest = false }) {
  return (
    <main className={`design1-test${wandTest ? ' design1-wand-test' : ''}`}>
      <Helmet>
        <title>
          {wandTest
            ? 'ANIX Studio - hero animation test'
            : 'ANIX Studio - ролики, маскоты и визуальные системы для сложных продуктов'}
        </title>
        <meta
          name="description"
          content="ANIX Studio делает AI-видео, анимацию, маскотов, visual sales kits и обучающие материалы для B2B, фармы, MedTech, HSE и событий."
        />
        <link
          rel="canonical"
          href={
            wandTest
              ? 'https://studio.anix-ai.pro/hero_animation_test'
              : 'https://studio.anix-ai.pro/'
          }
        />
        <meta
          property="og:title"
          content="ANIX Studio — дизайн-тест лендинга"
        />
        <meta
          property="og:description"
          content="Кейсы, showreel, метрики и направления ANIX в новой редакторской структуре."
        />
        <meta
          property="og:url"
          content={
            wandTest
              ? 'https://studio.anix-ai.pro/hero_animation_test'
              : 'https://studio.anix-ai.pro/'
          }
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <header className="d1-header">
        <nav
          className="d1-header-inner"
          aria-label="Навигация тестовой страницы ANIX"
        >
          <a className="d1-logo" href="#top" aria-label="ANIX Studio">
            <img src={logo} alt="ANIX" />
          </a>
          <div className="d1-nav-links">
            {navigationLinks.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <a
            className="d1-header-cta"
            href={heroLinks.telegram}
            target="_blank"
            rel="noreferrer"
          >
            <span className="d1-desktop-only">Обсудить проект</span>
            <span className="d1-mobile-only">Написать</span>
          </a>
        </nav>
      </header>

      <section className="d1-hero d1-container" id="top">
        <div className="d1-hero-copy">
          <p className="d1-eyebrow">
            ANIX / AI-видео, анимация и сложные продукты
          </p>
          <h1>Делаем сложное интересным</h1>
                    <p className="d1-lead">
            Сначала понимание. Потом восхищение. ANIX помогает вовлекать в
            сложные продукты, правила и идеи через 2D-анимацию, историю и ясную
            драматургию.
          </p>
          <p className="d1-microcopy">
            Разбираемся, кто будет смотреть ролик, ищем, где теряется внимание,
            строим вовлекающую историю, подбираем визуальный формат и связываем
            материал с бизнес-задачей.
          </p>
          <div className="d1-hero-actions">
            <a
              className="d1-button d1-button-primary"
              href={heroLinks.telegram}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Обсудить проект
            </a>
            <a className="d1-button d1-button-secondary" href={heroLinks.cases}>
              Смотреть кейсы
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <aside className="d1-hero-visual" aria-label="Showreel ANIX">
          <VideoShowreel wandTargetName={wandTest ? 'hero-video' : undefined} />
          <div className="d1-hero-note">
            <MonitorPlay aria-hidden="true" />
            <span>
              Showreel: AI-видео, фарма, HSE, маскоты, события и короткие
              визуальные истории для сложных продуктов.
            </span>
          </div>
        </aside>
      </section>

      <section className="d1-section d1-proof" id="video">
        <div className="d1-container">
          <div className="d1-proof-layout">
            <div>
              <p className="d1-eyebrow">Showreel + цифры</p>
              <h2>
                Сначала человек должен{' '}
                <span
                  className={wandTest ? 'd1-wand-word' : undefined}
                  {...wandTarget(wandTest ? 'understand-word' : undefined)}
                >
                  понять
                </span>{', потом уже '}
                <span
                  className={wandTest ? 'd1-wand-word' : undefined}
                  {...wandTarget(wandTest ? 'admire-word' : undefined)}
                >
                  восхищаться
                </span>
              </h2>
            </div>
            <p className="d1-section-lead">
              Хороший ролик не просит у зрителя лишнюю минуту на расшифровку. Он
              быстро собирает контекст, показывает пользу и оставляет ощущение,
              что продуктом занимаются взрослые люди.
            </p>
          </div>
          <div className="d1-metrics-grid">
            {metrics.map((item, index) => (
              <MetricCard
                item={item}
                key={item.value}
                wandTargetName={
                  wandTest && index < 3 ? `metric-${index + 1}` : undefined
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="d1-section" id="services">
        <div className="d1-container">
          <div className="d1-section-head">
            <p className="d1-eyebrow">Что делаем</p>
                        <h2>Перерабатываем сложное в интересное</h2>
            <p className="d1-section-lead">
              Сначала ищем, где ломается внимание. Потом выбираем формат: ролик,
              серия карточек, страница, визуальная система, презентационное видео
              или экранный контент для события.
            </p>
          </div>
          <div className="d1-service-grid">
            {services.map((item) => (
              <ServiceCard item={item} key={item.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="d1-section d1-cases" id="cases">
        <div className="d1-container">
          <div className="d1-section-head d1-section-head-row">
            <div>
              <p className="d1-eyebrow">Наши кейсы</p>
              <h2>
                Видео, которые уже работали в продажах, PR, фарме, HSE и на
                событиях
              </h2>
            </div>
            <p className="d1-section-lead">
              Здесь важно оставить не только красоту. Оставить результат. Цифры,
              контекст, ссылку на видео и ощущение, что за каждым роликом была
              задача, а не просто желание сделать вау.
            </p>
          </div>
          <div
            className="d1-case-grid"
            {...wandTarget(wandTest ? 'case-card-grid' : undefined)}
          >
            {mainCases.map((item, index) => (
              <CaseCard
                item={item}
                key={item.title}
                wandTargetName={
                  wandTest && index === 1 ? 'case-card-main-right' : undefined
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="d1-section d1-video-shelf">
        <div className="d1-container">
          <div className="d1-section-head d1-section-head-row">
            <div>
              <p className="d1-eyebrow">Еще видео</p>
              <h2 {...wandTarget(wandTest ? 'small-cases-title' : undefined)}>
                Не все надо превращать в огромный кейс. Иногда достаточно быстро
                показать, что мы умеем
              </h2>
            </div>
            <a
              className="d1-button d1-button-primary"
              href={heroLinks.videoFolder}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink aria-hidden="true" />
              Открыть папку со всеми видео
            </a>
          </div>
          <div className="d1-compact-grid">
            {compactCases.map((item) => (
              <CompactCaseCard item={item} key={item.name} />
            ))}
          </div>
        </div>
      </section>

      <section className="d1-section d1-reasons">
        <div className="d1-container">
          <div className="d1-reasons-head">
            <p className="d1-eyebrow">Почему это работает</p>
            <h2>
              Мы не начинаем с картинки. И это, кажется, сильно экономит всем
              нервы
            </h2>
            <p>
              Самая частая ошибка — сразу бежать делать красиво. А потом
              выяснять, что красиво не объясняет, не продает, не обучает и
              вообще живет отдельно от задачи. Мы так стараемся не делать.
            </p>
          </div>
          <div className="d1-reason-grid">
            {reasons.map((item, index) => (
              <ReasonCard
                item={item}
                key={item.number}
                wandTargetName={wandTest ? `why-card-${index + 1}` : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="d1-section d1-process" id="process">
        <div className="d1-container d1-process-layout">
          <div className="d1-process-copy">
            <p className="d1-eyebrow">Процесс</p>
            <h2>Чтобы проект не расползся, мы заранее фиксируем маршрут</h2>
            <p className="d1-section-lead">
              Особенно в фарме, HSE и корпоративных проектах. Там много
              согласующих, правил, экспертов и внезапных правок. Поэтому процесс
              должен быть виден, а не жить в голове у подрядчика.
            </p>
            {wandTest ? (
              <div
                className="d1-route-marker"
                {...wandTarget('route-title-space')}
                aria-hidden="true"
              >
                <span>route</span>
                <strong>6 шагов</strong>
                <small>зафиксировали маршрут проекта</small>
              </div>
            ) : null}
          </div>
          <ol
            className="d1-process-list"
            {...wandTarget(wandTest ? 'roadmap' : undefined)}
          >
            {processSteps.map((item, index) => (
              <ProcessStep item={item} index={index} key={item.title} />
            ))}
          </ol>
        </div>
      </section>

      <section className="d1-section d1-directions">
        <div className="d1-container">
          <div className="d1-section-head">
            <p className="d1-eyebrow">Направления</p>
            <h2>ANIX уже шире, чем один формат роликов</h2>
          </div>
          <div className="d1-direction-grid">
            {directions.map((item) => (
              <DirectionCard item={item} key={item.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="d1-section d1-trust">
        <div className="d1-container d1-trust-layout">
          <div>
            <p className="d1-eyebrow">Признание</p>
            <h2>Нас уже замечали не только клиенты</h2>
          </div>
          <div>
            <div className="d1-trust-chips" aria-label="Признание ANIX">
              {trustChips.map((item) => (
                <span key={item}>
                  <BadgeCheck aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
            <p>
              Для нас это не финальная медалька на стене. Скорее сигнал, что
              студия выросла из эксперимента в нормальную рабочую систему. Все
              еще живую. Все еще немного безумную. Но уже систему.
            </p>
          </div>
        </div>
      </section>

      <section
        className="d1-section d1-final-cta"
        id="contact"
        {...wandTarget(wandTest ? 'contacts' : undefined)}
      >
        <div className="d1-container d1-final-inner">
          <div>
            <p className="d1-eyebrow">Контакты</p>
            <h2>
              Покажите нам продукт, правило или событие, которое сложно
              объяснить
            </h2>
            <p>
              Мы посмотрим, где там смысловая пробка, и предложим формат: ролик,
              серия, маскот, visual sales kit, HSE-пилот, pharma-визуал или
              экранная история для мероприятия.
            </p>
          </div>
          <div className="d1-final-actions">
            <a
              className="d1-button d1-button-light"
              href={heroLinks.telegram}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Написать в Telegram
            </a>
            <a
              className="d1-button d1-button-dark-outline"
              href={heroLinks.videoFolder}
              target="_blank"
              rel="noreferrer"
            >
              <PlayCircle aria-hidden="true" />
              Смотреть все видео
            </a>
            <a
              className="d1-button d1-button-dark-outline"
              href={heroLinks.email}
            >
              <Mail aria-hidden="true" />
              anix.ai@yandex.ru
            </a>
          </div>
        </div>
      </section>

      <div
        className="d1-wand-footer-target"
        {...wandTarget(wandTest ? 'footer' : undefined)}
      >
        <SiteFooter />
      </div>
      {wandTest ? <WandOverlay /> : null}
    </main>
  );
}

export default Design1TestPage;

