import React from 'react';
import { Helmet } from 'react-helmet';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Camera,
  ExternalLink,
  GraduationCap,
  Mail,
  MessageCircle,
  PenLine,
  Sparkles,
  Theater,
  Workflow,
} from 'lucide-react';
import SiteFooter from './SiteFooter';
import './CeoPage.css';
import logo from '../images/logoanix.png';
import awardPhoto from '../images/ceo/alexandra-award.webp';
import andreyPhoto from '../images/ceo/alexandra-andrey-anix.webp';
import speakingPhoto from '../images/ceo/alexandra-speaking.webp';
import portraitPhoto from '../images/ceo/alexandra-portrait.webp';

const telegramUrl = 'https://t.me/anix_helper';
const emailUrl = 'mailto:anix.ai@yandex.ru';

const navLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Кейсы', href: '/#cases' },
  { label: 'Фарма', href: '/medicine/' },
  { label: 'HSE', href: '/hse/' },
  { label: 'Контакт', href: '#contact' },
];

const facts = [
  'CEO ANIX',
  'ФОПФ МФТИ',
  'Бизнес-школа МФТИ x Сбер',
  'Sber500',
  'RB Young Awards',
  'Physics Letters B',
];

const roles = [
  {
    title: 'Режиссер',
    text: 'Саша держит в голове не набор красивых кадров, а путь зрителя: где он устал, где поверил, где наконец понял, зачем ему это смотреть.',
    icon: Theater,
  },
  {
    title: 'Сценарист',
    text: 'Она вытаскивает из продукта конфликт, ставку и человеческий мотив. Даже если на входе только презентация, таблица и тревожное ТЗ.',
    icon: PenLine,
  },
  {
    title: 'Предприниматель',
    text: 'ANIX прошел путь от нейросетевого стартапа для 2D-анимации до студии, которая зарабатывает на сложных B2B-задачах.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Оператор процесса',
    text: 'Идеи не должны жить в хаосе. Саша собирает роли, сроки, согласования и нормальный маршрут, чтобы проект не расползался.',
    icon: Workflow,
  },
  {
    title: 'Человек из науки',
    text: 'Физтеховская школа дала ей привычку разбираться до механики, а не останавливаться на первом удобном объяснении.',
    icon: Brain,
  },
  {
    title: 'Публичный голос',
    text: 'Она говорит о технологиях без стерильного пафоса: через людей, риск, юмор, сопротивление и смысл, который можно почувствовать.',
    icon: Sparkles,
  },
];

const approachQuotes = [
  {
    label: 'Про пивот',
    text: 'Если модель не работает, ее не надо защищать красивыми слайдами. Надо найти форму, где сходятся продукт, рынок, деньги и команда.',
  },
  {
    label: 'Про видео',
    text: 'Красиво само по себе мало что спасает. В ролике должно быть понятно, почему человеку вообще не все равно.',
  },
  {
    label: 'Про команду',
    text: 'Хаос не исчезает сам. Его приходится переводить в роли, процессы и нормальные договоренности. Иначе идея просто съедает людей.',
  },
  {
    label: 'Про сложное',
    text: 'Сложную тему нельзя опускать до примитива. Ее надо разложить так, чтобы человек не чувствовал себя глупым.',
  },
];

const timeline = [
  {
    year: 'МФТИ',
    title: 'Физика как базовая школа мышления',
    text: 'ФОПФ МФТИ, работа с абстрактными моделями и привычка проверять, что именно стоит за красивой формулировкой.',
  },
  {
    year: '2023',
    title: 'Научная публикация',
    text: 'Статья в Physics Letters B о 3d higher-spin theory. Не украшение биографии, а след от реальной работы в сложной математической теме.',
  },
  {
    year: 'ANIX',
    title: 'От AI-инструмента к студии',
    text: 'Первый ANIX рос как нейросетевой продукт для ускорения 2D-анимации. Потом рынок показал, где ценность сильнее: в решении задач клиента целиком.',
  },
  {
    year: 'Сейчас',
    title: 'Сложные продукты, видео и визуальные системы',
    text: 'Фарма, HSE, MedTech, B2B, события, маскоты, ролики и материалы, которые помогают людям понять, запомнить и решиться на следующий шаг.',
  },
];

