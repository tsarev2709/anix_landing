import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Film,
  Layers3,
  MessageCircle,
  Presentation,
  Sparkles,
  Users,
  WandSparkles,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import Breadcrumbs from './Breadcrumbs';
import SiteFooter from './SiteFooter';
import './RchkCasePage.css';

const telegramUrl = 'https://t.me/anix_helper';
const clientUrl = 'https://рчк.москва/';

const metrics = [
  ['5,5 мин', 'главный AI-ролик'],
  ['9', 'сотрудников РЧК в кадре'],
  ['8', 'уникальных AI-локаций'],
  ['90%', 'кадров с AI'],
  ['2 недели', 'чистое производство ролика'],
  ['7 человек', 'команда Anix'],
];

const scope = [
  {
    icon: Film,
    title: 'Главный AI-ролик',
    text: '5,5 минут кинематографичного репортажа с реальными героями, суперспособностями и восемью сгенерированными мирами.',
  },
  {
    icon: Presentation,
    title: 'Всё выступление',
    text: 'Сценарий получасового блока, режиссура, несколько презентаций для спикеров и единая логика выхода материалов на сцене.',
  },
  {
    icon: Users,
    title: 'Контент вокруг ролика',
    text: 'Отдельный 1,5-минутный ролик-интервью, фоновая анимация для экранов и обновлённая «говорящая голова» руководителя.',
  },
  {
    icon: Layers3,
    title: 'Гибридный production',
    text: 'Съёмки, AI-генерация, композинг, motion design, монтаж, звук и ручная доработка сошлись в одном пайплайне.',
  },
];

const production = [
  [
    '01',
    'Собрали драматургию',
    'Придумали формат репортажа: корреспондент проходит путь молодого человека в Москве и через него показывает, чем РЧК помогает людям и бизнесу.',
  ],
  [
    '02',
    'Сняли реальных героев',
    'В кадре появились девять сотрудников РЧК. Съёмка дала живые эмоции и узнаваемость, которые особенно важны для внутренней аудитории.',
  ],
  [
    '03',
    'Построили восемь миров',
    'Каждому смысловому блоку — своя среда и своя суперспособность: порталы, взгляд в будущее стартапов, золотая перчатка бесконечного количества партнёров и другие визуальные метафоры.',
  ],
  [
    '04',
    'Довели до кино',
    'AI был не финальной кнопкой, а материалом. Мы собирали кадры слоями, исправляли артефакты, делали композ, графику, монтаж и звук, чтобы генерации стали цельным фильмом.',
  ],
];

