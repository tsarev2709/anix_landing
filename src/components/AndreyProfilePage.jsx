import React from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  Camera,
  ExternalLink,
  FlaskConical,
  MessageCircle,
  Microscope,
  PenTool,
  Presentation,
  Sparkles,
  Theater,
} from 'lucide-react';
import SiteFooter from './SiteFooter';
import './AndreyProfilePage.css';
import './AndreyProfilePhotos.css';
import logo from '../images/logoanix.png';
import theatrePromoPhoto from '../images/andrey/profile/andrey-profile-theatre-promo.webp';
import portraitPhoto from '../images/andrey/profile/andrey-profile-portrait.webp';
import businessSchoolSpeakingPhoto from '../images/andrey/profile/andrey-profile-business-school-speaking.webp';
import novatorMoscowPhoto from '../images/andrey/profile/andrey-profile-novator-moscow.webp';
import businessSchoolGraduatesPhoto from '../images/andrey/profile/andrey-profile-business-school-graduates.webp';
import theatreGroupPhoto from '../images/andrey/profile/andrey-profile-tochka-theatre.webp';
import kafkaPhoto from '../images/andrey/profile/andrey-profile-kafka.webp';
import academyPitchPhoto from '../images/andrey/profile/andrey-profile-academy-pitch.webp';

const telegramUrl = 'https://t.me/tsarev2709';

const navLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Подход', href: '#approach' },
  { label: 'Траектория', href: '#trajectory' },
  { label: 'Наука', href: '#science' },
  { label: 'Творчество', href: '#creative' },
];

const facts = [
  'Сооснователь и продуктовый директор Anix',
  'ФБМФ МФТИ: бакалавриат, магистратура, аспирантура',
  '5 научных публикаций по биофизике',
  '7 лет преподавания драматургии',
  'Финалист «Новатора Москвы — 2024»',
];

const intersections = [
  {
    icon: BriefcaseBusiness,
    title: 'Бизнес',
    text: 'Собираю продукт, позиционирование, гипотезы, экономику и маршрут к рынку. Могу говорить и с фаундером, и с командой производства.',
  },
  {
    icon: Theater,
    title: 'Творчество',
    text: 'Работаю с драматургией, режиссурой и визуальным языком. Ищу не декоративную идею, а форму, которая удерживает внимание и меняет восприятие.',
  },
  {
    icon: BrainCircuit,
    title: 'Технологии',
    text: 'Понимаю ограничения AI-пайплайна, продуктовой разработки и сложных цифровых систем. Технология для меня — инструмент результата, а не повод для фейерверка.',
  },
  {
    icon: FlaskConical,
    title: 'Наука',
    text: 'Бэкграунд в молекулярной биофизике помогает разбирать сложные темы до механики и переводить точность в понятную коммуникацию.',
  },
];

const trustCards = [
  {
    number: '01',
    title: 'Сложный продукт',
    text: 'Когда технологию, препарат или B2B-решение невозможно нормально объяснить одним слайдом.',
    href: '/medicine',
    link: 'Посмотреть Medicine',
  },
  {
    number: '02',
    title: 'Творческая концепция',
    text: 'Когда нужна история, визуальный мир, персонажи, режиссура и логика, которая переживёт первый эффектный кадр.',
    href: '/cases',
    link: 'Смотреть кейсы',
  },
  {
    number: '03',
    title: 'Новая продуктовая форма',
    text: 'Когда на входе есть идея, технология и десятки вариантов, а на выходе нужен ясный продукт и план проверки.',
    href: '/why_it_works',
    link: 'Как мы думаем',
  },
  {
    number: '04',
    title: 'Выступление или событие',
    text: 'Когда презентация должна не просто передать информацию, а собрать внимание зала в одну последовательную историю.',
    href: telegramUrl,
    link: 'Обсудить задачу',
    external: true,
  },
];

