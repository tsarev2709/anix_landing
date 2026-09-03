import React from 'react';
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
const emailUrl = 'mailto:studio@anix-ai.pro';

const navLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Продукт', href: '#product' },
  { label: 'Сценарии', href: '#tasks' },
  { label: 'Демо', href: '/hse/mvp' },
  { label: 'Цены', href: '/hse/price' },
];

const heroStats = [
  ['5–7', 'коротких модулей в системе'],
  ['7 дней', 'обычный срок ролика 1 минута'],
  ['QR / LMS', 'доступ и передача материалов'],
];

const painPoints = [
  {
    title: 'Инструкции не пробивают внимание',
    text: 'Длинные регламенты и плакаты быстро становятся фоном.',
    icon: ClipboardList,
  },
  {
    title: 'Правила приходится объяснять заново',
    text: 'Новички, подрядчики, временные команды, сезонные риски. У службы охраны труда снова и снова уходит время на один и тот же разговор.',
    icon: Users,
  },
  {
    title: 'Красивый плакат не меняет поведение',
    text: 'Если нет ситуации, ошибки, последствия и правильного действия, материал остаётся картинкой на стене.',
    icon: Activity,
  },
  {
    title: 'Сложно увидеть, кто дошел до смысла',
    text: 'Страница по QR-коду, короткий тест и простая аналитика показывают, кто прошёл материал и что нужно повторить.',
    icon: ShieldCheck,
  },
];

