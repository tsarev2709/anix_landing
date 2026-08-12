import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Film,
  MessageCircle,
  Presentation,
  Users,
  WandSparkles,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import Breadcrumbs from './Breadcrumbs';
import SiteFooter from './SiteFooter';
import aiProductionImage from '../images/cases/rchk/ai-production.webp';
import backstageMonitorImage from '../images/cases/rchk/bts-monitor.webp';
import backstageRooftopImage from '../images/cases/rchk/bts-rooftop.webp';
import campusAerialImage from '../images/cases/rchk/campus-aerial.webp';
import challengeTechnogradImage from '../images/cases/rchk/challenge-technograd.webp';
import davidFutureImage from '../images/cases/rchk/david-future.webp';
import heroPortalImage from '../images/cases/rchk/hero-portal.webp';
import hologramBuildingImage from '../images/cases/rchk/hologram-building.webp';
import moscowFutureImage from '../images/cases/rchk/moscow-future.webp';
import partnerGauntletImage from '../images/cases/rchk/partner-gauntlet.webp';
import productionDramaturgyImage from '../images/cases/rchk/production-dramaturgy.webp';
import productionHybridImage from '../images/cases/rchk/production-hybrid.webp';
import robotTeamImage from '../images/cases/rchk/robot-team.webp';
import talkingHeadImage from '../images/cases/rchk/talking-head.webp';
import './RchkCasePage.css';

const telegramUrl = 'https://t.me/anix_helper';
const clientUrl = 'https://рчк.москва/';

const metrics = [
  ['5,5 мин', 'главный ролик с ИИ'],
  ['9', 'сотрудников РЧК в кадре'],
  ['8', 'уникальных цифровых миров'],
  ['90%', 'кадров с ИИ'],
  ['2 недели', 'чистое производство ролика'],
  ['7 человек', 'команда Anix'],
];

const scope = [
  {
    icon: Film,
    text: 'Создали 5,5 минуты кинематографичного репортажа с реальными героями, суперспособностями и восемью цифровыми мирами.',
  },
  {
    icon: Presentation,
    text: 'Собрали сценарий получасового блока, режиссуру, презентации для спикеров и единую логику выхода материалов на сцене.',
  },
  {
    icon: Users,
    text: 'Сняли отдельное интервью, сделали фоновую анимацию для экранов и оживили «говорящую голову» руководителя.',
  },
];

const production = [
  {
    number: '01',
    title: 'Собрали драматургию',
    text: 'Превратили деятельность РЧК в понятный путь героя и репортажную историю.',
    image: productionDramaturgyImage,
    alt: 'Футуристическая героиня ролика РЧК как образ продуманной драматургии',
  },
  {
    number: '02',
    title: 'Сняли девять героев',
    text: 'Сохранили живые эмоции и узнаваемость сотрудников для внутренней аудитории.',
    image: backstageMonitorImage,
    alt: 'Кадр с операторского монитора во время съёмок ролика РЧК',
  },
  {
    number: '03',
    title: 'Работали в разных локациях',
    text: 'Проводили съёмки в помещениях и на открытых площадках, включая крышу.',
    image: backstageRooftopImage,
    alt: 'Съёмка сцены ролика РЧК на крыше',
  },
  {
    number: '04',
    title: 'Построили восемь миров',
    text: 'Для каждого смыслового блока придумали собственную среду и визуальную метафору.',
    image: aiProductionImage,
    alt: 'Цифровой мир внутри ролика РЧК',
  },
  {
    number: '05',
    title: 'Соединили съёмку и ИИ',
    text: 'Собирали кадры слоями, исправляли артефакты и вручную дорабатывали детали.',
    image: productionHybridImage,
    alt: 'Реальный герой ролика РЧК, преобразованный с помощью ИИ',
  },
  {
    number: '06',
    title: 'Довели до цельного фильма',
    text: 'Сведение кадров, графика, монтаж и звук превратили генерации в единое кино.',
    image: robotTeamImage,
    alt: 'Команда человекоподобных роботов в кадре из ролика РЧК',
  },
  {
    number: '07',
    title: 'Оживили прошлогодний образ',
    text: '«Говорящая голова» руководителя тоже стала частью нового выступления.',
    image: talkingHeadImage,
    alt: 'Проверка оживлённой говорящей головы руководителя',
  },
];