const links = [
  {
    title: 'Статья в Physics Letters B',
    text: 'Disentanglement of topological and dynamical fields in 3d higher-spin theory within shifted homotopy approach',
    href: 'https://doi.org/10.1016/j.physletb.2023.137718',
  },
  {
    title: 'ФОПФ МФТИ',
    text: 'Факультет общей и прикладной физики МФТИ',
    href: 'https://mipt.ru/education/chairs/fopf/',
  },
  {
    title: 'Бизнес-школа МФТИ',
    text: 'Предпринимательская траектория МФТИ',
    href: 'https://business.mipt.ru/',
  },
];

const photos = [
  {
    src: speakingPhoto,
    alt: 'Александра Севостьянова выступает с микрофоном',
    label: 'публичные выступления',
  },
  {
    src: awardPhoto,
    alt: 'Александра Севостьянова на вручении награды',
    label: 'премии и признание',
  },
  {
    src: andreyPhoto,
    alt: 'Александра Севостьянова и Андрей Царев на мероприятии ANIX',
    label: 'ANIX как команда',
  },
  {
    src: portraitPhoto,
    alt: 'Портрет Александры Севостьяновой',
    label: 'портрет',
  },
];

function Header() {
  return (
    <header className="ceo-header">
      <a className="ceo-logo" href="/" aria-label="ANIX Studio">
        <img src={logo} alt="ANIX" />
      </a>
      <nav aria-label="Навигация по странице CEO">
        {navLinks.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a
        className="ceo-header-cta"
        href={telegramUrl}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle aria-hidden="true" />
        Telegram
      </a>
    </header>
  );
}

function RoleCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="ceo-role-card">
      <div className="ceo-icon-wrap">
        <Icon aria-hidden="true" />
      </div>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  );
}

function LinkCard({ item }) {
  return (
    <a
      className="ceo-link-card"
      href={item.href}
      target="_blank"
      rel="noreferrer"
    >
      <span>{item.title}</span>
      <p>{item.text}</p>
      <ExternalLink aria-hidden="true" />
    </a>
  );
}

