import React from 'react';
import {
  BadgeCheck,
  BookOpen,
  Brain,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Mail,
  MessageCircle,
  Microscope,
  Pill,
  PlayCircle,
  Presentation,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import './MedicinePage.css';
import SiteFooter from './SiteFooter';
import logo from '../images/logoanix.png';
import hemotechImage from '../images/cases/hemotech-ai.webp';
import mosfarmaImage from '../images/cases/mosfarma.webp';
import clappyImage from '../images/cases/clappy.webp';
import andreyPhoto from '../images/experts/andrey-tsarev-scientist.webp';

const telegramUrl = 'https://t.me/anix_helper';
const emailUrl = 'mailto:studio@anix-ai.pro';

const navLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Форматы', href: '#formats' },
  { label: 'Научный директор', href: '#expert' },
  { label: 'HSE', href: '/hse' },
  { label: 'HSE-демо', href: '/hse/mvp' },
  { label: 'CEO', href: '/ceo' },
];

const heroStats = [
  ['Механизм', 'работа препарата без перегруза'],
  ['Врачи', 'ролики и визуалы для встреч, клиник, конференций'],
  ['Наука', 'структурный опыт внутри команды'],
];

const formats = [
  {
    title: 'Механизм действия препарата',
    text: 'Переводим молекулу, рецептор, клеточный процесс или каскад — и делаем наглядными',
    icon: Microscope,
  },
  {
    title: 'Ролик для конференции',
    text: 'Привлекающий внимание материал для стенда, выступления или встречи с врачами. Пробивает баннерную слепоту, собирает охваты',
    icon: Presentation,
  },
  {
    title: 'Материалы для продаж',
    text: 'Один главный ролик и версии для письма, демонстрации, Telegram, лендинга и презентации.',
    icon: PlayCircle,
  },
  {
    title: 'Маскот препарата',
    text: 'Когда бренду нужна мягкость и узнаваемость: персонаж, который помогает говорить с врачами или пациентами без холодного корпоративного лица.',
    icon: Sparkles,
  },
  {
    title: 'Материалы для медпредов',
    text: 'Сценарии первого касания, короткие видео, карточки и визуальные объяснения, которые проще отправить после встречи, чем пересказывать голосом.',
    icon: Stethoscope,
  },
  {
    title: 'Серия под портфель',
    text: 'Если препаратов несколько, собираем общую визуальную систему. Не набор разрозненных файлов, а нормальный язык коммуникации.',
    icon: Pill,
  },
];

const cases = [
  {
    title: 'Hemotech AI',
    label: 'медтех / AI-диагностика',
    image: hemotechImage,
    text: 'Нужно было быстро снизить недоверие к инновационному продукту. Мы сделали спокойный минималистичный ролик-визитку. Его стиль потом ушел в презентации и стал частью бренда.',
    result:
      'отклик и охваты выросли в несколько десятков раз по оценке фаундера',
  },
  {
    title: 'Мосфарма',
    label: 'фарма / ТВ-реклама',
    image: mosfarmaImage,
    text: 'У бренда уже были персонажи, но они выглядели холодно. Мы сохранили узнаваемость и сделали героев живее, теплее, ближе к классическому рекламному ролику.',
    result: 'ролик прошел требования Первого канала',
  },
  {
    title: 'Clappy',
    label: 'сложный B2B2C-продукт',
    image: clappyImage,
    text: 'Это не фарма, но задача очень похожая: продукт непонятен сразу двум аудиториям. Ролик собрал одну ясную историю и помог довести компанию до первых пилотов.',
    result: 'отклик на письма вырос в несколько десятков раз',
  },
];

const scienceTags = [
  'структурная биология',
  'молекулярная биофизика',
  'ЯМР-структуры',
  'антимикробные пептиды',
  'Ly6/uPAR-белки',
  'PDB-структуры',
];

const education = [
  {
    title: 'ФБМФ МФТИ',
    text: 'бакалавриат 2017, магистратура 2019, аспирантура 2023',
    href: 'https://mipt.ru/',
  },
  {
    title: 'Бизнес-школа МФТИ',
    text: '2023',
    href: 'https://business.mipt.ru/',
  },
];

