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
          Документы для руководителя и закупки
        </h2>
        <p>
          Короткие PDF с составом работ, этапами согласования и примером
          закупочного пакета. Можно скачать и переслать коллегам. Версия{' '}
          {procurement.version}.
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
            <h3>
              {item.id === 'hse' ? 'Материалы по охране труда' : item.name}
            </h3>
            <p>{item.subtitle}. Результат, сроки, состав и границы работ.</p>
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
            контрольный список для закупки.
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
