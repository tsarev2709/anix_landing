import React from 'react';
import { createRoot } from 'react-dom/client';
import TestUtils from 'react-dom/test-utils';
import WebsiteLeadForm from '../components/WebsiteLeadForm';
import { loadTurnstile } from '../lib/turnstile';
import { briefFields, formatBriefMessage } from '../lib/leadBrief';

jest.mock('../config', () => ({
  CONFIG: {
    TURNSTILE_SITE_KEY: 'test-site-key',
    WEBSITE_LEAD_URL: 'https://example.test/submit',
  },
}));

jest.mock('../lib/turnstile', () => ({
  loadTurnstile: jest.fn(),
}));

jest.mock('../lib/leadSession', () => ({
  createLeadIdempotencyKey: () => '12345678-1234-4234-9234-123456789abc',
  getLeadSessionSnapshot: () => ({
    session_id: 'session-test',
    page_path: '/',
    page_url: 'https://studio.anix-ai.pro/',
    source: 'direct',
    pages_viewed: [{ path: '/', title: 'Anix', duration_seconds: 4 }],
  }),
}));

describe('WebsiteLeadForm', () => {
  let container;
  let root;

  beforeEach(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    window.history.replaceState({}, '', '/');
    window.turnstile = {
      reset: jest.fn(),
      remove: jest.fn(),
    };
    loadTurnstile.mockResolvedValue({
      render: jest.fn((_container, options) => {
        options.callback('turnstile-test-token');
        return 'widget-test';
      }),
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ok: true, synced: true }),
      })
    );

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    await TestUtils.act(async () => {
      root.render(<WebsiteLeadForm />);
      await Promise.resolve();
    });
  });

  afterEach(() => {
    TestUtils.act(() => root.unmount());
    container.remove();
    delete global.fetch;
    delete window.turnstile;
  });

  test('shows human validation messages and preserves the form', async () => {
    await TestUtils.act(async () => {
      TestUtils.Simulate.submit(container.querySelector('form'));
      await Promise.resolve();
    });

    expect(container.textContent).toContain('Укажите имя');
    expect(container.textContent).toContain(
      'Оставьте email или другой способ связи'
    );
    expect(container.textContent).toContain(
      'Расскажите хотя бы немного о задаче'
    );
    expect(container.textContent).toContain(
      'Подтвердите согласие на обработку данных'
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test.each(['/stoimost/', '/medicine/price/', '/hse/price/', '/procurement/'])(
    'is available on the commercial route %s',
    async (routePath) => {
      TestUtils.act(() => root.unmount());
      window.history.replaceState({}, '', routePath);
      root = createRoot(container);

      await TestUtils.act(async () => {
        root.render(<WebsiteLeadForm />);
        await Promise.resolve();
      });

      expect(container.querySelector('#website-lead-form')).toBeTruthy();
    }
  );

  test('submits once, opens the success dialog and leaves a confirmation', async () => {
    const change = (name, value) => {
      const field = container.querySelector(`[name="${name}"]`);
      TestUtils.Simulate.change(field, { target: { name, value } });
    };

    TestUtils.act(() => {
      change('name', 'Андрей');
      change('email', 'andrey@example.com');
      change('message', 'Нужен объясняющий ролик о сложном продукте.');
      for (const field of briefFields) change(field.name, field.options[0]);
      const checkbox = container.querySelector('[name="privacyConsent"]');
      TestUtils.Simulate.change(checkbox, {
        target: {
          name: 'privacyConsent',
          type: 'checkbox',
          checked: true,
          value: 'on',
        },
      });
    });

    await TestUtils.act(async () => {
      TestUtils.Simulate.submit(container.querySelector('form'));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(payload.privacy_consent).toBe(true);
    expect(payload.turnstile_token).toBe('turnstile-test-token');
    expect(payload.message).toContain(
      'Нужен объясняющий ролик о сложном продукте.'
    );
    for (const field of briefFields)
      expect(payload.message).toContain(`${field.label}: ${field.options[0]}`);
    expect(container.querySelector('[role="dialog"]')).toBeTruthy();
    expect(container.textContent).toContain('Заявка успешно отправлена');
    expect(
      container.querySelector('[role="dialog"] a').getAttribute('href')
    ).toBe('/why_it_works/');

    TestUtils.act(() => {
      TestUtils.Simulate.click(
        container.querySelector('[aria-label="Закрыть сообщение"]')
      );
    });
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(container.textContent).toContain('Заявка у нас');
  });

  test('keeps the longest brief within the backend message limit without losing answers', () => {
    const values = { message: 'А'.repeat(3000) };
    for (const field of briefFields)
      values[field.name] = [...field.options].sort(
        (a, b) => b.length - a.length
      )[0];
    const message = formatBriefMessage(values);
    expect(message.length).toBeLessThanOrEqual(4000);
    expect(message.startsWith('А'.repeat(3000))).toBe(true);
    for (const field of briefFields)
      expect(message).toContain(values[field.name]);
  });

  test.each([
    ['/medicine/price/', 'Фарма / медицинская анимация'],
    ['/hse/', 'Охрана труда / HSE'],
  ])(
    'prefills the direction on %s and allows it to change',
    async (path, expected) => {
      TestUtils.act(() => root.unmount());
      window.history.replaceState({}, '', path);
      root = createRoot(container);
      await TestUtils.act(async () => {
        root.render(<WebsiteLeadForm />);
      });
      const field = container.querySelector('[name="direction"]');
      expect(field.value).toBe(expected);
      TestUtils.act(() =>
        TestUtils.Simulate.change(field, {
          target: { name: 'direction', value: 'MedTech' },
        })
      );
      expect(field.value).toBe('MedTech');
    }
  );
});
