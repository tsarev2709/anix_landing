import React from 'react';
import {
  ArrowRight,
  Clapperboard,
  Eye,
  Film,
  Layers3,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import SiteFooter from './SiteFooter';
import littlePrinceImage from '../images/cases/little-prince.webp';
import bondarchukImage from '../images/cases/bondarchuk.webp';
import borodinoImage from '../images/cases/borodino.webp';
import agrotechImage from '../images/cases/agrotech.webp';
import hemotechImage from '../images/cases/hemotech-ai.webp';
import './AiVideoPage.css';

const telegramUrl = 'https://t.me/anix_helper';

const capabilities = [
  {
    icon: Eye,
    title: 'Показать то, чего ещё нет',
    text: 'Будущие продукты, невозможные миры, исторические сцены и визуальные метафоры без тяжёлой съёмочной инфраструктуры.',
  },
  {
    icon: WandSparkles,
    title: 'Быстрее проверять идеи',
    text: 'Можно раньше увидеть художественное направление, протестировать образ сцены и понять, куда действительно стоит вкладывать продакшн.',
  },
  {
    icon: Layers3,
    title: 'Собирать гибридный пайплайн',
    text: 'Соединяем AI с анимацией, графикой, 3D, монтажом, композингом и ручной доработкой — в нужной пропорции.',
  },
];

const principles = [
  ['AI не заменяет режиссуру', 'Модель может сгенерировать кадр, но не определяет драматургию, темп, точку зрения и то, зачем зрителю смотреть дальше.'],
  ['Не используем AI ради AI', 'Если задачу надёжнее решить съёмкой, 3D или классической анимацией, выбираем подходящий инструмент, а не модный ярлык.'],
  ['Контролируем консистентность', 'Персонажи, продукт, композиция и стиль требуют системы: референсов, отбора, итераций, композинга и ручной доработки.'],
  ['Собираем результат, а не набор генераций', 'Клиенту нужен законченный ролик с понятной задачей, а не папка красивых экспериментов.'],
];

const cases = [
  {
    title: 'Маленький принц',
    note: 'Кинематографичная фантазия и быстрый поиск художественного языка с помощью генеративного продакшна.',
    image: littlePrinceImage,
    href: '/cases/little-prince/',
  },
  {
    title: 'Фёдор Бондарчук',
    note: 'Прототип кинематографичной сцены с нужной атмосферой за несколько часов вместо длинного предпродакшна.',
    image: bondarchukImage,
    href: '/cases/cinema/',
  },
  {
    title: 'Бородино',
    note: 'Исторический мир, масштаб и атмосфера с вниманием к форме, оружию и среде.',
    image: borodinoImage,
    href: '/cases/borodino/',
  },
  {
    title: 'АгроТех',
    note: 'Технологичная отрасль превращается в визуальный мир будущего вместо сухого продуктового рассказа.',
    image: agrotechImage,
    href: '/cases/b2b/',
  },
  {
    title: 'Hemotech AI',
    note: 'Пример того, как технологичный продукт можно показывать без визуального AI-пафоса и клише.',
    image: hemotechImage,
    href: '/cases/hemotech-ai/',
  },
];

const process = [
  ['01', 'Задача и сценарий', 'Определяем, что нужно объяснить, почувствовать или запомнить — до выбора моделей и инструментов.'],
  ['02', 'Визуальная система', 'Собираем референсы, правила мира, персонажей, композицию и критерии консистентности.'],
  ['03', 'Генерация и производство', 'Используем подходящие AI-модели вместе с анимацией, 3D, монтажом и другими инструментами.'],
  ['04', 'Отбор и доработка', 'Не принимаем первый красивый результат: собираем сцену, исправляем артефакты, выравниваем стиль и движение.'],
  ['05', 'Финальный ролик', 'Монтаж, композинг, звук и адаптации превращают материал в законченный продукт.'],
];

function CaseCard({ item }) {
  return (
    <a className="ai-video-case" href={item.href}>
      <div className="ai-video-case__media">
        <img
          src={item.image}
          alt={`Кейс Anix: ${item.title}`}
          width="1200"
          height="675"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="ai-video-case__body">
        <h3>{item.title}</h3>
        <p>{item.note}</p>
        <span>Смотреть кейс <ArrowRight aria-hidden="true" /></span>
      </div>
    </a>
  );
}

export default function AiVideoPage() {
  return (
    <main className="ai-video-page">
      <header className="ai-video-header">
        <a href="/" aria-label="Anix Studio — на главную"><BrandLogo alt="Anix Studio" width={120} height={44} /></a>
        <nav aria-label="Навигация страницы AI-видео">
          <a href="#capabilities">Возможности</a>
          <a href="#approach">Подход</a>
          <a href="#cases">Кейсы</a>
        </nav>
        <a className="ai-video-header__cta" href={telegramUrl} target="_blank" rel="noreferrer">Обсудить проект</a>
      </header>

      <section className="ai-video-hero">
        <p className="ai-video-eyebrow">Anix Studio / AI-video production</p>
        <h1>AI-видео с режиссурой, продакшном и вкусом</h1>
        <p className="ai-video-hero__lead">
          Anix — полноценная анимационная студия, которая профессионально использует AI внутри продакшна. Не заменяем нейросетями режиссуру — соединяем генеративные инструменты со сценарием, арт-дирекшеном, анимацией и постпродакшном.
        </p>
        <div className="ai-video-hero__actions">
          <a className="ai-video-button ai-video-button--primary" href={telegramUrl} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" /> Обсудить задачу
          </a>
          <a className="ai-video-button" href="/animation/">Анимационные ролики <ArrowRight aria-hidden="true" /></a>
        </div>
        <div className="ai-video-hero__statement">
          <Sparkles aria-hidden="true" />
          <p>AI — это часть инструментария. Ценность появляется, когда есть идея, система и человек, который принимает художественные решения.</p>
        </div>
      </section>

      <section className="ai-video-section" id="capabilities">
        <div className="ai-video-section__heading">
          <p className="ai-video-eyebrow">Что AI действительно даёт</p>
          <h2>Новые производственные возможности — не новый жанр плохого видео</h2>
        </div>
        <div className="ai-video-capabilities">
          {capabilities.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-video-section ai-video-section--dark" id="approach">
        <div className="ai-video-section__heading">
          <p className="ai-video-eyebrow">Не AI ради AI</p>
          <h2>Технология не должна быть заметнее самой идеи</h2>
        </div>
        <div className="ai-video-principles">
          {principles.map(([title, text], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-video-section" id="cases">
        <div className="ai-video-section__heading ai-video-section__heading--with-link">
          <div>
            <p className="ai-video-eyebrow">AI-heavy проекты</p>
            <h2>От быстрого прототипа до законченного визуального мира</h2>
          </div>
          <a href="/cases/">Все кейсы <ArrowRight aria-hidden="true" /></a>
        </div>
        <div className="ai-video-cases">
          {cases.map((item) => <CaseCard item={item} key={item.title} />)}
        </div>
      </section>

      <section className="ai-video-section ai-video-control">
        <div className="ai-video-section__heading">
          <p className="ai-video-eyebrow">Где нужен контроль</p>
          <h2>Генеративное видео всё ещё умеет ошибаться красиво</h2>
        </div>
        <div className="ai-video-control__grid">
          <div><ShieldCheck aria-hidden="true" /><h3>Персонажи и лица</h3><p>Следим за идентичностью, анатомией и поведением героя от кадра к кадру.</p></div>
          <div><Clapperboard aria-hidden="true" /><h3>Монтаж и движение</h3><p>Сцены должны работать вместе, а не быть набором эффектных независимых генераций.</p></div>
          <div><Film aria-hidden="true" /><h3>Продукт и бренд</h3><p>Там, где нужна точность, используем гибридный пайплайн, графику, 3D и ручной композинг.</p></div>
        </div>
      </section>

      <section className="ai-video-section ai-video-process">
        <div className="ai-video-section__heading">
          <p className="ai-video-eyebrow">Как работаем</p>
          <h2>Сначала режиссура. Потом модели.</h2>
        </div>
        <div className="ai-video-process__grid">
          {process.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-video-cta">
        <p className="ai-video-eyebrow">Есть идея или сложная сцена?</p>
        <h2>Разберёмся, где AI действительно усиливает проект — и соберём вокруг него нормальный продакшн.</h2>
        <a href={telegramUrl} target="_blank" rel="noreferrer">Обсудить AI-видео <ArrowRight aria-hidden="true" /></a>
      </section>

      <SiteFooter />
    </main>
  );
}
