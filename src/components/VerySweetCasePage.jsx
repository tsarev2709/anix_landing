import React from 'react';
import { ArrowLeft, ArrowRight, Check, ExternalLink, MessageCircle, PlayCircle, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';
import SiteFooter from './SiteFooter';
import './VerySweetCasePage.css';

const TELEGRAM_URL = 'https://t.me/anix_helper';
const CASE_VIDEO = {
  embed: 'https://vkvideo.ru/video_ext.php?oid=-174933827&id=456239052&hash=07bbbbf497d8d649&hd=3&autoplay=0',
  external: 'https://vkvideo.ru/video-174933827_456239052',
};

const consistencyRisks = [
  'персонаж становится «похожим, но не тем»',
  'черты лица уплывают от кадра к кадру',
  'образ становится слишком универсально-мультяшным',
  'одежда, глаза, пропорции и цвет начинают жить своей жизнью',
  'в движении появляются артефакты и нежелательный motion blur',
];

const responsibilities = [
  'разобрали сториборд и экранное действие',
  'подготовили AI-пайплайн под конкретный визуальный стиль',
  'работали с референсами персонажей и локаций',
  'добивались сохранения пропорций, мимики и цветового характера',
  'собирали и дорабатывали анимационные фрагменты',
  'боролись с артефактами генерации и нежелательным motion blur',
];

function VideoBlock({ compact = false }) {
  return (
    <div className={`sweet-video${compact ? ' sweet-video--compact' : ''}`}>
      <iframe
        src={CASE_VIDEO.embed}
        width="1280"
        height="720"
        title="Очень сладкий кейс — финальный анимационный фрагмент"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
        frameBorder="0"
        allowFullScreen
        loading={compact ? 'eager' : 'lazy'}
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <a href={CASE_VIDEO.external} target="_blank" rel="noreferrer">
        Открыть во VK Видео <ExternalLink aria-hidden="true" />
      </a>
    </div>
  );
}

export default function VerySweetCasePage() {
  return (
    <main className="sweet-case-page">
      <header className="sweet-header">
        <a href="/" aria-label="ANIX Studio — на главную"><BrandLogo alt="ANIX Studio" width={116} height={42} /></a>
        <nav aria-label="Навигация по кейсу">
          <a href="/cases/">Кейсы</a>
          <a href="#process">Процесс</a>
          <a href="#result">Результат</a>
        </nav>
        <a className="sweet-header-cta" href={TELEGRAM_URL} target="_blank" rel="noreferrer">Обсудить проект</a>
      </header>

      <section className="sweet-hero">
        <div className="sweet-hero-copy">
          <a className="sweet-back" href="/cases/"><ArrowLeft aria-hidden="true" /> Все кейсы</a>
          <p className="sweet-eyebrow">ANIX Studio × анимационный production</p>
          <h1>Очень сладкий кейс</h1>
          <p className="sweet-hero-subtitle">Как мы помогали анимационной студии ускорить производство рецептурной сцены с помощью AI-инструментов — и не потерять характер персонажей.</p>
          <p className="sweet-lead">На входе у нас были сториборд, персонажи, локации и минута экранного действия. На выходе — анимационный фрагмент, в котором AI помог не заменить художников, а ускорить сложную производственную часть.</p>
          <div className="sweet-actions">
            <a href="#video" className="sweet-button sweet-button-primary"><PlayCircle aria-hidden="true" /> Смотреть фрагмент</a>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="sweet-button sweet-button-secondary"><MessageCircle aria-hidden="true" /> Обсудить задачу</a>
          </div>
        </div>
        <VideoBlock compact />
      </section>

      <section className="sweet-section sweet-task">
        <div className="sweet-section-heading"><p className="sweet-eyebrow">01 / Задача</p><h2>Задача: оживить рецепт</h2></div>
        <p className="sweet-section-intro">В каждой серии героини готовят блюдо, взаимодействуют с предметами, двигаются, реагируют и работают руками и лицом. На бумаге это звучит просто. В производстве — это много сложной анимационной рутины: позы, мимика, руки, предметы, тайминг, монтаж и аккуратность кадра.</p>
        <div className="sweet-three-grid">
          <article><span>На входе</span><h3>Сториборд, персонажи, локации и минута действия</h3></article>
          <article><span>Нужно получить</span><h3>Анимационный фрагмент, пригодный для дальнейшей студийной работы</h3></article>
          <article><span>Главное ограничение</span><h3>Сохранить узнаваемость персонажей и визуальный язык проекта</h3></article>
        </div>
      </section>

      <section className="sweet-section sweet-dark">
        <div className="sweet-section-heading"><p className="sweet-eyebrow">02 / Консистентность</p><h2>Сложность была не в том, чтобы «сгенерировать картинку»</h2></div>
        <p className="sweet-section-intro">Персонажи уже много лет жили в руках студии. У них были свои пропорции, форма глаз, оттенки кожи, пластика и внутренняя логика образа. Чуть меняется расстояние между глазами — и перед нами уже не героиня сериала, а похожий, но чужой персонаж.</p>
        <div className="sweet-risk-block">
          <h3>Главный враг AI-анимации — потеря консистентности</h3>
          <ul>{consistencyRisks.map((item) => <li key={item}><Sparkles aria-hidden="true" />{item}</li>)}</ul>
        </div>
      </section>

      <section className="sweet-section sweet-test">
        <div className="sweet-section-heading"><p className="sweet-eyebrow">03 / Внутренний тест</p><h2>Если нам слишком нравится — возможно, это уже не тот персонаж</h2></div>
        <p className="sweet-section-intro">Когда генерация выглядела слишком глянцево и слишком «по-диснеевски», мы часто оказывались дальше от нужного образа. А менее универсально-красивый результат, но с верной формой глаз, пропорциями и характером, оказывался ближе к восприятию заказчика.</p>
        <div className="sweet-compare">
          <article className="sweet-compare-wrong"><span>Красиво, но мимо</span><h3>Универсальная мультяшность</h3><p>Более круглые глаза, лишний глянец, ощущение «почти Disney».</p></article>
          <article className="sweet-compare-right"><span>Менее очевидно, но точнее</span><h3>Персонаж остаётся собой</h3><p>Миндалевидная форма глаз, сохранение пропорций и узнаваемая мимика.</p></article>
        </div>
      </section>

      <section className="sweet-section" id="process">
        <div className="sweet-section-heading"><p className="sweet-eyebrow">04 / Production thinking</p><h2>Что мы взяли на себя</h2></div>
        <div className="sweet-process-layout">
          <ul className="sweet-check-list">{responsibilities.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
          <aside><p className="sweet-eyebrow">Не просто AI</p><h3>Производственная задача, а не эксперимент с кнопкой</h3><p>Мы взяли материалы студии, поняли художественные ограничения, собрали рабочий процесс и довели результат до формы, которую можно показывать профессиональной команде.</p></aside>
        </div>
      </section>

      <section className="sweet-section sweet-blur">
        <div><p className="sweet-eyebrow">05 / Технический вызов</p><h2>Отдельный квест: убрать лишний motion blur</h2><p>AI-видео часто само «смазывает» движение, пытаясь сделать его кинематографичнее. Но в анимационном производстве это может мешать чистоте кадра и стилю проекта.</p></div>
        <article><span>Решение</span><h3>Кастомный пайплайн генерации и постобработки</h3><p>Контроль движения, чистота кадра и заметное снижение лишнего blur-эффекта — без раскрытия внутреннего технического ноу-хау.</p></article>
      </section>

      <section className="sweet-section sweet-video-section" id="video">
        <div className="sweet-section-heading"><p className="sweet-eyebrow">06 / Финальный фрагмент</p><h2>Результат, который можно посмотреть</h2></div>
        <p className="sweet-section-intro">Ниже — видоизменённая версия фрагмента, подготовленная специально для демонстрации кейса. Это не production-файл, переданный заказчику в исходном виде: материал дополнительно переработан для публичного показа.</p>
        <VideoBlock />
      </section>

      <section className="sweet-note">
        <p className="sweet-eyebrow">Важное уточнение</p>
        <p>Персонажи, локации и исходный визуальный мир проекта были разработаны студией. ANIX работала с предоставленными материалами и помогала превратить их в анимационный фрагмент с использованием AI-пайплайна, технической сборки, контроля консистентности и доработок.</p>
      </section>

      <section className="sweet-section" id="result">
        <div className="sweet-section-heading"><p className="sweet-eyebrow">07 / Итог</p><h2>Что получилось</h2></div>
        <div className="sweet-result-grid">
          <article><span>01</span><h3>Ускорили сложную рецептурную сцену</h3><p>AI закрыл часть производственной рутины и помог быстрее прийти к визуальному результату.</p></article>
          <article><span>02</span><h3>Сохранили уважение к авторскому стилю</h3><p>Работали внутри уже созданной визуальной логики, а не поверх неё.</p></article>
          <article><span>03</span><h3>Прокачали пайплайн консистентности</h3><p>Научились точнее отличать «красиво» от «попали в персонажа».</p></article>
          <article><span>04</span><h3>Сделали движение чище</h3><p>Нашли рабочий способ снизить нежелательный motion blur.</p></article>
        </div>
      </section>

      <section className="sweet-final-cta">
        <p className="sweet-eyebrow">Следующая задача</p>
        <h2>У вас тоже есть сложная анимационная задача?</h2>
        <p>Подключимся на этапе идеи, сториборда, production-пайплайна или уже существующего визуального мира — и аккуратно внедрим AI туда, где он действительно ускоряет производство, а не ломает стиль.</p>
        <div className="sweet-actions"><a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="sweet-button sweet-button-primary">Обсудить проект <ArrowRight aria-hidden="true" /></a><a href="/cases/" className="sweet-button sweet-button-secondary">Смотреть другие кейсы</a></div>
      </section>

      <SiteFooter />
    </main>
  );
}
