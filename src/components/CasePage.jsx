import React from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, MessageCircle } from 'lucide-react';
import seoConfig from '../seo/routes.json';
import { toPublicHref } from '../seo/SeoHead';
import BrandLogo from './BrandLogo';
import Breadcrumbs from './Breadcrumbs';
import SiteFooter from './SiteFooter';
import './CasePage.css';
import './CasePagePlaceholder.css';

const telegramUrl = 'https://t.me/anix_helper';

export default function CasePage({ path }) {
  const route = seoConfig.routes[path];

  if (!route?.case) return null;

  const { case: caseData } = route;

  return (
    <main className="case-page">
      <header className="case-header">
        <a className="case-logo" href="/" aria-label="Anix Studio">
          <BrandLogo alt="Anix Studio" width={120} height={44} />
        </a>
        <nav aria-label="Навигация по кейсу">
          <a href={toPublicHref('/cases')}>Кейсы</a>
          <a href={toPublicHref('/medicine')}>Medicine</a>
          <a href={toPublicHref('/hse')}>HSE</a>
        </nav>
        <a className="case-header-cta" href={telegramUrl} target="_blank" rel="noreferrer">Обсудить проект</a>
      </header>

      <Breadcrumbs path={path} />

      <section className="case-hero">
        <div className="case-hero-copy">
          <p className="case-eyebrow">Кейс Anix / {caseData.category}</p>
          <h1>{route.h1}</h1>
          <p className="case-lead">{route.intro}</p>
          <div className="case-result"><span>Результат</span><strong>{caseData.result}</strong></div>
          <div className="case-actions">
            {caseData.videoUrl ? (
              <a className="case-button case-button-primary" href={caseData.videoUrl} target="_blank" rel="noreferrer">Смотреть видео<ExternalLink aria-hidden="true" /></a>
            ) : null}
            <a className="case-button case-button-secondary" href={toPublicHref(caseData.relatedPath)}>Связанное направление<ArrowRight aria-hidden="true" /></a>
          </div>
        </div>

        <figure className={`case-hero-media${caseData.image ? '' : ' case-hero-media--placeholder'}`}>
          {caseData.image ? (
            <img src={caseData.image} alt={caseData.imageAlt} width="1200" height="675" fetchPriority="high" decoding="async" />
          ) : (
            <div className="case-hero-placeholder" role="img" aria-label={caseData.imageAlt}><span>{caseData.placeholder || 'Anix'}</span></div>
          )}
          <figcaption>{caseData.tags}</figcaption>
        </figure>
      </section>

      <section className="case-story" aria-label="Разбор кейса">
        {route.sections.map((section, index) => (
          <article className="case-story-card" key={section.heading}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div><h2>{section.heading}</h2><p>{section.body}</p></div>
          </article>
        ))}
      </section>

      <section className="case-related">
        <a href={toPublicHref('/cases')} className="case-back-link"><ArrowLeft aria-hidden="true" />Все кейсы Anix</a>
        <div>
          <p>Есть сложный продукт или задача?</p>
          <h2>Соберём формат, который быстро включает аудиторию в контекст</h2>
          <a className="case-button case-button-primary" href={telegramUrl} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" />Обсудить проект</a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}