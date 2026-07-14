import React from 'react';
import { ArrowDown, ArrowLeft, MessageCircle } from 'lucide-react';
import './RybkiPage.css';
import './RybkiPdfSlides.css';

const telegramUrl = 'https://t.me/anix_helper';

const slides = Array.from({ length: 10 }, (_, index) => ({
  file: `Слайд ${index + 1}.pdf`,
  label: `Слайд ${index + 1}`,
}));

function Slide({ slide, index }) {
  const pdfUrl = `/rybki-assets/${encodeURIComponent(slide.file)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <section className="rybki-slide" id={`slide-${index + 1}`}>
      <div className="rybki-slide-meta" aria-hidden="true">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{slide.label}</span>
      </div>
      <div className="rybki-slide-frame">
        <iframe
          className="rybki-slide-pdf"
          src={pdfUrl}
          title={`Рыбки — ${slide.label}`}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
        <a className="rybki-slide-open" href={pdfUrl} target="_blank" rel="noreferrer">
          Открыть слайд отдельно
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
          <span>ANIX Studio</span>
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
          Написать ANIX
        </a>
      </section>
    </main>
  );
}
