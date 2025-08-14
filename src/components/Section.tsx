import React, { useEffect, useLayoutEffect, useRef } from 'react';
import StickyBridge from './StickyBridge';

function getNextSection(el?: HTMLElement | null) {
  let n = el?.nextElementSibling as HTMLElement | null;
  while (n && !n.classList.contains('section')) {
    n = n.nextElementSibling as HTMLElement | null;
  }
  return n;
}

type Props = {
  id: string;
  bg: string;
  nextBg?: string;
  stickyTransition?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function Section({
  id,
  bg,
  nextBg,
  stickyTransition = false,
  className = '',
  children,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    // свой фон
    ref.current.style.setProperty('--bg', bg);

    // nextBg: из пропса или вычисляем из следующей .section
    if (nextBg) {
      ref.current.style.setProperty('--next-bg', nextBg);
    } else {
      const next = getNextSection(ref.current);
      if (next) {
        const cs = getComputedStyle(next);
        let nb = cs.getPropertyValue('--bg').trim();
        if (!nb) nb = cs.backgroundColor;
        if (nb) ref.current.style.setProperty('--next-bg', nb);
      }
    }
  }, [bg, nextBg]);

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
      className={`section ${className}`.trim()}
      data-section={id}
      {...rest}
    >
      {children}
      {stickyTransition && <StickyBridge />}
    </section>
  );
}
