import React from 'react';
import { ArrowRight, Download, FileText } from 'lucide-react';
import procurement from '../content/procurement.json';
import './Procurement.css';

export default function ProcurementDownloads({ product, standalone = false }) {
  const products = procurement.products.filter(
    (item) => !product || item.id === product
  );
  return (
    <section
      className="procurement-downloads"
      aria-labelledby="procurement-downloads-title"
    >
      <div className="procurement-heading">
        <p className="procurement-eyebrow">
          Для руководителя и закупки · без регистрации
        </p>
        <h2 id="procurement-downloads-title">
          Документы, которые можно переслать коллегам
        </h2>
        <p>
          Состав продуктов, границы работ и пример закупочного пакета. Версия{' '}
          {procurement.version}. Это стартовая рамка, не оферта и не подписанный
          договор.
        </p>
      </div>
      <div className="procurement-download-grid">
        {products.map((item) => (
          <a
            className="procurement-file"
            href={`/procurement/${item.file}`}
            download
            key={item.id}
          >
            <FileText aria-hidden="true" />
            <span className="procurement-file-type">PDF · 1 страница</span>
            <h3>{item.name}</h3>
            <p>
              {item.subtitle}. Результат, цены, сроки, что входит и что не
              входит.
            </p>
            <span className="procurement-file-action">
              Скачать одностраничник <Download aria-hidden="true" />
            </span>
          </a>
        ))}
        <a
          className="procurement-file procurement-file--kit"
          href="/procurement/anix-procurement-kit.pdf"
          download
        >
          <FileText aria-hidden="true" />
          <span className="procurement-file-type">PDF · 4 страницы</span>
          <h3>Пакет для закупки</h3>
          <p>
            Пример ТЗ, материалы от клиента, календарный план, этапы приёмки и
            procurement checklist.
          </p>
          <span className="procurement-file-action">
            Скачать комплект <Download aria-hidden="true" />
          </span>
        </a>
      </div>
      {!standalone && (
        <a className="procurement-more" href="/procurement/">
          Состав пакета, реквизиты и методика оценки{' '}
          <ArrowRight aria-hidden="true" />
        </a>
      )}
    </section>
  );
}
