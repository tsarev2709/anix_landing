import React from 'react';
import { Helmet } from 'react-helmet';
import { ArrowDown, ArrowLeft, MessageCircle } from 'lucide-react';
import rybkiDeckData from '../generated/rybkiDeckData';
import './RybkiLayeredPage.css';

const telegramUrl = 'https://t.me/anix_helper';

function cleanCopy(section) {
  const ignored = new Set([
    section.heading.toLowerCase(),
    section.label.toLowerCase(),
    'рыбки',
  ]);

  const extracted = (section.text || [])
    .map((item) => item.trim())
    .filter((item) => item.length > 2)
    .filter((item) => !ignored.has(item.toLowerCase()))
    .filter((item, index, items) => items.indexOf(item) === index);

  return extracted.length ? extracted.slice(0, 8) : section.fallback;
}

function ArtLayer({ section, index }) {
  const base = `/rybki-page-assets/${section.slug}-base`;
  const overlay = `/rybki-page-assets/${section.slug}-overlay.svg`;

  return (
    <div className={`rybki-layered-art rybki-layered-art-${index + 1}`}>
      <picture>
        <source
          type="image/webp"
          srcSet={`${base}-720.webp 720w, ${base}-1280.webp 1280w, ${base}-1800.webp 1800w`}
          sizes="(max-width: 860px) 92vw, 56vw"
        />
        <img
          className="rybki-layered-base"
          src={`${base}-1280.webp`}
          alt=""
          width="1672"
          height="941"
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          decoding={index === 0 ? 'sync' : 'async'}
        />
      </picture>
      <img
        className="rybki-layered-overlay"
        src={overlay}
        alt=""
        aria-hidden="true"
        loading={index === 0 ? 'eager' : 'lazy'}
      />
      <span className="rybki-layered-scanline" aria-hidden="true" />
    </div>
  );
}

function StorySection({ section, index }) {
  const copy = cleanCopy(section);
  const isReverse = index % 2 === 1;

  return (
    <section
      className={`rybki-layered-section${isReverse ? ' is-reverse' : ''}`}
      id={`chapter-${index + 1}`}
    >
      <div className="rybki-layered-copy">
        <div className="rybki-layered-meta">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{section.label}</span>
        </div>
        <h2>{section.heading}</h2>
        <div className="rybki-layered-text">
          {copy.map((paragraph, paragraphIndex) => (
            <p key={`${section.slug}-${paragraphIndex}`}>{paragraph}</p>
          ))}
        </div>
      </div>
      <ArtLayer section={section} index={index} />
    </section>
  );
}

export default function RybkiLayeredPage() {
  return (
    <main className="rybki-layered-page">
      <Helmet>
        <title>Рыбки — сценарный проект | ANIX</title>
        <meta
          name="description"
          content="Рыбки — полнометражный научно-фантастический триллер и антиутопия о памяти, свободе и праве человека остаться собой."
        />
        <link rel="canonical" href="https://studio.anix-ai.pro/rybki_page" />
        <meta property="og:title" content="Рыбки — антиутопия о памяти" />
        <meta
          property="og:description"
          content="Сценарный проект ANIX: логлайн, история, герой, мир, аудитория и потенциал фильма."
        />
        <meta property="og:url" content="https://studio.anix-ai.pro/rybki_page" />
        <meta property="og:type" content="website" />
      </Helmet>

      <header className="rybki-layered-header">
        <a href="/" className="rybki-layered-back">
          <ArrowLeft aria-hidden="true" />
          <span>ANIX Studio</span>
        </a>
        <span className="rybki-layered-title">РЫБКИ / SCREENPLAY</span>
        <a href={telegramUrl} target="_blank" rel="noreferrer" className="rybki-layered-contact">
          Обсудить проект
        </a>
      </header>

      <section className="rybki-layered-hero" id="top">
        <div className="rybki-layered-hero-copy">
          <p>Полнометражный фильм / sci-fi thriller</p>
          <h1>Антиутопия о памяти, свободе и праве человека остаться собой</h1>
          <a href="#chapter-1" className="rybki-layered-scroll">
            <span>Смотреть проект</span>
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
        <ArtLayer section={rybkiDeckData[0]} index={0} />
      </section>

      <div className="rybki-layered-story">
        {rybkiDeckData.slice(1).map((section, index) => (
          <StorySection section={section} index={index + 1} key={section.slug} />
        ))}
      </div>

      <section className="rybki-layered-final">
        <p>Проект открыт к развитию и партнёрству</p>
        <h2>Обсудим сценарий, производство или совместную упаковку проекта</h2>
        <a href={telegramUrl} target="_blank" rel="noreferrer" className="rybki-layered-final-button">
          <MessageCircle aria-hidden="true" />
          Написать ANIX
        </a>
      </section>
    </main>
  );
}