const publications = [
  {
    title:
      'Novel Antimicrobial Peptides from the Arctic Polychaeta Nicomache minor',
    venue: 'Marine Drugs, 2018',
    href: 'https://doi.org/10.3390/md16110401',
  },
  {
    title:
      'Recombinant Production and Structural Studies of Human Lypd6 and Lypd6b',
    venue: 'Russian Journal of Bioorganic Chemistry, 2017',
    href: 'https://doi.org/10.1134/S1068162017060127',
  },
  {
    title: 'Structural Diversity and Dynamics of Human Three-Finger Proteins',
    venue: 'International Journal of Molecular Sciences, 2020',
    href: 'https://doi.org/10.3390/ijms21197280',
  },
  {
    title: 'Structure Elucidation and Functional Studies of Capitellacin',
    venue: 'Marine Drugs, 2020',
    href: 'https://doi.org/10.3390/md18120620',
  },
  {
    title: 'Specific Binding of Lichenicidin to Lipid II',
    venue: 'International Journal of Molecular Sciences, 2023',
    href: 'https://doi.org/10.3390/ijms24021332',
  },
];

const structures = [
  {
    code: '6HN9',
    title: 'Nicomicin-1',
    href: 'https://www.rcsb.org/structure/6HN9',
  },
  {
    code: '7ALD',
    title: 'Capitellacin',
    href: 'https://www.rcsb.org/structure/7ALD',
  },
  {
    code: '6IB6',
    title: 'Human Lypd6',
    href: 'https://www.rcsb.org/structure/6IB6',
  },
  {
    code: '6ZSO',
    title: 'Human Lypd6b',
    href: 'https://www.rcsb.org/structure/6ZSO',
  },
];

const process = [
  'Понимаем задачу, целевые метрики, портрет аудитории и её запросы.',
  'Собираем научную карту и позиционирование.',
  'Создаём драматургию и вовлекаем аудиторию в препарат.',
  'Делаем ролик и адаптации: горизонтальные и вертикальные версии, слайды, стенд, рассылка, карточки, обложки, короткие форматы.',
  'Запускаем материалы, смотрим метрики и радуемся результату.',
];

function IconCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="medicine-card">
      <Icon aria-hidden="true" />
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  );
}

function ExternalRow({ title, meta, href }) {
  return (
    <a
      className="medicine-link-row"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <span>
        <strong>{title}</strong>
        <small>{meta}</small>
      </span>
      <ExternalLink aria-hidden="true" />
    </a>
  );
}

