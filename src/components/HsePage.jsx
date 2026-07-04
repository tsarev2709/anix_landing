import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Gamepad2,
  HardHat,
  Mail,
  MessageCircle,
  PlayCircle,
  Presentation,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import './HsePage.css';
import SiteFooter from './SiteFooter';
import logo from '../images/logoanix.png';
import multonImage from '../images/cases/multon-partners.webp';
import heroImage from '../images/hse/hse-hero.jpg';
import onboardingImage from '../images/hse/hse-onboarding.jpg';
import ruleTaraImage from '../images/hse/hse-rule-tara.jpg';
import ruleLabImage from '../images/hse/hse-rule-lab.jpg';
import ventilationImage from '../images/hse/hse-ventilation.jpg';
import alexeyPhoto from '../images/experts/alexey-lychko-hse.webp';

const telegramUrl = 'https://t.me/anix_helper';
const emailUrl = 'mailto:anix.ai@yandex.ru';

const navLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Форматы', href: '#formats' },
  { label: 'Эксперт', href: '#expert' },
  { label: 'Демо', href: '/hse/mvp' },
  { label: 'Medicine', href: '/medicine/' },
];

const heroStats = [
  ['5-7', 'микро-роликов для первого пилота'],
  ['QR', 'доступ к материалам прямо на объекте'],
  ['LSR', 'карточки, тесты, напоминания, сценарии'],
];

const painPoints = [
  {
    title: 'Инструктаж быстро превращается в фон',
    text: 'Люди кивают, расписываются, уходят на смену. А потом в реальной ситуации вспоминают не пункт регламента, а то, что успели увидеть и прожить.',
    icon: ClipboardList,
  },
  {
    title: 'Правила приходится объяснять заново',
    text: 'Новички, подрядчики, временные команды, сезонные риски. У HSE-службы снова и снова уходит время на один и тот же разговор.',
    icon: Users,
  },
  {
    title: 'Красивый плакат не меняет поведение',
    text: 'Если нет ситуации, ошибки, последствий и правильного действия, материал остается картинкой на стене. Иногда хорошей. Но все равно фоном.',
    icon: Activity,
  },
  {
    title: 'Сложно увидеть, кто дошел до смысла',
    text: 'QR-страница, короткий тест и простая аналитика дают хотя бы базовую картину: кто посмотрел, что понял, какие темы надо повторить.',
    icon: ShieldCheck,
  },
];

const formats = [
  {
    title: 'Преддопусковой onboarding',
    text: 'Короткие сцены для конкретной группы людей: подрядчики, новые сотрудники, сервисные бригады, лаборатория, склад, горячие работы.',
    icon: HardHat,
  },
  {
    title: 'Life Saving Rules',
    text: 'Карточки, ролики и тесты по критическим правилам. Не лекция на полчаса, а повторяемые касания, которые можно вернуть в поле внимания.',
    icon: CheckCircle2,
  },
  {
    title: 'Маскот кампании',
    text: 'Персонаж помогает говорить о безопасности без холодного тона приказа. Особенно когда нужно годами возвращать людей к одним и тем же правилам.',
    icon: Sparkles,
  },
  {
    title: 'Игровые механики',
    text: 'Соревнование, выбор, последствия, командные сценарии. То, что легче обсуждать после обучения, чем просто перечень запретов.',
    icon: Gamepad2,
  },
  {
    title: 'QR-страницы и тесты',
    text: 'Материал можно открыть у стенда, на объекте, в рассылке или после инструктажа. Сразу пройти мини-проверку и оставить след в отчете.',
    icon: PlayCircle,
  },
  {
    title: 'Годовая HSE-кампания',
    text: 'Система тем, визуальный язык, календарь касаний и обновления под сезонные риски, происшествия и внутренние приоритеты компании.',
    icon: Presentation,
  },
];

