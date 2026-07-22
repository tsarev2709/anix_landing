import React from 'react';
import { ArrowLeft, ArrowRight, Camera, HardHat, Stethoscope, Workflow } from 'lucide-react';
import BrandLogo from './BrandLogo';
import SiteFooter from './SiteFooter';
import agrotechImage from '../images/cases/agrotech.webp';
import aviandrCoverImage from '../images/cases/aviandr-cover.webp';
import bondarchukImage from '../images/cases/bondarchuk.webp';
import borodinoImage from '../images/cases/borodino.webp';
import clappyImage from '../images/cases/clappy.webp';
import factoryDirectorImage from '../images/cases/factory-director.webp';
import hemotechImage from '../images/cases/hemotech-ai.webp';
import koloboxImage from '../images/cases/kolobox.webp';
import littlePrinceImage from '../images/cases/little-prince.webp';
import mftiImage from '../images/cases/mfti-endowment.webp';
import mosfarmaImage from '../images/cases/mosfarma.webp';
import multonImage from '../images/cases/multon-partners.webp';
import startechImage from '../images/cases/startech.webp';
import tpesImage from '../images/cases/tpes.webp';
import yurrobotImage from '../images/cases/yurrobot.webp';
import './CasesHubPage.css';
import './CasesCategoryPage.css';

const categoryConfig = {
  '/cases/b2b': {
    eyebrow: 'B2B / Technology',
    title: 'Технологии, B2B и сложные продукты',
    description:
      'Кейсы для продуктов, которые трудно объяснить одним слайдом: сложная механика, новая категория, длинный цикл продажи или профессиональная аудитория.',
    icon: Workflow,
    cases: [
      {
        title: 'Factory Director',
        image: factoryDirectorImage,
        note: 'Маскот и конференционный ролик для сложного B2B-продукта.',
      },
      {
        title: 'Стартех',
        image: startechImage,
        note: 'Переупаковка продукта и объясняющий ролик для регионального B2B.',
      },
      {
        title: 'Kolobox',
        image: koloboxImage,
        note: 'Яркая визуальная история для продукта с непростой первой реакцией аудитории.',
        href: 'https://drive.google.com/file/d/1eI5mODOu-mJ54QLPM_q0YuUP9bWjLN5k/view',
      },
      {
        title: 'ЮРРОБОТ',
        image: yurrobotImage,
        note: 'Короткий ролик для узкой профессиональной аудитории.',
        href: 'https://drive.google.com/file/d/1bwItNtWXY-IfIrG910jVYGbsOH9BJukR/view',
      },
      {
        title: 'АгроТех',
        image: agrotechImage,
        note: 'История, в которой технологичная отрасль становится живым миром будущего.',
      },
      {
        title: 'ТПЭС',
        image: tpesImage,
        note: 'Промышленный B2B: объяснить реактивные потери быстрее 50 слайдов.',
        href: '/cases/tpes/',
      },
      {
        title: 'Эндаумент-фонд МФТИ',
        image: mftiImage,
        note: 'Анимационная система, которая стала самостоятельным инфоповодом.',
        href: '/cases/mfti-endowment/',
      },
      {
        title: 'Clappy',
        image: clappyImage,
        note: 'Explainer для продукта, который раньше приходилось долго объяснять.',
        href: '/cases/clappy/',
      },
    ],
  },
  '/cases/medicine': {
    eyebrow: 'Pharma / MedTech',
    title: 'Pharma, MedTech и медицина',
    description:
      'Проекты, где одновременно важны точность, доверие и внимание: медицинские продукты, препараты, доказательная база, врачи и пациенты.',
    icon: Stethoscope,
    cases: [
      {
        title: 'Hemotech AI',
        image: hemotechImage,
        note: 'Спокойная визуальная система для инновационного MedTech-продукта.',
        href: '/cases/hemotech-ai/',
      },
      {
        title: 'Мосфарма',
        image: mosfarmaImage,
        note: 'ТВ-ролик с бренд-персонажами и требованиями федерального эфира.',
        href: '/cases/mosfarma/',
      },
      {
        title: 'Авиандр',
        image: aviandrCoverImage,
        note: 'Медицинская анимация, доказательная база, маскоты и визуальная система препарата.',
        href: '/cases/aviandr/',
      },
    ],
  },
  '/cases/cinema': {
    eyebrow: 'Cinema / Creative',
    title: 'Cinema & Creative',
    description:
      'Кинематографичные прототипы, исторические миры и авторские эксперименты — там, где важны атмосфера, художественный язык и скорость проверки идеи.',
    icon: Camera,
    cases: [
      {
        title: 'Маленький принц',
        image: littlePrinceImage,
        note: 'Имиджевый ролик-фантазия, собранный за один день.',
        href: '/cases/little-prince/',
      },
      {
        title: 'Фёдор Бондарчук',
        image: bondarchukImage,
        note: 'Кинематографичный прототип сцены с нужной атмосферой за несколько часов.',
        href: 'https://drive.google.com/file/d/1wnRsoYIgio_MilkNFRlEBuTfgJfzx25d/view',
      },
      {
        title: 'Бородино',
        image: borodinoImage,
        note: 'Исторический ролик с вниманием к форме, оружию, среде и масштабу.',
        href: '/cases/borodino/',
      },
    ],
  },
  '/cases/hse': {
    eyebrow: 'HSE / Safety',
    title: 'Охрана труда',
    description:
      'Визуальные системы, которые помогают правилам безопасности не растворяться в регламентах и оставаться в поле внимания сотрудников.',
    icon: HardHat,
    cases: [
      {
        title: 'Мултон Партнерс',
        image: multonImage,
        note: 'Маскот и визуальная система коммуникации жизненно важных правил.',
        href: '/cases/multon-partners/',
      },
    ],
  },
};

