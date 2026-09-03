import React from 'react';
import { createRoot } from 'react-dom/client';
import TestUtils from 'react-dom/test-utils';
import fs from 'fs';
import App from '../App';

describe('current ANIX landing', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    TestUtils.act(() => root.unmount());
    container.remove();
  });

  test('renders one meaningful H1 inside the main content', () => {
    TestUtils.act(() => {
      root.render(<App />);
    });

    const main = container.querySelector('main.design1-test');
    const headings = container.querySelectorAll('h1');

    expect(main).toBeTruthy();
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe('Делаем сложное интересным');
  });

  test('exposes real internal links to public direction pages', () => {
    TestUtils.act(() => {
      root.render(<App />);
    });

    const hrefs = Array.from(container.querySelectorAll('a[href]')).map(
      (link) => link.getAttribute('href')
    );

    expect(hrefs).toContain('/medicine/');
    expect(hrefs).toContain('/hse/');
    expect(hrefs).toContain('/ceo/');
  });

  test('routes the first screen into both flagship products', () => {
    TestUtils.act(() => {
      root.render(<App />);
    });

    const links = Array.from(
      container.querySelectorAll('.d1-hero-solutions a')
    );
    expect(links.map((link) => link.textContent.trim())).toEqual([
      'Решения для фармы',
      'Решения по охране труда',
    ]);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/medicine',
      '/hse',
    ]);
  });

  test('showreel is click-to-load and does not mount the iframe initially', () => {
    TestUtils.act(() => {
      root.render(<App />);
    });

    expect(container.querySelector('.d1-showreel-poster')).toBeTruthy();
    expect(container.querySelector('.d1-showreel iframe')).toBeNull();
  });

  test('wide layout remains fluid instead of using a narrow fixed container', () => {
    const css = fs.readFileSync('src/Design1TestPage.css', 'utf8');
    const match = css.match(/\.d1-container\s*\{[^}]*\}/);

    expect(match).not.toBeNull();
    expect(match[0]).toMatch(/width:\s*100%/);
    expect(match[0]).toMatch(/max-width:\s*none/);
    expect(match[0]).toMatch(/padding-inline:\s*clamp\(/);
  });

  test('all public desktop pages share the homepage fluid grid', () => {
    const css = fs.readFileSync('src/styles/site-wide-layout.css', 'utf8');

    expect(css).toMatch(/@media \(min-width:\s*901px\)/);
    expect(css).toContain('.why-hero');
    expect(css).toContain('.animation-hero');
    expect(css).toContain('.ai-video-hero');
    expect(css).toContain('.rybki-intro');
    expect(css).toContain('.cases-category-hero');
    expect(css).toContain('.case-page .case-hero');
    expect(css).toContain('.andrey-page .andrey-hero');
    expect(css).toMatch(/width:\s*100%/);
    expect(css).toMatch(/padding-right:\s*var\(--anix-page-gutter\)/);
    expect(css).toMatch(/padding-left:\s*var\(--anix-page-gutter\)/);
  });

  test('shows one native website lead form before the shared footer', () => {
    TestUtils.act(() => {
      root.render(<App />);
    });

    expect(container.querySelectorAll('.website-lead')).toHaveLength(1);
    expect(container.querySelector('.website-lead h2').textContent).toBe(
      'Обсудим ваш проект'
    );
    expect(container.querySelector('#website-lead-form')).toBeTruthy();
    expect(container.querySelector('.anix-site-footer')).toBeTruthy();
  });

  test('publishes all additional video cards with useful destinations', () => {
    TestUtils.act(() => {
      root.render(<App />);
    });

    const cards = Array.from(container.querySelectorAll('.d1-compact-case'));
    expect(cards).toHaveLength(8);
    expect(cards.every((card) => card.getAttribute('href') !== '#cases')).toBe(
      true
    );
  });

  test('publishes the company details in the shared footer', () => {
    TestUtils.act(() => {
      root.render(<App />);
    });

    const footerText = container.querySelector('.anix-site-footer').textContent;
    expect(footerText).toContain('ООО «АНИКС»');
    expect(footerText).toContain('ИНН 9714017729');
    expect(footerText).toContain('КПП 772701001');
  });

  test('keeps the lead form fluid on desktop and single-column on mobile', () => {
    const css = fs.readFileSync('src/components/WebsiteLeadForm.css', 'utf8');

    expect(css).toMatch(/\.website-lead\s*\{[\s\S]*?width:\s*100%/);
    expect(css).toMatch(/@media \(max-width:\s*980px\)/);
    expect(css).toMatch(
      /@media \(max-width:\s*640px\)[\s\S]*?\.website-lead__grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/
    );
  });
});
