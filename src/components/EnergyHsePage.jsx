import React from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  FileText,
  Layers3,
  MonitorPlay,
  Route,
  ShieldCheck,
  Smartphone,
  Users,
  Zap,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import ProjectCta from './ProjectCta';
import SiteFooter from './SiteFooter';
import heroImage from '../images/hse/review/hero.webp';
import foxImage from '../images/hse/review/energyFox.webp';
import owlImage from '../images/hse/review/energyOwl.webp';
import dogImage from '../images/hse/review/energyDog.webp';
import beaverImage from '../images/hse/review/energyBeaver.webp';
import './EnergyHsePage.css';

const risks = [
  ['01', 'Электрический риск', 'Опасная зона, отключение, проверка и допуск.'],
  ['02', 'Работы на высоте', 'Условия начала работ и правильная последовательность.'],
  ['03', 'Подрядчики', 'Маршрут, локальные риски и контакты до выхода на объект.'],
  ['04', 'Ремонтная кампания', 'Повторение ключевых правил перед пиковым периодом.'],
];

const cases = [
  {
    image: foxImage,
    label: 'Энергетика · выполненный проект',
    title: 'Адаптация существующего маскота',
    task: 'Встроить знакомого героя в коммуникацию по безопасности.',
    result: 'Форма, СИЗ, рабочие роли, сцены и карточки в едином стиле.',
  },
  {
    image: owlImage,
    label: 'Энергетика · выполненный проект',
    title: 'Единая система для площадок',
    task: 'Связать разрозненные материалы общим визуальным языком.',
    result: 'Повторяемые шаблоны для вводных материалов, экранов и памяток.',
  },
  {
    image: dogImage,
    label: 'Энергетика · выполненный проект',
    title: 'Подготовка подрядчиков',
    task: 'Показать маршрут, риски и порядок действий до начала работ.',
    result: 'Короткий материал, вопросы и версия для просмотра с телефона.',
  },
  {
    image: beaverImage,
    label: 'Энергетика · выполненный проект',
    title: 'Опасная зона у оборудования',
    task: 'Сделать границу зоны и безопасное действие визуально очевидными.',
    result: 'Одна сцена объединяет оборудование, риск и порядок действий.',
  },
];

