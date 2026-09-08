import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { caseEvidence } from '../content/caseEvidence';
import './Evidence.css';

export default function CaseEvidence({ path }) {
  const data = caseEvidence[path];
  if (!data) return null;
  return (
    <section
      className="case-evidence"
      id="project-passport"
      aria-labelledby="case-evidence-title"
    >
      <p className="evidence-eyebrow">
        Паспорт проекта · для предварительной оценки подрядчика
      </p>
      <h2 id="case-evidence-title">Что сделано и чем это подтверждается</h2>
      <dl className="case-evidence-rows">
        <div>
          <dt>Задача</dt>
          <dd>{data.task}</dd>
        </div>
        <div>
          <dt>Аудитория и канал</dt>
          <dd>{data.audience}</dd>
        </div>
        <div>
          <dt>Состав результата</dt>
          <dd>
            <ul>
              {data.delivery.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Наблюдаемый результат</dt>
          <dd>{data.result}</dd>
        </div>
        <div>
          <dt>Источники</dt>
          <dd>
            <p>
              Первичный материал — работа из портфолио. Описание производства —
              данные Anix, не независимый аудит.
            </p>
            {data.sources.map(([label, href]) => (
              <a
                className="evidence-source"
                href={href}
                target="_blank"
                rel="noreferrer"
                key={href}
              >
                {label}
                <ExternalLink aria-hidden="true" />
              </a>
            ))}
          </dd>
        </div>
        <div>
          <dt>Границы доказательств</dt>
          <dd>{data.limits}</dd>
        </div>
        <div>
          <dt>Что перенести в новое ТЗ</dt>
          <dd>{data.acceptance}</dd>
        </div>
      </dl>
      <a className="evidence-source" href="/procurement/#measurement">
        Методика оценки и документы для закупки
        <ArrowRight aria-hidden="true" />
      </a>
    </section>
  );
}
