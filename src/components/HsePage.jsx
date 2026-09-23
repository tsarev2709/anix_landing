import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  Eye,
  FileText,
  Layers3,
  Play,
  ShieldCheck,
  Users,
} from 'lucide-react';
import ProjectCta from './ProjectCta';
import ProcurementDownloads from './ProcurementDownloads';
import SiteFooter from './SiteFooter';
import { track } from '../lib/analytics';
import { hseBenefits, hseScenarios, hseStyles } from '../content/hseLanding';
import logo from '../images/logoanix.png';
import onboardingImage from '../images/hse/hse-onboarding.jpg';
import alexeyPhoto from '../images/experts/alexey-lychko-hse.webp';
import heroImage from '../images/hse/review/hero.webp';
import newMascotImage from '../images/hse/review/mascotNew.webp';
import existingMascotImage from '../images/hse/review/mascotExisting.webp';
import './HsePage.css';

const report = (section, task_id) => {
  void track('cta_click', { section, task_id });
};

function SectionHead({ eyebrow, title, intro, light = false }) {
  return (
    <div
      className={`hse2-section-head${light ? ' hse2-section-head--light' : ''}`}
    >
      <span className="hse2-kicker">{eyebrow}</span>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

export default function HsePage() {
  const [stylePage, setStylePage] = useState(0);
  const [benefit, setBenefit] = useState(0);
  const [sector, setSector] = useState('Все');
  const [mascotMode, setMascotMode] = useState('new');
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const visibleScenarios = hseScenarios.filter(
    (item) => sector === 'Все' || item.sector === sector
  );
  const scenarios = showAll ? visibleScenarios : visibleScenarios.slice(0, 4);
  const currentBenefit = hseBenefits[benefit];

  const changeBenefit = (index) => {
    setBenefit(index);
    void track('cta_click', {
      section: 'hse_mascot_benefits',
      task_id: hseBenefits[index].id,
    });
  };

  const copyPage = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/hse/#for-leader`
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
      report('hse_leader', 'copy_link');
    } catch {
      window.location.hash = 'for-leader';
    }
  };

  return (
    <main className="hse2">
      <header className="hse2-header">
        <a href="/" className="hse2-brand" aria-label="Anix Studio — главная">
          <img src={logo} alt="Anix" />
        </a>
        <nav className="hse2-nav" aria-label="Разделы об охране труда">
          <a href="#system">Система</a>
          <a href="#mascot">Маскот</a>
          <a href="#examples">Кейсы</a>
          <a href="#budget">Бюджет</a>
        </nav>
        <a
          className="hse2-header-demo"
          href="/hse/mvp/"
          onClick={() => report('hse_header', 'demo')}
        >
          Демо модуля <ExternalLink size={15} aria-hidden="true" />
        </a>
        <a className="hse2-header-cta" href="#website-lead-form">
          Обсудить задачу <ArrowRight size={16} aria-hidden="true" />
        </a>
      </header>

      <section className="hse2-hero" id="top" aria-labelledby="hse2-title">
        <div className="hse2-hero-copy">
          <span className="hse2-kicker">
            Anix / Маскоты и видео по охране труда
          </span>
          <h1 id="hse2-title">
            Маскот и единая визуальная система <em>для безопасности</em>
          </h1>
          <p>
            Превращаем утвержденные правила безопасности в ролики, карточки,
            маскоты и обучающие модули для сотрудников и подрядчиков. Работаем
            по материалам заказчика и согласовываем сценарии с вашими
            специалистами по ОТ и ПБ.
          </p>
          <div className="hse2-hero-actions">
            <ProjectCta
              className="hse2-button hse2-button--bright"
              task="help_choose"
              cta="hse_hero"
            />
            <a href="#examples" className="hse2-button hse2-button--outline">
              Посмотреть HSE-кейс{' '}
              <ArrowDownRight size={19} aria-hidden="true" />
            </a>
          </div>
          <div className="hse2-hero-note">
            <ShieldCheck size={20} aria-hidden="true" /> Начать можно с одного
            риска, одной группы или одной площадки
          </div>
        </div>
        <div className="hse2-hero-visual">
          <img
            src={heroImage}
            alt="Сотрудник в защитной каске у электрооборудования"
            width="1300"
            height="1300"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="hse2-system-showcase" id="system">
        <div className="hse2-system hse2-section">
          <div className="hse2-wrap">
            <SectionHead
              eyebrow="Система, а не разовый ролик"
              title="Все важные форматы в одной системе"
              intro="Согласованный персонаж и стиль используем повторно — от первого правила до библиотеки материалов."
              light
            />
            <div className="hse2-system-grid">
              <div className="hse2-system-core">
                <span>Основа</span>
                <h3>Персонаж + стиль + сцены</h3>
                <p>Основа для следующих тем и площадок.</p>
              </div>
              <div className="hse2-system-items">
                <article>
                  <Play />
                  <h3>Ролики</h3>
                  <p>Сцены риска и правильного действия</p>
                </article>
                <article>
                  <Layers3 />
                  <h3>Карточки жизненно важных правил</h3>
                  <p>Действия в конкретных ситуациях</p>
                </article>
                <article>
                  <FileText />
                  <h3>Инструкции</h3>
                  <p>Порядок работ без лишнего текста</p>
                </article>
                <article>
                  <ClipboardCheck />
                  <h3>Обучение</h3>
                  <p>Уроки, вопросы и файлы для учебной системы</p>
                </article>
                <article>
                  <Eye />
                  <h3>Экраны</h3>
                  <p>Контент для объекта и внутренних каналов</p>
                </article>
                <article>
                  <Users />
                  <h3>Вводный курс</h3>
                  <p>Первые правила для сотрудников и подрядчиков</p>
                </article>
                <article>
                  <ShieldCheck />
                  <h3>Плакаты и памятки</h3>
                  <p>Напоминания на рабочих местах</p>
                </article>
              </div>
            </div>
          </div>
        </div>

        <div
          className="hse2-styles hse2-section"
          id="styles"
          aria-labelledby="hse2-styles-title"
        >
          <div className="hse2-wrap">
            <div className="hse2-section-head hse2-styles-head">
              <span className="hse2-kicker">01 / Визуальные возможности</span>
              <h2 id="hse2-styles-title">Примеры стилей</h2>
              <p>
                От реализма до рисованного персонажа. Выберем подходящий стиль
                для вашей задачи.
              </p>
            </div>
            <div className="hse2-style-grid" aria-live="polite">
              {hseStyles
                .slice(stylePage * 3, stylePage * 3 + 3)
                .map((item, index) => (
                  <article key={item.id} className="hse2-style">
                    <span className="hse2-style-image">
                      <img
                        src={item.image}
                        alt={`${item.name}: тот же персонаж показывает границу зоны у электрооборудования`}
                        width="1280"
                        height="720"
                        loading="lazy"
                      />
                      <span className="hse2-style-index">
                        0{stylePage * 3 + index + 1}
                      </span>
                    </span>
                    <span className="hse2-style-caption">
                      <strong>{item.name}</strong>
                      <small>{item.type}</small>
                    </span>
                  </article>
                ))}
            </div>
            <div className="hse2-style-controls">
              <button
                type="button"
                aria-label="Предыдущие стили"
                disabled={stylePage === 0}
                onClick={() => setStylePage(0)}
              >
                <ChevronLeft />
              </button>
              <span>{stylePage + 1} / 2</span>
              <button
                type="button"
                aria-label="Следующие стили"
                disabled={stylePage === 1}
                onClick={() => setStylePage(1)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="hse2-benefits hse2-section"
        id="mascot"
        aria-label="Маскот: способы создания и задачи"
      >
        <div className="hse2-wrap">
          <SectionHead
            eyebrow="Маскот / Два способа начать"
            title="Используем вашего персонажа или создадим нового"
            intro="Сначала определяем основу героя, затем используем его в единой системе материалов, для узнаваемости безопасности и быстрой адаптации новичков."
            light
          />
          <div className="hse2-mascot-source">
            <div className="hse2-mascot-source-head">
              <span className="hse2-kicker">01 / Выберите основу</span>
              <div
                className="hse2-mode"
                role="group"
                aria-label="Выберите подход к маскоту"
              >
                <button
                  type="button"
                  className={mascotMode === 'new' ? 'is-active' : ''}
                  aria-pressed={mascotMode === 'new'}
                  onClick={() => {
                    setMascotMode('new');
                    report('hse_mascot_mode', 'new');
                  }}
                >
                  Создать с нуля
                </button>
                <button
                  type="button"
                  className={mascotMode === 'existing' ? 'is-active' : ''}
                  aria-pressed={mascotMode === 'existing'}
                  onClick={() => {
                    setMascotMode('existing');
                    report('hse_mascot_mode', 'existing');
                  }}
                >
                  Адаптировать вашего
                </button>
              </div>
            </div>
            <div className="hse2-path-detail">
              <div className="hse2-path-portrait">
                <img
                  src={
                    mascotMode === 'new' ? newMascotImage : existingMascotImage
                  }
                  alt={
                    mascotMode === 'new'
                      ? 'Ёжик: разные ракурсы, эмоции и элементы облика нового персонажа'
                      : 'Один персонаж в разных комплектах формы и средств защиты'
                  }
                  loading="lazy"
                />
              </div>
              <div>
                <span className="hse2-kicker">
                  {mascotMode === 'new' ? 'Создание' : 'Адаптация'}
                </span>
                <h3>
                  {mascotMode === 'new'
                    ? 'Разработаем героя под вашу культуру безопасности'
                    : 'Сохраним узнаваемость вашего героя в новых ситуациях'}
                </h3>
                <p>
                  {mascotMode === 'new'
                    ? 'Придумаем характер, выберем стиль, нарисуем образ, эмоции и сцены. Герой может быть человеком или зверьком.'
                    : 'Сохраним вашего героя узнаваемым и покажем его в нужных ролях, форме и СИЗ. При необходимости переведём в другой стиль.'}
                </p>
              </div>
            </div>
          </div>
          <span className="hse2-kicker hse2-benefit-step">
            02 / Какие задачи решает персонаж
          </span>
          <div
            className="hse2-benefit-tabs"
            role="tablist"
            aria-label="Задачи маскота"
          >
            {hseBenefits.map((item, index) => (
              <button
                type="button"
                key={item.id}
                id={`hse2-benefit-tab-${index}`}
                role="tab"
                aria-selected={index === benefit}
                aria-controls="hse2-benefit-panel"
                tabIndex={index === benefit ? 0 : -1}
                onClick={() => changeBenefit(index)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                    event.preventDefault();
                    const next =
                      (benefit +
                        (event.key === 'ArrowRight' ? 1 : -1) +
                        hseBenefits.length) %
                      hseBenefits.length;
                    changeBenefit(next);
                    document
                      .getElementById(`hse2-benefit-tab-${next}`)
                      ?.focus();
                  }
                }}
              >
                <span>{item.number}</span>
                {item.short}
              </button>
            ))}
          </div>
          <div
            className="hse2-benefit-panel"
            id="hse2-benefit-panel"
            role="tabpanel"
            aria-labelledby={`hse2-benefit-tab-${benefit}`}
            key={currentBenefit.id}
          >
            <div className="hse2-benefit-copy">
              <h3>{currentBenefit.title}</h3>
              <p>{currentBenefit.description}</p>
              <div className="hse2-benefit-shift">
                <span>
                  Сейчас <strong>{currentBenefit.before}</strong>
                </span>
                <ArrowRight aria-hidden="true" />
                <span>
                  Можно сделать <strong>{currentBenefit.after}</strong>
                </span>
              </div>
              <small>{currentBenefit.note}</small>
            </div>
            <div className="hse2-benefit-visual">
              <div className="hse2-benefit-mark">{currentBenefit.number}</div>
              <div className="hse2-benefit-person">
                <img
                  src={currentBenefit.image}
                  alt={currentBenefit.title}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div className="hse2-benefit-controls">
            <button
              type="button"
              aria-label="Предыдущая задача"
              onClick={() =>
                changeBenefit(
                  (benefit + hseBenefits.length - 1) % hseBenefits.length
                )
              }
            >
              <ChevronLeft />
            </button>
            <span>
              0{benefit + 1} / 0{hseBenefits.length}
            </span>
            <button
              type="button"
              aria-label="Следующая задача"
              onClick={() => changeBenefit((benefit + 1) % hseBenefits.length)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      <section className="hse2-cases hse2-section" id="examples">
        <div className="hse2-wrap">
          <SectionHead
            eyebrow="Кейсы / Опыт в разных отраслях"
            title="Выберите близкий вам кейс"
            intro="Запросы, решения и результаты наших проектов. В части кейсов названия компаний, площадки и подробности производства закрыты соглашениями о конфиденциальности."
          />
          <div className="hse2-examples-heading">
            <a href="/hse/energy/">
              Подробнее об охране труда в энергетике <ArrowRight size={16} />
            </a>
          </div>
          <div
            className="hse2-filters"
            role="group"
            aria-label="Фильтр по отрасли"
          >
            {[
              'Все',
              'Энергетика',
              'Металлургия',
              'Пищевое производство',
              'Логистика',
              'Ещё',
            ].map((item) => (
              <button
                type="button"
                aria-pressed={sector === item}
                className={sector === item ? 'is-active' : ''}
                key={item}
                onClick={() => {
                  setSector(item);
                  setShowAll(false);
                  void track('cta_click', {
                    section: 'hse_scenario_filter',
                    task_id:
                      item === 'Все'
                        ? 'all'
                        : item === 'Энергетика'
                          ? 'energy'
                          : item === 'Металлургия'
                            ? 'metals'
                            : item === 'Логистика'
                              ? 'logistics'
                              : item === 'Ещё'
                                ? 'other'
                                : 'food',
                  });
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="hse2-scenario-grid">
            {scenarios.map((item) => (
              <article className="hse2-scenario" key={item.id}>
                <div className="hse2-scenario-image">
                  <img
                    src={item.image}
                    alt={`Иллюстрация к кейсу: ${item.title}`}
                    loading="lazy"
                    width="1280"
                    height="720"
                  />
                </div>
                <div className="hse2-scenario-copy">
                  <div className="hse2-scenario-meta">
                    {item.sector}
                    {item.size && (
                      <>
                        <span> · </span>
                        {item.size}
                      </>
                    )}
                  </div>
                  <h4>{item.title}</h4>
                  <p>
                    <strong>Запрос клиента.</strong> {item.task}
                  </p>
                  <div className="hse2-scenario-delivery">
                    <strong>Что сделали</strong>
                    {item.delivery}
                    <strong>Результат</strong>
                    {item.result}
                  </div>
                  <a
                    href={
                      item.id === 'multon'
                        ? '/cases/multon-partners/'
                        : '#website-lead-form'
                    }
                    onClick={() => report('hse_case', item.id)}
                  >
                    {item.id === 'multon'
                      ? 'Подробнее о проекте'
                      : 'Обсудить похожую задачу'}{' '}
                    <ArrowRight size={17} />
                  </a>
                </div>
              </article>
            ))}
          </div>
          {!showAll && visibleScenarios.length > 4 && (
            <button
              className="hse2-show-more"
              type="button"
              onClick={() => setShowAll(true)}
            >
              Показать ещё {visibleScenarios.length - 4} кейса{' '}
              <ArrowRight size={17} />
            </button>
          )}
        </div>
      </section>

      <section className="hse2-zoomers">
        <div className="hse2-wrap hse2-zoomers-inner">
          <div>
            <span className="hse2-kicker">
              Отдельный вопрос для новых сотрудников
            </span>
            <h2>
              Кстати, если у вас работают зумеры — для них тоже найдём подход.
            </h2>
            <p>
              Попробуем короткие сцены, понятный выбор и персонажа-проводника.
              Проверим на ваших сотрудниках, что помогает понять правило;
              возраст сам по себе не определяет результат.
            </p>
          </div>
          <Users size={82} strokeWidth={1} aria-hidden="true" />
        </div>
      </section>

      <section className="hse2-process hse2-section" id="process">
        <div className="hse2-wrap">
          <SectionHead
            eyebrow="07 / Как работаем"
            title="Сцена должна быть точной для вашего объекта"
            intro="При разработке HSE-решений Anix привлекает профильную экспертизу по охране труда и промышленной безопасности. Сценарий, оборудование, СИЗ и безопасную последовательность действий согласуем с вашими ответственными специалистами."
          />
          <ol className="hse2-process-grid">
            <li>
              <span>01</span>
              <h3>Определяем задачу</h3>
              <p>Одна аудитория, риск, правила и место показа.</p>
            </li>
            <li>
              <span>02</span>
              <h3>Выбираем героя и стиль</h3>
              <p>Новый маскот или ваш образ в нужных ролях.</p>
            </li>
            <li>
              <span>03</span>
              <h3>Проверяем сценарий</h3>
              <p>
                Ваши эксперты утверждают безопасность действий до производства.
              </p>
            </li>
            <li>
              <span>04</span>
              <h3>Производим и передаём</h3>
              <p>
                Ролик, карточки, версии и правила использования по договору.
              </p>
            </li>
          </ol>
          <div className="hse2-expert">
            <img
              src={alexeyPhoto}
              alt="Алексей Лычко, эксперт Anix по охране труда"
              loading="lazy"
            />
            <div>
              <span className="hse2-kicker">Экспертиза ОТ</span>
              <h3>Алексей Лычко — более 20 лет опыта в ОТ и ПБ</h3>
              <p>
                Более 20 лет в охране труда и промышленной безопасности.
                Генеральный директор ООО «Безопасные Условия Труда», основатель
                и сооснователь проекта «Б в Кубе», автор игровых форматов по
                охране труда, пожарной и электробезопасности. Помогает проверять
                сценарии на связь с реальными рисками; особенности объекта
                утверждает специалист заказчика.
              </p>
              <a
                href="https://b-cubed.ru/about-us/"
                target="_blank"
                rel="noreferrer"
              >
                Подробнее о «Б в Кубе» <ExternalLink size={14} />
              </a>
            </div>
            <BadgeCheck aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="hse2-budget hse2-section" id="budget">
        <div className="hse2-wrap">
          <SectionHead
            eyebrow="06 / Приоритет бюджета"
            title="Начните с главного риска. Сохраните основу для следующих задач."
            intro="Когда бюджет ограничен, выбираем материал по значимости риска, аудитории и возможности повторного использования. Не предлагаем всю библиотеку до проверки первого решения."
            light
          />
          <div className="hse2-budget-grid">
            <article>
              <span>01 / Есть свои материалы</span>
              <h3>Обновить один важный сюжет</h3>
              <p>
                Разберём действующее правило и сделаем сцену, которую можно
                показать там, где она нужна.
              </p>
            </article>
            <article>
              <span>02 / Нужен общий стиль</span>
              <h3>Персонаж + первый набор</h3>
              <p>
                Разработаем или адаптируем героя, утвердим визуальные правила и
                выпустим первый материал.
              </p>
            </article>
            <article>
              <span>03 / Несколько площадок</span>
              <h3>Расширяемая библиотека</h3>
              <p>
                План тем, короткие модули, карточки и версии для экрана,
                телефона и системы обучения.
              </p>
            </article>
          </div>
          <div className="hse2-budget-actions">
            <a href="/hse/price/">
              Что влияет на бюджет <ArrowRight size={18} />
            </a>
            <ProjectCta
              className="hse2-button hse2-button--bright"
              task="help_choose"
              cta="hse_budget"
            />
          </div>
        </div>
      </section>

      <section className="hse2-leader" id="for-leader">
        <div className="hse2-wrap hse2-leader-share">
          <div>
            <span className="hse2-kicker">
              Для руководителя и закупки · без регистрации
            </span>
            <h2>Перешлите страницу руководителю или скачайте документы</h2>
            <p>
              Ниже — готовые PDF с составом работ и пакетом для закупки. Их
              можно скачать без регистрации и использовать во внутреннем
              согласовании.
            </p>
          </div>
          <button
            type="button"
            onClick={copyPage}
            className="hse2-button hse2-button--bright"
          >
            {copied ? 'Ссылка скопирована' : 'Скопировать ссылку руководителю'}{' '}
            {copied ? <Check size={19} /> : <ArrowRight size={19} />}
          </button>
        </div>
        <ProcurementDownloads product="hse" />
      </section>

      <section className="hse2-demo hse2-section" id="demo">
        <div className="hse2-wrap hse2-demo-layout">
          <div className="hse2-demo-image">
            <img
              src={onboardingImage}
              alt="Демонстрационный учебный модуль HSE Anix"
              loading="lazy"
            />
          </div>
          <div>
            <span className="hse2-kicker">
              Бонус / Можно открыть прямо сейчас
            </span>
            <h2>Попробуйте учебный модуль по охране труда</h2>
            <p>
              Пример показывает путь сотрудника через короткие материалы и
              вопросы, а также рабочее место специалиста. Откройте и посмотрите,
              как персонаж и сцены могут жить внутри системы обучения.
            </p>
            <a
              className="hse2-button hse2-button--bright"
              href="/hse/mvp/"
              onClick={() => report('hse_demo', 'open')}
            >
              Открыть демо модуля <ArrowRight size={19} />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
      <a href="#top" className="hse2-back-top" aria-label="Наверх">
        <ArrowLeft aria-hidden="true" />
      </a>
    </main>
  );
}
