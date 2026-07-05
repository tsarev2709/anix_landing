import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  CheckCircle2,
  ClipboardList,
  Database,
  Download,
  Eye,
  FileText,
  Gauge,
  LifeBuoy,
  Link as LinkIcon,
  Mail,
  Phone,
  Plus,
  RotateCcw,
  Send,
  Settings,
  ShieldCheck,
  Upload,
  Users,
  Wrench,
} from 'lucide-react';
import './HseMvpPage.css';
import SiteFooter from '../../components/SiteFooter';
import {
  HSE_MVP_DISCLAIMER,
  HSE_MVP_PRODUCT_DESCRIPTION,
  HSE_MVP_SYSTEM_NAME,
  competitionCriteria,
  courseCatalog,
  demoCompany,
  demoEmployee,
  demoEmployeeRows,
  demoModules,
  getModuleById,
} from './data/demoData';
import {
  getDepartmentById,
  hseDepartments,
  hseModeCards,
  showcaseJurySteps,
  testModeEnvKeys,
} from './data/modeData';
import {
  getCourseProgress,
  getLatestAttempt,
  getAttemptsByModule,
  getModuleLearningState,
  saveAttempt,
  saveCourseProgress,
  saveModuleLearningState,
} from './lib/storage';
import { downloadCsv, downloadXlsxFallback } from './lib/export';
import { getRuleBasedRecommendations } from './lib/recommendations';
import { generateAiRecommendation } from './lib/aiRecommendations';
import { submitCourseRequest, getCrmMode } from './lib/crm';
import { openCompletionPrint } from './lib/pdf';
import {
  getHseSupabaseClient,
  getHseSupabaseConfig,
  isAllowedWorkEmail,
} from './lib/hseSupabase';

const base = '';
const rootPath = '/hse/mvp';
const showcasePath = `${rootPath}/showcase`;
const testPath = `${rootPath}/test`;
const passScore = 95;
const maxAttempts = 3;

const getModuleBlocksCount = (module) =>
  module.blocks?.length || module.cards?.length || 0;

const getModuleQuestions = (module) =>
  module.finalTest || module.questions || [];

const getModulePassScore = (module) => module.passScore || passScore;

const getModuleLessonItems = (module) => {
  if (module.blocks?.length) {
    return module.blocks.map((block, index) => ({
      id: block.id,
      title: block.title,
      type: block.type,
      summary: block.body || block.scene || block.question || block.shortText,
      sourceRefIds: block.sourceRefIds || [],
      index,
    }));
  }
  return (module.cards || []).map((card, index) => ({
    id: card.id,
    title: card.title,
    type: 'video_card',
    summary: card.shortText,
    sourceRefIds: [],
    index,
  }));
};
const getOptionId = (index) => String.fromCharCode(97 + index);

const normalizeQuestion = (question) => {
  const options = (question.options || []).map((option, index) => {
    if (typeof option === 'string') {
      return {
        id: getOptionId(index),
        text: option,
        correct: option === question.correctAnswer,
      };
    }
    return option;
  });
  return {
    ...question,
    text: question.text || question.question,
    type: question.type || 'single',
    options,
    riskTag:
      question.riskTag || question.competency || 'практическое поведение',
    relatedRuleCode:
      question.relatedRuleCode || question.competency || 'итоговый тест',
    recommendationRule: question.recommendationRule || question.explanation,
  };
};

const getQuestionCorrectIds = (question) =>
  normalizeQuestion(question)
    .options.filter((option) => option.correct)
    .map((option) => option.id);

const getSourceTitle = (module, sourceId) =>
  module.sourceRefs?.find((source) => source.id === sourceId)?.title ||
  sourceId;
const href = (path) => `${base}${path}`;

const navItems = [
  { label: 'Главная MVP', path: rootPath, icon: Gauge },
  { label: 'Витринный контур', path: showcasePath, icon: BookOpen },
  { label: 'Тестировочный контур', path: testPath, icon: Database },
  { label: 'Организация', path: `${showcasePath}/organization`, icon: Users },
  {
    label: 'Специалист ОТ',
    path: `${showcasePath}/specialist`,
    icon: BarChart3,
  },
  { label: 'Администратор', path: `${showcasePath}/admin`, icon: Settings },
  { label: 'Интеграции', path: `${showcasePath}/integrations`, icon: LinkIcon },
  { label: 'Поддержка', path: `${showcasePath}/support`, icon: LifeBuoy },
];

const getModeBadge = (path) => {
  if (path === testPath || path.startsWith(`${testPath}/`)) {
    const config = getHseSupabaseConfig();
    return config.isConfigured
      ? 'Тестировочный режим · Supabase'
      : 'Тестировочный режим · Supabase не настроен';
  }
  if (path === rootPath) return 'Выбор контура';
  return 'Витринный режим · демоданные';
};

const statusClass = (status = '') => {
  if (status.includes('Пройден')) return 'success';
  if (status.includes('повтор')) return 'warning';
  if (status.includes('процессе')) return 'info';
  if (status.includes('Просроч')) return 'danger';
  return 'neutral';
};

const formatDateTime = (value) => {
  if (!value) return 'нет данных';
  return new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function Progress({ value = 0, label }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      className="hse-mvp-progress"
      aria-label={label || `Прогресс ${safeValue}%`}
    >
      <div>
        <span style={{ width: `${safeValue}%` }} />
      </div>
      <strong>{safeValue}%</strong>
    </div>
  );
}

function Badge({ children, tone }) {
  return (
    <span
      className={`hse-mvp-badge hse-mvp-badge-${tone || statusClass(children)}`}
    >
      {children}
    </span>
  );
}

