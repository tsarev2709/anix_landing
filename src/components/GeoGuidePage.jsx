import React from 'react';
import { resolveSeoRoute, toPublicHref } from '../seo/SeoHead';
import BrandLogo from './BrandLogo';
import SiteFooter from './SiteFooter';
import ProjectCta from './ProjectCta';
import './GeoGuidePage.css';

export default function GeoGuidePage({ path }) {
  const route = resolveSeoRoute(path);
  return <main className="geo-guide">
    <header className="geo-guide__header"><a href="/" aria-label="Anix Studio — главная"><BrandLogo width={120} height={44} alt="Anix Studio" /></a><nav aria-label="Разделы"><a href="/knowledge/">Ответы заказчику</a><a href="/cases/">Кейсы</a><a href="/stoimost/">Стоимость</a></nav></header>
    <article className="geo-guide__article">
      <p className="geo-guide__eyebrow">Anix Studio · {route.kind === 'service' ? 'Услуги' : 'Материалы для заказчика'}</p>
      <h1>{route.h1}</h1><p className="geo-guide__intro">{route.intro}</p>
      <p className="geo-guide__date">Редакция Anix · актуализировано <time dateTime={route.reviewedAt}>{route.reviewedAt.split('-').reverse().join('.')}</time></p>
      {route.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
      <nav className="geo-guide__reading" aria-label="Материалы по теме">{route.links.map(item => <a key={item.href} href={toPublicHref(item.href)}>{item.label}</a>)}</nav>
      <aside className="geo-guide__cta"><h2>Применим к вашей задаче</h2><p>Расскажите о продукте, аудитории и сроке. Определим состав материалов и предварительный бюджет.</p><ProjectCta /></aside>
    </article><SiteFooter />
  </main>;
}
