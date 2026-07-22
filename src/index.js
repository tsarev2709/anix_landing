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
import { installRuntimeRecovery, recoverFromRuntimeFailure } from './runtimeCompatibility';

console.info('[CFG] SUBMIT:', CONFIG.SUBMIT_LEAD_URL);
console.info('[CFG] TRACK :', CONFIG.TRACK_EVENT_URL);
installRuntimeRecovery();

const NotFound = lazy(() => import('./components/NotFound'));
const WhyItWorksPage = lazy(() => import('./components/WhyItWorksPage'));
const MedicinePage = lazy(() => import('./components/MedicinePage'));
const HsePage = lazy(() => import('./components/HsePage'));
const AnimationPage = lazy(() => import('./components/AnimationPage'));
const AiVideoPage = lazy(() => import('./components/AiVideoPage'));
const HseMvpPage = lazy(() => import('./features/hseMvp/HseMvpPage'));
const Design1TestPage = lazy(() => import('./components/Design1TestPage'));
const DesignOldPage = lazy(() => import('./components/DesignOldPage'));
const CeoPage = lazy(() => import('./components/CeoPage'));
const LegalPage = lazy(() => import('./components/LegalPage'));
const RybkiPage = lazy(() => import('./components/RybkiPage'));
const CasesHubPage = lazy(() => import('./components/CasesHubPage'));
const CasesCategoryPage = lazy(() => import('./components/CasesCategoryPage'));
const CasePage = lazy(() => import('./components/CasePage'));
const VerySweetCasePage = lazy(() => import('./components/VerySweetCasePage'));

function RuntimeFallback({ failed = false }) {
  return (
    <main role="status" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '32px', boxSizing: 'border-box', background: '#f7f4ef', color: '#21162d', textAlign: 'center', fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <div><strong style={{ display: 'block', fontSize: '22px', marginBottom: '10px' }}>ANIX Studio</strong><p style={{ margin: '0 0 18px' }}>{failed ? 'Страница не смогла загрузиться полностью.' : 'Загружаем страницу…'}</p>{failed ? <button type="button" onClick={() => window.location.reload()} style={{ padding: '12px 18px', border: 0, borderRadius: '999px', cursor: 'pointer' }}>Обновить страницу</button> : null}</div>
    </main>
  );
}

class RuntimeErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { recoverFromRuntimeFailure(error); }
  render() { if (this.state.failed) return <RuntimeFallback failed />; return this.props.children; }
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
const base = process.env.PUBLIC_URL || '';
const relativePath = window.location.pathname.replace(base, '') || '/';
const normalizedPath = (() => {
  const withoutIndex = relativePath.replace(/index\.html$/, '');
  if (!withoutIndex || withoutIndex === '/') return '/';
  return withoutIndex.endsWith('/') ? withoutIndex.slice(0, Math.max(1, withoutIndex.length - 1)) : withoutIndex;
})();

const categoryCasePaths = new Set(['/cases/b2b', '/cases/medicine', '/cases/cinema', '/cases/hse']);
const renderInLayout = (component) => {
  root.render(<RuntimeErrorBoundary><AppLayout><SeoHead path={normalizedPath} /><Suspense fallback={<RuntimeFallback />}>{component}</Suspense><AboutStudioPortal path={normalizedPath} /><CasesHubLinkPortal path={normalizedPath} /><RouteBreadcrumbsPortal path={normalizedPath} /><RouteRelatedLinksPortal path={normalizedPath} /></AppLayout></RuntimeErrorBoundary>);
};

if (normalizedPath === '/hse/mvp' || normalizedPath.startsWith('/hse/mvp/')) {
  renderInLayout(<HseMvpPage path={normalizedPath} />);
} else if (normalizedPath === '/cases') {
  renderInLayout(<CasesHubPage />);
} else if (categoryCasePaths.has(normalizedPath)) {
  renderInLayout(<CasesCategoryPage path={normalizedPath} />);
} else if (normalizedPath === '/cases/very-sweet-case') {
  renderInLayout(<VerySweetCasePage />);
} else if (normalizedPath.startsWith('/cases/')) {
  renderInLayout(<CasePage path={normalizedPath} />);
} else {
  switch (normalizedPath) {
    case '/': renderInLayout(<App />); break;
    case '/why_it_works': renderInLayout(<WhyItWorksPage />); break;
    case '/medicine': renderInLayout(<MedicinePage />); break;
    case '/hse': renderInLayout(<HsePage />); break;
    case '/animation': renderInLayout(<AnimationPage />); break;
    case '/ai-video': renderInLayout(<AiVideoPage />); break;
    case '/rybki':
    case '/rybki_page': renderInLayout(<RybkiPage />); break;
    case '/design1test': renderInLayout(<Design1TestPage />); break;
    case '/design_old': renderInLayout(<DesignOldPage />); break;
    case '/ceo': renderInLayout(<CeoPage />); break;
    case '/personal-data': renderInLayout(<LegalPage type="personal-data" />); break;
    case '/privacy': renderInLayout(<LegalPage type="privacy" />); break;
    default:
      root.render(<RuntimeErrorBoundary><SeoHead path={normalizedPath} /><Suspense fallback={<RuntimeFallback />}><NotFound /></Suspense></RuntimeErrorBoundary>);
  }
}

if ('requestIdleCallback' in window) requestIdleCallback(() => import('./styles/sections.css'));
else setTimeout(() => import('./styles/sections.css'), 0);
