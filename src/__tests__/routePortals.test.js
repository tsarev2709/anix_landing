import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import RouteBreadcrumbsPortal from '../seo/RouteBreadcrumbsPortal';
import RouteRelatedLinksPortal from '../seo/RouteRelatedLinksPortal';

test('navigation waits for route content and survives a delayed page chunk', async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  let resolvePage;
  const Page = lazy(
    () =>
      new Promise((resolve) => {
        resolvePage = resolve;
      })
  );
  try {
    await act(async () =>
      root.render(
        <>
          <Suspense
            fallback={
              <main data-runtime-fallback="true">Загружаем страницу…</main>
            }
          >
            <Page />
          </Suspense>
          <RouteBreadcrumbsPortal path="/medicine" />
          <RouteRelatedLinksPortal path="/medicine" />
        </>
      )
    );
    expect(container.querySelector('[data-runtime-fallback] nav')).toBeNull();
    await act(async () => {
      resolvePage({
        default: () => (
          <main className="loaded-route">
            <header>Навигация</header>
            <h1>Анимация</h1>
            <footer>Контакты</footer>
          </main>
        ),
      });
    });
    expect(container.querySelector('[data-runtime-fallback]')).toBeNull();
    expect(
      container.querySelector('.loaded-route .seo-breadcrumbs')
    ).toBeTruthy();
    expect(
      container.querySelector('.loaded-route .seo-related-links')
    ).toBeTruthy();
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});
