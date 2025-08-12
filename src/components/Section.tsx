import React, { useEffect, useRef } from 'react';
import SectionSeparator from './SectionSeparator';
import StickyBridge from './StickyBridge';

type Props = {
  id: string;
  bg: string;
  nextBg?: string;
  separator?: 'gradient' | 'curve';
  stickyTransition?: boolean;
  children: React.ReactNode;
};

export default function Section({
  id,
  bg,
  nextBg,
  separator = 'gradient',
  stickyTransition = false,
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!nextBg && ref.current) {
      const next = ref.current.nextElementSibling as HTMLElement | null;
      if (next)
        ref.current.style.setProperty(
          '--next-bg',
          getComputedStyle(next).getPropertyValue('--bg') ||
            (next.style as any).backgroundColor
        );
    }
  }, [nextBg]);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          document.documentElement.style.setProperty('--bg-global', bg);
          window.dispatchEvent(
            new CustomEvent('section-inview', { detail: { id } })
          );
        }
      },
      { threshold: 0.55 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [bg, id]);

  return (
    <section
      ref={ref}
      className="section"
      data-section={id}
      style={{
        ['--bg' as any]: bg,
        ['--next-bg' as any]: nextBg ?? 'transparent',
      }}
    >
      {children}
      <SectionSeparator position="bottom" variant={separator} />
      {stickyTransition && <StickyBridge />}
    </section>
  );
}