export default function RchkCasePage() {
  return (
    <main className="rchk-page">
      <header className="rchk-header">
        <a href="/" aria-label="Anix Studio — на главную">
          <BrandLogo alt="Anix Studio" width={120} height={44} />
        </a>
        <nav aria-label="Навигация по кейсу">
          <a href="#challenge">Задача</a>
          <a href="#production">Production</a>
          <a href="#result">Результат</a>
        </nav>
        <a
          className="rchk-header-cta"
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
        >
          Обсудить проект
        </a>
      </header>

      <Breadcrumbs path="/cases/rchk" />

      <section className="rchk-hero">
        <div className="rchk-hero-copy">
          <a className="rchk-back" href="/cases/events/">
            <ArrowLeft aria-hidden="true" /> Events
          </a>
          <p className="rchk-eyebrow">
            Anix Studio × АНО «Развитие человеческого капитала»
          </p>
          <h1>Как превратить внутреннее выступление в технологическое шоу</h1>
          <p className="rchk-lead">
            Полчаса сценического действия, шесть типов контента и главный герой
            — 5,5-минутный AI-ролик, ради которого мы собирали полноценный
            production киношного уровня.
          </p>
          <div className="rchk-hero-result">
            <span>Результат на тестовых просмотрах</span>
            <strong>«Очень круто». Вау-эффект сработал.</strong>
          </div>
          <div className="rchk-actions">
            <a className="rchk-button rchk-button-primary" href="#story">
              Разобрать кейс <ArrowRight aria-hidden="true" />
            </a>
            <a
              className="rchk-button rchk-button-secondary"
              href={clientUrl}
              target="_blank"
              rel="noreferrer"
            >
              Сайт РЧК
            </a>
          </div>
        </div>

        <div
          className="rchk-hero-visual"
          role="img"
          aria-label="Визуальная схема AI-ролика РЧК продолжительностью пять с половиной минут"
        >
          <div className="rchk-orbit rchk-orbit-one" />
          <div className="rchk-orbit rchk-orbit-two" />
          <span className="rchk-visual-chip rchk-chip-one">real shoot</span>
          <span className="rchk-visual-chip rchk-chip-two">AI worlds</span>
          <span className="rchk-visual-chip rchk-chip-three">compositing</span>
          <Sparkles className="rchk-visual-spark" aria-hidden="true" />
          <div className="rchk-visual-center">
            <span>главный ролик</span>
            <strong>5:30</strong>
            <small>90% кадров с AI</small>
          </div>
        </div>
      </section>

      <section className="rchk-metrics" aria-label="Проект в цифрах">
        {metrics.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="rchk-section rchk-challenge" id="challenge">
        <div className="rchk-section-label">
          <span>01</span> Вызов
        </div>
        <div>
          <p className="rchk-eyebrow">Планку уже подняли до нас</p>
          <h2>
            В прошлом году РЧК удивили зал «говорящей головой» руководителя. В
            этом году нужно было сделать сильно мощнее.
          </h2>
          <p>
            Запрос звучал не как «сделайте красивый ролик». Нужно было собрать
            получасовое выступление для большой внутренней аудитории в контуре
            столичного департамента — и добиться реакции: «Ну вы даёте. Как вы
            вообще это сделали?»
          </p>
          <blockquote>
            <WandSparkles aria-hidden="true" />
            <span>
              Не отдельный эффект, а цельное шоу, где каждый материал работает
              на одно большое «вау».
            </span>
          </blockquote>
        </div>
      </section>

      <section className="rchk-section rchk-scope" id="story">
        <div className="rchk-section-label">
          <span>02</span> Сопровождение
        </div>
        <div>
          <p className="rchk-eyebrow">Anix отвечала за весь блок</p>
          <h2>От первой реплики спикера до последнего пикселя на экране</h2>
          <div className="rchk-scope-grid">
            {scope.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rchk-reportage">
        <div className="rchk-reportage-copy">
          <p className="rchk-eyebrow">Формат фильма</p>
          <h2>Репортаж из мультивселенной РЧК</h2>
          <p>
            Корреспондент проходит путь молодого человека в Москве: от первой
            точки входа до возможностей для карьеры и предпринимательства. По
            дороге он встречает команду РЧК — и каждый герой показывает свою
            суперспособность.
          </p>
        </div>
        <div
          className="rchk-superpowers"
          aria-label="Примеры суперспособностей героев ролика"
        >
          <div>
            <span>01</span>
            <strong>Открывать порталы</strong>
            <small>между возможностями</small>
          </div>
          <div>
            <span>02</span>
            <strong>Видеть будущее</strong>
            <small>стартапов и команд</small>
          </div>
          <div>
            <span>03</span>
            <strong>Объединять партнёров</strong>
            <small>в одном движении</small>
          </div>
        </div>
      </section>

      <section className="rchk-section rchk-production" id="production">
        <div className="rchk-section-label">
          <span>03</span> Production
        </div>
        <div>
          <p className="rchk-eyebrow">Съёмка + AI + post-production</p>
          <h2>Мы не генерировали ролик. Мы его производили.</h2>
          <div className="rchk-production-list">
            {production.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rchk-limit">
        <div>
          <Clock3 aria-hidden="true" />
          <p className="rchk-eyebrow">Один месяц на всю работу</p>
          <h2>
            Три версии ролика, пересъёмки и параллельное производство всех
            материалов.
          </h2>
        </div>
        <p>
          Чистое производство главного ролика заняло две недели. На многих
          сценах мы упирались в текущий потолок нейротехнологий — и не снижали
          идею до возможностей одной модели, а меняли пайплайн, пересобирали
          кадры и доводили их вручную.
        </p>
      </section>

      <section className="rchk-section rchk-result" id="result">
        <div className="rchk-section-label">
          <span>04</span> Результат
        </div>
        <div>
          <p className="rchk-eyebrow">До премьеры</p>
          <h2>Технологическое чудо готово к выходу на сцену</h2>
          <p>
            РЧК получили не набор разрозненных материалов, а полностью собранное
            выступление: сценарий, режиссуру, видео, презентации и экранную
            графику. Главный ролик уже прошёл тестовые просмотры и получил
            именно ту реакцию, ради которой всё затевалось — «очень круто» и
            настоящее удивление от того, как это вообще было сделано.
          </p>
          <p className="rchk-result-note">
            Публичное выступление ещё впереди. После мероприятия дополним кейс
            кадрами, бэкстейджем и реакцией зала.
          </p>
        </div>
      </section>

      <section className="rchk-final-cta">
        <p className="rchk-eyebrow">Следующая высокая планка</p>
        <h2>
          Нужно, чтобы после вашего выступления подходили и спрашивали: «Как вы
          это сделали?»
        </h2>
        <div className="rchk-actions">
          <a
            className="rchk-button rchk-button-light"
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle aria-hidden="true" /> Обсудить проект
          </a>
          <a className="rchk-button rchk-button-ghost" href="/cases/">
            Другие кейсы <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