function Breadcrumbs({ items }) {
  return (
    <nav className="hse-mvp-breadcrumbs" aria-label="Хлебные крошки">
      <a href={href('/hse')}>Охрана труда</a>
      <span>/</span>
      <a href={href(rootPath)}>Демополигон</a>
      {items.map((item) => (
        <React.Fragment key={item.label}>
          <span>/</span>
          {item.path ? (
            <a href={href(item.path)}>{item.label}</a>
          ) : (
            <strong>{item.label}</strong>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

function Shell({ path, title, children, breadcrumbs = [] }) {
  const [largeText, setLargeText] = useState(false);
  const [contrast, setContrast] = useState(false);

  return (
    <main
      className={`hse-mvp ${largeText ? 'hse-mvp-large-text' : ''} ${contrast ? 'hse-mvp-contrast' : ''}`}
    >
      <Helmet>
        <title>{title} | ANIX HSE MVP</title>
        <meta name="description" content={HSE_MVP_PRODUCT_DESCRIPTION} />
      </Helmet>
      <aside className="hse-mvp-sidebar" aria-label="Навигация демополигона">
        <a
          className="hse-mvp-brand"
          href={href(rootPath)}
          aria-label="ANIX HSE MVP"
        >
          <ShieldCheck aria-hidden="true" />
          <span>ANIX HSE</span>
        </a>
        <nav>
          {navItems.map(({ label, path: itemPath, icon: Icon }) => (
            <a
              className={path === itemPath ? 'active' : ''}
              href={href(itemPath)}
              key={itemPath}
            >
              <Icon aria-hidden="true" size={18} />
              {label}
            </a>
          ))}
        </nav>
      </aside>
      <section className="hse-mvp-workspace">
        <header className="hse-mvp-topbar">
          <div className="hse-mvp-topbar-left">
            <Breadcrumbs items={breadcrumbs} />
            <Badge tone="info">{getModeBadge(path)}</Badge>
          </div>
          <div className="hse-mvp-access" aria-label="Настройки доступности">
            <label>
              <input
                type="checkbox"
                checked={largeText}
                onChange={(event) => setLargeText(event.target.checked)}
              />
              Крупный шрифт
            </label>
            <label>
              <input
                type="checkbox"
                checked={contrast}
                onChange={(event) => setContrast(event.target.checked)}
              />
              Контраст
            </label>
          </div>
        </header>
        {children}
        <SiteFooter />
      </section>
    </main>
  );
}

function KpiCard({ icon: Icon, label, value, hint }) {
  return (
    <article className="hse-mvp-kpi">
      <Icon aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
      {hint ? <p>{hint}</p> : null}
    </article>
  );
}

const getModuleProgress = (moduleId) => {
  const saved = getCourseProgress()[moduleId] || {};
  const learningState = getModuleLearningState(moduleId);
  return {
    status:
      saved.status ||
      (learningState.currentBlockIndex > 0 ? 'В процессе' : 'Не начат'),
    progress: saved.progress || learningState.progress || 0,
    score: saved.score,
    attemptId: saved.attemptId,
  };
};
const scenarioCards = [
  {
    title: 'Пройти обучение как сотрудник',
    text: 'Мобильный сценарий по QR-коду: карточки, прогресс, тест и подтверждение прохождения.',
    path: `${showcasePath}/organization`,
    icon: BookOpen,
  },
  {
    title: 'Кабинет специалиста по охране труда',
    text: 'Аналитика, ошибки по темам, таблица сотрудников, экспорт и рекомендации.',
    path: `${showcasePath}/specialist`,
    icon: BarChart3,
  },
  {
    title: 'Кабинет администратора',
    text: 'Курсы, версии, модули, технологический контур и сведения для конкурса.',
    path: `${showcasePath}/admin`,
    icon: Settings,
  },
  {
    title: 'Заказать новый курс',
    text: 'Форма заявки с файлами, CRM webhook-ready архитектурой и demo fallback.',
    path: `${showcasePath}/request-course`,
    icon: ClipboardList,
  },
];

function HomePage() {
  return (
    <>
      <section className="hse-mvp-hero">
        <div>
          <Badge tone="info">Демополигон цифрового решения</Badge>
          <h1>ANIX. Единая визуальная система обучения по охране труда</h1>
          <p>{HSE_MVP_PRODUCT_DESCRIPTION}</p>
          <div className="hse-mvp-disclaimer">
            <ShieldCheck aria-hidden="true" />
            {HSE_MVP_DISCLAIMER}
          </div>
        </div>
        <div className="hse-mvp-hero-panel" aria-label="Контуры демополигона">
          <KpiCard
            icon={BookOpen}
            label="Витринный контур"
            value="demo"
            hint="Готовые данные и localStorage"
          />
          <KpiCard
            icon={Database}
            label="Тестовый контур"
            value="Supabase"
            hint="Auth, роли, база, RLS-ready"
          />
          <KpiCard
            icon={ShieldCheck}
            label="Безопасность"
            value="0 секретов"
            hint="Service role ключи не попадают во frontend"
          />
        </div>
      </section>

      <section
        className="hse-mvp-grid hse-mvp-mode-grid"
        aria-label="Выбор контура MVP"
      >
        {hseModeCards.map((mode) => (
          <a
            className="hse-mvp-card hse-mvp-mode-card"
            href={href(mode.path)}
            key={mode.id}
          >
            <Badge tone={mode.id === 'test' ? 'warning' : 'info'}>
              {mode.badge}
            </Badge>
            <h2>{mode.title}</h2>
            <p>{mode.description}</p>
            <span>
              {mode.button} <ArrowRight aria-hidden="true" size={18} />
            </span>
          </a>
        ))}
      </section>

      <section className="hse-mvp-panel">
        <div className="hse-mvp-section-head">
          <p>Сценарий для жюри</p>
          <h2>Покажите оба контура за 3-5 минут</h2>
        </div>
        <ol className="hse-mvp-steps">
          {showcaseJurySteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </>
  );
}
function ShowcaseHomePage() {
  const jurySteps = [
    'Откройте сценарий сотрудника.',
    'Пройдите один модуль.',
    'Скачайте подтверждение прохождения.',
    'Перейдите в кабинет специалиста.',
    'Посмотрите аналитику и рекомендации.',
    'Откройте интеграции и поддержку.',
  ];

  return (
    <>
      <section className="hse-mvp-hero">
        <div>
          <Badge tone="info">Демополигон для конкурса</Badge>
          <h1>{HSE_MVP_SYSTEM_NAME}</h1>
          <p>{HSE_MVP_PRODUCT_DESCRIPTION}</p>
          <div className="hse-mvp-disclaimer">
            <ShieldCheck aria-hidden="true" />
            {HSE_MVP_DISCLAIMER}
          </div>
        </div>
        <div className="hse-mvp-hero-panel" aria-label="Ключевые возможности">
          <KpiCard
            icon={BookOpen}
            label="Модули"
            value="3"
            hint="LSR, падения, электробезопасность"
          />
          <KpiCard
            icon={Users}
            label="Демо-сотрудники"
            value="5"
            hint="для кабинета специалиста"
          />
          <KpiCard
            icon={Database}
            label="Режим"
            value="localStorage"
            hint="Supabase-ready без поломки env"
          />
        </div>
      </section>

      <section
        className="hse-mvp-grid hse-mvp-scenarios"
        aria-label="Сценарии демополигона"
      >
        {scenarioCards.map(({ title, text, path, icon: Icon }) => (
          <a
            className="hse-mvp-card hse-mvp-scenario"
            href={href(path)}
            key={path}
          >
            <Icon aria-hidden="true" />
            <h2>{title}</h2>
            <p>{text}</p>
            <span>
              Открыть <ArrowRight aria-hidden="true" size={18} />
            </span>
          </a>
        ))}
      </section>

      <section className="hse-mvp-panel">
        <div className="hse-mvp-section-head">
          <p>Сценарий для жюри</p>
          <h2>3-5 минут, чтобы увидеть полный контур решения</h2>
        </div>
        <ol className="hse-mvp-steps">
          {jurySteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </>
  );
}

function ShowcaseOrganizationPage() {
  const totalHeadcount = hseDepartments.reduce(
    (sum, department) => sum + department.headcount,
    0
  );
  const averageProgress = Math.round(
    hseDepartments.reduce((sum, department) => sum + department.progress, 0) /
      hseDepartments.length
  );

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone="info">Витринный режим · демоданные</Badge>
        <h1>{demoCompany.name}</h1>
        <p>
          Организация показывает структуру LMS: отделы, обязательные модули,
          прогресс, riskTags и нормативную базу. Данные заранее подготовлены для
          демонстрации и сохраняются в браузере.
        </p>
      </section>
      <section className="hse-mvp-grid hse-mvp-kpi-grid">
        <KpiCard
          icon={Users}
          label="Сотрудники"
          value={totalHeadcount}
          hint="в демоструктуре"
        />
        <KpiCard
          icon={BookOpen}
          label="Модули"
          value={demoModules.length}
          hint="LSR, падения, электробезопасность"
        />
        <KpiCard
          icon={Activity}
          label="Средний прогресс"
          value={`${averageProgress}%`}
          hint="по отделам"
        />
        <KpiCard
          icon={FileText}
          label="Источники"
          value="ГОСТ/приказы"
          hint="хранятся в методических полях"
        />
      </section>
      <section className="hse-mvp-grid hse-mvp-department-grid">
        {hseDepartments.map((department) => (
          <article
            className="hse-mvp-card hse-mvp-department-card"
            key={department.id}
          >
            <div className="hse-mvp-card-top">
              <Badge tone="neutral">{department.headcount} чел.</Badge>
              <span>{department.requiredModuleIds.length} мод.</span>
            </div>
            <h2>{department.title}</h2>
            <p>{department.description}</p>
            <Progress
              value={department.progress}
              label={`Прогресс отдела ${department.title}`}
            />
            <div className="hse-mvp-source-list">
              {department.riskTags.map((riskTag) => (
                <span key={riskTag}>{riskTag}</span>
              ))}
            </div>
            <a
              className="hse-mvp-button hse-mvp-button-primary"
              href={href(`${showcasePath}/departments/${department.id}`)}
            >
              Открыть отдел <ArrowRight aria-hidden="true" size={18} />
            </a>
          </article>
        ))}
      </section>
    </>
  );
}

function ShowcaseDepartmentPage({ departmentId }) {
  const department = getDepartmentById(departmentId);
  const modules = department.requiredModuleIds.map((moduleId) =>
    getModuleById(moduleId)
  );

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone="info">Отдел</Badge>
        <h1>{department.title}</h1>
        <p>{department.description}</p>
      </section>
      <section className="hse-mvp-grid hse-mvp-module-grid">
        {modules.map((module) => {
          const lessons = getModuleLessonItems(module);
          return (
            <article
              className="hse-mvp-card hse-mvp-module-card"
              key={module.id}
            >
              <div className="hse-mvp-card-top">
                <Badge tone="neutral">версия {module.version}</Badge>
                <span>{lessons.length} уроков</span>
              </div>
              <h2>{module.title}</h2>
              <p>{module.description}</p>
              <Progress
                value={getModuleProgress(module.id).progress}
                label={`Прогресс ${module.title}`}
              />
              <dl className="hse-mvp-meta">
                <div>
                  <dt>Время</dt>
                  <dd>{module.estimatedMinutes} мин</dd>
                </div>
                <div>
                  <dt>Тест</dt>
                  <dd>{getModuleQuestions(module).length} вопросов</dd>
                </div>
                <div>
                  <dt>Порог</dt>
                  <dd>{getModulePassScore(module)}%</dd>
                </div>
                <div>
                  <dt>Risk tags</dt>
                  <dd>{department.riskTags.slice(0, 2).join(', ')}</dd>
                </div>
              </dl>
              <a
                className="hse-mvp-button hse-mvp-button-primary"
                href={href(`${showcasePath}/modules/${module.id}`)}
              >
                Открыть модуль <ArrowRight aria-hidden="true" size={18} />
              </a>
            </article>
          );
        })}
      </section>
    </>
  );
}

function ShowcaseModulePage({ moduleId }) {
  const module = getModuleById(moduleId);
  const lessons = getModuleLessonItems(module);

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone="info">Модуль</Badge>
        <h1>{module.title}</h1>
        <p>{module.description}</p>
      </section>
      <section className="hse-mvp-grid hse-mvp-kpi-grid">
        <KpiCard
          icon={BookOpen}
          label="Уроки"
          value={lessons.length}
          hint="обязательные блоки"
        />
        <KpiCard
          icon={ClipboardList}
          label="Тест"
          value={getModuleQuestions(module).length}
          hint="вопросов"
        />
        <KpiCard
          icon={ShieldCheck}
          label="Порог"
          value={`${getModulePassScore(module)}%`}
          hint="для прохождения"
        />
        <KpiCard
          icon={FileText}
          label="Версия"
          value={module.version}
          hint="каталог курса"
        />
      </section>
      <section className="hse-mvp-panel">
        <div className="hse-mvp-section-head">
          <p>Обязательные уроки</p>
          <h2>Единый каталог используется в витринном и тестовом контуре</h2>
        </div>
        <div className="hse-mvp-lesson-list">
          {lessons.map((lesson) => (
            <a
              className="hse-mvp-lesson-row"
              href={href(
                `${showcasePath}/modules/${module.id}/lessons/${lesson.id}`
              )}
              key={lesson.id}
            >
              <span>{lesson.index + 1}</span>
              <div>
                <strong>{lesson.title}</strong>
                <p>{lesson.summary}</p>
              </div>
              <ArrowRight aria-hidden="true" size={18} />
            </a>
          ))}
        </div>
      </section>
      <div className="hse-mvp-actions">
        <a
          className="hse-mvp-button"
          href={href(`${rootPath}/course/${module.id}`)}
        >
          Открыть прохождение модуля
        </a>
        <a
          className="hse-mvp-button hse-mvp-button-primary"
          href={href(`${showcasePath}/modules/${module.id}/test`)}
        >
          Перейти к тесту <ArrowRight aria-hidden="true" size={18} />
        </a>
      </div>
    </>
  );
}

function ShowcaseLessonPage({ moduleId, lessonId }) {
  const module = getModuleById(moduleId);
  const lessons = getModuleLessonItems(module);
  const lesson = lessons.find((item) => item.id === lessonId) || lessons[0];
  const sourceRefs = lesson.sourceRefIds || [];

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone="info">Урок {lesson.index + 1}</Badge>
        <h1>{lesson.title}</h1>
        <p>{lesson.summary}</p>
      </section>
      <section className="hse-mvp-course-layout hse-mvp-learning-layout">
        <article className="hse-mvp-course-card hse-mvp-learning-card">
          <div
            className="hse-mvp-scene-placeholder"
            role="img"
            aria-label={lesson.title}
          >
            <Eye aria-hidden="true" size={34} />
            <strong>{lesson.title}</strong>
            <span>Визуальная карточка / урок из единого каталога модуля.</span>
          </div>
          <div className="hse-mvp-text-lesson">
            <p>{lesson.summary}</p>
            <dl>
              <div>
                <dt>На чем основан урок</dt>
                <dd>
                  {sourceRefs.length
                    ? sourceRefs
                        .map((sourceId) => getSourceTitle(module, sourceId))
                        .join(', ')
                    : 'Методические данные курса и внутренние правила площадки'}
                </dd>
              </div>
              <div>
                <dt>Практическое действие</dt>
                <dd>
                  Определить риск, остановиться, обозначить опасность и сообщить
                  ответственному лицу.
                </dd>
              </div>
              <div>
                <dt>Запрет</dt>
                <dd>
                  Не игнорировать опасность и не продолжать работу, если
                  ситуация небезопасна.
                </dd>
              </div>
            </dl>
          </div>
        </article>
        <aside className="hse-mvp-course-aside">
          <h2>Уроки модуля</h2>
          <div className="hse-mvp-card-list">
            {lessons.map((item) => (
              <a
                className={item.id === lesson.id ? 'active' : ''}
                href={href(
                  `${showcasePath}/modules/${module.id}/lessons/${item.id}`
                )}
                key={item.id}
              >
                <span>{item.index + 1}</span>
                {item.title}
              </a>
            ))}
          </div>
        </aside>
      </section>
      <div className="hse-mvp-actions hse-mvp-course-actions">
        <a
          className="hse-mvp-button"
          href={href(`${showcasePath}/modules/${module.id}`)}
        >
          <ArrowLeft aria-hidden="true" size={18} /> К модулю
        </a>
        <a
          className="hse-mvp-button hse-mvp-button-primary"
          href={href(`${rootPath}/course/${module.id}`)}
        >
          Пройти интерактивно <ArrowRight aria-hidden="true" size={18} />
        </a>
      </div>
    </>
  );
}
function EmployeePage() {
  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone="info">Сценарий сотрудника</Badge>
        <h1>Пищевая производственная площадка №1</h1>
        <p>
          Демо-сотрудник проходит визуальные модули без настоящей авторизации.
          Результаты сохраняются в браузере и появляются в кабинете специалиста.
        </p>
      </section>
      <section className="hse-mvp-grid hse-mvp-module-grid">
        {demoModules.map((module) => {
          const progress = getModuleProgress(module.id);
          return (
            <article
              className="hse-mvp-card hse-mvp-module-card"
              key={module.id}
            >
              <div className="hse-mvp-card-top">
                <Badge>{progress.status}</Badge>
                <span>версия {module.version}</span>
              </div>
              <h2>{module.title}</h2>
              <p>{module.description}</p>
              <Progress
                value={progress.progress}
                label={`Прогресс модуля ${module.title}`}
              />
              <dl className="hse-mvp-meta">
                <div>
                  <dt>Время</dt>
                  <dd>{module.estimatedMinutes} мин</dd>
                </div>
                <div>
                  <dt>{module.blocks?.length ? 'Блоки' : 'Карточки'}</dt>
                  <dd>{getModuleBlocksCount(module)}</dd>
                </div>
                <div>
                  <dt>Вопросы</dt>
                  <dd>{getModuleQuestions(module).length}</dd>
                </div>
                <div>
                  <dt>Статус курса</dt>
                  <dd>
                    {module.status === 'published'
                      ? 'Опубликован'
                      : module.status}
                  </dd>
                </div>
              </dl>
              <a
                className="hse-mvp-button hse-mvp-button-primary"
                href={href(`${rootPath}/course/${module.id}`)}
              >
                {progress.progress > 0 && progress.progress < 100
                  ? 'Продолжить'
                  : 'Начать'}
                <ArrowRight aria-hidden="true" size={18} />
              </a>
            </article>
          );
        })}
      </section>
    </>
  );
}
function LearningModulePage({ module }) {
  const initialState = getModuleLearningState(module.id);
  const [blockIndex, setBlockIndex] = useState(
    Math.min(initialState.currentBlockIndex || 0, module.blocks.length - 1)
  );
  const [answers, setAnswers] = useState(initialState.answers || {});
  const block = module.blocks[blockIndex];
  const selectedAnswer = answers[block.id];
  const isAnswered = Boolean(selectedAnswer);
  const requiresAnswer =
    block.type === 'video_card' || block.type === 'interactive_question';
  const isCorrect = selectedAnswer === block.correctAnswer;
  const percent = Math.round(((blockIndex + 1) / module.blocks.length) * 100);

  useEffect(() => {
    saveModuleLearningState(module.id, {
      currentBlockIndex: blockIndex,
      answers,
      progress: percent,
    });
    saveCourseProgress(module.id, {
      status: percent >= 100 ? 'В процессе' : 'В процессе',
      progress: Math.min(99, percent),
    });
  }, [answers, blockIndex, module.id, percent]);

  const chooseAnswer = (answer) => {
    setAnswers((current) => ({ ...current, [block.id]: answer }));
  };

  const goToBlock = (index) => {
    setBlockIndex(Math.max(0, Math.min(index, module.blocks.length - 1)));
  };

  const sourceRefs = block.sourceRefIds || [];

  return (
    <>
      <section className="hse-mvp-page-head hse-mvp-course-head">
        <div>
          <Badge tone="info">{module.title}</Badge>
          <h1>{block.title}</h1>
          <p>
            {module.companyContext}. Короткий LMS-блок для прохождения на
            рабочем месте.
          </p>
        </div>
        <Progress value={percent} label="Прогресс прохождения модуля" />
      </section>

      <section className="hse-mvp-course-layout hse-mvp-learning-layout">
        <article
          className={`hse-mvp-course-card hse-mvp-learning-card hse-mvp-block-${block.type}`}
        >
          <div className="hse-mvp-block-kicker">
            <Badge
              tone={
                block.type === 'text_lesson'
                  ? 'neutral'
                  : block.type === 'video_card'
                    ? 'info'
                    : 'warning'
              }
            >
              {block.type === 'text_lesson'
                ? 'Микроурок'
                : block.type === 'video_card'
                  ? 'Видеокарточка'
                  : 'Интерактивный вопрос'}
            </Badge>
            <span>
              Блок {blockIndex + 1} из {module.blocks.length}
            </span>
          </div>

          {block.type === 'video_card' ? (
            <>
              <div
                className="hse-mvp-scene-placeholder"
                role="img"
                aria-label={block.visualDescription}
              >
                <Eye aria-hidden="true" size={34} />
                <strong>{block.screenText}</strong>
                <span>{block.visualDescription}</span>
              </div>
              <p className="hse-mvp-scene-text">{block.scene}</p>
              <QuestionOptions
                block={block}
                selectedAnswer={selectedAnswer}
                onChoose={chooseAnswer}
              />
            </>
          ) : null}

          {block.type === 'text_lesson' ? (
            <div className="hse-mvp-text-lesson">
              <p>{block.body}</p>
              <dl>
                <div>
                  <dt>Главное правило</dt>
                  <dd>{block.mainRule}</dd>
                </div>
                <div>
                  <dt>Действие сотрудника</dt>
                  <dd>{block.employeeAction}</dd>
                </div>
                <div>
                  <dt>Запрет</dt>
                  <dd>{block.prohibition}</dd>
                </div>
              </dl>
            </div>
          ) : null}

          {block.type === 'interactive_question' ? (
            <>
              <p className="hse-mvp-scene-text">{block.question}</p>
              <QuestionOptions
                block={block}
                selectedAnswer={selectedAnswer}
                onChoose={chooseAnswer}
              />
            </>
          ) : null}

          {requiresAnswer && isAnswered ? (
            <div
              className={`hse-mvp-answer-feedback ${isCorrect ? 'success' : 'warning'}`}
            >
              <strong>{isCorrect ? 'Верно' : 'Нужно повторить'}</strong>
              <p>{block.explanation}</p>
              {!isCorrect ? (
                <p>Правильный ответ: {block.correctAnswer}</p>
              ) : null}
            </div>
          ) : null}

          {sourceRefs.length ? (
            <div
              className="hse-mvp-source-list"
              aria-label="Методические источники"
            >
              {sourceRefs.map((sourceId) => (
                <span key={sourceId}>{getSourceTitle(module, sourceId)}</span>
              ))}
            </div>
          ) : null}
        </article>

        <aside className="hse-mvp-course-aside">
          <h2>Навигация по модулю</h2>
          <div className="hse-mvp-card-list" aria-label="Список блоков модуля">
            {module.blocks.map((item, index) => (
              <button
                className={index === blockIndex ? 'active' : ''}
                key={item.id}
                type="button"
                onClick={() => goToBlock(index)}
              >
                <span>{index + 1}</span>
                {item.title}
              </button>
            ))}
          </div>
        </aside>
      </section>

      <div className="hse-mvp-actions hse-mvp-course-actions">
        <button
          className="hse-mvp-button"
          type="button"
          onClick={() => goToBlock(blockIndex - 1)}
          disabled={blockIndex === 0}
        >
          <ArrowLeft aria-hidden="true" size={18} /> Назад
        </button>
        {blockIndex < module.blocks.length - 1 ? (
          <button
            className="hse-mvp-button hse-mvp-button-primary"
            type="button"
            onClick={() => goToBlock(blockIndex + 1)}
            disabled={requiresAnswer && !isAnswered}
          >
            Далее <ArrowRight aria-hidden="true" size={18} />
          </button>
        ) : (
          <a
            className="hse-mvp-button hse-mvp-button-primary"
            href={href(`${rootPath}/course/${module.id}/test`)}
          >
            Перейти к итоговому тесту{' '}
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        )}
      </div>
    </>
  );
}

function QuestionOptions({ block, selectedAnswer, onChoose }) {
  return (
    <div className="hse-mvp-options hse-mvp-learning-options">
      {block.options.map((option) => {
        const answered = Boolean(selectedAnswer);
        const isSelected = selectedAnswer === option;
        const isCorrectOption = block.correctAnswer === option;
        return (
          <button
            className={`${isSelected ? 'selected' : ''} ${answered && isCorrectOption ? 'correct' : ''} ${answered && isSelected && !isCorrectOption ? 'wrong' : ''}`}
            key={option}
            type="button"
            onClick={() => onChoose(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function LegacyCardCoursePage({ module }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [repeatKey, setRepeatKey] = useState(0);
  const card = module.cards[cardIndex];
  const percent = Math.round(((cardIndex + 1) / module.cards.length) * 100);

  return (
    <>
      <section className="hse-mvp-page-head hse-mvp-course-head">
        <div>
          <Badge tone="info">{module.title}</Badge>
          <h1>{card.title}</h1>
          <p>{card.shortText}</p>
        </div>
        <Progress value={percent} label="Прогресс прохождения карточек" />
      </section>

      <section className="hse-mvp-course-layout">
        <article className="hse-mvp-course-card">
          <div className="hse-mvp-media-frame">
            {card.video ? (
              <video
                key={`${card.id}-${repeatKey}`}
                src={card.video}
                poster={card.image}
                controls
                muted
                playsInline
                preload="metadata"
                aria-label={card.altText}
              />
            ) : (
              <img src={card.image} alt={card.altText} loading="lazy" />
            )}
          </div>
          <div className="hse-mvp-rule-meta">
            <Badge tone="neutral">{card.ruleCode}</Badge>
            <Badge tone="info">{card.riskTag}</Badge>
            <span>версия {card.version}</span>
          </div>
        </article>

        <aside className="hse-mvp-course-aside">
          <h2>Карточки модуля</h2>
          <div className="hse-mvp-card-list" aria-label="Список карточек">
            {module.cards.map((item, index) => (
              <button
                className={index === cardIndex ? 'active' : ''}
                key={item.id}
                type="button"
                onClick={() => setCardIndex(index)}
              >
                <span>{item.ruleCode}</span>
                {item.title}
              </button>
            ))}
          </div>
        </aside>
      </section>

      <div className="hse-mvp-actions hse-mvp-course-actions">
        <button
          className="hse-mvp-button"
          type="button"
          onClick={() => setCardIndex(Math.max(0, cardIndex - 1))}
          disabled={cardIndex === 0}
        >
          <ArrowLeft aria-hidden="true" size={18} /> Назад
        </button>
        <button
          className="hse-mvp-button"
          type="button"
          onClick={() => setRepeatKey((value) => value + 1)}
        >
          <RotateCcw aria-hidden="true" size={18} /> Повторить правило
        </button>
        {cardIndex < module.cards.length - 1 ? (
          <button
            className="hse-mvp-button hse-mvp-button-primary"
            type="button"
            onClick={() => setCardIndex(cardIndex + 1)}
          >
            Далее <ArrowRight aria-hidden="true" size={18} />
          </button>
        ) : (
          <a
            className="hse-mvp-button hse-mvp-button-primary"
            href={href(`${rootPath}/course/${module.id}/test`)}
          >
            Перейти к тесту <ArrowRight aria-hidden="true" size={18} />
          </a>
        )}
      </div>
    </>
  );
}
function CoursePage({ courseId }) {
  const module = getModuleById(courseId) || demoModules[0];
  if (module.blocks?.length) return <LearningModulePage module={module} />;
  return <LegacyCardCoursePage module={module} />;
}
function sameAnswers(selected, correct) {
  if (selected.length !== correct.length) return false;
  return selected.every((id) => correct.includes(id));
}

function TestPage({ courseId }) {
  const module = getModuleById(courseId) || demoModules[0];
  const questions = getModuleQuestions(module).map(normalizeQuestion);
  const requiredScore = getModulePassScore(module);
  const [answers, setAnswers] = useState({});
  const [showMissing, setShowMissing] = useState(false);
  const attemptsCount = getAttemptsByModule(module.id).length;

  const setAnswer = (question, optionId) => {
    setShowMissing(false);
    setAnswers((current) => {
      const selected = current[question.id] || [];
      if (question.type === 'single')
        return { ...current, [question.id]: [optionId] };
      return {
        ...current,
        [question.id]: selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId],
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isComplete = questions.every(
      (question) => (answers[question.id] || []).length > 0
    );
    if (!isComplete) {
      setShowMissing(true);
      return;
    }

    const results = questions.map((question) => {
      const selected = answers[question.id] || [];
      const correct = getQuestionCorrectIds(question);
      return {
        questionId: question.id,
        questionText: question.text,
        selectedOptionIds: selected,
        selectedAnswers: question.options
          .filter((option) => selected.includes(option.id))
          .map((option) => option.text),
        isCorrect: sameAnswers(selected, correct),
        riskTag: question.riskTag,
        relatedRuleCode: question.relatedRuleCode,
        recommendationRule: question.recommendationRule,
        competency: question.competency,
        explanation: question.explanation,
      };
    });
    const correctCount = results.filter((result) => result.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= requiredScore;
    const storedAttempt = saveAttempt({
      employeeId: demoEmployee.id,
      employeeName: demoEmployee.fullName,
      companyId: demoCompany.id,
      companyName: demoCompany.name,
      moduleId: module.id,
      moduleTitle: module.title,
      version: module.version,
      score,
      passScore: requiredScore,
      passed,
      status: passed ? 'модуль пройден' : 'рекомендуется повторить',
      durationSeconds: module.estimatedMinutes * 60,
      maxAttempts,
      answers: results,
      mistakes: results.filter((result) => !result.isCorrect),
      completionStatement: module.completionStatement,
      completedAt: new Date().toISOString(),
    });

    saveModuleLearningState(module.id, {
      currentBlockIndex: module.blocks?.length ? module.blocks.length - 1 : 0,
      testScore: score,
      testPassed: passed,
      progress: 100,
    });

    window.location.assign(href(`${rootPath}/result/${storedAttempt.id}`));
  };

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone="info">Итоговый тест</Badge>
        <h1>Тест: {module.title}</h1>
        <p>
          Это проверка понимания обучающего модуля, а не официальный экзамен и
          не юридический допуск к работам. Для завершения модуля нужно набрать
          не менее {requiredScore}%.
        </p>
        <div className="hse-mvp-test-limits">
          <Badge tone="neutral">Проходной балл {requiredScore}%</Badge>
          <Badge tone="neutral">{questions.length} вопросов</Badge>
          <Badge tone="neutral">
            Попытка {Math.min(attemptsCount + 1, maxAttempts)} из {maxAttempts}
          </Badge>
        </div>
      </section>

      <form className="hse-mvp-test" onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <fieldset className="hse-mvp-question" key={question.id}>
            <legend>
              {index + 1}. {question.text}
            </legend>
            <p>
              {question.type === 'multi'
                ? 'Выберите несколько вариантов'
                : 'Выберите один вариант'}{' '}
              · {question.competency || question.relatedRuleCode}
            </p>
            <div className="hse-mvp-options">
              {question.options.map((option) => {
                const selected = (answers[question.id] || []).includes(
                  option.id
                );
                return (
                  <label className={selected ? 'selected' : ''} key={option.id}>
                    <input
                      type={question.type === 'multi' ? 'checkbox' : 'radio'}
                      name={question.id}
                      checked={selected}
                      onChange={() => setAnswer(question, option.id)}
                    />
                    {option.text}
                  </label>
                );
              })}
            </div>
            {question.sourceRefIds?.length ? (
              <div className="hse-mvp-source-list">
                {question.sourceRefIds.map((sourceId) => (
                  <span key={sourceId}>{getSourceTitle(module, sourceId)}</span>
                ))}
              </div>
            ) : null}
          </fieldset>
        ))}
        {showMissing ? (
          <p className="hse-mvp-form-error">
            Ответьте на все вопросы перед завершением проверки.
          </p>
        ) : null}
        <div className="hse-mvp-actions">
          <a
            className="hse-mvp-button"
            href={href(`${rootPath}/course/${module.id}`)}
          >
            <ArrowLeft aria-hidden="true" size={18} /> Назад к модулю
          </a>
          <button
            className="hse-mvp-button hse-mvp-button-primary"
            type="submit"
          >
            Завершить модуль
          </button>
        </div>
      </form>
    </>
  );
}
function ResultPage({ attemptId }) {
  const attempt = getLatestAttempt(attemptId);
  const module = attempt ? getModuleById(attempt.moduleId) : demoModules[0];
  const mistakes = attempt?.mistakes || [];
  const status = attempt?.passed ? 'модуль пройден' : 'рекомендуется повторить';

  return (
    <>
      <section className="hse-mvp-result-hero">
        <Badge>{status}</Badge>
        <h1>Итог прохождения</h1>
        <div
          className="hse-mvp-score"
          aria-label={`Результат ${attempt?.score || 0}%`}
        >
          {attempt?.score || 0}%
        </div>
        <p>
          {attempt?.passed
            ? 'Модуль пройден. Данные сохранены в демо-базе браузера.'
            : 'Рекомендуется повторить правила, по которым были ошибки.'}
        </p>
        <button
          className="hse-mvp-button hse-mvp-button-primary"
          type="button"
          onClick={() => openCompletionPrint(attempt)}
        >
          <Download aria-hidden="true" size={18} /> Скачать подтверждение
          прохождения
        </button>
      </section>

      {attempt?.completionStatement || module.completionStatement ? (
        <section className="hse-mvp-panel hse-mvp-completion-statement">
          <div className="hse-mvp-section-head">
            <p>Подтверждение прохождения</p>
            <h2>{module.title}</h2>
          </div>
          <p>{attempt?.completionStatement || module.completionStatement}</p>
          <a className="hse-mvp-button" href={href(`${rootPath}/employee`)}>
            Вернуться к модулям
          </a>
        </section>
      ) : null}
      <section className="hse-mvp-grid hse-mvp-result-grid">
        <KpiCard
          icon={BookOpen}
          label="Модуль"
          value={module.title}
          hint={`версия ${module.version}`}
        />
        <KpiCard
          icon={Activity}
          label="Попытки"
          value={attempt?.attemptNumber || 1}
          hint={`максимум ${maxAttempts}`}
        />
        <KpiCard
          icon={Gauge}
          label="Время"
          value={`${Math.round((attempt?.durationSeconds || 0) / 60)} мин`}
          hint="демо-оценка"
        />
      </section>

      <section className="hse-mvp-panel">
        <div className="hse-mvp-section-head">
          <p>Ошибки и рекомендации</p>
          <h2>
            {mistakes.length
              ? 'Повторите правила по темам ниже'
              : 'Ошибок не зафиксировано'}
          </h2>
        </div>
        {mistakes.length ? (
          <div className="hse-mvp-recommendation-list">
            {mistakes.map((mistake) => (
              <article key={mistake.questionId}>
                <Badge tone="warning">{mistake.riskTag}</Badge>
                <h3>Повторите правило: {mistake.recommendationRule}</h3>
                <p>{mistake.questionText}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="hse-mvp-muted">
            Можно перейти в кабинет специалиста и увидеть обновленную аналитику.
          </p>
        )}
      </section>
    </>
  );
}
const toExportRows = (rows) =>
  rows.map((row) => ({
    сотрудник: row.name,
    подразделение: row.department,
    площадка: row.site,
    модуль: row.module,
    прогресс: `${row.progress}%`,
    статус: row.status,
    балл: row.score,
    попытки: row.attempts,
    'время прохождения': row.duration,
    'последняя активность': row.lastActivity,
    рекомендации: row.recommendations,
  }));

function useSpecialistRows() {
  return useMemo(() => {
    const latest = getLatestAttempt();
    if (!latest) return demoEmployeeRows;
    return demoEmployeeRows.map((row, index) => {
      if (index !== 0) return row;
      return {
        ...row,
        moduleId: latest.moduleId,
        module: latest.moduleTitle,
        progress: 100,
        status: latest.passed ? 'Пройден' : 'Рекомендуется повторить',
        score: latest.score,
        attempts: latest.attemptNumber,
        duration: `${Math.round((latest.durationSeconds || 0) / 60)} мин`,
        lastActivity: formatDateTime(latest.completedAt),
        riskTag: latest.mistakes?.[0]?.riskTag || row.riskTag,
        recommendations: latest.passed
          ? 'Сохранить результат и продолжить плановое микрообучение.'
          : `Повторить правило: ${latest.mistakes?.[0]?.recommendationRule || 'ключевые правила модуля'}.`,
      };
    });
  }, []);
}

function SpecialistPage() {
  const rows = useSpecialistRows();
  const [filters, setFilters] = useState({
    site: 'all',
    department: 'all',
    module: 'all',
    status: 'all',
    riskTag: 'all',
  });
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const options = (key) => [
    'all',
    ...Array.from(new Set(rows.map((row) => row[key]).filter(Boolean))),
  ];
  const filteredRows = rows.filter((row) =>
    Object.entries(filters).every(
      ([key, value]) => value === 'all' || row[key] === value
    )
  );
  const completed = rows.filter((row) => row.status === 'Пройден').length;
  const averageScore = Math.round(
    rows.reduce((sum, row) => sum + Number(row.score || 0), 0) / rows.length
  );
  const recommendations = getRuleBasedRecommendations(rows);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));
  const askAi = async () => {
    setAiLoading(true);
    const result = await generateAiRecommendation(rows);
    setAiText(result.text);
    setAiLoading(false);
  };

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone="info">Кабинет специалиста по охране труда</Badge>
        <h1>{demoCompany.name}</h1>
        <p>
          Дашборд показывает учет прохождения, ошибки по темам, рекомендации и
          экспорт для отчетной подготовки.
        </p>
      </section>

      <section className="hse-mvp-grid hse-mvp-kpi-grid">
        <KpiCard
          icon={Users}
          label="Всего сотрудников"
          value={rows.length}
          hint="демо-выборка"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Прошли обучение"
          value={`${completed}/${rows.length}`}
          hint={`${Math.round((completed / rows.length) * 100)}%`}
        />
        <KpiCard
          icon={Gauge}
          label="Средний балл"
          value={`${averageScore}%`}
          hint={`проходной ${passScore}%`}
        />
        <KpiCard
          icon={Activity}
          label="Среднее время"
          value="7 мин"
          hint="по завершенным модулям"
        />
      </section>

      <section className="hse-mvp-panel hse-mvp-analytics">
        <div className="hse-mvp-section-head">
          <p>Аналитика ошибок</p>
          <h2>Темы риска и модули с наибольшим числом ошибок</h2>
        </div>
        <div className="hse-mvp-risk-bars">
          {[
            'скользкие поверхности',
            'электробезопасность',
            'организация работ',
          ].map((risk, index) => (
            <div key={risk}>
              <span>{risk}</span>
              <Progress
                value={[34, 28, 18][index]}
                label={`Ошибки по теме ${risk}`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="hse-mvp-panel">
        <div className="hse-mvp-toolbar">
          <div className="hse-mvp-section-head">
            <p>Фильтры</p>
            <h2>Сотрудники и результаты</h2>
          </div>
          <div className="hse-mvp-export-actions">
            <button
              className="hse-mvp-button"
              type="button"
              onClick={() =>
                downloadCsv(toExportRows(filteredRows), 'anix-hse-results.csv')
              }
            >
              <Download aria-hidden="true" size={18} /> Экспорт CSV
            </button>
            <button
              className="hse-mvp-button"
              type="button"
              onClick={() =>
                downloadXlsxFallback(
                  toExportRows(filteredRows),
                  'anix-hse-results.xls'
                )
              }
            >
              <Download aria-hidden="true" size={18} /> Экспорт XLSX
            </button>
          </div>
        </div>
        <div className="hse-mvp-filters" aria-label="Фильтры таблицы">
          {[
            ['site', 'Площадка'],
            ['department', 'Подразделение'],
            ['module', 'Модуль'],
            ['status', 'Статус'],
            ['riskTag', 'Тема риска'],
          ].map(([key, label]) => (
            <label key={key}>
              {label}
              <select
                value={filters[key]}
                onChange={(event) => updateFilter(key, event.target.value)}
              >
                {options(key).map((option) => (
                  <option value={option} key={option}>
                    {option === 'all' ? 'Все' : option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="hse-mvp-table-wrap">
          <table className="hse-mvp-table">
            <thead>
              <tr>
                <th>сотрудник</th>
                <th>подразделение</th>
                <th>площадка</th>
                <th>модуль</th>
                <th>прогресс</th>
                <th>статус</th>
                <th>балл</th>
                <th>попытки</th>
                <th>время</th>
                <th>активность</th>
                <th>рекомендации</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.department}</td>
                  <td>{row.site}</td>
                  <td>{row.module}</td>
                  <td>
                    <Progress value={row.progress} />
                  </td>
                  <td>
                    <Badge>{row.status}</Badge>
                  </td>
                  <td>{row.score ? `${row.score}%` : '—'}</td>
                  <td>{row.attempts}</td>
                  <td>{row.duration}</td>
                  <td>{row.lastActivity}</td>
                  <td>{row.recommendations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="hse-mvp-grid hse-mvp-reco-grid">
        <article className="hse-mvp-panel">
          <div className="hse-mvp-section-head">
            <p>Рекомендации системы</p>
            <h2>Rule-based подсказки</h2>
          </div>
          <div className="hse-mvp-recommendation-list">
            {recommendations.map((item) => (
              <article key={item.text}>
                <Badge tone={item.severity === 'high' ? 'warning' : 'info'}>
                  {item.riskTag}
                </Badge>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </article>
        <article className="hse-mvp-panel hse-mvp-ai-panel">
          <div className="hse-mvp-section-head">
            <p>AI-помощник</p>
            <h2>Рекомендация специалисту по ОТ</h2>
          </div>
          <p>
            AI-рекомендация сформирована на основе результатов прохождения,
            частых ошибок и правил курса. В промышленной версии может
            использоваться LLM-интеграция через защищенный backend.
          </p>
          <p className="hse-mvp-muted">
            AI-рекомендации носят справочный характер и не заменяют решение
            специалиста по охране труда.
          </p>
          <button
            className="hse-mvp-button hse-mvp-button-primary"
            type="button"
            onClick={askAi}
            disabled={aiLoading}
          >
            <Bot aria-hidden="true" size={18} />{' '}
            {aiLoading ? 'Формируем...' : 'AI-рекомендация специалисту по ОТ'}
          </button>
          {aiText ? <pre className="hse-mvp-ai-output">{aiText}</pre> : null}
        </article>
      </section>
    </>
  );
}

function AdminPage() {
  const [message, setMessage] = useState('');
  const mockAction = (text) =>
    setMessage(
      `${text}: демо-действие выполнено, промышленная версия подключается к backend.`
    );

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone="info">Кабинет администратора</Badge>
        <h1>Управление курсами ANIX HSE</h1>
        <p>
          Демо-админка показывает версии курсов, модули, технологический контур
          и сведения для конкурсной оценки.
        </p>
      </section>
      <section className="hse-mvp-panel">
        <div className="hse-mvp-toolbar">
          <div className="hse-mvp-section-head">
            <p>Курсы</p>
            <h2>Список курсов и версий</h2>
          </div>
          <div className="hse-mvp-export-actions">
            <button
              className="hse-mvp-button"
              type="button"
              onClick={() => mockAction('Создать новую версию курса')}
            >
              <Plus aria-hidden="true" size={18} /> Создать новую версию курса
            </button>
            <button
              className="hse-mvp-button"
              type="button"
              onClick={() => mockAction('Добавить модуль')}
            >
              <BookOpen aria-hidden="true" size={18} /> Добавить модуль
            </button>
            <button
              className="hse-mvp-button"
              type="button"
              onClick={() => mockAction('Проверить интеграции')}
            >
              <Wrench aria-hidden="true" size={18} /> Проверить интеграции
            </button>
          </div>
        </div>
        {message ? <p className="hse-mvp-success">{message}</p> : null}
        <div className="hse-mvp-table-wrap">
          <table className="hse-mvp-table">
            <thead>
              <tr>
                <th>курс</th>
                <th>версия</th>
                <th>модули</th>
                <th>карточки</th>
                <th>вопросы</th>
                <th>обновлен</th>
                <th>публикация</th>
              </tr>
            </thead>
            <tbody>
              {courseCatalog.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.version}</td>
                  <td>{course.modulesCount}</td>
                  <td>{course.cardsCount}</td>
                  <td>{course.questionsCount}</td>
                  <td>{course.updatedAt}</td>
                  <td>
                    <Badge tone="success">
                      {course.status === 'published'
                        ? 'Опубликован'
                        : course.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="hse-mvp-grid hse-mvp-admin-grid">
        <article className="hse-mvp-panel">
          <div className="hse-mvp-section-head">
            <p>Технологический контур</p>
            <h2>Что уже собрано в MVP</h2>
          </div>
          <ul className="hse-mvp-check-list">
            {[
              'визуальные обучающие материалы',
              'тестирование',
              'база прохождений',
              'аналитика',
              'экспорт',
              'CRM-заявки на новые курсы',
              'AI-рекомендации',
            ].map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article className="hse-mvp-panel">
          <div className="hse-mvp-section-head">
            <p>Сведения для конкурса</p>
            <h2>Покрытие критериев</h2>
          </div>
          <div className="hse-mvp-criteria">
            {competitionCriteria.map((item) => (
              <div key={item}>
                <CheckCircle2 aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
const requestFields = [
  ['companyName', 'Название компании', 'text'],
  ['industry', 'Отрасль', 'text'],
  ['employeesCount', 'Количество сотрудников', 'number'],
  ['sites', 'Площадки / локации', 'text'],
  ['riskTypes', 'Типы рисков', 'text'],
  ['courseGoal', 'Задача курса', 'textarea'],
  ['materialsDescription', 'Какие материалы уже есть', 'textarea'],
  ['comment', 'Комментарий', 'textarea'],
  ['contactName', 'Контактное лицо', 'text'],
  ['phone', 'Телефон', 'tel'],
  ['email', 'Email', 'email'],
];

function RequestCoursePage() {
  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    employeesCount: '',
    sites: '',
    riskTypes: '',
    courseGoal: '',
    materialsDescription: '',
    comment: '',
    contactName: '',
    phone: '',
    email: '',
  });
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const crmMode = getCrmMode();

  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const payload = {
      source: 'ANIX HSE MVP',
      product: 'Единая визуальная система обучения по охране труда',
      companyName: form.companyName,
      industry: form.industry,
      employeesCount: form.employeesCount,
      sites: form.sites,
      riskTypes: form.riskTypes,
      courseGoal: form.courseGoal,
      materialsDescription: form.materialsDescription,
      contactName: form.contactName,
      phone: form.phone,
      email: form.email,
      comment: form.comment,
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      })),
      createdAt: new Date().toISOString(),
    };
    const response = await submitCourseRequest(payload);
    setResult(response);
    setSubmitting(false);
  };

  if (result) {
    return (
      <section className="hse-mvp-result-hero hse-mvp-success-screen">
        <Badge tone="success">
          {result.status === 'sent'
            ? 'Заявка передана в CRM'
            : 'Демо-заявка сохранена'}
        </Badge>
        <h1>Заявка принята</h1>
        <p>
          {result.message}. Специалист ANIX свяжется для подготовки визуального
          курса.
        </p>
        <p className="hse-mvp-muted">
          В деморежиме файлы не сохраняются. В промышленной версии материалы
          передаются через защищенное хранилище.
        </p>
        <a
          className="hse-mvp-button hse-mvp-button-primary"
          href={href(rootPath)}
        >
          Вернуться на демополигон
        </a>
      </section>
    );
  }

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone="info">Сценарий заказчика</Badge>
        <h1>Заказать новый курс</h1>
        <p>
          Форма собирает задачу, риски и материалы. OAuth-токены CRM не хранятся
          во frontend; используется безопасный webhook/proxy endpoint.
        </p>
      </section>
      <form
        className="hse-mvp-panel hse-mvp-request-form"
        onSubmit={handleSubmit}
      >
        <div className="hse-mvp-form-grid">
          {requestFields.map(([key, label, type]) => (
            <label className={type === 'textarea' ? 'wide' : ''} key={key}>
              {label}
              {type === 'textarea' ? (
                <textarea
                  value={form[key]}
                  onChange={(event) => update(key, event.target.value)}
                  rows={4}
                  required={['courseGoal', 'contactName'].includes(key)}
                />
              ) : (
                <input
                  type={type}
                  value={form[key]}
                  onChange={(event) => update(key, event.target.value)}
                  required={[
                    'companyName',
                    'contactName',
                    'phone',
                    'email',
                  ].includes(key)}
                />
              )}
            </label>
          ))}
          <label className="wide hse-mvp-file-input">
            Загрузка файлов: регламенты, фото, видео, презентации
            <input
              type="file"
              multiple
              onChange={(event) =>
                setFiles(Array.from(event.target.files || []))
              }
              aria-label="Выбрать материалы для курса"
            />
            <span>
              <Upload aria-hidden="true" size={18} /> Выбрать файлы
            </span>
          </label>
        </div>
        {files.length ? (
          <div className="hse-mvp-file-list" aria-label="Выбранные файлы">
            {files.map((file) => (
              <Badge tone="neutral" key={`${file.name}-${file.size}`}>
                {file.name}
              </Badge>
            ))}
          </div>
        ) : null}
        <p className="hse-mvp-muted">
          {crmMode.crmWebhookConfigured
            ? 'Webhook CRM настроен: заявка будет отправлена методом POST.'
            : 'VITE_CRM_WEBHOOK_URL не задан: заявка сохранится в demo localStorage.'}
        </p>
        <p className="hse-mvp-muted">
          В деморежиме файлы не сохраняются. В промышленной версии материалы
          передаются через защищенное хранилище.
        </p>
        <button
          className="hse-mvp-button hse-mvp-button-primary"
          type="submit"
          disabled={submitting}
        >
          <Send aria-hidden="true" size={18} />{' '}
          {submitting ? 'Отправляем...' : 'Отправить заявку'}
        </button>
      </form>
    </>
  );
}

function IntegrationsPage() {
  const [message, setMessage] = useState('');
  const crmMode = getCrmMode();
  const testWebhook = async () => {
    const response = await submitCourseRequest({
      source: 'ANIX HSE MVP',
      product: 'Единая визуальная система обучения по охране труда',
      companyName: 'Тестовая компания',
      industry: 'Пищевая промышленность',
      employeesCount: 10,
      sites: 'Демо-площадка',
      riskTypes: 'LSR, падения, электробезопасность',
      courseGoal: 'Тестовая заявка из страницы интеграций',
      materialsDescription: 'нет',
      contactName: 'Демо-контакт',
      phone: '+7 000 000-00-00',
      email: 'demo@example.com',
      comment: 'Тест webhook-ready архитектуры',
      files: [],
      createdAt: new Date().toISOString(),
    });
    setMessage(response.message);
  };

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone="info">Интеграции</Badge>
        <h1>CSV/XLSX, CRM webhook и API-ready контур</h1>
        <p>
          В MVP интеграции реализованы в демонстрационном и CSV/XLSX-формате;
          промышленная версия подключается к корпоративной LMS, HRM или CRM
          через API/webhook.
        </p>
      </section>
      <section className="hse-mvp-grid hse-mvp-integration-grid">
        {[
          ['импорт сотрудников CSV/XLSX', FileText],
          ['экспорт результатов CSV/XLSX', Download],
          ['webhook для передачи заявок в CRM', LinkIcon],
          ['API-ready архитектура', Database],
          ['будущая интеграция с LMS/HR-системами', Wrench],
        ].map(([label, Icon]) => (
          <article className="hse-mvp-card" key={label}>
            <Icon aria-hidden="true" />
            <h2>{label}</h2>
            <Badge tone="success">готово к подключению</Badge>
          </article>
        ))}
      </section>
      <section className="hse-mvp-panel hse-mvp-webhook-demo">
        <div className="hse-mvp-section-head">
          <p>Демонстрационный webhook</p>
          <h2>Передача заявки в CRM</h2>
        </div>
        <label>
          Webhook URL
          <input
            readOnly
            value={crmMode.webhookUrl || 'не настроен'}
            aria-label="Webhook URL"
          />
        </label>
        <Badge tone={crmMode.crmWebhookConfigured ? 'success' : 'neutral'}>
          {crmMode.crmWebhookConfigured ? 'настроен' : 'не настроен'}
        </Badge>
        <button
          className="hse-mvp-button hse-mvp-button-primary"
          type="button"
          onClick={testWebhook}
        >
          Отправить тестовую заявку
        </button>
        {message ? <p className="hse-mvp-success">{message}</p> : null}
      </section>
    </>
  );
}

function SupportPage() {
  const [chatText, setChatText] = useState('');
  const [chatSent, setChatSent] = useState(false);

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone="info">Поддержка пользователей</Badge>
        <h1>Инструкции, руководство, контакты и онлайн-консультант</h1>
        <p>
          Раздел явно показывает виды поддержки для сотрудников, специалистов по
          ОТ и администраторов системы.
        </p>
      </section>
      <section className="hse-mvp-grid hse-mvp-support-grid">
        <article className="hse-mvp-card">
          <FileText aria-hidden="true" />
          <h2>Текстовая инструкция</h2>
          <p>
            Откройте модуль, просмотрите карточки, ответьте на вопросы, скачайте
            подтверждение прохождения.
          </p>
        </article>
        <article className="hse-mvp-card">
          <Eye aria-hidden="true" />
          <h2>Видеоинструкция</h2>
          <div className="hse-mvp-video-placeholder">
            Видеоинструкция-заглушка
          </div>
        </article>
        <article className="hse-mvp-card">
          <BookOpen aria-hidden="true" />
          <h2>Руководство пользователя</h2>
          <p>
            Краткое руководство доступно в деморежиме как встроенный блок. В
            промышленной версии подключается PDF/база знаний.
          </p>
        </article>
        <article className="hse-mvp-card">
          <Mail aria-hidden="true" />
          <h2>Email поддержки</h2>
          <a href="mailto:anix.ai@yandex.ru">anix.ai@yandex.ru</a>
        </article>
        <article className="hse-mvp-card">
          <Phone aria-hidden="true" />
          <h2>Телефон</h2>
          <a href="tel:+79251737305">+7 (925) 173-73-05</a>
        </article>
        <article className="hse-mvp-card hse-mvp-chat">
          <LifeBuoy aria-hidden="true" />
          <h2>Онлайн-консультант</h2>
          <textarea
            value={chatText}
            onChange={(event) => setChatText(event.target.value)}
            rows={4}
            placeholder="Задайте вопрос по демо"
            aria-label="Вопрос консультанту"
          />
          <button
            className="hse-mvp-button"
            type="button"
            onClick={() => setChatSent(true)}
          >
            Отправить вопрос
          </button>
          {chatSent ? (
            <p className="hse-mvp-success">Вопрос принят в деморежиме.</p>
          ) : null}
        </article>
      </section>
    </>
  );
}

function SupabaseSetupPanel() {
  return (
    <section className="hse-mvp-panel hse-mvp-setup-panel">
      <div className="hse-mvp-section-head">
        <p>Supabase не настроен</p>
        <h2>Тестировочный контур не подключен</h2>
      </div>
      <p>
        Для включения авторизации и базы данных укажите публичные
        env-переменные. Без них витринный контур продолжает работать на demoData
        и localStorage.
      </p>
      <div className="hse-mvp-env-list">
        {testModeEnvKeys.map((key) => (
          <code key={key}>{key}</code>
        ))}
      </div>
      <pre className="hse-mvp-code-block">{`VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
VITE_ALLOWED_EMAIL_DOMAINS=company.ru,multon.ru,anix-ai.pro
VITE_TEST_ADMIN_EMAIL=admin@anix-ai.pro`}</pre>
      <div className="hse-mvp-actions">
        <a
          className="hse-mvp-button hse-mvp-button-primary"
          href={href(showcasePath)}
        >
          Открыть витринный контур
        </a>
        <a className="hse-mvp-button" href={href('/docs/hse-mvp-supabase.md')}>
          Инструкция настройки
        </a>
      </div>
    </section>
  );
}

function TestModePage() {
  const config = getHseSupabaseConfig();
  const client = getHseSupabaseClient();

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone={config.isConfigured ? 'success' : 'warning'}>
          {config.isConfigured ? 'Supabase подключен' : 'Supabase не настроен'}
        </Badge>
        <h1>Тестировочный контур</h1>
        <p>
          Рабочий контур для регистрации сотрудников, входа по ролям и
          сохранения прохождений в Supabase. Service role ключи используются
          только локально в админском script и не попадают во frontend.
        </p>
      </section>
      <section className="hse-mvp-grid hse-mvp-scenarios">
        <a
          className="hse-mvp-card hse-mvp-scenario"
          href={href(`${testPath}/login`)}
        >
          <Users aria-hidden="true" />
          <h2>Войти</h2>
          <p>
            Email/password через Supabase Auth. После входа пользователь
            попадает в свой ролевой кабинет.
          </p>
          <span>
            Открыть вход <ArrowRight aria-hidden="true" size={18} />
          </span>
        </a>
        <a
          className="hse-mvp-card hse-mvp-scenario"
          href={href(`${testPath}/register`)}
        >
          <Plus aria-hidden="true" />
          <h2>Зарегистрироваться по рабочей почте</h2>
          <p>
            Фронтенд проверяет домен для UX, настоящая защита описана через
            Supabase Auth Hook.
          </p>
          <span>
            Открыть регистрацию <ArrowRight aria-hidden="true" size={18} />
          </span>
        </a>
        <a
          className="hse-mvp-card hse-mvp-scenario"
          href={href(`${testPath}/admin-login`)}
        >
          <Settings aria-hidden="true" />
          <h2>Админский вход</h2>
          <p>
            Администратор создается seed/script. Пароль не хранится во frontend
            env.
          </p>
          <span>
            Открыть админ-вход <ArrowRight aria-hidden="true" size={18} />
          </span>
        </a>
        <article className="hse-mvp-card hse-mvp-scenario">
          <Database aria-hidden="true" />
          <h2>Статус клиента</h2>
          <p>
            {client
              ? 'Supabase client инициализирован из env.'
              : 'Клиент не создан: env отсутствуют.'}
          </p>
          <span>
            {config.allowedDomains.length
              ? `Домены: ${config.allowedDomains.join(', ')}`
              : 'Домены задаются через env'}
          </span>
        </article>
      </section>
      {!config.isConfigured ? <SupabaseSetupPanel /> : null}
    </>
  );
}

function TestAuthPage({ kind }) {
  const config = getHseSupabaseConfig();
  const [email, setEmail] = useState(kind === 'admin' ? config.adminEmail : '');
  const [message, setMessage] = useState('');
  const domainOk = isAllowedWorkEmail(email);
  const title =
    kind === 'register'
      ? 'Регистрация сотрудника'
      : kind === 'admin'
        ? 'Админский вход'
        : 'Вход пользователя';

  const submitLabel =
    kind === 'register'
      ? 'Создать профиль'
      : kind === 'admin'
        ? 'Войти как администратор'
        : 'Войти';

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!config.isConfigured) {
      setMessage(
        'Supabase не настроен: форма показана как безопасная демонстрация UX.'
      );
      return;
    }
    if (kind === 'register' && !domainOk) {
      setMessage('Домен почты не входит в список разрешенных для регистрации.');
      return;
    }
    setMessage(
      'Форма готова к отправке в Supabase Auth через защищенный публичный anon key.'
    );
  };

  return (
    <>
      <section className="hse-mvp-page-head">
        <Badge tone={config.isConfigured ? 'success' : 'warning'}>
          {config.isConfigured ? 'Supabase Auth' : 'Supabase не настроен'}
        </Badge>
        <h1>{title}</h1>
        <p>
          В промышленном режиме вход и регистрация выполняются через Supabase
          Auth, профиль и роль читаются из hse_profiles.
        </p>
      </section>
      <form className="hse-mvp-panel hse-mvp-auth-form" onSubmit={handleSubmit}>
        {kind === 'register' ? (
          <label>
            ФИО
            <input required placeholder="Иванов Иван Иванович" />
          </label>
        ) : null}
        <label>
          Рабочая почта
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.ru"
          />
        </label>
        <label>
          Пароль
          <input
            required
            type="password"
            placeholder="Пароль хранится только в Supabase Auth"
          />
        </label>
        {kind === 'register' ? (
          <>
            <label>
              Отдел
              <select defaultValue="production-lines">
                {hseDepartments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Должность / роль на площадке
              <input placeholder="Оператор линии" />
            </label>
          </>
        ) : null}
        {kind === 'register' && email ? (
          <p className={domainOk ? 'hse-mvp-success' : 'hse-mvp-form-error'}>
            {domainOk
              ? 'Домен почты проходит frontend-проверку.'
              : 'Для регистрации нужен домен из VITE_ALLOWED_EMAIL_DOMAINS.'}
          </p>
        ) : null}
        <div className="hse-mvp-actions">
          <button
            className="hse-mvp-button hse-mvp-button-primary"
            type="submit"
          >
            {submitLabel}
          </button>
          <a className="hse-mvp-button" href={href(testPath)}>
            Назад к тестовому контуру
          </a>
        </div>
        {message ? <p className="hse-mvp-success">{message}</p> : null}
      </form>
      {!config.isConfigured ? <SupabaseSetupPanel /> : null}
    </>
  );
}

function TestMePage() {
  const config = getHseSupabaseConfig();
  if (!config.isConfigured) return <SupabaseSetupPanel />;
  return (
    <section className="hse-mvp-panel">
      <Badge tone="info">employee</Badge>
      <h1>Мой кабинет</h1>
      <p>
        Пользователь видит только свои назначенные модули, попытки, прогресс и
        подтверждения прохождения.
      </p>
      <EmployeePage />
    </section>
  );
}

function TestAdminPage() {
  const config = getHseSupabaseConfig();
  if (!config.isConfigured) return <SupabaseSetupPanel />;
  return (
    <section className="hse-mvp-panel">
      <Badge tone="info">admin</Badge>
      <h1>Админка тестового контура</h1>
      <p>
        В промышленном режиме этот экран читает организации, отделы, модули,
        уроки, пользователей, события и заявки из Supabase.
      </p>
      <AdminPage />
    </section>
  );
}

function TestSpecialistPage() {
  const config = getHseSupabaseConfig();
  if (!config.isConfigured) return <SupabaseSetupPanel />;
  return (
    <section className="hse-mvp-panel">
      <Badge tone="info">specialist</Badge>
      <h1>Кабинет специалиста тестового контура</h1>
      <p>
        Специалист видит прохождения по своей организации/отделам, фильтры,
        ошибки, рекомендации и CSV-экспорт.
      </p>
      <SpecialistPage />
    </section>
  );
}
function NotFoundMvp() {
  return (
    <section className="hse-mvp-result-hero">
      <Badge tone="warning">Раздел не найден</Badge>
      <h1>Вернитесь на старт демополигона</h1>
      <a
        className="hse-mvp-button hse-mvp-button-primary"
        href={href(rootPath)}
      >
        Открыть сценарии
      </a>
    </section>
  );
}

export default function HseMvpPage({ path }) {
  const rawPath =
    path || window.location.pathname.replace(base, '') || rootPath;
  const cleanPath =
    rawPath.endsWith('/') && rawPath.length > 1
      ? rawPath.slice(0, -1)
      : rawPath;
  const parts = cleanPath
    .replace(`${rootPath}/`, '')
    .split('/')
    .filter(Boolean);
  let title = 'Демополигон цифрового решения';
  let activePath = cleanPath;
  let breadcrumbs = [];
  let page = <HomePage />;

  if (cleanPath === rootPath) {
    page = <HomePage />;
  } else if (cleanPath === showcasePath) {
    title = 'Витринный контур';
    activePath = showcasePath;
    breadcrumbs = [{ label: 'Витринный контур' }];
    page = <ShowcaseHomePage />;
  } else if (cleanPath === `${showcasePath}/organization`) {
    title = demoCompany.name;
    activePath = `${showcasePath}/organization`;
    breadcrumbs = [
      { label: 'Витринный контур', path: showcasePath },
      { label: 'Организация' },
    ];
    page = <ShowcaseOrganizationPage />;
  } else if (
    parts[0] === 'showcase' &&
    parts[1] === 'departments' &&
    parts[2]
  ) {
    const department = getDepartmentById(parts[2]);
    title = department.title;
    activePath = `${showcasePath}/organization`;
    breadcrumbs = [
      { label: 'Витринный контур', path: showcasePath },
      { label: 'Организация', path: `${showcasePath}/organization` },
      { label: department.title },
    ];
    page = <ShowcaseDepartmentPage departmentId={parts[2]} />;
  } else if (
    parts[0] === 'showcase' &&
    parts[1] === 'modules' &&
    parts[2] &&
    parts[3] === 'lessons'
  ) {
    const module = getModuleById(parts[2]);
    title = `Урок: ${module.title}`;
    activePath = showcasePath;
    breadcrumbs = [
      { label: 'Витринный контур', path: showcasePath },
      { label: module.title, path: `${showcasePath}/modules/${module.id}` },
      { label: 'Урок' },
    ];
    page = <ShowcaseLessonPage moduleId={parts[2]} lessonId={parts[4]} />;
  } else if (
    parts[0] === 'showcase' &&
    parts[1] === 'modules' &&
    parts[2] &&
    parts[3] === 'test'
  ) {
    const module = getModuleById(parts[2]);
    title = `Тест: ${module.title}`;
    activePath = showcasePath;
    breadcrumbs = [
      { label: 'Витринный контур', path: showcasePath },
      { label: module.title, path: `${showcasePath}/modules/${module.id}` },
      { label: 'Тест' },
    ];
    page = <TestPage courseId={parts[2]} />;
  } else if (parts[0] === 'showcase' && parts[1] === 'modules' && parts[2]) {
    const module = getModuleById(parts[2]);
    title = module.title;
    activePath = showcasePath;
    breadcrumbs = [
      { label: 'Витринный контур', path: showcasePath },
      { label: module.title },
    ];
    page = <ShowcaseModulePage moduleId={parts[2]} />;
  } else if (parts[0] === 'showcase' && parts[1] === 'result') {
    title = 'Итог прохождения';
    activePath = showcasePath;
    breadcrumbs = [
      { label: 'Витринный контур', path: showcasePath },
      { label: 'Итог' },
    ];
    page = <ResultPage attemptId={parts[2]} />;
  } else if (cleanPath === `${showcasePath}/specialist`) {
    title = 'Кабинет специалиста по ОТ';
    activePath = `${showcasePath}/specialist`;
    breadcrumbs = [
      { label: 'Витринный контур', path: showcasePath },
      { label: 'Специалист ОТ' },
    ];
    page = <SpecialistPage />;
  } else if (cleanPath === `${showcasePath}/admin`) {
    title = 'Кабинет администратора';
    activePath = `${showcasePath}/admin`;
    breadcrumbs = [
      { label: 'Витринный контур', path: showcasePath },
      { label: 'Администратор' },
    ];
    page = <AdminPage />;
  } else if (cleanPath === `${showcasePath}/request-course`) {
    title = 'Заказать новый курс';
    activePath = showcasePath;
    breadcrumbs = [
      { label: 'Витринный контур', path: showcasePath },
      { label: 'Заказ курса' },
    ];
    page = <RequestCoursePage />;
  } else if (cleanPath === `${showcasePath}/integrations`) {
    title = 'Интеграции';
    activePath = `${showcasePath}/integrations`;
    breadcrumbs = [
      { label: 'Витринный контур', path: showcasePath },
      { label: 'Интеграции' },
    ];
    page = <IntegrationsPage />;
  } else if (cleanPath === `${showcasePath}/support`) {
    title = 'Поддержка';
    activePath = `${showcasePath}/support`;
    breadcrumbs = [
      { label: 'Витринный контур', path: showcasePath },
      { label: 'Поддержка' },
    ];
    page = <SupportPage />;
  } else if (cleanPath === testPath) {
    title = 'Тестировочный контур';
    activePath = testPath;
    breadcrumbs = [{ label: 'Тестировочный контур' }];
    page = <TestModePage />;
  } else if (cleanPath === `${testPath}/login`) {
    title = 'Вход пользователя';
    activePath = testPath;
    breadcrumbs = [
      { label: 'Тестировочный контур', path: testPath },
      { label: 'Вход' },
    ];
    page = <TestAuthPage kind="login" />;
  } else if (cleanPath === `${testPath}/register`) {
    title = 'Регистрация сотрудника';
    activePath = testPath;
    breadcrumbs = [
      { label: 'Тестировочный контур', path: testPath },
      { label: 'Регистрация' },
    ];
    page = <TestAuthPage kind="register" />;
  } else if (cleanPath === `${testPath}/admin-login`) {
    title = 'Админский вход';
    activePath = testPath;
    breadcrumbs = [
      { label: 'Тестировочный контур', path: testPath },
      { label: 'Админский вход' },
    ];
    page = <TestAuthPage kind="admin" />;
  } else if (cleanPath === `${testPath}/me`) {
    title = 'Мой кабинет';
    activePath = testPath;
    breadcrumbs = [
      { label: 'Тестировочный контур', path: testPath },
      { label: 'Мой кабинет' },
    ];
    page = <TestMePage />;
  } else if (cleanPath === `${testPath}/admin`) {
    title = 'Админка тестового контура';
    activePath = testPath;
    breadcrumbs = [
      { label: 'Тестировочный контур', path: testPath },
      { label: 'Админ' },
    ];
    page = <TestAdminPage />;
  } else if (cleanPath === `${testPath}/specialist`) {
    title = 'Специалист тестового контура';
    activePath = testPath;
    breadcrumbs = [
      { label: 'Тестировочный контур', path: testPath },
      { label: 'Специалист' },
    ];
    page = <TestSpecialistPage />;
  } else if (cleanPath === `${testPath}/organization`) {
    title = 'Организация тестового контура';
    activePath = testPath;
    breadcrumbs = [
      { label: 'Тестировочный контур', path: testPath },
      { label: 'Организация' },
    ];
    page = getHseSupabaseConfig().isConfigured ? (
      <ShowcaseOrganizationPage />
    ) : (
      <SupabaseSetupPanel />
    );
  } else if (cleanPath === `${rootPath}/employee`) {
    title = 'Сценарий сотрудника';
    breadcrumbs = [{ label: 'Сотрудник' }];
    page = <EmployeePage />;
  } else if (parts[0] === 'course' && parts[1] && parts[2] === 'test') {
    const module = getModuleById(parts[1]) || demoModules[0];
    title = `Тест: ${module.title}`;
    activePath = `${rootPath}/employee`;
    breadcrumbs = [
      { label: 'Сотрудник', path: `${showcasePath}/organization` },
      { label: module.title, path: `${rootPath}/course/${module.id}` },
      { label: 'Тест' },
    ];
    page = <TestPage courseId={parts[1]} />;
  } else if (parts[0] === 'course' && parts[1]) {
    const module = getModuleById(parts[1]) || demoModules[0];
    title = module.title;
    activePath = `${rootPath}/employee`;
    breadcrumbs = [
      { label: 'Сотрудник', path: `${showcasePath}/organization` },
      { label: module.title },
    ];
    page = <CoursePage courseId={parts[1]} />;
  } else if (parts[0] === 'result') {
    title = 'Итог прохождения';
    activePath = `${rootPath}/employee`;
    breadcrumbs = [
      { label: 'Сотрудник', path: `${showcasePath}/organization` },
      { label: 'Итог' },
    ];
    page = <ResultPage attemptId={parts[1]} />;
  } else if (cleanPath === `${rootPath}/specialist`) {
    title = 'Кабинет специалиста по ОТ';
    breadcrumbs = [{ label: 'Специалист ОТ' }];
    page = <SpecialistPage />;
  } else if (cleanPath === `${rootPath}/admin`) {
    title = 'Кабинет администратора';
    breadcrumbs = [{ label: 'Администратор' }];
    page = <AdminPage />;
  } else if (cleanPath === `${rootPath}/request-course`) {
    title = 'Заказать новый курс';
    breadcrumbs = [{ label: 'Заказ курса' }];
    page = <RequestCoursePage />;
  } else if (cleanPath === `${rootPath}/integrations`) {
    title = 'Интеграции';
    breadcrumbs = [{ label: 'Интеграции' }];
    page = <IntegrationsPage />;
  } else if (cleanPath === `${rootPath}/support`) {
    title = 'Поддержка';
    breadcrumbs = [{ label: 'Поддержка' }];
    page = <SupportPage />;
  } else {
    title = 'Раздел не найден';
    page = <NotFoundMvp />;
  }

  return (
    <Shell path={activePath} title={title} breadcrumbs={breadcrumbs}>
      {page}
    </Shell>
  );
}
