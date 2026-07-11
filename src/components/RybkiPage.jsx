import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowDown, ArrowLeft, MessageCircle } from 'lucide-react';
import './RybkiPage.css';

const telegramUrl = 'https://t.me/anix_helper';

const slides = [
  {
    src: '/rybki-assets/01-cover.svg',
    alt: 'Рыбки — антиутопия о памяти. Обложка проекта.',
    label: 'Обложка',
  },
  {
    src: '/rybki-assets/02-logline.svg',
    alt: 'Логлайн полнометражного фильма «Рыбки».',
    label: 'Логлайн',
  },
  {
    src: '/rybki-assets/03-why-it-hooks.svg',
    alt: 'Почему история «Рыбки» цепляет зрителя.',
    label: 'Почему это цепляет',
  },
  {
    src: '/rybki-assets/04-synopsis.svg',
    alt: 'Синопсис полнометражного фильма «Рыбки».',
    label: 'Синопсис',
  },
  {
    src: '/rybki-assets/05-main-character.svg',
    alt: 'Главный герой И-1.',
    label: 'Главный герой',
  },
  {
    src: '/rybki-assets/06-world.svg',
    alt: 'Мир и контекст истории «Рыбки».',
    label: 'Мир',
  },
  {
    src: '/rybki-assets/08-audience.svg',
    alt: 'Целевая аудитория фильма «Рыбки».',
    label: 'Для кого',
  },
  {
    src: '/rybki-assets/09-potential.svg',
    alt: 'Потенциал проекта «Рыбки».',
    label: 'Потенциал',
  },
];

function Slide({ slide, index }) {
  const [failed, setFailed] = useState(false);

  return (
    <section className="rybki-slide" id={`slide-${index + 1}`}>
      <div className="rybki-slide-meta" aria-hidden="true">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{slide.label}</span>
      </div>
      <div className="rybki-slide-frame">
        {failed ? (
          <div className="rybki-asset-missing">
            <strong>{slide.label}</strong>
            <span>SVG-файл будет опубликован вместе с финальными материалами.</span>
          </div>
        ) : (
          <img
            src={slide.src}
            alt={slide.alt}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </section>
  );
}

export default function RybkiPage() {
  return (
    <main className="rybki-page">
      <Helmet>
        <title>Рыбки — полнометражный фильм | ANIX</title>
        <meta
          name="description"
          content="Рыбки — научно-фантастический триллер и антиутопия о памяти, свободе и человеке внутри корпоративной системы будущего."
        />
        <link rel="canonical" href="https://studio.anix-ai.pro/rybki" />
        <meta property="og:title" content="Рыбки — антиутопия о памяти" />
        <meta
          property="og:description"
          content="Полнометражный sci-fi триллер: логлайн, синопсис, герой, мир, аудитория и потенциал проекта."
        />
        <meta property="og:url" content="https://studio.anix-ai.pro/rybki" />
        <meta property="og:type" content="website" />
      </Helmet>

      <header className="rybki-header">
        <a href="/" className="rybki-back">
          <ArrowLeft aria-hidden="true" />
          <span>ANIX Studio</span>
        </a>
        <div className="rybki-header-title">РЫБКИ / PITCH DECK</div>
        <a
          className="rybki-contact"
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
        >
          Обсудить проект
        </a>
      </header>

      <section className="rybki-intro" aria-label="О проекте">
        <div>
          <p>Полнометражный фильм</p>
          <h1>Антиутопия о памяти, свободе и праве человека остаться собой</h1>
        </div>
        <a href="#slide-2" className="rybki-scroll-cue">
          <span>Смотреть проект</span>
          <ArrowDown aria-hidden="true" />
        </a>
      </section>

      <div className="rybki-slides">
        {slides.map((slide, index) => (
          <Slide slide={slide} index={index} key={slide.src} />
        ))}
      </div>

      <section className="rybki-final">
        <p>Проект открыт к развитию и партнёрству</p>
        <h2>Обсудим сценарий, производство или совместную упаковку проекта</h2>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          className="rybki-final-button"
        >
          <MessageCircle aria-hidden="true" />
          Написать ANIX
        </a>
      </section>
    </main>
  );
}
