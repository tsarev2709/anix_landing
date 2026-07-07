import React from 'react';
import { CONFIG } from '@/config';
console.info('[CFG] SUBMIT:', CONFIG.SUBMIT_LEAD_URL);
console.info('[CFG] TRACK :', CONFIG.TRACK_EVENT_URL);
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import NotFound from './components/NotFound';
import AppLayout from './AppLayout';
import WhyItWorksPage from './components/WhyItWorksPage';
import MedicinePage from './components/MedicinePage';
import HsePage from './components/HsePage';
import HseMvpPage from './features/hseMvp/HseMvpPage';
import Design1TestPage from './components/Design1TestPage';
import DesignOldPage from './components/DesignOldPage';
import CeoPage from './components/CeoPage';
import LegalPage from './components/LegalPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
const base = process.env.PUBLIC_URL || '';
const relativePath = window.location.pathname.replace(base, '') || '/';
const normalizedPath = (() => {
  const withoutIndex = relativePath.replace(/index\.html$/, '');
  if (!withoutIndex) {
    return '/';
  }
  if (withoutIndex === '/') {
    return '/';
  }
  return withoutIndex.endsWith('/')
    ? withoutIndex.slice(0, Math.max(1, withoutIndex.length - 1))
    : withoutIndex;
})();

const renderInLayout = (component) => {
  root.render(<AppLayout>{component}</AppLayout>);
};

if (normalizedPath === '/hse/mvp' || normalizedPath.startsWith('/hse/mvp/')) {
  renderInLayout(<HseMvpPage path={normalizedPath} />);
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
      root.render(<NotFound />);
  }
}
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => import('./styles/sections.css'));
} else {
  setTimeout(() => import('./styles/sections.css'), 0);
}
