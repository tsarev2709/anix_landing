import React from 'react';
import { ArrowRight } from 'lucide-react';
import { caseEvidence } from '../content/caseEvidence';
import './Evidence.css';

export default function EvidenceShowcase({ direction }) {
  const entries = Object.entries(caseEvidence).filter(([path]) =>
    direction === 'hse'
      ? path.includes('multon')
      : direction === 'pharma'
        ? !path.includes('multon')
        : true
  );
  return (
    <section className="evidence-showcase">
      <p className="evidence-eyebrow">Работы, источники, границы результата</p>
      <h2>Кейсы, которые можно разобрать до закупки</h2>
      <div className="evidence-grid">
        {entries.map(([path, data]) => (
          <a
            className="evidence-card"
            href={`${path}/#project-passport`}
            key={path}
          >
            <span>{data.category}</span>
            <h3>{data.name}</h3>
            <p>{data.task}</p>
            <strong>
              Состав работ и доказательства <ArrowRight aria-hidden="true" />
            </strong>
          </a>
        ))}
      </div>
      {direction !== 'hse' && (
        <figure className="evidence-quote">
          <blockquote>
            «Очень украшает сделанный вами ролик наш стенд. Спасибо огромное!»
          </blockquote>
          <figcaption>
            Алексей, маркетинговый директор «Авинейро»
            <a href="/cases/aviandr/#conference">
              Опубликованный отзыв и видео стенда →
            </a>
          </figcaption>
        </figure>
      )}
      {direction === 'hse' && (
        <p className="evidence-limits">
          Мултон Партнерс — кейс маскота и HSE-карточек. Демополигон и сцены
          риска ниже показывают возможности формата, но не являются
          доказательством внедрения LMS или снижения травматизма у клиента.
        </p>
      )}
    </section>
  );
}