const cases = [
  {
    title: 'Мултон Партнерс',
    label: 'маскот + LSR-карточки',
    image: multonImage,
    text: 'Нужно было привлечь внимание сотрудников к правилам безопасности. Мы с нуля разработали маскота кампании и формат карточек. Получился не разовый материал, а визуальный инструмент для внутренней коммуникации.',
  },
  {
    title: 'Демополигон HSE',
    label: 'цифровой MVP',
    image: onboardingImage,
    text: 'Собрали демонстрационную среду: обучение, сценарии, тесты, роли сотрудника и специалиста. Это можно открыть и потрогать, а не только представить в КП.',
    href: '/hse/mvp',
  },
  {
    title: 'Сцены риска',
    label: 'визуальные правила',
    image: ruleLabImage,
    text: 'Показываем не пункт инструкции, а момент, где человек может ошибиться: тара, лаборатория, вентиляция, пожарная безопасность, подготовка места работ.',
  },
];

const expertFacts = [
  'более 20 лет в охране труда и промышленной безопасности',
  'генеральный директор ООО Безопасные Условия Труда',
  'основатель/сооснователь проекта B в Кубе',
  'автор игровых форматов по охране труда, пожарной и электробезопасности',
];

const expertSources = [
  { title: 'Профиль Pressfeed', href: 'https://pressfeed.ru/people/116563' },
  { title: 'B в Кубе', href: 'https://b-cubed.ru/about-us/' },
  {
    title: 'Интервью в Строительной газете',
    href: 'https://stroygaz.ru/publication/biznes/ozorstvo-okhrannoy-gramoty-igra-pomozhet-bezopasnosti-i-uluchshit-kulturu-proizvodstva/',
  },
];

const process = [
  'Выбираем один объект, одну группу людей и 5-7 правил. Чем меньше расплывчатости, тем быстрее появляется рабочий пилот.',
  'Разбираем регламенты, LSR, реальные ситуации и типовые ошибки вместе с вашей HSE-командой и профильным экспертом.',
  'Пишем короткие сцены: человек собирается сделать действие, появляется риск, видно последствие, понятно правильное поведение.',
  'Производим ролики, карточки, QR-страницу, тесты и материалы для запуска во внутренних каналах.',
  'Смотрим первые метрики и решаем, что масштабировать: темы, площадки, форматы, маскота, годовую кампанию.',
];

function IconCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="hse-card">
      <Icon aria-hidden="true" />
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  );
}

