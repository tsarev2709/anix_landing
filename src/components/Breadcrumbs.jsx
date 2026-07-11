import React from 'react';
import { resolveSeoRoute } from '../seo/SeoHead';
import './Breadcrumbs.css';

export default function Breadcrumbs({ path = window.location.pathname }) {
  const route = resolveSeoRoute(path);
  const items = route.breadcrumbs || [];

  if (items.length < 2) return null;

  return (
    <nav className="seo-breadcrumbs" aria-label="Хлебные крошки">
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.href}-${item.label}`}>
              {isCurrent ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
