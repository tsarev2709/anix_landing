import React, { useEffect, useState } from 'react';

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onIn = (e: Event) => {
      const id = (e as CustomEvent).detail?.id;
      setVisible(['hero', 'cases', 'faq'].includes(id));
    };
    window.addEventListener('section-inview', onIn);
    return () => window.removeEventListener('section-inview', onIn);
  }, []);
  const click = () => {
    window.dispatchEvent(new CustomEvent('cta-click'));
  };
  if (!visible) return null;
  return (
    <div className="cta-sticky" role="region" aria-label="CTA">
      <span>Разобрать ваш продукт в Telegram</span>
      <a className="cta-btn" href="https://t.me/anixpro" onClick={click}>
        Открыть чат
      </a>
    </div>
  );
}
