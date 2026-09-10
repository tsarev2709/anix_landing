import React from 'react';
import { ArrowRight, Check, PlayCircle } from 'lucide-react';
import BrandLogo from './BrandLogo';
import SiteFooter from './SiteFooter';
import ProjectCta from './ProjectCta';
import AnnualProgram from './AnnualProgram';
import pages from '../content/industryLandingPages.json';
import './IndustryLandingPage.css';

export default function IndustryLandingPage({ path }) {
  const page = Object.values(pages).find(
    (item) => item.path === path.replace(/\/+$/, '')
  );
  if (!page) return null;
  return (
    <main
      className="industry-page"
      style={{ '--industry-accent': page.accent }}
    >
      <header className="industry-header">
        <a href="/" aria-label="Anix Studio — главная">
          <BrandLogo width={110} height={42} />
        </a>
        <nav aria-label="Навигация страницы">
          <a href="#solutions">Задачи</a>
          <a href="#industry-prices">Стоимость</a>
          <a href="#related-cases">Кейсы</a>
          <a href="#website-lead-form">Форматы и бюджет</a>
        </nav>
      </header>
      <section className="industry-hero">
        <div>
          <p className="industry-eyebrow">{page.eyebrow}</p>
          <h1>{page.h1}</h1>
          <p className="industry-lead">{page.intro}</p>
          <ProjectCta />
          <p className="industry-small">
            Минутный ролик обычно за неделю при готовых вводных и своевременном
            согласовании.
          </p>
        </div>
        <figure>
          <a href={`/cases/${page.heroCase}/`}>
            <img
              src={`/seo-media/cases/${page.heroCase}.webp`}
              alt={page.heroLabel}
              width="960"
              height="540"
              fetchPriority="high"
            />
            <span>
              <PlayCircle aria-hidden="true" /> Разобрать подход на примере
            </span>
          </a>
          <figcaption>{page.heroLabel}</figcaption>
        </figure>
      </section>
      <section className="industry-section" id="solutions">
        <p className="industry-eyebrow">От ситуации к материалу</p>
        <h2>Какую задачу нужно решить?</h2>
        <div className="industry-task-grid">
          {page.tasks.map(([id, title, text], index) => (
            <article key={id}>
              <span className="industry-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <a
                href="#website-lead-form"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('anix:brief-prefill', {
                      detail: { task: id, cta: 'task_card' },
                    })
                  )
                }
              >
                Рассчитать такой материал <ArrowRight size={18} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="industry-section industry-delivery">
        <div>
          <p className="industry-eyebrow">Состав под вашу задачу</p>
          <h2>Что получает ваша команда</h2>
          <p>
            Выбираем нужные носители и аудитории до производства. Количество
            версий, языков и файлов включаем в смету.
          </p>
        </div>
        <ul>
          {page.deliverables.map((text) => (
            <li key={text}>
              <Check aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </section>
      <section className="industry-section" id="industry-prices">
        <p className="industry-eyebrow">Стоимость и объём</p>
        <h2>От одного объяснения до целой программы</h2>
        <p className="industry-section-intro">
          Ориентир — 400 тыс. ₽ за минуту анимации. Короткие ролики, учебные
          модули и курсы считаем по объёму и сложности: сценарий, визуальная
          разработка, анимация, озвучка и согласование.
        </p>
        <div className="industry-price-grid">
          {[
            [
              'Один сценарий',
              'от 200 тыс. ₽',
              'Ориентир для 30 секунд анимации. Подходит для одной инструкции, истории или короткого объяснения.',
              'pilot',
            ],
            [
              'Ролик и адаптации',
              'от 400 тыс. ₽',
              'Ориентир для одной минуты. Число версий и адаптаций согласуем в составе проекта.',
              'master_adaptations',
            ],
            [
              'Серия / учебный модуль',
              'от 800 тыс. ₽',
              'Ориентир для двух минут анимации суммарно. Темы, задания и формат передачи определяют итоговую смету.',
              'series',
            ],
          ].map(([title, price, text, scope]) => (
            <article key={title}>
              <h3>{title}</h3>
              <strong>{price}</strong>
              <p>{text}</p>
              <ProjectCta scope={scope} cta="package" />
            </article>
          ))}
        </div>
        <p className="industry-small">
          Это стартовые ориентиры, не автоматический расчёт по секундам. Новый
          персонаж, сложные сцены, дополнительные языки, съёмка, интерактивность
          и интеграция оцениваются отдельно. Для курса считаем анимацию,
          методическую работу и задания; длительность всего курса не равна
          хронометражу анимации.
        </p>
      </section>
      <AnnualProgram />
      <section className="industry-section industry-example">
        <div>
          <p className="industry-eyebrow">Пример возможного решения</p>
          <h2>{page.example[0]}</h2>
        </div>
        <div>
          <h3>Что должен понять зритель</h3>
          <p>{page.example[1]}</p>
          <h3>Как можно показать</h3>
          <p>{page.example[2]}</p>
        </div>
      </section>
      <section className="industry-section" id="related-cases">
        <p className="industry-eyebrow">Опыт, который можно применить</p>
        <h2>Наши работы в смежных задачах</h2>
        <p className="industry-section-intro">
          В этом направлении пока нет завершённых проектов. Ниже — реальные
          работы Anix из других отраслей: показываем подход к объяснению,
          персонажам и визуальным системам.
        </p>
        <div className="industry-case-grid">
          {page.cases.map(([slug, title, text]) => (
            <a key={slug} href={`/cases/${slug}/`}>
              <img
                src={`/seo-media/cases/${slug}.webp`}
                alt={title}
                loading="lazy"
                width="640"
                height="360"
              />
              <div>
                <span>Смежный кейс</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <strong>
                  Посмотреть работу <ArrowRight size={18} />
                </strong>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="industry-section industry-process">
        <p className="industry-eyebrow">До старта производства</p>
        <h2>Согласуем содержание, сроки и приёмку</h2>
        <div className="industry-columns">
          <div>
            <h3>Входные материалы</h3>
            <p>{page.inputs}</p>
          </div>
          <div>
            <h3>Рабочий порядок</h3>
            <p>
              Задача и источники → сценарий → визуальное решение → производство
              → проверка и передача. Два раунда консолидированных правок; новые
              смыслы и объём после утверждения оцениваем отдельно.
            </p>
          </div>
          <div>
            <h3>Сроки</h3>
            <p>
              Одна минута — обычно неделя от сценария до готового ролика при
              готовых вводных и оперативном согласовании. Календарь серии или
              курса фиксируем отдельно.
            </p>
          </div>
        </div>
        <a href="/procurement/">
          Пример ТЗ, календарь и этапы приёмки <ArrowRight size={18} />
        </a>
      </section>
      <section className="industry-section industry-faq">
        <p className="industry-eyebrow">Перед обсуждением проекта</p>
        <h2>Частые вопросы</h2>
        {page.faq.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
