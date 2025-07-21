/* eslint-disable no-redeclare */
import React from 'react';
import { createRoot } from 'react-dom/client';
import TestUtils from 'react-dom/test-utils';
import fs from 'fs';
import App from '../App';

jest.mock('react-swipeable', () => ({
  useSwipeable: () => ({}),
}), { virtual: true });

// Mock react-helmet to avoid dependency errors in tests
jest.mock('react-helmet', () => ({
  Helmet: ({ children }) => <>{children}</>
}), { virtual: true });

test('hero section appears after loading and has three lines', () => {
  jest.useFakeTimers();
  // Polyfill IntersectionObserver for JSDOM
  global.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  const container = document.createElement('div');
  document.body.appendChild(container);
  TestUtils.act(() => {
    createRoot(container).render(<App />);
  });

  expect(container.querySelector('.loading-screen')).toBeTruthy();

  TestUtils.act(() => {
    jest.runAllTimers();
  });

  const heroTitle = container.querySelector('.hero-title');
  expect(heroTitle).toBeTruthy();
  expect(heroTitle.querySelectorAll('.title-line').length).toBe(3);
});

test('hero-content has expected max width', () => {
  const css = fs.readFileSync('src/App.css', 'utf8');
  const match = css.match(/\.hero-content\s*\{[^}]*\}/);
  expect(match).not.toBeNull();
  expect(match[0]).toMatch(/max-width:\s*800px/);
});

test('award card fits mobile width', () => {
  const css = fs.readFileSync('src/App.css', 'utf8');
  const match = css.match(/\.award-card\s*\{[^}]*\}/);
  expect(match).not.toBeNull();
  expect(match[0]).toMatch(/max-width:\s*300px/);
});
