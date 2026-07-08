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
      Array.from({ length: 30 }, (_, index) => ({
        id: 'spark-' + index,
        x: Math.round(Math.cos(index * 1.52) * (30 + (index % 6) * 9)) + 'px',
        y: Math.round(Math.sin(index * 1.21) * (36 + (index % 5) * 11)) + 'px',
        delay: (index % 8) * 0.055 + 's',
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
    let directionCards = [];
    let trustChipTargets = [];
    let ctaTargets = [];
    const triggers = [];

    const readTargets = () => {
      targets = {};
      document.querySelectorAll('[data-wand-target]').forEach((element) => {
        targets[element.dataset.wandTarget] = { element };
      });
      compactCards = Array.from(
        document.querySelectorAll('.design1-wand-test .d1-compact-case')
      ).map((element) => ({ element }));
      processSteps = Array.from(
        document.querySelectorAll('.design1-wand-test .d1-process-step')
      ).map((element) => ({ element }));
      directionCards = Array.from(
        document.querySelectorAll('.design1-wand-test .d1-direction-card')
      ).map((element) => ({ element }));
      trustChipTargets = Array.from(
        document.querySelectorAll('.design1-wand-test .d1-trust-chip')
      ).map((element) => ({ element }));
      ctaTargets = ['cta-telegram', 'cta-videos', 'cta-email']
        .map((name) => targets[name])
        .filter(Boolean);
    };

    const focusBand = (spec = {}) => {
      const header = document.querySelector('.design1-wand-test .d1-header');
      const headerRect = header?.getBoundingClientRect();
      const headerBottom = Math.max(92, headerRect?.bottom || 92);
      let minY = Math.max(126, headerBottom + 44);
      let maxY = Math.max(minY + 96, window.innerHeight - 104);

      if (spec.band === 'middle') {
        minY = Math.max(minY, window.innerHeight * 0.24);
        maxY = Math.min(maxY, window.innerHeight * 0.76);
      }

      if (spec.band === 'upper') {
        minY = Math.max(minY, window.innerHeight * 0.2);
        maxY = Math.min(maxY, window.innerHeight * 0.68);
      }

      return { minY, maxY };
    };

    const keepPointInFrame = (point, spec = {}) => {
      const band = focusBand(spec);
      return {
        x: clamp(point.x, 44, window.innerWidth - 44),
        y: clamp(point.y, band.minY, band.maxY),
      };
    };

    const elementPoint = (element, spec = {}) => {
      if (!element) {
        return keepPointInFrame(
          {
            x: window.innerWidth * (spec.vx ?? 0.58),
            y: window.innerHeight * (spec.vy ?? 0.5),
          },
          spec
        );
      }

      const rect = element.getBoundingClientRect();
      const ax = spec.ax ?? 0.5;
      const ay = spec.ay ?? 0.5;
      let x = rect.left + rect.width * ax + (spec.dx ?? 0);
      let y = rect.top + rect.height * ay + (spec.dy ?? 0);

      if (spec.keepVisible !== false) {
        const band = focusBand(spec);
        const overlapsBand = rect.bottom >= band.minY && rect.top <= band.maxY;

        if (overlapsBand) {
          const visibleTop = clamp(rect.top, band.minY, band.maxY);
          const visibleBottom = clamp(rect.bottom, band.minY, band.maxY);

          if (visibleBottom - visibleTop > 24) {
            y = clamp(y, visibleTop + 14, visibleBottom - 14);
          }
        } else if (rect.top > band.maxY) {
          y = band.maxY - (spec.offscreenOffset ?? 28);
        } else {
          y = band.minY + (spec.offscreenOffset ?? 28);
        }

        y = clamp(y, band.minY, band.maxY);
      }

      return {
        x: clamp(x, 48, window.innerWidth - 48),
        y: clamp(y, 36, window.innerHeight - 36),
      };
    };

    const pointFor = (spec = {}) => {
      if (spec.vx != null || spec.vy != null) {
        const point = {
          x: window.innerWidth * (spec.vx ?? 0.5) + (spec.dx ?? 0),
          y: window.innerHeight * (spec.vy ?? 0.5) + (spec.dy ?? 0),
        };

        if (spec.keepVisible === false) {
          return {
            x: clamp(point.x, 44, window.innerWidth - 44),
            y: clamp(point.y, 36, window.innerHeight - 36),
          };
        }

        return keepPointInFrame(point, spec);
      }

      if (spec.element) {
        return elementPoint(spec.element, spec);
      }

      return elementPoint(targets[spec.target]?.element, spec);
    };

    const logoPoint = () => {
      const logo = targets['logo-origin']?.element || document.querySelector('.design1-wand-test .d1-logo');
      if (!logo) {
        return { x: 92, y: 94 };
      }
      const rect = logo.getBoundingClientRect();
      return {
        x: clamp(rect.left + rect.width * 0.58, 48, window.innerWidth - 48),
        y: clamp(rect.bottom + 18, 58, window.innerHeight - 58),
      };
    };

    const curveBetween = (fromSpec, toSpec, progress, options = {}) => {
      const p = smooth(progress);
      const from = pointFor(fromSpec);
      const to = pointFor(toSpec);
      const swing = Math.sin(p * Math.PI);
      return keepPointInFrame(
        {
          x: lerp(from.x, to.x, p) + swing * (options.arcX ?? 0),
          y: lerp(from.y, to.y, p) + swing * (options.arcY ?? -28),
        },
        options
      );
    };

    const pathThrough = (points, progress, options = {}) => {
      if (points.length <= 1) {
        return pointFor(points[0] || { vx: 0.5, vy: 0.5 });
      }

      const raw = clamp(progress) * (points.length - 1);
      const index = Math.min(points.length - 2, Math.floor(raw));
      const local = raw - index;
      const arcX = Array.isArray(options.arcX)
        ? options.arcX[index % options.arcX.length]
        : options.arcX ?? (index % 2 === 0 ? 58 : -58);
      const arcY = Array.isArray(options.arcY)
        ? options.arcY[index % options.arcY.length]
        : options.arcY ?? (index % 2 === 0 ? -44 : 34);

      return curveBetween(points[index], points[index + 1], local, {
        ...options,
        arcX,
        arcY,
      });
    };

    const resolveElement = (item) => {
      if (!item) return null;
      if (typeof item === 'string') return targets[item]?.element || null;
      if (item.nodeType === 1) return item;
      return item.element || null;
    };

    const setActive = (items = []) => {
      const next = new Set();
      items.forEach((item) => {
        const element = resolveElement(item);
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

    const steppedIndex = (progress, length) =>
      Math.min(length - 1, Math.max(0, Math.floor(clamp(progress) * length)));

    const placeWand = ({ point, rotation = 0, scale = 1, opacity = 1, trailScale = 1 }) => {
      const x = clamp(point.x, 36, window.innerWidth - 36);
      const y = clamp(point.y, 36, window.innerHeight - 36);
      gsap.set(wand, { x, y, rotation, scale, autoAlpha: opacity });
      gsap.set(trail, {
        x,
        y,
        rotation: rotation - 18,
        scaleX: trailScale,
        scaleY: Math.max(0.58, scale),
        autoAlpha: opacity * 0.66,
      });
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
    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set([wand, beam, pillar, footerBurst, trail], {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: '50% 50%',
    });

    const hero = document.querySelector('.design1-wand-test .d1-hero');
    const proof = document.querySelector('.design1-wand-test .d1-proof');
    const metricsGrid = document.querySelector('.design1-wand-test .d1-metrics-grid');
    const servicesSection = document.querySelector('.design1-wand-test #services');
    const cases = document.querySelector('.design1-wand-test .d1-cases');
    const smallCases = document.querySelector('.design1-wand-test .d1-video-shelf');
    const reasons = document.querySelector('.design1-wand-test .d1-reasons');
    const process = document.querySelector('.design1-wand-test .d1-process');
    const directions = document.querySelector('.design1-wand-test .d1-directions');
    const trust = document.querySelector('.design1-wand-test .d1-trust');
    const contacts = targets.contacts?.element;
    const footer = targets.footer?.element;

    if (hero) {
      createTrigger({
        trigger: hero,
        start: 'top 96px',
        end: '+=190%',
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          readTargets();
          const logo = logoPoint();
          const videoFocus = pointFor({ target: 'hero-video', ax: 0.54, ay: 0.43, dx: -18, dy: -8, band: 'upper' });
          const travel = segment(progress, 0.02, 0.56);
          const settle = segment(progress, 0.5, 1);
          const appear = window.scrollY < 4 ? 0 : segment(progress, 0.06, 0.16);

          let point;
          if (progress < 0.2) {
            const p = smooth(segment(progress, 0.02, 0.2));
            const underHeader = {
              x: window.innerWidth * 0.3,
              y: Math.max(logo.y + 18, window.innerHeight * 0.24),
            };
            point = {
              x: lerp(logo.x, underHeader.x, p) + Math.sin(p * Math.PI) * 58,
              y: lerp(logo.y, underHeader.y, p) - Math.sin(p * Math.PI) * 26,
            };
          } else if (progress < 0.56) {
            point = pathThrough(
              [
                { vx: 0.3, vy: 0.26, band: 'upper' },
                { vx: 0.43, vy: 0.45, band: 'middle' },
                { vx: 0.54, vy: 0.5, band: 'middle' },
                { target: 'hero-video', ax: 0.48, ay: 0.32, dx: -28, dy: -22, band: 'upper' },
              ],
              segment(progress, 0.2, 0.56),
              { arcX: [-56, 72, -42], arcY: [46, -38, 28], band: 'middle' }
            );
          } else {
            const orbit = bell(settle);
            point = {
              x: videoFocus.x + Math.sin(progress * Math.PI * 4.6) * (22 + orbit * 18),
              y: videoFocus.y + Math.cos(progress * Math.PI * 3.8) * (16 + orbit * 12),
            };
          }

          const videoPoint = pointFor({ target: 'hero-video', ax: 0.5, ay: 0.5, band: 'upper' });
          placeWand({
            point,
            rotation: lerp(-48, 92, smooth(progress)) + Math.sin(progress * Math.PI * 5) * 10,
            scale: lerp(0.52, 1.46, segment(progress, 0.1, 0.72)) - settle * 0.12,
            opacity: appear,
            trailScale: 1.25 + settle * 0.5,
          });
          showPillar(point, appear * (0.2 + bell(segment(progress, 0.28, 0.92)) * 0.96), 0.92 + settle * 0.58);
          showBeam(point, appear * bell(segment(progress, 0.26, 0.82)) * 0.58, -66 + settle * 24, 1.05 + settle * 0.28);
          showDim(0);
          showFooterBurst(videoPoint, 0);
          setActive(progress > 0.24 ? ['hero-video'] : []);
          gsap.set(overlay, { autoAlpha: appear > 0.02 ? 1 : 0 });
        },
      });
    }

    if (proof) {
      createTrigger({
        trigger: proof,
        start: 'top 90%',
        end: 'bottom 42%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const point = pathThrough(
            [
              { vx: 0.75, vy: 0.66, band: 'middle' },
              { target: 'understand-word', ax: 0.46, ay: 0.5, dx: -24, dy: -46, band: 'middle' },
              { target: 'admire-word', ax: 0.52, ay: 0.5, dx: 26, dy: -46, band: 'middle' },
            ],
            progress,
            { arcX: [52, -44], arcY: [44, -36], band: 'middle' }
          );
          const active = progress < 0.54 ? 'understand-word' : 'admire-word';
          placeWand({
            point,
            rotation: lerp(82, -34, smooth(progress)),
            scale: lerp(1.02, 0.86, segment(progress, 0.18, 1)),
            opacity: 0.98,
            trailScale: 1.2,
          });
          showBeam(point, 0.22 + bell(progress) * 0.2, progress < 0.54 ? 8 : -12, 0.72);
          showPillar(point, bell(progress) * 0.5, 0.78);
          showFooterBurst(point, 0);
          showDim(0);
          setActive([active]);
          gsap.set(overlay, { autoAlpha: 1 });
        },
      });
    }

    if (metricsGrid) {
      const metricSpecs = [
        { target: 'metric-1', ax: 0.34, ay: 0.64, dx: -18, dy: 18, rotation: -26, band: 'middle' },
        { target: 'metric-2', ax: 0.52, ay: 0.35, dx: 4, dy: -28, rotation: 24, band: 'middle' },
        { target: 'metric-3', ax: 0.68, ay: 0.62, dx: 18, dy: 18, rotation: -44, band: 'middle' },
        { target: 'metric-4', ax: 0.76, ay: 0.44, dx: 22, dy: -12, rotation: 30, band: 'middle' },
      ];

      createTrigger({
        trigger: metricsGrid,
        start: 'top 94%',
        end: 'bottom 42%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const point = pathThrough(
            [
              { target: 'admire-word', ax: 0.52, ay: 0.62, band: 'middle' },
              ...metricSpecs,
            ],
            progress,
            { arcX: [50, -38, 44, -32], arcY: [-30, 32, -26, 24], band: 'middle' }
          );
          const metricProgress = segment(progress, 0.02, 0.82);
          const index = steppedIndex(metricProgress, metricSpecs.length);
          const local = (metricProgress * metricSpecs.length) % 1;
          const activeName = 'metric-' + (index + 1);
          const fromRotation = metricSpecs[Math.max(0, index - 1)]?.rotation ?? -18;
          placeWand({
            point,
            rotation: lerp(fromRotation, metricSpecs[index].rotation, smooth(local)),
            scale: 0.8 + bell(local) * 0.26,
            opacity: 0.9 + bell(local) * 0.1,
            trailScale: 1.1,
          });
          showPillar(point, 0.2 + bell(local) * 0.54, 0.7 + bell(local) * 0.18);
          showBeam(point, bell(local) * 0.3, metricSpecs[index].rotation / 2, 0.74);
          showFooterBurst(point, 0);
          showDim(0);
          setActive(progress < 0.14 ? ['admire-word'] : [activeName]);
        },
      });
    }

    if (servicesSection) {
      createTrigger({
        trigger: servicesSection,
        start: 'top 92%',
        end: 'bottom 38%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const point = pathThrough(
            [
              { target: 'metric-4', ax: 0.72, ay: 0.52, band: 'middle' },
              { vx: 0.62, vy: 0.48, dx: -18, dy: -18, band: 'middle' },
              { vx: 0.42, vy: 0.62, dx: 24, dy: 18, band: 'middle' },
              { target: 'case-card-1', ax: 0.34, ay: 0.42, dx: -16, dy: -18, band: 'middle' },
            ],
            progress,
            { arcX: [-56, 68, -46], arcY: [42, -52, 34], band: 'middle' }
          );
          placeWand({
            point,
            rotation: lerp(28, -38, smooth(progress)) + Math.sin(progress * Math.PI * 2) * 10,
            scale: 0.92 + bell(progress) * 0.42,
            opacity: 0.82 + bell(progress) * 0.12,
            trailScale: 1.34,
          });
          showPillar(point, 0.14 + bell(progress) * 0.3, 0.58 + bell(progress) * 0.18);
          showBeam(point, 0.1 + bell(progress) * 0.1, -24, 0.72);
          showFooterBurst(point, 0);
          showDim(0);
          setActive(progress < 0.24 ? ['metric-4'] : []);
        },
      });
    }

    if (cases) {
      const caseSpecs = Array.from({ length: 6 }, (_, index) => ({
        target: 'case-card-' + (index + 1),
        ax: index % 2 === 0 ? 0.34 : 0.68,
        ay: index < 2 ? 0.42 : 0.5,
        dx: index % 2 === 0 ? -12 : 12,
        dy: index % 3 === 1 ? -18 : 18,
        band: 'middle',
      }));

      createTrigger({
        trigger: cases,
        start: 'top 88%',
        end: 'bottom 18%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const point = pathThrough(caseSpecs, progress, {
            arcX: [62, -58, 64, -52, 44],
            arcY: [-34, 36, -32, 30, -24],
            band: 'middle',
          });
          const caseProgress = segment(progress, 0.02, 0.9);
          const index = steppedIndex(caseProgress, caseSpecs.length);
          const local = (caseProgress * caseSpecs.length) % 1;
          const activeName = 'case-card-' + (index + 1);
          placeWand({
            point,
            rotation: lerp(64, 292, smooth(progress)) + Math.sin(progress * Math.PI * 6) * 14,
            scale: 0.72 + bell(local) * 0.18,
            opacity: 0.72 + bell(local) * 0.22,
            trailScale: 1.22,
          });
          showPillar(point, 0.14 + bell(local) * 0.3, 0.52 + bell(local) * 0.12);
          showBeam(point, 0.1 + bell(local) * 0.14, progress * 90 - 32, 0.58);
          showFooterBurst(point, 0);
          showDim(0.03 + bell(progress) * 0.03);
          setActive([activeName]);
        },
      });
    }

    if (smallCases) {
      createTrigger({
        trigger: smallCases,
        start: 'top 88%',
        end: 'bottom 12%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const compactSpecs = compactCards.map((card, index) => ({
            target: 'compact-case-' + (index + 1),
            element: card.element,
            ax: index % 2 === 0 ? 0.3 : 0.7,
            ay: 0.42,
            dy: index % 2 === 0 ? -16 : 18,
            band: 'middle',
          }));
          const point = pathThrough(
            [
              { target: 'case-card-6', ax: 0.6, ay: 0.5, band: 'middle' },
              { target: 'small-cases-title', ax: 0.54, ay: 0.52, dx: 16, dy: -28, band: 'middle' },
              ...compactSpecs,
            ],
            progress,
            { arcX: [62, -58, 54, -64, 48], arcY: [30, -38, 32, -34, 28], band: 'middle' }
          );
          const compactProgress = segment(progress, 0.12, 0.84);
          const length = Math.max(1, compactSpecs.length);
          const cardIndex = steppedIndex(compactProgress, length);
          const local = (compactProgress * length) % 1;
          const activeName = compactSpecs[cardIndex]?.target;
          placeWand({
            point,
            rotation: lerp(248, -72, smooth(progress)) + Math.sin(progress * Math.PI * 5) * 12,
            scale: 0.58 + bell(local) * 0.16,
            opacity: 0.66 + bell(local) * 0.2,
            trailScale: 1.08,
          });
          showPillar(point, 0.08 + bell(local) * 0.3, 0.46 + bell(local) * 0.1);
          showBeam(point, 0.1 + bell(local) * 0.08, progress * 120 - 28, 0.5);
          showFooterBurst(point, 0);
          showDim(0.02 + bell(progress) * 0.03);
          setActive(progress < 0.12 || !activeName ? ['case-card-6', 'small-cases-title'] : ['small-cases-title', activeName]);
        },
      });
    }

    if (reasons) {
      const reasonSpecs = [
        { target: 'why-card-1', ax: 0.28, ay: 0.62, dx: -10, dy: 20, rotation: -38, band: 'middle' },
        { target: 'why-card-2', ax: 0.5, ay: 0.36, dx: 0, dy: -30, rotation: 18, band: 'middle' },
        { target: 'why-card-3', ax: 0.72, ay: 0.62, dx: 18, dy: 22, rotation: 58, band: 'middle' },
      ];

      createTrigger({
        trigger: reasons,
        start: 'top 84%',
        end: 'bottom 22%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const lastCompactTarget = 'compact-case-' + Math.max(1, compactCards.length);
          const point = pathThrough(
            [
              { target: lastCompactTarget, ax: 0.62, ay: 0.5, band: 'middle' },
              ...reasonSpecs,
            ],
            progress,
            { arcX: [66, -54, 58], arcY: [-36, 34, -34], band: 'middle' }
          );
          const reasonProgress = segment(progress, 0.1, 0.82);
          const index = steppedIndex(reasonProgress, reasonSpecs.length);
          const local = (reasonProgress * reasonSpecs.length) % 1;
          const activeName = 'why-card-' + (index + 1);
          placeWand({
            point,
            rotation: lerp(reasonSpecs[Math.max(0, index - 1)]?.rotation ?? -12, reasonSpecs[index].rotation, smooth(local)),
            scale: 0.72 + bell(local) * 0.18,
            opacity: 0.84 + bell(local) * 0.12,
            trailScale: 1.08,
          });
          showPillar(point, 0.12 + bell(local) * 0.46, 0.6 + bell(local) * 0.14);
          showBeam(point, 0.08 + bell(local) * 0.18, reasonSpecs[index].rotation, 0.58);
          showFooterBurst(point, 0);
          showDim(0);
          setActive(progress < 0.12 ? [lastCompactTarget] : [activeName]);
        },
      });
    }

    if (process) {
      createTrigger({
        trigger: process,
        start: 'top 82%',
        end: 'bottom 18%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const stepSpecs = processSteps.map((step, index) => ({
            target: 'process-step-' + (index + 1),
            element: step.element,
            ax: index % 2 === 0 ? 0.34 : 0.72,
            ay: 0.5,
            dx: index % 2 === 0 ? -18 : 18,
            band: 'middle',
          }));
          const point = pathThrough(
            [
              { target: 'why-card-3', ax: 0.66, ay: 0.6, band: 'middle' },
              { target: 'route-title-space', ax: 0.55, ay: 0.55, band: 'middle' },
              ...stepSpecs,
            ],
            progress,
            { arcX: [72, -60, 56, -50, 54], arcY: [32, -40, 30, -32, 26], band: 'middle' }
          );
          const stepProgress = segment(progress, 0.14, 0.82);
          const length = Math.max(1, stepSpecs.length);
          const stepIndex = steppedIndex(stepProgress, length);
          const local = (stepProgress * length) % 1;
          const activeName = stepSpecs[stepIndex]?.target;
          placeWand({
            point,
            rotation: lerp(18, 292, smooth(progress)) + Math.sin(progress * Math.PI * 4) * 10,
            scale: 0.62 + bell(local) * 0.16,
            opacity: 0.72 + bell(local) * 0.14,
            trailScale: 1.06,
          });
          showPillar(point, 0.08 + bell(local) * 0.24, 0.42 + bell(local) * 0.1);
          showBeam(point, 0.08 + bell(local) * 0.08, -24, 0.52);
          showFooterBurst(point, 0);
          showDim(0);
          setActive(progress < 0.14 || !activeName ? ['why-card-3', 'route-title-space'] : [activeName]);
        },
      });
    }

    if (directions) {
      createTrigger({
        trigger: directions,
        start: 'top 88%',
        end: 'bottom 24%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const cardIndex = steppedIndex(progress, Math.max(1, directionCards.length));
          const point = pathThrough(
            [
              { target: 'process-step-' + Math.max(1, processSteps.length), ax: 0.58, ay: 0.58, band: 'middle' },
              ...directionCards.map((card, index) => ({
                element: card.element,
                ax: index % 2 === 0 ? 0.32 : 0.68,
                ay: 0.44,
                band: 'middle',
              })),
              { target: 'trust-panel', ax: 0.34, ay: 0.42, dx: -18, dy: -18, band: 'middle' },
            ],
            progress,
            { arcX: [62, -70, 54, -52, 58], arcY: [-30, 38, -28, 32, -24], band: 'middle' }
          );
          const local = (progress * Math.max(1, directionCards.length)) % 1;
          placeWand({
            point,
            rotation: lerp(282, 148, smooth(progress)) + Math.sin(progress * Math.PI * 4) * 10,
            scale: 0.56 + bell(local) * 0.12,
            opacity: 0.58 + bell(local) * 0.14,
            trailScale: 1,
          });
          showPillar(point, 0.06 + bell(local) * 0.16, 0.36 + bell(local) * 0.08);
          showBeam(point, 0.06 + bell(local) * 0.06, -12, 0.44);
          showFooterBurst(point, 0);
          showDim(0);
          setActive(progress < 0.14 ? ['process-step-' + Math.max(1, processSteps.length)] : progress > 0.88 ? ['trust-panel'] : [directionCards[cardIndex]?.element]);
        },
      });
    }

    if (trust) {
      createTrigger({
        trigger: trust,
        start: 'top 86%',
        end: 'bottom 28%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const trustSpecs = trustChipTargets.map((chip, index) => ({
            target: 'trust-chip-' + (index + 1),
            element: chip.element,
            ax: index % 2 === 0 ? 0.34 : 0.68,
            ay: 0.5,
            dx: index % 2 === 0 ? -10 : 10,
            band: 'middle',
          }));
          const point = pathThrough(
            [
              { target: 'trust-panel', ax: 0.34, ay: 0.42, dx: -12, dy: -16, band: 'middle' },
              ...trustSpecs,
              { target: 'contacts', ax: 0.48, ay: 0.34, dx: -10, dy: -20, band: 'middle' },
            ],
            progress,
            { arcX: [54, -48, 46, -42, 40], arcY: [-24, 30, -26, 28, -22], band: 'middle' }
          );
          const chipProgress = segment(progress, 0.08, 0.78);
          const length = Math.max(1, trustSpecs.length);
          const index = steppedIndex(chipProgress, length);
          const local = (chipProgress * length) % 1;
          const activeName = trustSpecs[index]?.target;
          placeWand({
            point,
            rotation: lerp(212, -28, smooth(progress)) + Math.sin(progress * Math.PI * 4) * 8,
            scale: 0.74 + bell(progress) * 0.36,
            opacity: 0.8 + bell(progress) * 0.16,
            trailScale: 1.28,
          });
          showPillar(point, 0.16 + bell(local) * 0.36, 0.58 + bell(local) * 0.16);
          showBeam(point, 0.08 + bell(local) * 0.12, -22, 0.64);
          showFooterBurst(point, 0);
          showDim(0);
          setActive(progress < 0.08 || !activeName ? ['trust-panel'] : ['trust-panel', activeName]);
        },
      });
    }

    if (contacts) {
      createTrigger({
        trigger: contacts,
        start: 'top 82%',
        end: 'bottom 20%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const ctaSpecs = [
            { target: 'cta-telegram', ax: 0.84, ay: 0.5, dx: 26, rotation: -22, band: 'middle' },
            { target: 'cta-videos', ax: 0.84, ay: 0.5, dx: 26, rotation: -12, band: 'middle' },
            { target: 'cta-email', ax: 0.84, ay: 0.5, dx: 26, rotation: 4, band: 'middle' },
          ].filter((spec) => ctaTargets.some((target) => target.element === targets[spec.target]?.element));
          const point = pathThrough(
            [
              { target: 'trust-chip-' + Math.max(1, trustChipTargets.length), ax: 0.64, ay: 0.5, band: 'middle' },
              { target: 'contacts', ax: 0.44, ay: 0.46, dx: 8, dy: -8, band: 'middle' },
              ...ctaSpecs,
              { target: 'footer', ax: 0.26, ay: 0.36, dx: -12, dy: -18, band: 'middle' },
            ],
            progress,
            { arcX: [-56, 62, -42, 38], arcY: [30, -36, 22, -24], band: 'middle' }
          );
          const ctaProgress = segment(progress, 0.22, 0.88);
          const length = Math.max(1, ctaSpecs.length);
          const index = steppedIndex(ctaProgress, length);
          const local = (ctaProgress * length) % 1;
          const activeName = ctaSpecs[index]?.target;
          placeWand({
            point,
            rotation: lerp(138, -26, smooth(progress)),
            scale: 0.74 + bell(local) * 0.24,
            opacity: 0.9,
            trailScale: 1.2,
          });
          showPillar(point, 0.14 + bell(local) * 0.44, 0.62 + bell(local) * 0.18);
          showBeam(point, 0.1 + bell(local) * 0.18, -34, 0.68);
          showFooterBurst(point, 0);
          showDim(0);
          setActive(progress < 0.18 || !activeName ? ['contacts', 'trust-chip-' + Math.max(1, trustChipTargets.length - 1), 'trust-chip-' + Math.max(1, trustChipTargets.length)] : ['contacts', activeName]);
        },
      });
    }

    if (footer) {
      createTrigger({
        trigger: footer,
        start: 'top 86%',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const p = smooth(progress);
          const swing = Math.sin(p * Math.PI);
          const point = {
            x: lerp(window.innerWidth * 0.08, window.innerWidth * 0.92, p) + swing * window.innerWidth * 0.04,
            y: lerp(window.innerHeight * 0.9, window.innerHeight * 0.16, p) - swing * window.innerHeight * 0.08,
          };
          const opacity = 0.38 + segment(progress, 0.02, 0.34) * 0.58;
          placeWand({
            point,
            rotation: lerp(42, -38, p),
            scale: lerp(1.16, 4.35, segment(progress, 0.04, 0.92)),
            opacity,
            trailScale: 1.8 + progress * 1.5,
          });
          showPillar(point, (0.24 + bell(progress) * 0.58) * opacity, 0.95 + progress * 1.25);
          showBeam(point, (0.14 + bell(progress) * 0.22) * opacity, -38, 1.1 + progress * 1.55);
          showFooterBurst(point, segment(progress, 0.18, 0.96) * 0.92, 1 + progress * 1.4);
          showDim(0);
          setActive(['footer', 'cta-telegram', 'cta-videos', 'cta-email']);
          gsap.set(overlay, { autoAlpha: 1 });
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
      gsap.set(overlay, { clearProps: 'all' });
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  const wandAsset = (process.env.PUBLIC_URL || '') + '/assets/anix-wand.svg';

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
            key={'footer-' + spark.id}
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
