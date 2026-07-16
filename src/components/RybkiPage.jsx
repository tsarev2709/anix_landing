import React from 'react';
import { ArrowDown, ArrowLeft, MessageCircle } from 'lucide-react';
import './RybkiPage.css';
import './RybkiPdfSlides.css';

const telegramUrl = 'https://t.me/anix_helper';

const slides = Array.from({ length: 10 }, (_, index) => ({
  number: index + 1,
  file: `Слайд ${index + 1}.pdf`,
  label: `Слайд ${index + 1}`,
}));

function Slide({ slide, index }) {
  const pdfUrl = `/rybki-assets/${encodeURIComponent(slide.file)}`;
  const imageBase = `/rybki-rendered/slide-${slide.number}`;

  return (
    <section className="rybki-slide" id={`slide-${index + 1}`}>
      <div className="rybki-slide-meta" aria-hidden="true">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{slide.label}</span>
      </div>
      <div className="rybki-slide-frame">
        <picture>
          <source
            type="image/webp"
            srcSet={`${imageBase}-720.webp 720w, ${imageBase}-1280.webp 1280w, ${imageBase}-1920.webp 1920w`}
            sizes="(max-width: 800px) 94vw, calc(96vw - 174px)"
          />
          <img
            className="rybki-slide-image"
            src={`${imageBase}-1280.webp`}
            alt={`Кадр презентации «Рыбки» — ${slide.label}`}
            width="1920"
            height="1080"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding={index === 0 ? 'sync' : 'async'}
          />
        </picture>
        <a className="rybki-slide-open" href={pdfUrl} target="_blank" rel="noreferrer">
          Открыть PDF
        </a>
      </div>
    </section>
  );
}

export default function RybkiPage() {
  return (
    <main className="rybki-page">
      <header className="rybki-header">
        <a href="/" className="rybki-back">
          <ArrowLeft aria-hidden="true" />
          <span>Anix Studio</span>
        </a>
        <div className="rybki-header-title">РЫБКИ / PITCH DECK</div>
        <a className="rybki-contact" href={telegramUrl} target="_blank" rel="noreferrer">
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
          <Slide slide={slide} index={index} key={slide.file} />
        ))}
      </div>

      <section className="rybki-final">
        <p>Проект открыт к развитию и партнёрству</p>
        <h2>Обсудим сценарий, производство или совместную упаковку проекта</h2>
        <a href={telegramUrl} target="_blank" rel="noreferrer" className="rybki-final-button">
          <MessageCircle aria-hidden="true" />
          Написать Anix
        </a>
      </section>
    </main>
  );
}