export default function MedicinePage() {
  return (
    <main className="medicine-page">
<header className="medicine-header">
        <nav className="medicine-header-inner" aria-label="Anix Medicine">
          <a className="medicine-logo" href="/" aria-label="Anix Studio">
            <img src={logo} alt="Anix" />
          </a>
          <div className="medicine-nav-links">
            {navLinks.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <a
            className="medicine-header-cta"
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Написать
          </a>
        </nav>
      </header>

      <section className="medicine-hero" id="top">
        <div className="medicine-hero-copy">
          <p className="medicine-eyebrow">
            Anix Medicine / фарма, медтех, медицина
          </p>
          <h1>Делаем ролики для продаж препаратов</h1>
                    <p className="medicine-lead">
            Наглядно показываем работу препарата так, что интересно даже
            загруженному врачу. Собираем ролики, маскотов и визуальную систему
            для продаж.
          </p>
          <div className="medicine-actions">
            <a
              className="medicine-button medicine-button-primary"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Разобрать продукт
            </a>
            <a
              className="medicine-button medicine-button-secondary"
              href="#expert"
            >
              <Microscope aria-hidden="true" />
              Научная база
            </a>
          </div>
        </div>
        <aside className="medicine-hero-panel" aria-label="Фокус Anix Medicine">
          {heroStats.map(([value, label]) => (
            <div key={value}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </aside>
      </section>

      <section className="medicine-section medicine-intro">
        <div className="medicine-container medicine-two-col">
          <div>
            <p className="medicine-eyebrow">Где проблема</p>
            <h2>Врачи не понимают работу препаратов</h2>
          </div>
                    <div className="medicine-rich-text">
            <p>
              У врача мало времени и много скепсиса. Поэтому визуал должен
              быстро показать, что происходит в организме и почему продукт
              заслуживает разговора.
            </p>
            <p>
              Мы не заменяем экспертную команду клиента. Мы помогаем превратить
              утверждённую научную логику в понятную сцену.
            </p>
          </div>
        </div>
      </section>

      <section className="medicine-section" id="formats">
        <div className="medicine-container">
          <div className="medicine-section-head">
            <p className="medicine-eyebrow">Форматы</p>
            <h2>
              Собираем систему касаний
            </h2>
          </div>
          <div className="medicine-card-grid">
            {formats.map((item) => (
              <IconCard item={item} key={item.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="medicine-section medicine-cases">
        <div className="medicine-container">
          <div className="medicine-section-head medicine-section-head-row">
            <div>
              <p className="medicine-eyebrow">Опыт</p>
              <h2>Кейсы в фарме, медтехе и медицине</h2>
            </div>
          </div>
          <div className="medicine-case-grid">
            {cases.map((item) => (
              <article className="medicine-case" key={item.title}>
                <img
                  src={item.image}
                  alt={`Кейс Anix: ${item.title}`}
                  loading="lazy"
                />
                <div>
                  <span>{item.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <strong>{item.result}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="medicine-section medicine-expert" id="expert">
        <div className="medicine-container medicine-expert-layout">
          <div className="medicine-expert-photo">
            <img
              src={andreyPhoto}
              alt="Андрей Царёв, научно-креативный директор Anix"
              loading="lazy"
            />
          </div>
          <div className="medicine-expert-copy">
            <p className="medicine-eyebrow">В команде эксперт</p>
            <h2>Андрей Царёв помогает объяснять сложную медицинскую механику</h2>
                        <p>
              У Андрея есть научный опыт: ФБМФ МФТИ, лаборатория структурной
              биологии ионных каналов ИБХ РАН, публикации по молекулярной
              биофизике, ЯМР-структурам, антимикробным пептидам и Ly6/uPAR-белкам.
              Поэтому сначала разбираемся, что происходит на уровне молекулы и
              где это можно показать честно.
            </p>
            <div className="medicine-tag-row">
              {scienceTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="medicine-education-grid">
              {education.map((item) => (
                <a
                  className="medicine-education-card"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  key={item.title}
                >
                  <GraduationCap aria-hidden="true" />
                  <span>{item.title}</span>
                  <small>{item.text}</small>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="medicine-section medicine-science-links">
        <div className="medicine-container medicine-link-layout">
          <div>
            <p className="medicine-eyebrow">Публикации</p>
            <h2>Кликабельные научные статьи</h2>
            <div className="medicine-link-list">
              {publications.map((item) => (
                <ExternalRow
                  title={item.title}
                  meta={item.venue}
                  href={item.href}
                  key={item.href}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="medicine-eyebrow">PDB</p>
            <h2>Опубликованные структуры</h2>
            <div className="medicine-structure-grid">
              {structures.map((item) => (
                <a
                  className="medicine-structure-card"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  key={item.code}
                >
                  <strong>{item.code}</strong>
                  <span>{item.title}</span>
                  <ExternalLink aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="medicine-section medicine-process">
        <div className="medicine-container medicine-process-layout">
          <div>
            <p className="medicine-eyebrow">Процесс</p>
            <h2>Работаем прозрачно и четко</h2>
                        <p>
              Сначала фиксируем смысл, ограничения и проверку. Так меньше
              тумана в начале и меньше лишних правок в конце.
            </p>
          </div>
          <ol className="medicine-process-list">
            {process.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="medicine-section medicine-compliance">
        <div className="medicine-container medicine-compliance-inner">
          <ShieldCheck aria-hidden="true" />
          <div>
            <h2>Наша работа - решить задачу</h2>
                        <p>
              Формулировки и научную основу даёт клиент. Мы превращаем их в
              понятные материалы для продаж: ролики, карточки, слайды и короткие
              версии для разных каналов.
            </p>
          </div>
          <ul>
            <li>
              <CheckCircle2 aria-hidden="true" /> заранее фиксируем источники и
              ограничения
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" /> показываем научную
              причинность, а не декоративные молекулы
            </li>
            <li>
              <CheckCircle2 aria-hidden="true" /> готовим версии под разные
              аудитории
            </li>
          </ul>
        </div>
      </section>

      <section className="medicine-final" id="contact">
        <div className="medicine-container medicine-final-inner">
          <div>
            <p className="medicine-eyebrow">Следующий шаг</p>
            <h2>Покажите препарат, платформу или технологию. Мы предложим лучшее решение для его продаж.</h2>
          </div>
          <div className="medicine-final-actions">
            <a
              className="medicine-button medicine-button-light"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              Telegram
            </a>
            <a
              className="medicine-button medicine-button-outline-dark"
              href={emailUrl}
            >
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
