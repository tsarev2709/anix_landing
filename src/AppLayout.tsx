import React, { useEffect, useRef } from 'react';
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
    window.addEventListener('section-inview', onIn);
    return () => window.removeEventListener('section-inview', onIn);
  }, []);

  return (
    <>
      <div className="page-grain" aria-hidden />
      {children}
    </>
  );
}
