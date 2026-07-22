import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, MessageCircle, Play, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';
import SiteFooter from './SiteFooter';
import './AviandrCasePage.css';

const TELEGRAM_URL = 'https://t.me/anix_helper';
const VIDEOS = {
  main: {
    embed: 'https://vkvideo.ru/video_ext.php?oid=-174933827&id=456239053&hash=3e590888196f8faa&hd=3&autoplay=1',
    external: 'https://vkvideo.ru/video-174933827_456239053',
    title: 'Авиандр: доказательная база — анимационный ролик ANIX Studio',
  },
  conference: {
    embed: 'https://vkvideo.ru/video_ext.php?oid=-174933827&id=456239054&hash=d9b9ce95e65e21be&hd=3&autoplay=1',
    external: 'https://vkvideo.ru/video-174933827_456239054',
    title: 'Как ролик Авиандр работал на конференционном стенде',
  },
};

function LazyVkVideo({ video, poster, posterAlt }) {
  const [started, setStarted] = useState(false);

  return (
    <div className="aviandr-video">
      {started ? (
        <iframe
          src={video.embed}
          width="1280"
          height="720"
          title={video.title}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
          frameBorder="0"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" className="aviandr-video-poster" onClick={() => setStarted(true)} aria-label={`Смотреть: ${video.title}`}>
          <img src={poster} alt={posterAlt} width="1280" height="720" decoding="async" />
          <span><Play aria-hidden="true" />Смотреть видео</span>
        </button>
      )}
      <a href={video.external} target="_blank" rel="noreferrer">Открыть во VK Видео <ExternalLink aria-hidden="true" /></a>
    </div>
  );
}

