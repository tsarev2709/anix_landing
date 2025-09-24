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

switch (normalizedPath) {
  case '/':
    renderInLayout(<App />);
    break;
  case '/why_it_works':
    renderInLayout(<WhyItWorksPage />);
    break;
  default:
    root.render(<NotFound />);
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(() => import('./styles/sections.css'));
} else {
  setTimeout(() => import('./styles/sections.css'), 0);
}