const timing = [
  ['1 месяц', 'всё производство'],
  ['2 недели', 'чистое время на ролик с ИИ'],
  ['3 версии', 'главного ролика'],
  ['4 съёмочных дня', 'в рамках производства'],
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
          <a href="#production">Производство</a>
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
            <ArrowLeft aria-hidden="true" /> События
          </a>
          <p className="rchk-eyebrow">
            Anix Studio × АНО «Развитие человеческого капитала»
          </p>
          <h1>Кейс: от выступления до техно шоу</h1>
          <p className="rchk-lead">
            Полчаса сценического действия, шесть типов материалов и главный
            герой — 5,5-минутный ролик с ИИ, ради которого мы собрали
            полноценное кинопроизводство.
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

        <div className="rchk-hero-visual">
          <img
            src={heroPortalImage}
            alt="Героиня ролика РЧК открывает световой портал в технологический центр"
            width="1600"
            height="900"
            fetchPriority="high"
            decoding="async"
          />
          <span className="rchk-visual-chip rchk-chip-one">
            реальная съёмка
          </span>
          <span className="rchk-visual-chip rchk-chip-two">миры с ИИ</span>
          <div className="rchk-visual-center">
            <span>главный ролик</span>
            <strong>5:30</strong>
            <small>90% кадров с ИИ</small>
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

      <figure className="rchk-showcase rchk-showcase-wide">
        <img
          src={campusAerialImage}
          alt="Кампус с неоновыми эффектами в кадре из ролика РЧК"
          width="1600"
          height="900"
          loading="lazy"
          decoding="async"
        />
        <figcaption>
          Реальные локации стали частью единой фантастической Москвы
        </figcaption>
      </figure>

      <section className="rchk-section rchk-challenge" id="challenge">
        <div className="rchk-section-label">
          <span>01</span> Вызов
        </div>
        <figure className="rchk-challenge-visual">
          <img
            src={challengeTechnogradImage}
            alt="Героиня ролика РЧК у цифрового здания Технограда"
            width="700"
            height="940"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className="rchk-challenge-copy">
          <p className="rchk-eyebrow">Планку уже подняли до нас</p>
          <h2>
            Год назад РЧК уже удивили зал. Теперь планку нужно было поднять ещё
            выше.
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
          <h2>Взяли на себя весь блок</h2>
          <div className="rchk-scope-grid">
            {scope.map(({ icon: Icon, text }, index) => (
              <article key={text}>
                <Icon aria-hidden="true" />
                <span>0{index + 1}</span>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <figure className="rchk-cinematic-break">
        <img
          src={moscowFutureImage}
          alt="Герой ролика РЧК в футуристической Москве"
          width="1500"
          height="844"
          loading="lazy"
          decoding="async"
        />
        <figcaption>Реальная съёмка стала входом в новую Москву</figcaption>
      </figure>

      <section className="rchk-reportage">
        <div className="rchk-reportage-copy">
          <p className="rchk-eyebrow">Формат фильма</p>
          <h2>Репортаж из миров РЧК</h2>
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

      <section
        className="rchk-story-gallery"
        aria-label="Кадры из ролика РЧК, созданного с помощью ИИ"
      >
        <figure className="rchk-story-card rchk-story-card-tall">
          <img
            src={hologramBuildingImage}
            alt="Героиня ролика демонстрирует голограмму здания Технограда"
            width="1500"
            height="844"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Показывать возможности</figcaption>
        </figure>
        <figure className="rchk-story-card rchk-story-card-tall">
          <img
            src={partnerGauntletImage}
            alt="Золотая перчатка партнёрской экосистемы в кадре из ролика"
            width="1500"
            height="844"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Объединять партнёров</figcaption>
        </figure>
        <figure className="rchk-story-card rchk-story-card-wide">
          <img
            src={davidFutureImage}
            alt="Футуристическая статуя держит модель инновационного центра"
            width="1600"
            height="900"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Видеть будущее проектов</figcaption>
        </figure>
      </section>

      <section className="rchk-section rchk-production" id="production">
        <div className="rchk-section-label">
          <span>03</span> Производство
        </div>
        <div>
          <p className="rchk-eyebrow">От идеи до готового фильма</p>
          <h2>Как мы собрали технологическое чудо</h2>
          <div
            className="rchk-production-slider"
            aria-label="Этапы производства"
          >
            {production.map(({ number, title, text, image, alt }) => (
              <article key={number}>
                <img src={image} alt={alt} loading="lazy" decoding="async" />
                <div className="rchk-production-caption">
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="rchk-slider-hint">Листайте этапы →</p>
        </div>
      </section>

      <section className="rchk-limit">
        {timing.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="rchk-section rchk-result" id="result">
        <div className="rchk-section-label">
          <span>04</span> Результат
        </div>
        <div>
          <p className="rchk-eyebrow">До премьеры</p>
          <h2>Технологическое чудо готово</h2>
          <p>
            РЧК получили не набор разрозненных материалов, а полностью собранное
            выступление: сценарий, режиссуру, видео, презентации и экранную
            графику. Главный ролик уже прошёл тестовые просмотры и получил
            именно ту реакцию, ради которой всё затевалось — «очень круто» и
            настоящее удивление от того, как это вообще было сделано.
          </p>
          <p className="rchk-result-note">
            Публичное выступление ещё впереди. После мероприятия дополним кейс
            кадрами со съёмок и реакцией зала.
          </p>
        </div>
      </section>

      <section className="rchk-final-cta">
        <p className="rchk-eyebrow">Следующая высокая планка</p>
        <h2>
          Пусть после вашего выступления спрашивают: «Как вы это сделали?»
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
