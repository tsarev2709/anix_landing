import React from 'react';
import { CONFIG } from '@/config';
console.info('[CFG] SUBMIT:', CONFIG.SUBMIT_LEAD_URL);
console.info('[CFG] TRACK :', CONFIG.TRACK_EVENT_URL);
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import NotFound from './components/NotFound';
import AppLayout from './AppLayout';

const root = ReactDOM.createRoot(document.getElementById('root'));
const base = process.env.PUBLIC_URL || '';
const relativePath = window.location.pathname.replace(base, '') || '/';

if (relativePath === '/' || relativePath === '/index.html') {
  root.render(
    <AppLayout>
      <App />
    </AppLayout>
  );
} else {
  root.render(<NotFound />);
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(() => import('./styles/sections.css'));
} else {
  setTimeout(() => import('./styles/sections.css'), 0);
}
