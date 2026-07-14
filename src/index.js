import React, { lazy, Suspense } from 'react';
import { CONFIG } from '@/config';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import AppLayout from './AppLayout';
import AboutStudioPortal from './components/AboutStudioPortal';
import CasesHubLinkPortal from './components/CasesHubLinkPortal';
import RouteBreadcrumbsPortal from './seo/RouteBreadcrumbsPortal';
import RouteRelatedLinksPortal from './seo/RouteRelatedLinksPortal';
import SeoHead from './seo/SeoHead';

console.info('[CFG] SUBMIT:', CONFIG.SUBMIT_LEAD_URL);
console.info('[CFG] TRACK :', CONFIG.TRACK_EVENT_URL);

const NotFound = lazy(() => import('./components/NotFound'));
const WhyItWorksPage = lazy(() => import('./components/WhyItWorksPage'));
const MedicinePage = lazy(() => import('./components/MedicinePage'));
const HsePage = lazy(() => import('./components/HsePage'));
const HseMvpPage = lazy(() => import('./features/hseMvp/HseMvpPage'));
const Design1TestPage = lazy(() => import('./components/Design1TestPage'));
const DesignOldPage = lazy(() => import('./components/DesignOldPage'));
const CeoPage = lazy(() => import('./components/CeoPage'));
const LegalPage = lazy(() => import('./components/LegalPage'));
const RybkiPage = lazy(() => import('./components/RybkiPage'));
const RybkiLayeredPage = lazy(() => import('./components/RybkiLayeredPage'));
const CasesHubPage = lazy(() => import('./components/CasesHubPage'));
const CasesCategoryPage = lazy(() => import('./components/CasesCategoryPage'));
const CasePage = lazy(() => import('./components/CasePage'));

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
const base = '';
const relativePath = window.location.pathname.replace(base, '') || '/';
const normalizedPath = (() => {
  const withoutIndex = relativePath.replace(/index\.html$/, '');
  if (!withoutIndex) return '/';
  if (withoutIndex === '/') return '/';
  return withoutIndex.endsWith('/')
    ? withoutIndex.slice(0, Math.max(1, withoutIndex.length - 1))
    : withoutIndex;
})();

const categoryCasePaths = new Set(['/cases/b2b', '/cases/medicine', '/cases/cinema', '/cases/hse']);

const renderInLayout = (component) => {
  root.render(
    <AppLayout>
      <SeoHead path={normalizedPath} />
      <Suspense fallback={null}>{component}</Suspense>
      <AboutStudioPortal path={normalizedPath} />
      <CasesHubLinkPortal path={normalizedPath} />
      <RouteBreadcrumbsPortal path={normalizedPath} />
      <RouteRelatedLinksPortal path={normalizedPath} />
    </AppLayout>,
  );
};

if (normalizedPath === '/hse/mvp' || normalizedPath.startsWith('/hse/mvp/')) {
  renderInLayout(<HseMvpPage path={normalizedPath} />);
} else if (normalizedPath === '/cases') {
  renderInLayout(<CasesHubPage />);
} else if (categoryCasePaths.has(normalizedPath)) {
  renderInLayout(<CasesCategoryPage path={normalizedPath} />);
} else if (normalizedPath.startsWith('/cases/')) {
  renderInLayout(<CasePage path={normalizedPath} />);
} else {
  switch (normalizedPath) {
    case '/':
      renderInLayout(<App />);
      break;
    case '/why_it_works':
      renderInLayout(<WhyItWorksPage />);
      break;
    case '/medicine':
      renderInLayout(<MedicinePage />);
      break;
    case '/hse':
      renderInLayout(<HsePage />);
      break;
    case '/rybki':
      renderInLayout(<RybkiPage />);
      break;
    case '/rybki_page':
      renderInLayout(<RybkiLayeredPage />);
      break;
    case '/design1test':
      renderInLayout(<Design1TestPage />);
      break;
    case '/design_old':
      renderInLayout(<DesignOldPage />);
      break;
    case '/ceo':
      renderInLayout(<CeoPage />);
      break;
    case '/personal-data':
      renderInLayout(<LegalPage type="personal-data" />);
      break;
    case '/privacy':
      renderInLayout(<LegalPage type="privacy" />);
      break;
    default:
      root.render(
        <>
          <SeoHead path={normalizedPath} />
          <Suspense fallback={null}>
            <NotFound />
          </Suspense>
        </>,
      );
  }
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(() => import('./styles/sections.css'));
} else {
  setTimeout(() => import('./styles/sections.css'), 0);
}