function Heading({ eyebrow, title, intro, light = false }) {
  return (
    <div className={`energy-head${light ? ' energy-head--light' : ''}`}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

export default function EnergyHsePage() {
  return (
    <main className="energy-hse">
      <header className="energy-nav">
        <a href="/" aria-label="Anix Studio — главная">
          <BrandLogo width={92} height={36} />
        </a>
        <nav aria-label="Разделы страницы">
          <a href="#tasks">Задачи</a>
          <a href="#system">Система</a>
          <a href="#cases">Кейсы</a>
          <a href="#process">Процесс</a>
        </nav>
        <a className="energy-nav__cta" href="#website-lead-form">
          Обсудить задачу <ArrowRight size={16} />
        </a>
      </header>

      <section className="energy-hero">
        <img
          src={heroImage}
          alt="Сотрудник энергетического объекта в защитной каске"
          width="1672"
          height="941"
          fetchPriority="high"
        />
        <div className="energy-hero__shade" />
        <div className="energy-wrap energy-hero__content">
          <span className="energy-kicker">Anix / Охрана труда в энергетике</span>
          <h1>
            Правила объекта — <em>в визуальной системе</em>
          </h1>
          <p>
            Ролики, карточки, маскоты и учебные модули для сотрудников,
            ремонтных бригад и подрядчиков.
          </p>
          <div className="energy-actions">
            <ProjectCta
              className="energy-button energy-button--bright"
              task="energy_hse"
              cta="energy_hero"
            />
            <a className="energy-button energy-button--glass" href="#cases">
              Смотреть кейсы <ArrowDownRight size={18} />
            </a>
          </div>
          <div className="energy-hero__facts">
            <span><ShieldCheck /> По правилам заказчика</span>
            <span><BadgeCheck /> Согласование с ОТ и ПБ</span>
            <span><Zap /> Пилот с одного риска</span>
          </div>
        </div>
      </section>

      <section className="energy-section energy-tasks" id="tasks">
        <div className="energy-wrap">
          <Heading
            eyebrow="01 / С чего начать"
            title="Один риск. Один понятный сценарий."
            intro="Берём конкретную ситуацию и превращаем утверждённый порядок действий в визуальный маршрут."
          />
          <div className="energy-risk-grid">
            {risks.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="energy-section energy-map" id="system">
        <div className="energy-wrap">
          <Heading
            eyebrow="02 / Единая система"
            title="От правила — до всех точек контакта"
            intro="Одна согласованная сцена становится основой для разных носителей. Не нужно каждый раз объяснять и рисовать заново."
            light
          />
          <div className="energy-map__flow">
            <article className="energy-map__source">
              <FileText />
              <span>Вход</span>
              <h3>Правило объекта</h3>
              <p>Документы, фото площадки и эксперт заказчика</p>
            </article>
            <div className="energy-map__arrow"><ArrowRight /></div>
            <article className="energy-map__core">
              <Zap />
              <span>Визуальное ядро</span>
              <h3>Риск → выбор → действие</h3>
              <p>Сценарий, сцены, персонаж и единый стиль</p>
            </article>
            <div className="energy-map__outputs">
              <span><MonitorPlay /> Ролик</span>
              <span><Layers3 /> Карточки</span>
              <span><ClipboardCheck /> Модуль</span>
              <span><Smartphone /> Телефон</span>
            </div>
          </div>
        </div>
      </section>

      <section className="energy-section energy-audiences">
        <div className="energy-wrap energy-audiences__grid">
          <Heading
            eyebrow="03 / Для разных групп"
            title="Одна основа. Разные акценты."
            intro="Разделяем версии по роли человека на объекте — без перегруженной универсальной инструкции."
          />
          <div className="energy-audience-list">
            <article><Users /><span>01</span><h3>Сотрудники</h3><p>Повторение правил и рабочих сценариев.</p></article>
            <article><Route /><span>02</span><h3>Подрядчики</h3><p>Навигация, риски и порядок до начала работ.</p></article>
            <article><ShieldCheck /><span>03</span><h3>Посетители</h3><p>Разрешённые зоны и действия при сигнале.</p></article>
          </div>
        </div>
      </section>

      <section className="energy-section energy-cases" id="cases">
        <div className="energy-wrap">
          <Heading
            eyebrow="04 / Кейсы в энергетике"
            title="Опыт на энергетических объектах"
            intro="Названия заказчиков и детали площадок закрыты соглашениями о конфиденциальности. Показываем задачи, формат решения и визуальный подход."
          />
          <div className="energy-case-grid">
            {cases.map((item, index) => (
              <article className="energy-case" key={item.title}>
                <div className="energy-case__image">
                  <img src={item.image} alt={item.title} loading="lazy" width="1254" height="1254" />
                  <span>0{index + 1}</span>
                </div>
                <div className="energy-case__copy">
                  <small>{item.label}</small>
                  <h3>{item.title}</h3>
                  <dl>
                    <div><dt>Задача</dt><dd>{item.task}</dd></div>
                    <div><dt>Решение</dt><dd>{item.result}</dd></div>
                  </dl>
                  <strong>NDA · без названия площадки</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="energy-section energy-pilot">
        <div className="energy-wrap energy-pilot__grid">
          <div>
            <span className="energy-kicker">05 / Пилот</span>
            <h2>Проверяем систему на одном приоритетном риске</h2>
          </div>
          <div className="energy-pilot__card">
            <strong>от 350 000 ₽</strong>
            <p>Один сценарий, одна аудитория, одна площадка.</p>
            <ul>
              <li><Check /> сценарий и раскадровка</li>
              <li><Check /> визуальный ролик</li>
              <li><Check /> карточка-памятка</li>
              <li><Check /> вопросы на понимание</li>
            </ul>
            <ProjectCta task="energy_pilot" scope="pilot" cta="energy_pilot" />
          </div>
        </div>
      </section>

      <section className="energy-section energy-process" id="process">
        <div className="energy-wrap">
          <Heading eyebrow="06 / Как работаем" title="Точность до производства" />
          <div className="energy-process__line">
            {[
              ['01', 'Фиксируем', 'аудиторию, риск и место показа'],
              ['02', 'Сверяем', 'правила с экспертами ОТ и ПБ'],
              ['03', 'Согласуем', 'сценарий и визуальные действия'],
              ['04', 'Производим', 'ролик и нужные адаптации'],
            ].map(([n, title, text]) => (
              <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
          <p className="energy-process__expert">
            Профильная экспертиза Anix: Алексей Лычко — более 20 лет опыта в охране труда и промышленной безопасности.
          </p>
        </div>
      </section>

      <section className="energy-final">
        <div className="energy-wrap">
          <span className="energy-kicker">Следующий шаг</span>
          <h2>Покажите нам один риск — предложим три формата</h2>
          <p>Достаточно правила, аудитории и примера площадки. Ответим с составом и вилкой бюджета за один рабочий день.</p>
          <div className="energy-actions">
            <ProjectCta className="energy-button energy-button--bright" task="energy_hse" cta="energy_final" />
            <a className="energy-button energy-button--glass" href="/hse/mvp/">
              Открыть демо модуля <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