export default function AviandrCasePage() {
  return (
    <main className="aviandr-case-page">
      <header className="aviandr-header">
        <a href="/" aria-label="ANIX Studio — на главную"><BrandLogo alt="ANIX Studio" width={116} height={42} /></a>
        <nav aria-label="Навигация по кейсу">
          <a href="/cases/">Кейсы</a>
          <a href="#mascot">Маскот</a>
          <a href="#conference">Конференция</a>
        </nav>
        <a className="aviandr-header-cta" href={TELEGRAM_URL} target="_blank" rel="noreferrer">Обсудить проект</a>
      </header>

      <section className="aviandr-hero">
        <div className="aviandr-hero-copy">
          <a className="aviandr-back" href="/cases/"><ArrowLeft aria-hidden="true" /> Все кейсы</a>
          <p className="aviandr-eyebrow">Фармацевтика / медицинская анимация</p>
          <h1>Авиандр: доказательная база, которая работает на доверие</h1>
          <p className="aviandr-lead">Анимационный ролик о препарате для врачей. Объясняем сложное через персонажей, атмосферу и внимание к научным деталям.</p>
          <div className="aviandr-pill-row">
            <span>Доктор Коала</span><span>доказательная база</span><span>конференционный стенд</span>
          </div>
        </div>
        <picture className="aviandr-hero-visual">
          <source srcSet="/seo-media/cases/aviandr-cover-2560.webp 2560w, /seo-media/cases/aviandr-cover-1280.webp 1280w" sizes="(max-width: 980px) 100vw, 58vw" type="image/webp" />
          <img src="/seo-media/cases/aviandr-cover-1280.webp" alt="Доктор Коала и маскот буква А — визуальный мир препарата Авиандр" width="1280" height="720" fetchPriority="high" />
        </picture>
      </section>

      <section className="aviandr-section aviandr-task">
        <div><p className="aviandr-eyebrow">01 / Задача</p><h2>Объяснить препарат без перегруза и рекламного шума</h2></div>
        <p>Нужно было собрать понятную историю о доказательной базе, механизме действия, безопасности и эффективности препарата — так, чтобы материал удерживал внимание врачей и при этом не упрощал научную логику до банального рекламного обещания.</p>
        <div className="aviandr-card-grid">
          <article><span>Научная точность</span><h3>Сохраняем утверждённую медицинскую логику и причинно-следственные связи</h3></article>
          <article><span>Внимание</span><h3>Делаем данные визуальной историей, которую хочется досмотреть</h3></article>
          <article><span>Доверие</span><h3>Безопасность, эффективность и доказательность остаются в центре коммуникации</h3></article>
        </div>
      </section>

      <section className="aviandr-section aviandr-mascot" id="mascot">
        <div className="aviandr-mascot-copy">
          <p className="aviandr-eyebrow">02 / Поиск маскота</p>
          <h2>Мы искали разные образы — и сошлись на коале</h2>
          <p>Вариантов было много: более абстрактные символы, технологичные персонажи и разные животные. Но для медицинской коммуникации был нужен не герой-шоумен, а спокойный проводник — умный, доброжелательный и достаточно взрослый, чтобы говорить с врачебной аудиторией.</p>
          <div className="aviandr-mascot-insight"><Sparkles aria-hidden="true" /><div><strong>Почему коала</strong><span>Она не отвлекает от сути, но делает сложные темы ближе, теплее и запоминаемее.</span></div></div>
        </div>
        <figure><img src="/seo-media/cases/aviandr-koala.webp" alt="Один из образов Доктора Коалы, выбранного маскотом проекта Авиандр" width="1456" height="816" loading="lazy" decoding="async" /><figcaption>Доктор Коала — спокойный эксперт и проводник по доказательной базе препарата.</figcaption></figure>
      </section>

      <section className="aviandr-section aviandr-main-video">
        <div className="aviandr-section-heading"><p className="aviandr-eyebrow">03 / Ролик</p><h2>Доказательная база как визуальная история</h2></div>
        <p className="aviandr-section-intro">В ролике научные исследования, безопасность и эффективность не превращаются в набор слайдов. Доктор Коала и маскот «А» ведут зрителя через материал, удерживая единую интонацию и визуальный язык.</p>
        <LazyVkVideo video={VIDEOS.main} poster="/seo-media/cases/aviandr-cover-1280.webp" posterAlt="Обложка анимационного ролика Авиандр" />
      </section>

      <section className="aviandr-section aviandr-conference" id="conference">
        <div className="aviandr-conference-copy">
          <p className="aviandr-eyebrow">04 / В полевых условиях</p>
          <h2>Ролик стал частью стенда и действительно собирал внимание</h2>
          <p>Клиент прислал видео с конференции: люди подходили к экрану, останавливались, смотрели и обсуждали материал. Ролик работал уже не как отдельный файл, а как заметный элемент пространства и первое касание с препаратом.</p>
          <blockquote>«Очень украшает сделанный вами ролик наш стенд. Спасибо огромное!»<cite>Алексей, маркетинговый директор «Авинейро»</cite></blockquote>
        </div>
        <LazyVkVideo video={VIDEOS.conference} poster="/seo-media/cases/aviandr-cover-1280.webp" posterAlt="Видео использования ролика Авиандр на конференции" />
      </section>

      <section className="aviandr-result">
        <p className="aviandr-eyebrow">Результат</p>
        <h2>Не просто красивый ролик, а инструмент коммуникации</h2>
        <div>
          <article><span>01</span><h3>Объясняет сложное</h3><p>Исследования и медицинские данные собраны в последовательную визуальную историю.</p></article>
          <article><span>02</span><h3>Усиливает доверие</h3><p>Подача поддерживает доказательный характер препарата и уважает врачебную аудиторию.</p></article>
          <article><span>03</span><h3>Работает офлайн</h3><p>На конференции ролик привлекал внимание и помогал начинать разговор у стенда.</p></article>
        </div>
      </section>

      <section className="aviandr-cta">
        <p className="aviandr-eyebrow">Следующий проект</p>
        <h2>Нужно показать сложный медицинский продукт понятно и точно?</h2>
        <p>Соберём научную карту, сценарий, визуальный язык, маскотов и ролик под врачей, конференции и продажи.</p>
        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> Обсудить проект</a>
      </section>

      <SiteFooter />
    </main>
  );
}
