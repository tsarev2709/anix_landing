import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WandOverlay.css';

const DESKTOP_QUERY = '(min-width: 1024px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, progress) => from + (to - from) * progress;
const smooth = (value) => {
  const p = clamp(value);
  return p * p * (3 - 2 * p);
};
const segment = (progress, from, to) => smooth((progress - from) / (to - from));
const bell = (progress) => Math.sin(clamp(progress) * Math.PI);

function useWandEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => setEnabled(desktop.matches && !reduced.matches);

    update();

    const addListener = (query) => {
      if (query.addEventListener) {
        query.addEventListener('change', update);
      } else {
        query.addListener(update);
      }
    };
    const removeListener = (query) => {
      if (query.removeEventListener) {
        query.removeEventListener('change', update);
      } else {
        query.removeListener(update);
      }
    };

    addListener(desktop);
    addListener(reduced);

    return () => {
      removeListener(desktop);
      removeListener(reduced);
    };
  }, []);

  return enabled;
}

function WandOverlay() {
  const enabled = useWandEnabled();
  const overlayRef = useRef(null);
  const wandRef = useRef(null);
  const beamRef = useRef(null);
  const pillarRef = useRef(null);
  const dimRef = useRef(null);
  const footerBurstRef = useRef(null);
  const trailRef = useRef(null);

  const sparkNodes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: `spark-${index}`,
        x: `${Math.round(Math.cos(index * 1.7) * (26 + (index % 5) * 8))}px`,
        y: `${Math.round(Math.sin(index * 1.25) * (34 + (index % 4) * 9))}px`,
        delay: `${(index % 6) * 0.07}s`,
      })),
    []
  );

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const overlay = overlayRef.current;
    const wand = wandRef.current;
    const beam = beamRef.current;
    const pillar = pillarRef.current;
    const dim = dimRef.current;
    const footerBurst = footerBurstRef.current;
    const trail = trailRef.current;

    if (!overlay || !wand || !beam || !pillar || !dim || !footerBurst || !trail) {
      return undefined;
    }

    let targets = {};
    let activeElements = new Set();
    let compactCards = [];
    let processSteps = [];
    const triggers = [];

    const cacheElement = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        element,
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    };

    const readTargets = () => {
      targets = {};
      document.querySelectorAll('[data-wand-target]').forEach((element) => {
        targets[element.dataset.wandTarget] = cacheElement(element);
      });
      compactCards = Array.from(document.querySelectorAll('.d1-compact-case')).map(
        cacheElement
      );
      processSteps = Array.from(document.querySelectorAll('.d1-process-step')).map(
        cacheElement
      );
    };

    const pointFor = (spec = {}) => {
      const target = targets[spec.target];
      if (!target) {
        return { x: window.innerWidth * 0.7, y: window.innerHeight * 0.45 };
      }

      return {
        x: target.x + target.width * (spec.ax ?? 0.5) + (spec.dx ?? 0),
        y:
          target.y +
          target.height * (spec.ay ?? 0.5) +
          (spec.dy ?? 0) -
          window.scrollY,
      };
    };

    const livePointFor = (spec = {}) => {
      const target = targets[spec.target];
      if (!target) {
        return pointFor(spec);
      }
      const rect = target.element.getBoundingClientRect();
      return {
        x: rect.left + rect.width * (spec.ax ?? 0.5) + (spec.dx ?? 0),
        y: rect.top + rect.height * (spec.ay ?? 0.5) + (spec.dy ?? 0),
      };
    };

    const between = (fromSpec, toSpec, progress) => {
      const from = pointFor(fromSpec);
      const to = pointFor(toSpec);
      return {
        x: lerp(from.x, to.x, progress),
        y: lerp(from.y, to.y, progress),
      };
    };

    const setActive = (items = []) => {
      const next = new Set();
      items.forEach((item) => {
        if (!item) return;
        const element = typeof item === 'string' ? targets[item]?.element : item;
        if (element) next.add(element);
      });

      activeElements.forEach((element) => {
        if (!next.has(element)) {
          element.classList.remove('wand-target-active');
        }
      });
      next.forEach((element) => element.classList.add('wand-target-active'));
      activeElements = next;
    };

    const placeWand = ({ point, rotation = 0, scale = 1, opacity = 1 }) => {
      const x = clamp(point.x, 36, window.innerWidth - 36);
      const y = clamp(point.y, 36, window.innerHeight - 36);
      gsap.set(wand, { x, y, rotation, scale, autoAlpha: opacity });
      gsap.set(trail, { x, y, rotation: rotation - 14, autoAlpha: opacity * 0.62 });
    };

    const showBeam = (point, opacity, rotation = -18, scaleX = 1) => {
      gsap.set(beam, {
        x: clamp(point.x, 0, window.innerWidth),
        y: clamp(point.y, 0, window.innerHeight),
        rotation,
        scaleX,
        autoAlpha: opacity,
      });
    };

    const showPillar = (point, opacity, scale = 1) => {
      gsap.set(pillar, {
        x: clamp(point.x, 0, window.innerWidth),
        y: clamp(point.y, 0, window.innerHeight),
        scale,
        autoAlpha: opacity,
      });
    };

    const showDim = (opacity) => gsap.set(dim, { autoAlpha: opacity });
    const showFooterBurst = (point, opacity, scale = 1) => {
      gsap.set(footerBurst, {
        x: clamp(point.x, 0, window.innerWidth),
        y: clamp(point.y, 0, window.innerHeight),
        scale,
        autoAlpha: opacity,
      });
    };

    const hideEffects = () => {
      showBeam({ x: 0, y: 0 }, 0);
      showPillar({ x: 0, y: 0 }, 0);
      showDim(0);
      showFooterBurst({ x: 0, y: 0 }, 0);
    };

    const createTrigger = (config) => {
      const trigger = ScrollTrigger.create(config);
      triggers.push(trigger);
      return trigger;
    };

    readTargets();

    gsap.set([wand, beam, pillar, dim, footerBurst, trail], { autoAlpha: 0 });
    gsap.set([wand, beam, pillar, footerBurst, trail], {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: '50% 50%',
    });

    const hero = document.querySelector('.design1-wand-test .d1-hero');
    const proof = document.querySelector('.design1-wand-test .d1-proof');
    const metricsGrid = document.querySelector('.design1-wand-test .d1-metrics-grid');
    const cases = document.querySelector('.design1-wand-test .d1-cases');
    const smallCases = document.querySelector('.design1-wand-test .d1-video-shelf');
    const reasons = document.querySelector('.design1-wand-test .d1-reasons');
    const process = document.querySelector('.design1-wand-test .d1-process');
    const directions = document.querySelector('.design1-wand-test .d1-directions');
    const contacts = targets.contacts?.element;
    const footer = targets.footer?.element;

    if (hero) {
      createTrigger({
        trigger: hero,
        start: 'top top',
        end: '+=165%',
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          readTargets();
          const entry = livePointFor({ target: 'hero-video', ax: 0.84, ay: 0.22, dx: -20, dy: -72 });
          const focus = livePointFor({ target: 'hero-video', ax: 0.56, ay: 0.42, dx: -92, dy: -78 });
          const p = smooth(progress);
          const drop = segment(progress, 0.62, 1);
          const point = {
            x: lerp(entry.x, focus.x, p),
            y: lerp(entry.y, focus.y, p) + drop * 106,
          };
          const videoPoint = livePointFor({ target: 'hero-video', ax: 0.52, ay: 0.42 });
          placeWand({
            point,
            rotation: lerp(-34, 76, drop),
            scale: lerp(0.92, 1.12, segment(progress, 0.04, 0.22)),
            opacity: segment(progress, 0.03, 0.16),
          });
          showPillar(videoPoint, bell(segment(progress, 0.1, 0.7)) * 0.95, 1.04);
          showBeam(videoPoint, bell(segment(progress, 0.16, 0.76)) * 0.42, -72, 1.05);
          showDim(0);
          showFooterBurst(videoPoint, 0);
          setActive(['hero-video']);
        },
      });
    }

    if (proof) {
      createTrigger({
        trigger: proof,
        start: 'top 78%',
        end: 'bottom 26%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const first = segment(progress, 0, 0.5);
          const second = segment(progress, 0.42, 1);
          const point =
            progress < 0.52
              ? between(
                  { target: 'hero-video', ax: 0.7, ay: 0.55, dx: -24, dy: 40 },
                  { target: 'understand-word', ax: 0.5, ay: 0.48, dx: -26, dy: -48 },
                  first
                )
              : between(
                  { target: 'understand-word', ax: 0.5, ay: 0.48, dx: -26, dy: -48 },
                  { target: 'admire-word', ax: 0.5, ay: 0.5, dx: 30, dy: -50 },
                  second
                );
          const wave = Math.sin(progress * Math.PI * 2) * 16;
          point.y += wave;
          placeWand({ point, rotation: lerp(68, -28, progress), scale: 0.96, opacity: 1 });
          const active = progress < 0.54 ? 'understand-word' : 'admire-word';
          const targetPoint = pointFor({ target: active, ax: 0.5, ay: 0.54 });
          showBeam(targetPoint, 0.24 + bell(progress) * 0.16, progress < 0.54 ? 6 : -8, 0.72);
          showPillar(targetPoint, bell(progress) * 0.42, 0.74);
          showDim(0);
          setActive([active]);
        },
      });
    }

    if (metricsGrid) {
      const metricSpecs = [
        { target: 'metric-1', ax: 0.26, ay: 0.82, dx: -28, dy: 34, rotation: -26 },
        { target: 'metric-2', ax: 0.48, ay: 0.18, dx: 6, dy: -40, rotation: 36 },
        { target: 'metric-3', ax: 0.78, ay: 0.86, dx: 34, dy: 36, rotation: -122 },
      ];

      createTrigger({
        trigger: metricsGrid,
        start: 'top 82%',
        end: 'bottom 18%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const raw = clamp(progress * metricSpecs.length, 0, metricSpecs.length - 0.001);
          const index = Math.floor(raw);
          const local = raw - index;
          const from = index === 0 ? { target: 'understand-word', ax: 0.55, ay: 0.7 } : metricSpecs[index - 1];
          const to = metricSpecs[index];
          const point = between(from, to, smooth(local));
          point.y += Math.sin(local * Math.PI) * -28;
          placeWand({
            point,
            rotation: lerp(from.rotation ?? 8, to.rotation, smooth(local)),
            scale: 0.9,
            opacity: 1,
          });
          const activeName = `metric-${index + 1}`;
          const activePoint = pointFor({ target: activeName, ax: 0.5, ay: 0.68 });
          showPillar(activePoint, bell(local) * 0.72, 0.82);
          showBeam(activePoint, bell(local) * 0.34, to.rotation / 2, 0.78);
          showDim(0);
          setActive([activeName]);
        },
      });
    }

    if (cases) {
      createTrigger({
        trigger: cases,
        start: 'top 80%',
        end: 'bottom 18%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const landing = segment(progress, 0, 0.36);
          const fly = segment(progress, 0.26, 1);
          const point =
            progress < 0.38
              ? between(
                  { target: 'metric-3', ax: 0.72, ay: 0.86, dx: 20, dy: 28 },
                  { target: 'case-card-main-right', ax: 0.5, ay: 0.18, dx: 30, dy: -24 },
                  landing
                )
              : between(
                  { target: 'case-card-main-right', ax: 0.5, ay: 0.18, dx: 30, dy: -24 },
                  { target: 'case-card-grid', ax: 0.78, ay: 0.72, dx: -12, dy: 22 },
                  fly
                );
          point.x += Math.sin(progress * Math.PI * 3) * 26;
          point.y += Math.cos(progress * Math.PI * 2) * 18;
          placeWand({
            point,
            rotation: lerp(84, 218, progress),
            scale: lerp(0.92, 0.66, fly),
            opacity: lerp(1, 0.58, fly),
          });
          showPillar(point, bell(progress) * 0.32, 0.58);
          showBeam(point, 0.12 + bell(progress) * 0.14, 14, 0.66);
          showDim(segment(progress, 0.34, 0.72) * 0.1 * (1 - segment(progress, 0.78, 1)));
          setActive(progress < 0.42 ? ['case-card-main-right'] : ['case-card-grid']);
        },
      });
    }

    if (smallCases) {
      createTrigger({
        trigger: smallCases,
        start: 'top 84%',
        end: 'bottom 24%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const base = pointFor({ target: 'small-cases-title', ax: 0.54, ay: 0.58, dx: 22, dy: -40 });
          const radius = 48 + progress * 42;
          const point = {
            x: base.x + Math.cos(progress * Math.PI * 5) * radius,
            y: base.y + Math.sin(progress * Math.PI * 5) * 34 + progress * 120,
          };
          const cardIndex = Math.min(
            compactCards.length - 1,
            Math.max(0, Math.floor(progress * Math.max(1, compactCards.length)))
          );
          placeWand({ point, rotation: progress * 540 - 90, scale: 0.62, opacity: 0.72 });
          showPillar(point, bell((progress * 4) % 1) * 0.34, 0.52);
          showBeam(point, 0.14, progress * 120, 0.54);
          showDim(0.04 + bell(progress) * 0.03);
          setActive(['small-cases-title', compactCards[cardIndex]?.element]);
        },
      });
    }

    if (reasons) {
      const reasonSpecs = [
        { target: 'why-card-1', ax: 0.28, ay: 0.7, dx: -12, dy: 26, rotation: -38 },
        { target: 'why-card-2', ax: 0.5, ay: 0.34, dx: 0, dy: -36, rotation: 18 },
        { target: 'why-card-3', ax: 0.72, ay: 0.68, dx: 18, dy: 24, rotation: 52 },
      ];

      createTrigger({
        trigger: reasons,
        start: 'top 78%',
        end: 'bottom 22%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const raw = clamp(progress * reasonSpecs.length, 0, reasonSpecs.length - 0.001);
          const index = Math.floor(raw);
          const local = raw - index;
          const from = index === 0 ? { target: 'small-cases-title', ax: 0.6, ay: 0.6 } : reasonSpecs[index - 1];
          const to = reasonSpecs[index];
          const point = between(from, to, smooth(local));
          point.y += Math.sin(local * Math.PI) * -36;
          placeWand({
            point,
            rotation: lerp(from.rotation ?? 0, to.rotation, smooth(local)),
            scale: 0.82,
            opacity: 0.95,
          });
          const activeName = `why-card-${index + 1}`;
          const activePoint = pointFor({ target: activeName, ax: 0.5, ay: 0.58 });
          showPillar(activePoint, bell(local) * 0.6, 0.7);
          showBeam(activePoint, bell(local) * 0.28, to.rotation, 0.64);
          showDim(0);
          setActive([activeName]);
        },
      });
    }

    if (process) {
      createTrigger({
        trigger: process,
        start: 'top 78%',
        end: 'bottom 18%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const routePoint = pointFor({ target: 'route-title-space', ax: 0.55, ay: 0.55 });
          const roadPoint = pointFor({ target: 'roadmap', ax: 0.48, ay: 0.5 });
          const point = {
            x:
              lerp(routePoint.x, roadPoint.x, smooth(progress)) +
              Math.sin(progress * Math.PI * 4) * 44,
            y:
              lerp(routePoint.y, roadPoint.y, smooth(progress)) +
              Math.cos(progress * Math.PI * 3) * 28,
          };
          const stepIndex = Math.min(
            processSteps.length - 1,
            Math.max(0, Math.floor(progress * Math.max(1, processSteps.length)))
          );
          placeWand({ point, rotation: lerp(12, 304, progress), scale: 0.72, opacity: 0.84 });
          showPillar(point, bell((progress * 6) % 1) * 0.28, 0.46);
          showBeam(point, 0.12 + bell(progress) * 0.08, -24, 0.58);
          showDim(0);
          setActive(['roadmap', 'route-title-space', processSteps[stepIndex]?.element]);
        },
      });
    }

    if (directions) {
      createTrigger({
        trigger: directions,
        start: 'top 84%',
        end: 'bottom 20%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const point = between(
            { target: 'roadmap', ax: 0.42, ay: 0.72, dx: -20, dy: 20 },
            { target: 'contacts', ax: 0.78, ay: 0.18, dx: -20, dy: -32 },
            smooth(progress)
          );
          point.x += Math.sin(progress * Math.PI * 2) * 34;
          placeWand({ point, rotation: lerp(304, 156, progress), scale: 0.62, opacity: 0.62 });
          showPillar(point, bell(progress) * 0.18, 0.38);
          showBeam(point, 0.1, -12, 0.46);
          showDim(0);
          setActive([]);
        },
      });
    }

    if (contacts) {
      createTrigger({
        trigger: contacts,
        start: 'top 78%',
        end: 'bottom 22%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const point = between(
            { target: 'contacts', ax: 0.78, ay: 0.2, dx: -30, dy: -16 },
            { target: 'footer', ax: 0.68, ay: 0.32, dx: 24, dy: -28 },
            smooth(progress)
          );
          placeWand({
            point,
            rotation: lerp(156, 480, progress),
            scale: lerp(0.76, 0.88, progress),
            opacity: 0.92,
          });
          showPillar(point, bell(progress) * 0.48, 0.72);
          showBeam(point, bell(progress) * 0.2, -42, 0.58);
          showDim(0);
          showFooterBurst(point, 0);
          setActive(['contacts']);
        },
      });
    }

    if (footer) {
      createTrigger({
        trigger: footer,
        start: 'top 82%',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const point = pointFor({ target: 'footer', ax: 0.58, ay: 0.58, dx: 20, dy: -24 });
          point.x += Math.sin(progress * Math.PI * 6) * (28 - progress * 16);
          point.y += Math.cos(progress * Math.PI * 4) * 18;
          const fade = 1 - segment(progress, 0.72, 1);
          placeWand({
            point,
            rotation: 480 + progress * 860,
            scale: lerp(0.88, 0.46, segment(progress, 0.62, 1)),
            opacity: fade,
          });
          showPillar(point, (0.26 + bell(progress) * 0.58) * fade, 0.9 + progress * 0.52);
          showBeam(point, bell(progress) * 0.28 * fade, progress * 180, 0.72);
          showFooterBurst(point, segment(progress, 0.34, 0.94) * (1 - segment(progress, 0.94, 1)), 0.8 + progress * 0.9);
          showDim(0);
          setActive(['footer']);
          gsap.set(overlay, { autoAlpha: fade <= 0.03 ? 0 : 1 });
        },
      });
    }

    const refresh = () => {
      readTargets();
      ScrollTrigger.refresh();
    };
    const refreshSoon = () => window.setTimeout(refresh, 120);

    window.addEventListener('resize', refresh);
    window.addEventListener('load', refreshSoon, { once: true });
    const refreshTimer = window.setTimeout(refresh, 350);
    ScrollTrigger.refresh();

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('load', refreshSoon);
      triggers.forEach((trigger) => trigger.kill());
      setActive([]);
      hideEffects();
      gsap.set([wand, beam, pillar, dim, footerBurst, trail], { clearProps: 'all' });
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  const wandAsset = `${process.env.PUBLIC_URL || ''}/assets/anix-wand.svg`;

  return (
    <div className="wand-overlay" ref={overlayRef} aria-hidden="true">
      <div className="wand-dim" ref={dimRef} />
      <div className="wand-beam" ref={beamRef} />
      <div className="wand-trail" ref={trailRef} />
      <div className="wand-spark-pillar" ref={pillarRef}>
        {sparkNodes.map((spark) => (
          <span
            key={spark.id}
            style={{
              '--spark-x': spark.x,
              '--spark-y': spark.y,
              '--spark-delay': spark.delay,
            }}
          />
        ))}
      </div>
      <img
        className="wand-asset"
        ref={wandRef}
        src={wandAsset}
        alt=""
        draggable="false"
      />
      <div className="wand-footer-burst" ref={footerBurstRef}>
        {sparkNodes.map((spark) => (
          <span
            key={`footer-${spark.id}`}
            style={{
              '--spark-x': spark.x,
              '--spark-y': spark.y,
              '--spark-delay': spark.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default WandOverlay;