export default function CeoPage() {
  return (
    <main className="ceo-page">
      <Helmet>
        <title>Александра Севостьянова, CEO ANIX</title>
        <meta
          name="description"
          content="Страница Александры Севостьяновой, CEO ANIX: физтех, режиссер, сценарист и предприниматель, который превращает сложные продукты в понятные визуальные истории."
        />
        <link rel="canonical" href="https://studio.anix-ai.pro/ceo/" />
      </Helmet>

      <Header />

      <section className="ceo-hero">
        <div className="ceo-hero-copy">
          <p className="ceo-eyebrow">CEO ANIX</p>
          <h1>
            Саша Севостьянова: физик, режиссер и человек, который собирает смысл
            в форму
          </h1>
          <p>
            Она умеет удерживать рядом вещи, которые обычно живут отдельно:
            физтеховскую точность, режиссерское внимание к человеку и
            предпринимательскую привычку проверять идеи рынком. Из этого вырос
            ANIX: сначала нейросетевой стартап для 2D-анимации, потом студия,
            которая объясняет сложные продукты через видео, маскотов и
            визуальные системы.
          </p>
          <div className="ceo-actions">
            <a
              className="ceo-button ceo-button-dark"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Обсудить проект
            </a>
            <a className="ceo-button ceo-button-light" href="/#cases">
              Кейсы ANIX
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
          <div
            className="ceo-facts"
            aria-label="Факты об Александре Севостьяновой"
          >
            {facts.map((fact) => (
              <span key={fact}>
                <BadgeCheck aria-hidden="true" />
                {fact}
              </span>
            ))}
          </div>
        </div>

        <div
          className="ceo-hero-visual"
          aria-label="Фотографии Александры Севостьяновой"
        >
          <img
            className="ceo-hero-main-photo"
            src={andreyPhoto}
            alt="Александра Севостьянова и Андрей Царев на мероприятии ANIX"
          />
          <div className="ceo-hero-photo-row">
            <img src={speakingPhoto} alt="Александра Севостьянова выступает" />
            <img
              src={awardPhoto}
              alt="Александра Севостьянова на вручении награды"
            />
          </div>
        </div>
      </section>

      <section className="ceo-section ceo-intro">
        <div className="ceo-container ceo-intro-grid">
          <div>
            <p className="ceo-eyebrow">Почему это важно клиентам</p>
            <h2>
              Саша не продает магию AI. Она собирает понятный маршрут от сложной
              идеи до зрителя.
            </h2>
          </div>
          <p>
            В ANIX часто приходят с задачами, которые трудно уложить в обычный
            рекламный формат: механизм действия препарата, охрана труда,
            B2B2C-продукт, инженерная технология, мероприятие с несколькими
            слоями смысла. Саша помогает не упростить это до пустоты, а найти
            сцену, язык и ритм, где сложность наконец начинает работать на
            доверие.
          </p>
        </div>
      </section>

      <section className="ceo-section">
        <div className="ceo-container">
          <div className="ceo-section-head">
            <p className="ceo-eyebrow">Что в ней редкое</p>
            <h2>
              Точность науки, нерв режиссуры и нормальная предпринимательская
              трезвость
            </h2>
          </div>
          <div className="ceo-role-grid">
            {roles.map((item) => (
              <RoleCard item={item} key={item.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="ceo-section ceo-quotes">
        <div className="ceo-container">
          <div className="ceo-section-head ceo-section-head-light">
            <p className="ceo-eyebrow">Подход</p>
            <h2>Фразы, которые хорошо описывают ее способ думать</h2>
          </div>
          <div className="ceo-quote-grid">
            {approachQuotes.map((item) => (
              <figure className="ceo-quote-card" key={item.label}>
                <figcaption>{item.label}</figcaption>
                <blockquote>{item.text}</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="ceo-section">
        <div className="ceo-container ceo-story-layout">
          <div>
            <p className="ceo-eyebrow">Траектория</p>
            <h2>Не биография для галочки, а путь, который объясняет ANIX</h2>
            <p>
              У Саши есть редкая для креативной студии связка: она понимает, как
              устроены сложные модели, как люди воспринимают историю и как
              бизнесу жить после красивой премьеры. Поэтому в проектах ANIX
              много внимания к смыслу, но не меньше - к дедлайнам, продажам,
              согласованиям и тому, чтобы материал потом реально использовали.
            </p>
          </div>
          <ol className="ceo-timeline">
            {timeline.map((item) => (
              <li key={item.title}>
                <span>{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ceo-section ceo-education">
        <div className="ceo-container ceo-education-layout">
          <div className="ceo-education-card">
            <GraduationCap aria-hidden="true" />
            <h2>Физтех, бизнес-школа и научный след</h2>
            <p>
              Саша училась на ФОПФ МФТИ и прошла предпринимательскую траекторию
              Бизнес-школы МФТИ x Сбер. В ее бэкграунде есть не только питчи и
              акселераторы, но и научная публикация в Physics Letters B. Для
              ANIX это не статусная строка, а привычка задавать неприятный
              вопрос: что здесь на самом деле происходит?
            </p>
          </div>
          <div className="ceo-link-grid">
            {links.map((item) => (
              <LinkCard item={item} key={item.href} />
            ))}
          </div>
        </div>
      </section>

      <section className="ceo-section ceo-gallery-section">
        <div className="ceo-container">
          <div className="ceo-section-head">
            <p className="ceo-eyebrow">Фото</p>
            <h2>Саша в работе, на сцене и внутри ANIX</h2>
          </div>
          <div className="ceo-gallery">
            {photos.map((photo) => (
              <figure key={photo.src}>
                <img src={photo.src} alt={photo.alt} />
                <figcaption>
                  <Camera aria-hidden="true" />
                  {photo.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="ceo-final" id="contact">
        <div className="ceo-container ceo-final-inner">
          <div>
            <p className="ceo-eyebrow">Следующий шаг</p>
            <h2>
              Если у вас сложный продукт, Саша быстро найдет, где в нем история,
              риск и ясный первый кадр.
            </h2>
            <p>
              Можно прийти с презентацией, ТЗ, молекулярной схемой, правилами
              безопасности или идеей мероприятия. ANIX разберется, что нужно
              объяснить, кому и в каком формате это сработает.
            </p>
          </div>
          <div className="ceo-final-actions">
            <a
              className="ceo-button ceo-button-light"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Telegram
            </a>
            <a className="ceo-button ceo-button-outline-dark" href={emailUrl}>
              <Mail aria-hidden="true" />
              Email
            </a>
            <a className="ceo-button ceo-button-outline-dark" href="/medicine/">
              <BookOpen aria-hidden="true" />
              Фарма
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
