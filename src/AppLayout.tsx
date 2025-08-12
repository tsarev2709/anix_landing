import { useEffect, useRef } from 'react';
import StickyCTA from './components/StickyCTA';
import { track } from './lib/analytics';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const lastSection = useRef<string | null>(null);

  useEffect(() => {
    const onIn = (e: any) => {
      const id = e.detail?.id;
      if (lastSection.current && lastSection.current !== id) {
        track('section_transition', { from: lastSection.current, to: id });
      }
      lastSection.current = id;
    };
    const onCTAview = () => track('cta_view', { section: lastSection.current });
    const onCTAclick = () => track('cta_click', { section: lastSection.current });

    window.addEventListener('section-inview', onIn);
    const obs = new MutationObserver(() => {
      const el = document.querySelector('.cta-sticky');
      if (el) {
        onCTAview();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('cta-click', onCTAclick);

    return () => {
      window.removeEventListener('section-inview', onIn);
      window.removeEventListener('cta-click', onCTAclick);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div className="page-grain" aria-hidden />
      {children}
      <StickyCTA />
    </>
  );
}
