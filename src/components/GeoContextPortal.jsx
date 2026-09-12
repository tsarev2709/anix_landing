import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { resolveSeoRoute } from '../seo/SeoHead';
import './GeoGuidePage.css';

export default function GeoContextPortal({ path }) {
  const [host, setHost] = useState(null);
  const route = resolveSeoRoute(path);
  const enabled = Boolean(route.geoSections?.length || route.geoFaq?.length);
  useEffect(() => {
    if (!enabled) return undefined;
    let element;
    const attach = () => {
      const main = document.querySelector('main:not([data-runtime-fallback])');
      if (!main || main.closest('[data-seo-shell]')) return false;
      element = document.createElement('div'); element.className = 'geo-context';
      const footer = main.querySelector('footer');
      if (footer?.parentNode) footer.parentNode.insertBefore(element, footer);
      else main.appendChild(element);
      setHost(element); return true;
    };
    const observer = new MutationObserver(() => { if (attach()) observer.disconnect(); });
    if (!attach()) observer.observe(document.getElementById('root'), {subtree:true,childList:true});
    return () => { observer.disconnect(); element?.remove(); };
  }, [path, enabled]);
  if (!host) return null;
  return createPortal(<>
    {(route.geoSections || []).map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
    {route.geoFaq?.length ? <section><h2>Перед началом проекта</h2>{route.geoFaq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section> : null}
  </>, host);
}