export default function HsePage() {
  return (
    <main className="hse-page">
      <Helmet>
        <title>
          ANIX HSE - видео, onboarding и игровые материалы по охране труда
        </title>
        <meta
          name="description"
          content="ANIX HSE делает видео-onboarding, Life Saving Rules, QR-страницы, тесты, маскотов и игровые обучающие материалы по охране труда, промышленной, пожарной и электробезопасности."
        />
        <link rel="canonical" href="https://studio.anix-ai.pro/hse/" />
        <meta property="og:title" content="ANIX HSE" />
        <meta
          property="og:description"
          content="Визуальные и игровые обучающие материалы по охране труда: onboarding, LSR, QR, тесты, маскоты и HSE-кампании."
        />
        <meta property="og:url" content="https://studio.anix-ai.pro/hse/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <header className="hse-header">
        <nav className="hse-header-inner" aria-label="ANIX HSE">
          <a className="hse-logo" href="/" aria-label="ANIX Studio">
            <img src={logo} alt="ANIX" />
          </a>
          <div className="hse-nav-links">
            {navLinks.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <a
            className="hse-header-cta"
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Написать
          </a>
        </nav>
      </header>

      <section className="hse-hero" id="top">
        <div className="hse-hero-copy">
          <p className="hse-eyebrow">
            ANIX HSE / охрана труда и культура безопасности
          </p>
          <h1>
            Правила безопасности легче запомнить, когда они выглядят как рабочая
            ситуация
          </h1>
          <p className="hse-lead">
            Мы делаем видео-onboarding, LSR-карточки, QR-страницы, тесты,
            маскотов и игровые обучающие форматы для компаний, где безопасность
            не должна оставаться подписью в журнале.
          </p>
          <div className="hse-actions">
            <a
              className="hse-button hse-button-primary"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Обсудить HSE-пилот
            </a>
            <a className="hse-button hse-button-secondary" href="/hse/mvp">
              <ShieldCheck aria-hidden="true" />
              Открыть демополигон
            </a>
          </div>
        </div>
        <aside className="hse-hero-media" aria-label="Визуальный пример HSE">
          <img
            src={heroImage}
            alt="HSE onboarding и визуальные материалы ANIX"
          />
          <div className="hse-hero-stats">
            {heroStats.map(([value, label]) => (
              <div key={value}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="hse-section hse-intro">
        <div className="hse-container hse-two-col">
          <div>
            <p className="hse-eyebrow">Проблема</p>
            <h2>
              Охрана труда проигрывает не потому, что правила слабые. Их плохо
              проживают.
            </h2>
          </div>
          <div className="hse-rich-text">
            <p>
              В реальности сотрудник вспоминает не номер пункта. Он вспоминает
              сцену: как выглядит опасная ситуация, что он делает руками, где
              запрет, где нормальное действие, чем кончится ошибка.
            </p>
            <p>
              Поэтому мы переводим требования в короткие визуальные эпизоды. Без
              попытки заменить службу ОТ. С ней вместе.
            </p>
          </div>
        </div>
      </section>

      <section className="hse-section">
        <div className="hse-container">
          <div className="hse-section-head">
            <p className="hse-eyebrow">
              Почему обычные материалы слабо держатся
            </p>
            <h2>
              Сотрудник должен узнать себя в ситуации, иначе материал быстро
              становится фоном
            </h2>
          </div>
          <div className="hse-card-grid hse-pain-grid">
            {painPoints.map((item) => (
              <IconCard item={item} key={item.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="hse-section hse-showcase">
        <div className="hse-container hse-showcase-layout">
          <div>
            <p className="hse-eyebrow">От инструкции к сцене</p>
            <h2>Показываем момент, где человек может ошибиться</h2>
            <p>
              Тара, лаборатория, вентиляция, пожарная безопасность, вход на
              объект. Чем конкретнее ситуация, тем проще сотруднику потом
              заметить её в жизни.
            </p>
            <ul className="hse-check-list">
              <li>
                <CheckCircle2 aria-hidden="true" /> сценарии под производство,
                склад, лабораторию, подрядчиков и сервисные бригады
              </li>
              <li>
                <CheckCircle2 aria-hidden="true" /> версии под телефон, экран,
                LMS, презентацию и внутренние каналы
              </li>
              <li>
                <CheckCircle2 aria-hidden="true" /> карточки и тесты вокруг
                роликов, чтобы правило вернулось несколько раз
              </li>
            </ul>
          </div>
          <div className="hse-image-grid" aria-label="Примеры HSE-визуалов">
            <img
              className="hse-image-large"
              src={onboardingImage}
              alt="Видео-onboarding по безопасности"
              loading="lazy"
            />
            <img
              src={ruleTaraImage}
              alt="Правило безопасной работы с тарой"
              loading="lazy"
            />
            <img
              src={ruleLabImage}
              alt="HSE-сцена для лаборатории"
              loading="lazy"
            />
            <img
              src={ventilationImage}
              alt="Сцена по вентиляции и пожарной безопасности"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="hse-section" id="formats">
        <div className="hse-container">
          <div className="hse-section-head">
            <p className="hse-eyebrow">Форматы</p>
            <h2>Можно начать с маленького пилота, а потом вырастить систему</h2>
          </div>
          <div className="hse-card-grid hse-format-grid">
            {formats.map((item) => (
              <IconCard item={item} key={item.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="hse-section hse-cases">
        <div className="hse-container">
          <div className="hse-section-head hse-section-head-row">
            <div>
              <p className="hse-eyebrow">Кейсы и демо</p>
              <h2>
                Не только обещание. Уже есть визуальные материалы и демополигон
              </h2>
            </div>
            <p>
              В HSE важно быстро увидеть, как это будет работать: карточка,
              ролик, QR, тест, путь сотрудника.
            </p>
          </div>
          <div className="hse-case-grid">
            {cases.map((item) => {
              const Wrapper = item.href ? 'a' : 'article';
              const props = item.href ? { href: item.href } : {};
              return (
                <Wrapper className="hse-case" key={item.title} {...props}>
                  <img
                    src={item.image}
                    alt={`Кейс ANIX HSE: ${item.title}`}
                    loading="lazy"
                  />
                  <div>
                    <span>{item.label}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    {item.href ? <ArrowRight aria-hidden="true" /> : null}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hse-section hse-expert" id="expert">
        <div className="hse-container hse-expert-layout">
          <div className="hse-expert-photo">
            <img
              src={alexeyPhoto}
              alt="Алексей Лычко, эксперт ANIX по охране труда"
              loading="lazy"
            />
          </div>
          <div className="hse-expert-copy">
            <p className="hse-eyebrow">Эксперт по охране труда</p>
            <h2>
              Алексей Лычко помогает ANIX не путать красивый HSE-ролик с
              полезным обучением
            </h2>
            <p>
              Алексей работает на стыке охраны труда, промышленной безопасности,
              пожарной и электробезопасности, культуры безопасности и игрового
              обучения. Его роль в проектах ANIX простая и очень важная:
              проверить, что сценарий связан с реальным риском, говорит на языке
              ОТ и не превращает безопасность в декоративную анимацию.
            </p>
            <div className="hse-fact-grid">
              {expertFacts.map((fact) => (
                <span key={fact}>
                  <BadgeCheck aria-hidden="true" />
                  {fact}
                </span>
              ))}
            </div>
            <div className="hse-source-row">
              {expertSources.map((item) => (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  key={item.href}
                >
                  {item.title}
                  <ExternalLink aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="hse-section hse-bcube">
        <div className="hse-container hse-bcube-inner">
          <Gamepad2 aria-hidden="true" />
          <div>
            <p className="hse-eyebrow">Почему игровой подход здесь уместен</p>
            <h2>
              B в Кубе показывает ту же мысль: безопасность лучше запоминается
              через действие
            </h2>
            <p>
              У проекта B в Кубе заявлены 16 000+ обученных участников и 110+
              турниров. Это не метрики ANIX, но хороший сигнал подхода Алексея:
              обучение можно делать не как зубрежку, а как ситуацию, где есть
              выбор, риск, последствия и командное обсуждение.
            </p>
          </div>
        </div>
      </section>

      <section className="hse-section hse-process">
        <div className="hse-container hse-process-layout">
          <div>
            <p className="hse-eyebrow">Процесс</p>
            <h2>Пилот должен быть маленьким, понятным и проверяемым</h2>
            <p>
              Если начать сразу с большой платформы, проект может утонуть в
              согласованиях. Мы предлагаем сначала собрать один работающий
              контур.
            </p>
          </div>
          <ol className="hse-process-list">
            {process.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hse-final" id="contact">
        <div className="hse-container hse-final-inner">
          <div>
            <p className="hse-eyebrow">Следующий шаг</p>
            <h2>
              Выберите одну группу людей и один риск. Мы покажем, как из этого
              собрать HSE-пилот.
            </h2>
          </div>
          <div className="hse-final-actions">
            <a
              className="hse-button hse-button-light"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Telegram
            </a>
            <a className="hse-button hse-button-outline-dark" href={emailUrl}>
              <Mail aria-hidden="true" />
              Email
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