const trajectory = [
  {
    marker: 'МФТИ',
    title: 'Научная школа мышления',
    text: 'Молекулярная биофизика, структурная биология, моделирование и публикации. Привычка не принимать красивое объяснение, пока не понятна механика.',
  },
  {
    marker: 'Точка',
    title: 'Театр как лаборатория людей',
    text: 'Десятки постановок, авторская и режиссёрская работа, актёрский опыт и семь лет преподавания драматургии в студенческом театре МФТИ.',
  },
  {
    marker: 'Продукт',
    title: 'Разработка и предпринимательство',
    text: 'Управление цифровыми командами, продуктовые гипотезы, инвестиции, MVP и разворот от SaaS-инструмента к коммерческой студии.',
  },
  {
    marker: 'Anix',
    title: 'Творческо-технологическая компания',
    text: 'Сегодня соединяю стратегию, режиссуру, R&D и сложные продажи, чтобы бизнес получал не AI ради AI, а сильный визуальный результат.',
  },
];

const principles = [
  'Не обещать невозможного ради спокойного созвона сегодня.',
  'Честно показывать ограничения и вместе выбирать компромисс между сроком, качеством и объёмом.',
  'Строить долгосрочную репутацию, а не выигрывать отдельные переговоры любой ценой.',
  'Делать систему сильнее, чтобы сложность не держалась на постоянном героизме команды.',
];

const publications = [
  ['Marine Drugs, 2018', 'Novel Antimicrobial Peptides from the Arctic Polychaeta Nicomache minor', 'https://doi.org/10.3390/md16110401'],
  ['Russian Journal of Bioorganic Chemistry, 2017', 'Recombinant Production and Structural Studies of Human Lypd6 and Lypd6b', 'https://doi.org/10.1134/S1068162017060127'],
  ['International Journal of Molecular Sciences, 2020', 'Structural Diversity and Dynamics of Human Three-Finger Proteins', 'https://doi.org/10.3390/ijms21197280'],
  ['Marine Drugs, 2020', 'Structure Elucidation and Functional Studies of Capitellacin', 'https://doi.org/10.3390/md18120620'],
  ['International Journal of Molecular Sciences, 2023', 'Specific Binding of Lichenicidin to Lipid II', 'https://doi.org/10.3390/ijms24021332'],
];

const gallery = [
  {
    src: theatrePromoPhoto,
    alt: 'Андрей Царёв на фотосессии спектакля «Разбитые каменные сердца Чёрного Города»',
    label: 'Промо спектакля, 2021',
    width: 1405,
    height: 937,
  },
  {
    src: portraitPhoto,
    alt: 'Студийный портрет Андрея Царёва',
    label: 'Студийный портрет',
    width: 1800,
    height: 1200,
  },
  {
    src: businessSchoolSpeakingPhoto,
    alt: 'Андрей Царёв выступает на юбилее Бизнес-школы МФТИ',
    label: 'Выступление в Бизнес-школе МФТИ',
    width: 1800,
    height: 1200,
  },
  {
    src: novatorMoscowPhoto,
    alt: 'Плакат с Андреем Царёвым на Цветном бульваре — финалист конкурса «Новатор Москвы — 2024»',
    label: '«Новатор Москвы — 2024»',
    width: 1280,
    height: 853,
  },
  {
    src: businessSchoolGraduatesPhoto,
    alt: 'Выпускники Бизнес-школы МФТИ и СберУниверситета',
    label: 'Выпуск Бизнес-школы МФТИ и СберУниверситета',
    width: 1800,
    height: 1200,
  },
  {
    src: theatreGroupPhoto,
    alt: 'Состав студенческого театра «Точка» МФТИ после спектакля',
    label: 'Театр «Точка» МФТИ',
    width: 1200,
    height: 800,
  },
  {
    src: kafkaPhoto,
    alt: 'Андрей Царёв в Гоголь-центре на фоне изображения Франца Кафки',
    label: 'Гоголь-центр / Франц Кафка',
    width: 1712,
    height: 958,
  },
  {
    src: academyPitchPhoto,
    alt: 'Андрей Царёв презентует нейросеть Anix на Академии инноваторов',
    label: 'Питчинг Академии инноваторов / Anix',
    width: 1800,
    height: 1200,
  },
];

