import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight } from 'lucide-react';
import { resolveSeoRoute, toPublicHref } from './SeoHead';
import './RouteRelatedLinksPortal.css';

export default function RouteRelatedLinksPortal({ path }) {
  const [host, setHost] = useState(null);
  const route = resolveSeoRoute(path);
  const links = route.indexable ? route.links || [] : [];

  useEffect(() => {
    if (!links.length) return undefined;

    let createdHost = null;
    let observer = null;

    const attach = () => {
      if (document.querySelector('.seo-related-links')) return true;
      const main = document.querySelector('main');
      if (!main) return false;

      createdHost = document.createElement('div');
      createdHost.className = 'seo-related-links-host';
      const footer = main.querySelector(':scope > footer, footer');

      if (footer?.parentNode) footer.parentNode.insertBefore(createdHost, footer);
      else main.appendChild(createdHost);

      setHost(createdHost);
      return true;
    };

    if (!attach()) {
      observer = new MutationObserver(() => {
        if (attach()) observer?.disconnect();
      });
      observer.observe(document.getElementById('root') || document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer?.disconnect();
      if (createdHost?.parentNode) createdHost.parentNode.removeChild(createdHost);
      setHost(null);
    };
  }, [links.length, path]);

  if (!host) return null;

  return createPortal(
    <nav className="seo-related-links" aria-label="Связанные страницы">
      <span className="seo-related-links__label">Смотреть дальше</span>
      <div className="seo-related-links__grid">
        {links.map((item) => (
          <a href={toPublicHref(item.href)} key={`${item.href}-${item.label}`}>
            <span>{item.label}</span>
            <ArrowRight aria-hidden="true" />
          </a>
        ))}
      </div>
    </nav>,
    host
  );
}
