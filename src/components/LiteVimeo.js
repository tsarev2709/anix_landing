import React, { useEffect, useRef, useState } from 'react';

/**
 * Lightweight Vimeo facade that defers player loading until user interaction
 * or idle time on mobile devices.
 */
export default function LiteVimeo({ videoId, className = '' }) {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const insertIframe = () => {
    if (loaded || !containerRef.current) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&playsinline=1`;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    iframe.setAttribute('title', 'Vimeo video');
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.objectFit = 'cover';
    containerRef.current.appendChild(iframe);
    setLoaded(true);
  };

  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const reduceData =
      navigator.connection?.saveData ||
      (typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-data: reduce)').matches);

    if (!isMobile || reduceData || loaded) return;

    const onIdle = () => {
      if (document.visibilityState === 'visible') {
        insertIframe();
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(onIdle);
    } else {
      setTimeout(onIdle, 3000);
    }
  }, [loaded]);

  return (
    <div
      ref={containerRef}
      className={`lite-vimeo relative ${className}`}
      onClick={insertIframe}
    >
      {!loaded && (
        <button
          type="button"
          className="lite-vimeo-play"
          aria-label="Play video"
        >
          ▶
        </button>
      )}
    </div>
  );
}
