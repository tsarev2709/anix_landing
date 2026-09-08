import React from 'react';
import BrandLogo from './BrandLogo';
import SiteFooter from './SiteFooter';
import ProjectCta from './ProjectCta';
import ProcurementDownloads from './ProcurementDownloads';
import EvidenceShowcase from './EvidenceShowcase';
import data from '../content/procurement.json';
import './Procurement.css';

function Rows({ rows }) {
  return (
    <dl className="procurement-rows">
      {rows.map(([title, text]) => (
        <div key={title}>
          <dt>{title}</dt>
          <dd>{text}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ProcurementPage() {
  return (
    <main className="procurement-page">
      <header className="procurement-header">
        <a href="/" aria-label="Anix Studio — на главную">
          <BrandLogo width={120} height={44} />
        </a>
        <nav aria-label="Навигация закупочного пакета">
          <a href="/stoimost/">Цены</a>
          <a href="#documents">PDF</a>
          <a href="#acceptance">Приёмка</a>
          <a href="#details">Реквизиты</a>
        </nav>
      </header>
      <section className="procurement-hero">
        <p className="procurement-eyebrow">Anix · закупка производства</p>
        <h1>Документы для закупки медицинской анимации и HSE-видео</h1>
        <p>
          Чтобы согласовать проект с руководителем, medical/HSE-командой, IT и
          закупкой: продукты на одной странице и рабочая структура ТЗ, календаря
          и приёмки.
        </p>
        <ProjectCta className="procurement-button" />
      </section>
      <div id="documents">
        <ProcurementDownloads standalone />
      </div>
      <section className="procurement-section">
        <p className="procurement-eyebrow">
          01 · Пример, который адаптируем под задачу
        </p>
        <h2>Что зафиксировать в ТЗ</h2>
        <Rows rows={data.brief} />
      </section>
      <section className="procurement-section procurement-soft">
        <p className="procurement-eyebrow">02 · Входные материалы</p>
        <h2>Что нужно от клиента до старта</h2>
        <div className="procurement-input-grid">
          {[
            ['common', 'Для всех проектов'],
            ['pharma', 'Для фармы'],
            ['hse', 'Для HSE'],
          ].map(([key, title]) => (
            <article key={key}>
              <h3>{title}</h3>
              <ul>
                {data.inputs[key].map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p>
          Не отправляйте медицинские данные пациентов и персональные данные
          сотрудников через открытую форму. Порядок передачи конфиденциальных
          материалов согласуем отдельно.
        </p>
      </section>
      <section className="procurement-section">
        <p className="procurement-eyebrow">03 · Типовой календарь</p>
        <h2>Одна минута видео — обычно одна неделя</h2>
        <p>
          Пример для одного ролика, не обещание для всей серии. Дни календарные;
          до старта согласуем доступность команды и валидатора. Паузы на
          согласование и новый объём сдвигают график. Срочность оцениваем
          отдельно.
        </p>
        <Rows rows={data.timeline} />
      </section>
      <section className="procurement-section procurement-soft" id="acceptance">
        <p className="procurement-eyebrow">
          04 · Приёмка по результатам этапов
        </p>
        <h2>Что проверяем перед переходом дальше</h2>
        <Rows rows={data.acceptance} />
        <p>
          Два раунда — два консолидированных списка в рамках утверждённой
          задачи. Несоответствия согласованному ТЗ устраняем; новые тезисы,
          сцены, языки или каналы после утверждения сначала оцениваем отдельно.
          Срок проверки и подтверждение этапов фиксируем в договоре.
        </p>
      </section>
      <section className="procurement-section" id="measurement">
        <p className="procurement-eyebrow">05 · Доказательства и методика</p>
        <h2>Как измерять эффект, не подменяя его обещаниями</h2>
        <div className="procurement-input-grid">
          <article>
            <h3>Понимание материала</h3>
            <p>
              До пилота фиксируем одинаковые вопросы и критерии ответа.
              Сравниваем долю верных ответов до и после, размер выборки и
              повторную проверку через согласованный период.
            </p>
          </article>
          <article>
            <h3>Использование и действия</h3>
            <p>
              Для QR/LMS считаем открытия, завершения и результаты вопросов. Для
              конференции или кампании — целевые обращения и конверсию из
              измеренного числа контактов, с одним окном атрибуции.
            </p>
          </article>
          <article>
            <h3>Корректная интерпретация</h3>
            <p>
              Фиксируем источник данных, даты, знаменатель и сопутствующие
              изменения. Для вывода о причинности нужна сопоставимая контрольная
              группа. Просмотры не равны продажам, а прохождение теста —
              снижению травматизма.
            </p>
          </article>
        </div>
        <p>
          Это предлагаемая методика для нового проекта, а не измеренные
          результаты опубликованных кейсов. Клиент подтверждает данные и
          отдельно разрешает публикацию. Без этих данных не обещаем проценты
          роста.
        </p>
      </section>
      <EvidenceShowcase />
      <section className="procurement-section procurement-soft" id="details">
        <p className="procurement-eyebrow">06 · Контрагент и checklist</p>
        <h2>Что проверить перед договором</h2>
        <p>
          <strong>{data.company}</strong> · ИНН {data.inn} · ОГРН {data.ogrn}
        </p>
        <p>
          Актуальную карточку с КПП, юридическим адресом, банковскими
          реквизитами и полномочиями подписанта предоставляем для договора. Этот
          пакет не является платёжным документом.
        </p>
        <ol className="procurement-checklist">
          {data.checklist.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ol>
        <a
          className="procurement-button"
          href="mailto:studio@anix-ai.pro?subject=Карточка%20компании%20и%20закупочный%20пакет%20Anix"
        >
          Запросить карточку компании
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}
