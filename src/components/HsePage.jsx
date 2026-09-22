import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  ExternalLink,
  Eye,
  FileText,
  Layers3,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import ProjectCta from './ProjectCta';
import ProcurementDownloads from './ProcurementDownloads';
import SiteFooter from './SiteFooter';
import AnnualProgram from './AnnualProgram';
import { track } from '../lib/analytics';
import { hseBenefits, hseScenarios, hseStyles } from '../content/hseLanding';
import logo from '../images/logoanix.png';
import multonImage from '../images/cases/multon-partners.webp';
import onboardingImage from '../images/hse/hse-onboarding.jpg';
import alexeyPhoto from '../images/experts/alexey-lychko-hse.webp';
import './HsePage.css';

const report = (section, task_id) => {
  void track('cta_click', { section, task_id });
};

const faq = [
  [
    'Можно сделать персонажа с нуля?',
    'Да. Исследуем задачу и аудиторию, покажем направления стиля, утвердим образ, позы и правила его использования. Объём разработки согласуем до старта.',
  ],
  [
    'У нас уже есть маскот. Вы сможете с ним работать?',
    'Да. Берём за основу утверждённый образ и брендбук, адаптируем его к рабочим сценам, форме и СИЗ. Какие именно материалы и права понадобятся, выясним на старте.',
  ],
  [
    'Сделаете реалистичный ролик и нашу спецодежду?',
    'Да, реализм — один из возможных языков. Точность оборудования, формы, СИЗ и безопасных действий проверяем по вашим исходникам вместе с ответственным специалистом.',
  ],
  [
    'Что взять в первый пилот при ограниченном бюджете?',
    'Один риск, одну аудиторию и один канал показа. Разберём действующие материалы, предложим визуальное решение и заранее укажем, что можно использовать повторно.',
  ],
  [
    'Заменяет ли ролик обязательный инструктаж?',
    'Нет. Это наглядный материал для процесса обучения и коммуникации, который организует работодатель. Просмотр ролика, проверка знания и допуск к работе — разные события.',
  ],
  [
    'Можно передать материалы в LMS?',
    'Подготовим файлы и вопросы в согласованном формате. Интеграция с конкретной системой, идентификация и отчётность требуют отдельной оценки.',
  ],
  [
    'Кому будет принадлежать персонаж?',
    'Права на финальный образ, исходники и способы использования указываем в договоре. Объём передачи зависит от согласованного пакета и исходных материалов заказчика.',
  ],
];

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
  const [selected, setSelected] = useState(['realism', 'flat_2d']);
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

  const chooseStyle = (id) => {
    setSelected((current) =>
      current.includes(id)
        ? current.length === 1
          ? current
          : current.filter((item) => item !== id)
        : [...current.slice(-1), id]
    );
    void track('cta_click', { section: 'hse_styles', task_id: id });
  };

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
        <nav className="hse2-nav" aria-label="Разделы HSE">
          <a href="#styles">Стили</a>
          <a href="#mascot">Зачем маскот</a>
          <a href="#examples">Примеры задач</a>
          <a href="#budget">Стоимость</a>
        </nav>
        <a
          className="hse2-header-demo"
          href="/hse/mvp/"
          onClick={() => report('hse_header', 'demo')}
        >
          HSE-демо <ExternalLink size={15} aria-hidden="true" />
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
            Персонаж, с которым <em>правила безопасности</em> становятся
            понятнее
          </h1>
          <p>
            Создаём маскота или адаптируем вашего. На его основе собираем
            ролики, карточки и материалы для обучения сотрудников и подрядчиков
            — в одном визуальном языке.
          </p>
          <div className="hse2-hero-actions">
            <a href="#styles" className="hse2-button hse2-button--bright">
              Посмотреть стили <ArrowDownRight size={19} aria-hidden="true" />
            </a>
            <ProjectCta
              className="hse2-button hse2-button--outline"
              task="help_choose"
              cta="hse_hero"
            />
          </div>
          <div className="hse2-hero-note">
            <ShieldCheck size={20} aria-hidden="true" /> Начать можно с одного
            риска, одной группы или одной площадки
          </div>
        </div>
        <div className="hse2-hero-visual">
          <img
            src={hseStyles[0].image}
            alt="Демонстрационный персонаж показывает границу опасной зоны у закрытого электрооборудования"
            width="1280"
            height="720"
            fetchPriority="high"
          />
          <span className="hse2-visual-label">
            Демонстрационный концепт · реалистичный стиль
          </span>
          <div className="hse2-hero-visual-corner">
            <span>01 / 06</span>
            <span>Вы выбираете стиль</span>
          </div>
        </div>
      </section>

      <section
        className="hse2-styles hse2-section"
        id="styles"
        aria-labelledby="hse2-styles-title"
      >
        <div className="hse2-wrap">
          <div className="hse2-section-head hse2-styles-head">
            <span className="hse2-kicker">01 / Визуальные возможности</span>
            <h2 id="hse2-styles-title">
              Один рабочий эпизод. <em>Шесть визуальных языков.</em>
            </h2>
            <p>
              Сравните, как один персонаж и одна граница опасной зоны выглядят в
              разных стилях. Выбор зависит от вашей задачи, узнаваемости
              оборудования и места показа.
            </p>
          </div>
          <div className="hse2-style-grid">
            {hseStyles.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={`hse2-style${selected.includes(item.id) ? ' is-selected' : ''}`}
                onClick={() => chooseStyle(item.id)}
                aria-pressed={selected.includes(item.id)}
              >
                <span className="hse2-style-image">
                  <img
                    src={item.image}
                    alt={`${item.name}: тот же персонаж показывает границу зоны у электрооборудования`}
                    width="1280"
                    height="720"
                    loading={index > 1 ? 'lazy' : 'eager'}
                  />
                  <span className="hse2-style-index">0{index + 1}</span>
                </span>
                <span className="hse2-style-caption">
                  <strong>{item.name}</strong>
                  <small>{item.type}</small>
                  <span className="hse2-style-toggle" aria-hidden="true">
                    {selected.includes(item.id) ? (
                      <Check size={17} />
                    ) : (
                      <ArrowRight size={17} />
                    )}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <p className="hse2-caption">
            Все шесть изображений — демонстрационные концепты, а не материалы,
            внедрённые у клиента. Они показывают диапазон исполнения;
            корректность СИЗ, оборудования и действий согласуем для конкретного
            объекта.
          </p>
          <div className="hse2-selected-line" aria-live="polite">
            Выбраны для сравнения:{' '}
            <strong>
              {selected
                .map((id) => hseStyles.find((item) => item.id === id)?.name)
                .join(' + ')}
            </strong>
            <a
              href="#website-lead-form"
              onClick={() => report('hse_styles', 'lead')}
            >
              Обсудить похожий стиль <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section
        className="hse2-benefits hse2-section"
        id="mascot"
        aria-labelledby="hse2-benefits-title"
      >
        <div className="hse2-wrap">
          <SectionHead
            eyebrow="02 / Зачем предприятию персонаж"
            title="Маскот — начало общей визуальной системы"
            intro="Три задачи, которые можно проверить на ваших материалах и сотрудниках. Листайте идеи или выберите нужную."
            light
          />
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
              <span className="hse2-kicker">
                Гипотеза {currentBenefit.number} / 03
              </span>
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
              <div className="hse2-benefit-orbit">
                <span>
                  <FileText /> Инструкция
                </span>
                <span>
                  <Play /> Ролик
                </span>
                <span>
                  <Layers3 /> Карточка
                </span>
              </div>
              <div className="hse2-benefit-person">
                <img
                  src={multonImage}
                  alt="Фрагмент выполненной работы: персонажи для карточек Мултон Партнерс"
                  loading="lazy"
                />
                <span>Пример маскота из реального кейса</span>
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

      <section className="hse2-paths hse2-section" id="paths">
        <div className="hse2-wrap">
          <SectionHead
            eyebrow="03 / Два способа начать"
            title="Новый персонаж или ваш существующий"
            intro="Оба пути позволяют выбрать стиль и собрать материалы для реальных рабочих ситуаций."
          />
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
          <div className="hse2-path-detail">
            <div className="hse2-path-portrait">
              <img
                src={mascotMode === 'new' ? hseStyles[1].image : multonImage}
                alt={
                  mascotMode === 'new'
                    ? 'Демонстрационный концепт нового персонажа'
                    : 'Пример существующего персонажа в карточках Мултон Партнерс'
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
                  ? 'Характер, визуальные направления, утверждённый образ, модельный лист, эмоции и действия. Персонаж может быть человеком, зверьком или другим образом, который подходит компании.'
                  : 'Берём брендбук и исходники, подбираем позы и роли, прорабатываем униформу, каску, очки и другие СИЗ под конкретную задачу. Можем перевести героя в иной визуальный стиль.'}
              </p>
              <ul>
                <li>
                  <CheckCircle2 /> Разные стили: от графичного до реалистичного
                </li>
                <li>
                  <CheckCircle2 /> Форма и СИЗ по материалам заказчика
                </li>
                <li>
                  <CheckCircle2 /> Серия, которую можно дополнять
                </li>
              </ul>
              <a
                href="#website-lead-form"
                onClick={() => report('hse_mascot_mode', mascotMode)}
              >
                Обсудить персонажа <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="hse2-system hse2-section" id="system">
        <div className="hse2-wrap">
          <SectionHead
            eyebrow="04 / Система, а не разовый ролик"
            title="Один герой. Несколько задач предприятия."
            intro="Сначала утверждаем персонажа и визуальный язык. Дальше расширяем библиотеку под те правила и процессы, которые действительно важны вам сейчас."
            light
          />
          <div className="hse2-system-grid">
            <div className="hse2-system-core">
              <Sparkles />
              <span>Основа</span>
              <h3>Персонаж + стиль + библиотека поз</h3>
              <p>Повторно используем то, что уже разработано и согласовано.</p>
            </div>
            <div className="hse2-system-items">
              <article>
                <Play />
                <h3>Ролики</h3>
                <p>Сцены риска и правильного действия</p>
              </article>
              <article>
                <Layers3 />
                <h3>Карточки</h3>
                <p>Напоминания в одном стиле</p>
              </article>
              <article>
                <ClipboardCheck />
                <h3>Обучение</h3>
                <p>Короткие вопросы и материалы для LMS</p>
              </article>
              <article>
                <Eye />
                <h3>Экраны</h3>
                <p>Контент для объекта и внутренних каналов</p>
              </article>
            </div>
          </div>
          <p className="hse2-system-foot">
            По мере необходимости тот же визуальный язык можно расширить на
            онбординг, наставничество и другие внутренние коммуникации.
          </p>
        </div>
      </section>

      <section className="hse2-cases hse2-section" id="examples">
        <div className="hse2-wrap">
          <SectionHead
            eyebrow="05 / Выберите близкую задачу"
            title="От реального кейса до сценария вашего будущего проекта"
            intro="Работу, которую уже сделали, показываем отдельно от демонстрационных проектных примеров."
          />
          <a
            className="hse2-real-case"
            href="/cases/multon-partners/"
            onClick={() => report('hse_real_case', 'multon')}
          >
            <div className="hse2-real-case-image">
              <img
                src={multonImage}
                alt="Персонажи в визуальных карточках правил безопасности Мултон Партнерс"
                loading="lazy"
              />
            </div>
            <div>
              <span className="hse2-kicker">
                Реальный опубликованный кейс / Мултон Партнерс
              </span>
              <h3>Маскот и карточки жизненно важных правил</h3>
              <p>
                Создали персонажа и визуальный формат для внутренней
                коммуникации по безопасности. Посмотрите задачу, состав работы и
                материалы.
              </p>
              <strong>
                Смотреть выполненный проект <ArrowRight size={18} />
              </strong>
            </div>
          </a>
          <div className="hse2-examples-heading">
            <div>
              <span className="hse2-kicker">Модельные сценарии</span>
              <h3>Как мог бы выглядеть проект для вашей компании</h3>
              <p>
                Условные предприятия и объёмы. Это примеры решений, а не
                выполненные проекты или заявленные результаты. Иллюстрации
                показывают стиль, а не описанную рабочую ситуацию.
              </p>
            </div>
            <a href="/hse/energy/">
              Подробнее для энергетики <ArrowRight size={16} />
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
              'Производство',
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
                              : item === 'Производство'
                                ? 'production'
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
                    alt="Демонстрационный стиль персонажа у закрытого электрооборудования"
                    loading="lazy"
                    width="1280"
                    height="720"
                  />
                  <span>Модельный сценарий</span>
                </div>
                <div className="hse2-scenario-copy">
                  <div className="hse2-scenario-meta">
                    {item.sector} <span>·</span> {item.size}
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.task}</p>
                  <div className="hse2-scenario-delivery">
                    <strong>Возможный состав</strong>
                    {item.delivery}
                  </div>
                  <a
                    href="#website-lead-form"
                    onClick={() => report('hse_scenario', item.id)}
                  >
                    У нас похожая задача <ArrowRight size={17} />
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
              Показать ещё {visibleScenarios.length - 4} сценария{' '}
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
            <h2>Не только картинки: попробуйте наш HSE-модуль</h2>
            <p>
              Демо показывает путь сотрудника через короткие материалы и
              вопросы, а также рабочее место специалиста. Откройте и посмотрите,
              как персонаж и сцены могут жить внутри системы обучения.
            </p>
            <p className="hse2-small">
              Это демонстрация возможностей, не отчёт о внедрении у клиента.
              Состав интеграции и учёта результатов обсуждается отдельно.
            </p>
            <a
              className="hse2-button hse2-button--bright"
              href="/hse/mvp/"
              onClick={() => report('hse_demo', 'open')}
            >
              Открыть интерактивное демо <ArrowRight size={19} />
            </a>
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
              <strong>Пилот одного сценария от 350 тыс. ₽</strong>
            </article>
            <article>
              <span>02 / Нужен общий стиль</span>
              <h3>Персонаж + первый набор</h3>
              <p>
                Разработаем или адаптируем героя, утвердим визуальные правила и
                выпустим первый материал.
              </p>
              <strong>Состав и цена по задаче</strong>
            </article>
            <article>
              <span>03 / Несколько площадок</span>
              <h3>Расширяемая библиотека</h3>
              <p>
                План тем, короткие модули, карточки и версии для экрана,
                телефона и системы обучения.
              </p>
              <strong>Модуль или серия от 900 тыс. ₽</strong>
            </article>
          </div>
          <p className="hse2-budget-note">
            Цены — ориентиры для указанного состава, не обещание выполнить все
            требования предприятия за одну сумму. Обновление библиотеки — от 150
            тыс. ₽ в месяц по согласованному плану.
          </p>
          <div className="hse2-budget-actions">
            <a href="/hse/price/">
              Подробно о цене и составе <ArrowRight size={18} />
            </a>
            <ProjectCta
              className="hse2-button hse2-button--bright"
              task="help_choose"
              cta="hse_budget"
            />
          </div>
        </div>
      </section>

      <section className="hse2-process hse2-section" id="process">
        <div className="hse2-wrap">
          <SectionHead
            eyebrow="07 / Как работаем"
            title="Сцена должна быть точной для вашего объекта"
            intro="Мы отвечаем за сценарий и визуальный язык. Ваш ответственный специалист подтверждает оборудование, СИЗ и безопасную последовательность действий."
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
              <h3>Алексей Лычко помогает проверять логику HSE-сценария</h3>
              <p>
                При этом особенности оборудования и действующие правила вашей
                площадки согласуем с назначенным специалистом предприятия.
              </p>
            </div>
            <BadgeCheck aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="hse2-leader hse2-section" id="for-leader">
        <div className="hse2-wrap hse2-leader-layout">
          <div>
            <span className="hse2-kicker">
              Для руководителя / Можно переслать
            </span>
            <h2>Первый результат можно определить до большого проекта</h2>
            <p>
              Выберите риск и группу сотрудников. Получите состав пилота,
              варианты визуального языка, смету и границы экспертной проверки.
              После пилота решите, какие материалы стоит тиражировать.
            </p>
            <button
              type="button"
              onClick={copyPage}
              className="hse2-button hse2-button--bright"
            >
              {copied
                ? 'Ссылка скопирована'
                : 'Скопировать ссылку руководителю'}{' '}
              {copied ? <Check size={19} /> : <ArrowRight size={19} />}
            </button>
          </div>
          <div className="hse2-leader-card">
            <span>Первое решение</span>
            <ol>
              <li>Какой риск показываем?</li>
              <li>Кому и где нужен материал?</li>
              <li>Есть ли у компании маскот?</li>
              <li>Что проверит ответственный по ОТ?</li>
            </ol>
            <a href="/procurement/">
              Документы для закупки <FileText size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="hse2-faq hse2-section" id="faq">
        <div className="hse2-wrap hse2-faq-layout">
          <div>
            <SectionHead
              eyebrow="08 / Частые вопросы"
              title="Что важно уточнить до проекта"
            />
            <CircleHelp size={64} strokeWidth={1} aria-hidden="true" />
          </div>
          <div>
            {faq.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <ArrowRight size={18} aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="hse2-final">
        <div className="hse2-wrap hse2-final-layout">
          <div>
            <span className="hse2-kicker">Обсудим первую задачу</span>
            <h2>Покажите правило, которое сложно объяснить</h2>
            <p>
              Предложим подходящий стиль, состав первого материала и бюджет.
              Если вводных пока мало — начнём с вопросов.
            </p>
          </div>
          <ProjectCta
            className="hse2-button hse2-button--bright"
            task="help_choose"
            cta="hse_final"
          />
        </div>
      </section>
      <div className="hse2-extras">
        <AnnualProgram />
        <ProcurementDownloads product="hse" />
      </div>
      <SiteFooter />
      <a href="#top" className="hse2-back-top" aria-label="Наверх">
        <ArrowLeft aria-hidden="true" />
      </a>
    </main>
  );
}