function Header() {
  return (
    <header className="andrey-header">
      <a className="andrey-logo" href="/" aria-label="Anix Studio">
        <img src={logo} alt="Anix" />
      </a>
      <nav aria-label="Навигация по странице Андрея Царёва">
        {navLinks.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
      </nav>
      <a className="andrey-header-cta" href={telegramUrl} target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden="true" />
        Написать
      </a>
    </header>
  );
}

function IntersectionCard({ item }) {
  const Icon = item.icon;
  return (
    <article className="andrey-intersection-card">
      <Icon aria-hidden="true" />
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  );
}

export default function AndreyProfilePage() {
  return (
    <main className="andrey-page">
      <Header />

      <section className="andrey-hero">
        <div className="andrey-hero-copy">
          <p className="andrey-eyebrow">Андрей Царёв / co-founder & product director Anix</p>
          <h1>Собираю сложные идеи в продукты, истории и работающие системы</h1>
          <p className="andrey-lead">
            Предприниматель, режиссёр, сценарист и биофизик. Работаю там, где бизнесу недостаточно просто «сделать красиво»: нужно понять сложную тему, найти сильную форму и довести её до результата.
          </p>
          <div className="andrey-actions">
            <a className="andrey-button andrey-button-primary" href={telegramUrl} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" />
              Связаться в Telegram
            </a>
            <a className="andrey-button andrey-button-secondary" href="/cases">
              Кейсы Anix
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
          <div className="andrey-facts" aria-label="Факты об Андрее Царёве">
            {facts.map((fact) => <span key={fact}><BadgeCheck aria-hidden="true" />{fact}</span>)}
          </div>
        </div>

        <div className="andrey-hero-visual" data-photo-layout="natural" aria-label="Фотографии Андрея Царёва">
          <figure className="andrey-hero-main">
            <img
              src={portraitPhoto}
              alt="Студийный портрет Андрея Царёва"
              width={1800}
              height={1200}
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>Предприниматель, автор, режиссёр</figcaption>
          </figure>
          <figure className="andrey-hero-side">
            <img
              src={theatrePromoPhoto}
              alt="Андрей Царёв в промо спектакля «Разбитые каменные сердца Чёрного Города»"
              width={1405}
              height={937}
              decoding="async"
            />
            <figcaption>Чёрный Город / театр</figcaption>
          </figure>
        </div>
      </section>

      <section className="andrey-statement" id="approach">
        <p className="andrey-eyebrow">Что во мне полезно проекту</p>
        <h2>Я вижу не отдельный ролик, сайт или презентацию. Я вижу систему решений вокруг идеи.</h2>
        <p>
          Мне комфортно входить в задачу, где ещё неясно, что именно нужно производить. Разобрать содержание, аудиторию и ограничения; найти продуктовую логику; придумать драматургию; собрать людей и технологию; проверить, что итог можно продать, показать и использовать дальше.
        </p>
      </section>

      <section className="andrey-section">
        <div className="andrey-section-head">
          <p className="andrey-eyebrow">Четыре оптики</p>
          <h2>Редкая связка, которая особенно хорошо работает на сложных проектах</h2>
        </div>
        <div className="andrey-intersection-grid">
          {intersections.map((item) => <IntersectionCard item={item} key={item.title} />)}
        </div>
      </section>

      <section className="andrey-section andrey-trust-section">
        <div className="andrey-section-head andrey-section-head-light">
          <p className="andrey-eyebrow">Что можно мне доверить</p>
          <h2>Задачи, где нужно одновременно думать, придумывать и отвечать за сборку</h2>
        </div>
        <div className="andrey-trust-grid">
          {trustCards.map((item) => (
            <a className="andrey-trust-card" href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <strong>{item.link}<ArrowRight aria-hidden="true" /></strong>
            </a>
          ))}
        </div>
      </section>

      <section className="andrey-section" id="trajectory">
        <div className="andrey-trajectory-layout">
          <div className="andrey-trajectory-intro">
            <p className="andrey-eyebrow">Траектория</p>
            <h2>Не набор случайных профессий, а одна линия</h2>
            <p>
              Я долго жил сразу в нескольких мирах. Со временем стало понятно: сильнее всего я не внутри одной узкой роли, а в точке их соединения — когда сложной идее нужны стратегия, язык, технология и люди.
            </p>
          </div>
          <ol className="andrey-timeline">
            {trajectory.map((item) => (
              <li key={item.marker}>
                <span>{item.marker}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="andrey-section andrey-science" id="science">
        <div className="andrey-science-copy">
          <p className="andrey-eyebrow">Научный фундамент</p>
          <h2>Умею не бояться материала, который нельзя понять за пять минут</h2>
          <p>
            ФБМФ МФТИ, молекулярная биофизика, структурные исследования белков и антимикробных пептидов. Научный опыт нужен мне не для статусной строки: он даёт терпение к сложности и уважение к точности — особенно в фарме, MedTech и технологических продуктах.
          </p>
          <a className="andrey-inline-link" href="/medicine">
            <Microscope aria-hidden="true" />
            Научная экспертиза в Anix Medicine
            <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <div className="andrey-publications">
          {publications.map(([venue, title, href]) => (
            <a href={href} target="_blank" rel="noreferrer" key={href}>
              <span>{venue}</span>
              <strong>{title}</strong>
              <ExternalLink aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      <section className="andrey-section andrey-creative" id="creative">
        <div className="andrey-creative-photo">
          <img
            src={theatreGroupPhoto}
            alt="Состав студенческого театра «Точка» МФТИ после спектакля"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="andrey-creative-copy">
          <p className="andrey-eyebrow">Театр и авторство</p>
          <h2>Драматургия для меня — способ проектировать внимание, а не украшать текст</h2>
          <p>
            В театре «Точка» МФТИ я работал как автор, актёр, режиссёр и участник производства, а затем семь лет преподавал драматургию. Постановки выходили в концертном зале и медиа-залах МФТИ, а также на московских культурных площадках.
          </p>
          <p>
            Параллельно пишу прозу и сценарии — от сюрреалистических и ироничных текстов до неонуарных и фантастических историй. Этот опыт напрямую переносится в коммерческую работу: где конфликт, что зритель должен почувствовать и почему он досмотрит до конца.
          </p>
          <a className="andrey-inline-link" href="/rybki">
            <PenTool aria-hidden="true" />
            Посмотреть авторский проект «Рыбки»
            <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="andrey-section andrey-principles">
        <div>
          <p className="andrey-eyebrow">Как со мной работать</p>
          <h2>Без обещаний невозможного. С уважением к качеству, людям и реальным ограничениям.</h2>
        </div>
        <ul>
          {principles.map((item) => <li key={item}><Sparkles aria-hidden="true" /><span>{item}</span></li>)}
        </ul>
      </section>

      <section className="andrey-section andrey-gallery-section" id="gallery">
        <div className="andrey-section-head">
          <p className="andrey-eyebrow">Архив</p>
          <h2>Сцена, наука, предпринимательство и несколько жизней внутри одной</h2>
        </div>
        <div className="andrey-gallery">
          {gallery.map((photo, index) => (
            <figure className={`andrey-gallery-item andrey-gallery-item-${index + 1}`} key={photo.src}>
              <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
              <figcaption><Camera aria-hidden="true" />{photo.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="andrey-section andrey-channels">
        <div className="andrey-channels-copy">
          <p className="andrey-eyebrow">Публичные заметки</p>
          <h2>Два канала — две стороны одной работы</h2>
          <p>В одном разбираю предпринимательство и строительство компании. В другом — сценарии, прозу, театр, музыку и то, как вообще возникает творческая форма.</p>
        </div>
        <div className="andrey-channel-grid">
          <a href="https://t.me/tsarev_startup" target="_blank" rel="noreferrer">
            <BriefcaseBusiness aria-hidden="true" />
            <span>Предпринимательство</span>
            <h3>Царёв про стартаперство</h3>
            <strong>Открыть канал <ExternalLink aria-hidden="true" /></strong>
          </a>
          <a href="https://t.me/tsarev_creative" target="_blank" rel="noreferrer">
            <BookOpen aria-hidden="true" />
            <span>Творчество</span>
            <h3>Творчество с Царёвым</h3>
            <strong>Открыть канал <ExternalLink aria-hidden="true" /></strong>
          </a>
        </div>
      </section>

      <section className="andrey-final" id="contact">
        <div>
          <p className="andrey-eyebrow">Следующий проект</p>
          <h2>Приходите с задачей, которую пока трудно даже нормально сформулировать</h2>
          <p>
            Я помогу разобрать содержание, найти сильную форму и понять, что именно нужно собрать: продукт, ролик, концепцию, выступление или целую коммуникационную систему.
          </p>
        </div>
        <div className="andrey-final-actions">
          <a className="andrey-button andrey-button-light" href={telegramUrl} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" />
            Написать Андрею
          </a>
          <a className="andrey-button andrey-button-dark-outline" href="/cases">
            <Presentation aria-hidden="true" />
            Кейсы Anix
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