const formats = [
  {
    title: 'Преддопусковой модуль',
    text: 'Короткие сцены для подрядчиков, новых сотрудников, сервисных бригад, лаборатории, склада и горячих работ.',
    icon: HardHat,
  },
  {
    title: 'Жизненно важные правила',
    text: 'Карточки, ролики и тесты по критическим правилам. Короткие касания, которые можно возвращать в поле внимания.',
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
    title: 'Годовая кампания',
    text: 'Темы, визуальный язык, календарь касаний и обновления под сезонные риски, происшествия и внутренние приоритеты.',
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
  'основатель/сооснователь проекта Б в Кубе',
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

const hseProductLevels = [
  {
    label: 'Пилот одного сценария',
    price: 'от 350 тыс. ₽',
    text: 'Один объект, одна группа людей и один критический риск.',
  },
  {
    label: 'Модуль или серия',
    price: 'от 900 тыс. ₽',
    text: '5–7 коротких модулей, вопросы, QR-доступ или пакет для LMS.',
  },
  {
    label: 'Обновление библиотеки',
    price: 'от 150 тыс. ₽/мес.',
    text: 'Новые правила, версии под объекты и актуализация при изменении инструкций.',
  },
];

const hseTasks = [
  {
    title: 'Вводный onboarding',
    text: 'Критические правила объекта для новых сотрудников до первого выхода в рабочую зону.',
  },
  {
    title: 'Подрядчики и сервисные бригады',
    text: 'Короткая объектная подготовка для конкретной категории людей, а не общий курс «про безопасность».',
  },
  {
    title: 'Сценарии реального риска',
    text: 'Высота, транспорт, LOTO, электричество, СИЗ, огневые работы, замкнутые пространства и другие риски площадки.',
  },
  {
    title: 'Жизненно важные правила',
    text: 'Серия повторяющихся касаний: ролики, карточки, короткие тесты и материалы для внутренних каналов.',
  },
  {
    title: 'Новое оборудование или процесс',
    text: 'Показываем безопасную последовательность действий до того, как ошибка произойдёт в реальной смене.',
  },
  {
    title: 'Пожарная и аварийная готовность',
    text: 'Роли, первые действия, маршруты и типовые ошибки в коротких ситуационных эпизодах.',
  },
  {
    title: 'Тестирование и подтверждение',
    text: 'Проверочные вопросы, логика прохождения и простой отчёт ответственному сотруднику.',
  },
  {
    title: 'QR, LMS и обновления',
    text: 'Доступ на объекте, передача материалов во внутреннюю систему и обновление при изменении инструкций.',
  },
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
      <header className="hse-header">
        <nav className="hse-header-inner" aria-label="Anix HSE">
          <a className="hse-logo" href="/" aria-label="Anix Studio">
            <img src={logo} alt="Anix" />
          </a>
          <div className="hse-nav-links">
            {navLinks.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <a
            className="hse-header-cta hse-header-cta-secondary"
            href="/hse/mvp/test/login"
          >
            Войти
          </a>
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
            Охрана труда / промышленная безопасность
          </p>
          <h1>Видео по охране труда, которое показывает реальный риск</h1>
          <p className="hse-lead">
            Собираем не отдельный ролик по охране труда, а 5–7 коротких
            onboarding-модулей для новых сотрудников и подрядчиков: реальные
            сценарии риска, проверочные вопросы, QR-доступ и передача материалов
            в LMS или внутреннюю систему.
          </p>
          <div className="hse-actions">
            <a
              className="hse-button hse-button-primary"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Обсудить пилот
            </a>
            <a className="hse-button hse-button-secondary" href="/hse/mvp">
              <ShieldCheck aria-hidden="true" />
              Открыть демополигон
            </a>
            <a className="hse-button hse-button-secondary" href="/hse/price">
              <ClipboardList aria-hidden="true" />
              Цены и состав сметы
            </a>
          </div>
        </div>
        <aside className="hse-hero-media" aria-label="Визуальный пример HSE">
          <img
            src={heroImage}
            alt="Визуальные материалы Anix по охране труда"
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
            <h2>Правила не запоминают</h2>
          </div>
          <div className="hse-rich-text">
            <p>
              Сотрудник вспоминает не номер пункта, а сцену: где риск, чем
              закончится ошибка и какое действие выбрать.
            </p>
            <p>
              Поэтому мы переводим требования в короткие визуальные эпизоды и
              работаем вместе со службой охраны труда.
            </p>
          </div>
        </div>
      </section>

      <section className="hse-section hse-product" id="product">
        <div className="hse-container">
          <div className="hse-product-head">
            <div>
              <p className="hse-eyebrow">Флагманский продукт</p>
              <h2>HSE Onboarding Module</h2>
            </div>
            <div>
              <p>
                Дополняет обязательный инструктаж. Стандартизирует повторяющееся
                объяснение, показывает риски конкретного объекта и помогает
                проверить, что новичок понял правильное действие.
              </p>
              <div
                className="hse-product-tags"
                aria-label="Состав HSE Onboarding Module"
              >
                <span>5–7 микро-модулей</span>
                <span>реальные риски</span>
                <span>тестирование</span>
                <span>QR / LMS</span>
              </div>
            </div>
          </div>

          <div className="hse-product-grid">
            <article className="hse-product-card hse-product-card-main">
              <span>Рабочий контур</span>
              <h3>Один объект. Одна группа. Понятный результат.</h3>
              <ul>
                <li>
                  <CheckCircle2 aria-hidden="true" /> собираем критические
                  правила и реальные ситуации
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" /> пишем короткие сценарии
                  «риск — последствие — действие»
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" /> производим ролики и
                  проверочные вопросы
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" /> даём QR-доступ или пакет
                  для внутренней системы
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" /> передаём материалы и план
                  обновлений
                </li>
              </ul>
            </article>
            <article className="hse-product-card">
              <span>Правила правок</span>
              <strong>2 раунда</strong>
              <p>
                Один раунд по сценариям и один по собранным материалам. Служба
                заказчика передаёт консолидированные комментарии через одного
                ответственного.
              </p>
            </article>
            <article className="hse-product-card hse-product-card-boundary">
              <span>Ограничение</span>
              <p>
                Модуль не заменяет обязательные процедуры обучения, инструктаж
                или ответственность за допуск. Глубокую LMS-интеграцию и новые
                сценарии после утверждения считаем отдельно.
              </p>
            </article>
          </div>

          <div className="hse-level-grid">
            {hseProductLevels.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.price}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="hse-product-actions">
            <a className="hse-button hse-button-primary" href="/hse/price">
              Подробный ценовой гайд <ArrowRight aria-hidden="true" />
            </a>
            <a className="hse-product-link" href="/hse/mvp">
              Открыть HSE-демо <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="hse-section hse-tasks" id="tasks">
        <div className="hse-container">
          <div className="hse-section-head hse-section-head-row">
            <div>
              <p className="hse-eyebrow">Таксономия задач</p>
              <h2>От вводного инструктажа до обновляемой библиотеки</h2>
            </div>
            <p>
              Входим через ближайший допуск или один повторяющийся риск. После
              пилота расширяем систему на другие правила, группы и объекты.
            </p>
          </div>
          <div className="hse-task-grid">
            {hseTasks.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hse-section">
        <div className="hse-container">
          <div className="hse-section-head">
            <p className="hse-eyebrow">
              Почему обычные материалы слабо держатся
            </p>
            <h2>Обычные материалы быстро становятся фоном</h2>
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
            <h2>Наглядно показываем риск</h2>
            <p>
              Сотрудник видит конкретную ситуацию: что может пойти не так, чем
              это закончится и какое действие нужно выбрать.
            </p>
            <ul className="hse-check-list">
              <li>
                <CheckCircle2 aria-hidden="true" /> сценарии под производство,
                склад, лабораторию, подрядчиков и сервисные бригады
              </li>
              <li>
                <CheckCircle2 aria-hidden="true" /> версии под телефон, экран,
                систему обучения, презентацию и внутренние каналы
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
              alt="Видео по безопасности"
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
            <h2>Начинаем с пилота и выращиваем систему</h2>
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
              <h2>Уже есть кейсы и результаты</h2>
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
                    alt={`Кейс Anix HSE: ${item.title}`}
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
              alt="Алексей Лычко, эксперт Anix по охране труда"
              loading="lazy"
            />
          </div>
          <div className="hse-expert-copy">
            <p className="hse-eyebrow">Эксперт по охране труда</p>
            <h2>
              Алексей Лычко помогает Anix не путать красивый HSE-ролик с
              полезным обучением
            </h2>
            <p>
              Алексей работает на стыке охраны труда, промышленной безопасности,
              пожарной и электробезопасности, культуры безопасности и игрового
              обучения. Его роль в проектах Anix простая и очень важная:
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
              Б в Кубе показывает ту же мысль: безопасность лучше запоминается
              через действие
            </h2>
            <p>
              У проекта Б в Кубе заявлены 16 000+ обученных участников и 110+
              турниров. Это не метрики Anix, но хороший сигнал подхода Алексея:
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
            <h2>Делаем пилот понятным и проверяемым</h2>
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
              собрать пилот.
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
