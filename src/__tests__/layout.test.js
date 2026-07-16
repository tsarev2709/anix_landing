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

    const hrefs = Array.from(container.querySelectorAll('a[href]')).map((link) =>
      link.getAttribute('href')
    );

    expect(hrefs).toContain('/medicine/');
    expect(hrefs).toContain('/hse/');
    expect(hrefs).toContain('/ceo/');
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
});