function CategoryCaseCard({ item }) {
  const content = (
    <>
      <div
        className={`cases-hub-card__media${item.image ? '' : ' cases-hub-card__media--placeholder'}`}
      >
        {item.image ? (
          <img src={item.image} alt={`Кейс Anix: ${item.title}`} loading="lazy" />
        ) : (
          <span>{item.placeholder}</span>
        )}
      </div>
      <div className="cases-hub-card__body">
        <h3>{item.title}</h3>
        <p>{item.note}</p>
        <span className="cases-hub-card__action">
          {item.href ? 'Смотреть кейс' : 'Страница кейса готовится'}
          {item.href ? <ArrowRight aria-hidden="true" /> : null}
        </span>
      </div>
    </>
  );

  if (!item.href) return <article className="cases-hub-card">{content}</article>;

  const external = /^https?:\/\//.test(item.href);
  return (
    <a
      className="cases-hub-card"
      href={item.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      {content}
    </a>
  );
}

export default function CasesCategoryPage({ path }) {
  const category = categoryConfig[path];
  if (!category) return null;

  const Icon = category.icon;
  return (
    <main className="cases-hub-page cases-category-page">
      <header className="cases-hub-header">
        <a href="/" className="cases-hub-logo" aria-label="Anix Studio — на главную">
          <BrandLogo alt="Anix Studio" width={120} height={44} />
        </a>
        <a
          className="cases-hub-header__cta"
          href="https://t.me/anix_helper"
          target="_blank"
          rel="noreferrer"
        >
          Обсудить проект
        </a>
      </header>
      <section className="cases-category-hero">
        <a className="cases-category-back" href="/cases/">
          <ArrowLeft aria-hidden="true" /> Все кейсы
        </a>
        <div className="cases-hub-category__icon">
          <Icon aria-hidden="true" />
        </div>
        <p className="cases-hub-eyebrow">{category.eyebrow}</p>
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </section>
      <section className="cases-hub-category cases-category-listing">
        <div
          className={`cases-hub-grid${
            category.cases.length === 1 ? ' cases-hub-grid--single' : ''
          }`}
        >
          {category.cases.map((item) => (
            <CategoryCaseCard item={item} key={item.title} />
          ))}
        </div>
      </section>
      <section className="cases-hub-cta">
        <p className="cases-hub-eyebrow">Другие задачи</p>
        <h2>Посмотреть все направления и кейсы Anix</h2>
        <a href="/cases/">
          Открыть все кейсы <ArrowRight aria-hidden="true" />
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}
