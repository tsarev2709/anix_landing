import React from 'react';
import { ArrowRight, Film, Layers3, MessageCircle, Microscope, Sparkles, WandSparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';
import SiteFooter from './SiteFooter';
import littlePrinceImage from '../images/cases/little-prince.webp';
import agrotechImage from '../images/cases/agrotech.webp';
import multonImage from '../images/cases/multon-partners.webp';
import mosfarmaImage from '../images/cases/mosfarma.webp';
import hemotechImage from '../images/cases/hemotech-ai.webp';
import './AnimationPage.css';

const telegramUrl = 'https://t.me/anix_helper';

const jobs = [
  {
    icon: Layers3,
    title: 'Объяснить сложное',
    text: 'Когда продукт, технология или процесс не помещаются в один слайд, а обычная съёмка не показывает главное.',
  },
  {
    icon: Sparkles,
    title: 'Сделать так, чтобы запомнили',
    text: 'Создаём визуальный язык, персонажей и сцены, которые продолжают жить после первого просмотра.',
  },
  {
    icon: Film,
    title: 'Показать то, что нельзя снять',
    text: 'Молекулы, исторические миры, будущие технологии, внутренние процессы и невозможные пространства.',
  },
];

const formats = [
  ['Объясняющие ролики', 'Для B2B, технологий и продуктов с длинным циклом принятия решения.'],
  ['Продуктовая анимация', 'Когда нужно показать механику, интерфейс, процесс или ценность продукта.'],
  ['Научная визуализация', 'Для медицины, фармы, MedTech и других наукоёмких тем.'],
  ['Персонажи и маскоты', 'Создаём героев, которые удерживают внимание и собирают вокруг продукта узнаваемый язык.'],
  ['Cinematic & mixed media', 'Соединяем анимацию, AI, графику, 3D и другие техники под конкретную режиссёрскую задачу.'],
  ['Серии и визуальные системы', 'Один ролик может стать началом системы: адаптаций, карточек, презентаций и следующих выпусков.'],
];

const cases = [
  {
    title: 'Маленький принц',
    note: 'Кинематографичная фантазия и проверка художественного языка в очень короткий срок.',
    image: littlePrinceImage,
    href: '/cases/little-prince/',
  },
  {
    title: 'АгроТех',
    note: 'Технологичная отрасль превращается в живой мир будущего — вместо сухого рассказа о продукте.',
    image: agrotechImage,
    href: '/cases/b2b/',
  },
  {
    title: 'Мултон Партнерс',
    note: 'Маскот и визуальная система, которая помогает правилам безопасности оставаться в поле внимания.',
    image: multonImage,
    href: '/cases/multon-partners/',
  },
  {
    title: 'Мосфарма',
    note: 'Анимационный ролик с бренд-персонажами, подготовленный под требования федерального эфира.',
    image: mosfarmaImage,
    href: '/cases/mosfarma/',
  },
  {
    title: 'Авиандр',
    note: 'Медицинская анимация, маскоты и визуальный язык для врачебной аудитории.',
    placeholder: 'А',
    href: '/cases/aviandr/',
  },
  {
    title: 'Hemotech AI',
    note: 'Минималистичная визуальная система для сложного MedTech-продукта.',
    image: hemotechImage,
    href: '/cases/hemotech-ai/',
  },
];

const process = [
  ['01', 'Разбираемся', 'Понимаем продукт, аудиторию, контекст просмотра и то, что зритель должен унести с собой.'],
  ['02', 'Строим историю', 'Находим драматургию, визуальную метафору и форму, которая работает именно для этой задачи.'],
  ['03', 'Создаём язык', 'Определяем стиль, персонажей, композицию, движение и производственный пайплайн.'],
  ['04', 'Производим', 'Соединяем анимацию, дизайн, AI, 3D, монтаж и звук в нужной пропорции.'],
  ['05', 'Развиваем', 'При необходимости превращаем ролик в серию, визуальную систему или набор адаптаций.'],
];

function CaseCard({ item }) {
  return (
    <a className="animation-case" href={item.href}>
      <div className={`animation-case__media${item.image ? '' : ' animation-case__media--placeholder'}`}>
        {item.image ? <img src={item.image} alt={`Кейс Anix: ${item.title}`} loading="lazy" /> : <span>{item.placeholder}</span>}
      </div>
      <div className="animation-case__body">
        <h3>{item.title}</h3>
        <p>{item.note}</p>
        <span>Смотреть кейс <ArrowRight aria-hidden="true" /></span>
      </div>
    </a>
  );
}

export default function AnimationPage() {
  return (
    <main className="animation-page">
      <header className="animation-header">
        <a href="/" aria-label="Anix Studio — на главную"><BrandLogo alt="Anix Studio" width={120} height={44} /></a>
        <nav aria-label="Навигация страницы анимационных роликов">
          <a href="#tasks">Задачи</a>
          <a href="#formats">Форматы</a>
          <a href="#cases">Кейсы</a>
        </nav>
        <a className="animation-header__cta" href={telegramUrl} target="_blank" rel="noreferrer">Обсудить ролик</a>
      </header>

      <section className="animation-hero">
        <p className="animation-eyebrow">Anix Studio / анимационные ролики</p>
        <h1>Создание анимационных роликов для сложных продуктов</h1>
        <p className="animation-hero__lead">
          Придумываем и производим анимационные ролики для технологий, фармы, B2B, образования и специальных проектов — там, где недостаточно просто красиво показать продукт.
        </p>
        <div className="animation-hero__actions">
          <a className="animation-button animation-button--primary" href={telegramUrl} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" /> Обсудить задачу
          </a>
          <a className="animation-button" href="/cases/">Посмотреть кейсы <ArrowRight aria-hidden="true" /></a>
        </div>
        <div className="animation-hero__statement">
          <WandSparkles aria-hidden="true" />
          <p>Не начинаем с вопроса «2D или 3D?». Сначала понимаем, что должно произойти со зрителем.</p>
        </div>
      </section>

      <section className="animation-section" id="tasks">
        <div className="animation-section__heading">
          <p className="animation-eyebrow">Когда нужна анимация</p>
          <h2>Когда продукт нельзя нормально объяснить обычным кадром</h2>
        </div>
        <div className="animation-jobs">
          {jobs.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="animation-section animation-section--dark" id="formats">
        <div className="animation-section__heading">
          <p className="animation-eyebrow">Что создаём</p>
          <h2>Форма под задачу, а не задача под технику</h2>
        </div>
        <div className="animation-formats">
          {formats.map(([title, text], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="animation-section" id="cases">
        <div className="animation-section__heading animation-section__heading--with-link">
          <div>
            <p className="animation-eyebrow">Работы Anix</p>
            <h2>Разные задачи. Разные визуальные языки.</h2>
          </div>
          <a href="/cases/">Все кейсы <ArrowRight aria-hidden="true" /></a>
        </div>
        <div className="animation-cases">
          {cases.map((item) => <CaseCard item={item} key={item.title} />)}
        </div>
      </section>

      <section className="animation-section animation-process">
        <div className="animation-section__heading">
          <p className="animation-eyebrow">Как работаем</p>
          <h2>От сложной фактуры до ролика, который хочется досмотреть</h2>
        </div>
        <div className="animation-process__grid">
          {process.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="animation-expertise">
        <div><Microscope aria-hidden="true" /><span>Наукоёмкий бэкграунд</span></div>
        <div><Film aria-hidden="true" /><span>Режиссура и драматургия</span></div>
        <div><WandSparkles aria-hidden="true" /><span>AI как часть продакшна</span></div>
      </section>

      <section className="animation-cta">
        <p className="animation-eyebrow">Есть сложная задача?</p>
        <h2>Покажите продукт. Придумаем, как сделать его понятным и интересным.</h2>
        <a href={telegramUrl} target="_blank" rel="noreferrer">Обсудить анимационный ролик <ArrowRight aria-hidden="true" /></a>
      </section>

      <SiteFooter />
    </main>
  );
}
