import React from 'react';
import ProjectCta from './ProjectCta';
import './IndustryLandingPage.css';
export default function AnnualProgram() {
  return (
    <section className="anix-annual" id="annual-program">
      <div>
        <p className="industry-eyebrow">Материалы на весь год</p>
        <h2>Одна команда. Общий план. Регулярные выпуски.</h2>
        <p>
          Годовая программа производства: ролики, серии, адаптации и обновления
          под ваши задачи. Согласуем план на квартал и состав работ на каждый
          месяц.
        </p>
      </div>
      <div className="anix-annual__offer">
        <strong>от 1 млн ₽ / месяц</strong>
        <p>Контракт на 12 месяцев — от 12 млн ₽ за год.</p>
        <ul>
          <li>Приоритеты и календарь производства</li>
          <li>Согласованный объём материалов и адаптаций</li>
          <li>
            Два раунда консолидированных правок по каждому согласованному
            материалу
          </li>
        </ul>
        <p>
          Это бюджет программы, а не безлимит. Объём, сложность, правила
          изменения плана и права фиксируем в договоре.
        </p>
        <ProjectCta scope="annual_program" cta="annual" />
      </div>
    </section>
  );
}
