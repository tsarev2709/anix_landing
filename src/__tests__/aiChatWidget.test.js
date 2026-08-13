import React from 'react';
import { createRoot } from 'react-dom/client';
import TestUtils from 'react-dom/test-utils';
import AiChatWidget from '../components/AiChatWidget';
import { loadTurnstile } from '../lib/turnstile';

jest.mock('../config', () => ({
  CONFIG: {
    AI_CHAT_URL: 'https://example.test/ai-chat',
    TURNSTILE_SITE_KEY: 'test-site-key',
  },
}));

jest.mock('../lib/turnstile', () => ({ loadTurnstile: jest.fn() }));
jest.mock('../lib/analytics', () => ({ track: jest.fn() }));
jest.mock('../lib/leadSession', () => ({
  getLeadSessionSnapshot: () => ({
    session_id: 'lead-session-test',
    page_path: '/medicine',
    page_url: 'https://studio.anix-ai.pro/medicine/',
    pages_viewed: [
      { path: '/medicine', title: 'Medicine', duration_seconds: 5 },
    ],
  }),
}));

describe('AiChatWidget', () => {
  let container;
  let root;

  beforeEach(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    window.localStorage.clear();
    window.history.replaceState({}, '', '/medicine/');
    window.turnstile = { reset: jest.fn(), remove: jest.fn() };
    loadTurnstile.mockResolvedValue({
      render: jest.fn((_element, options) => {
        options.callback('turnstile-ai-token');
        return 'ai-widget';
      }),
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            ok: true,
            session_id: '12345678-1234-4234-9234-123456789abc',
            session_token: 'session-secret',
            message_id: '12345678-1234-4234-9234-123456789abe',
            reply: 'Покажем клинический workflow без перегруза.',
            fallback: false,
            crm_sync: 'not_requested',
            sources: [
              {
                kind: 'case_page',
                label: 'Открыть кейс',
                title: 'Hemotech AI',
                url: 'https://studio.anix-ai.pro/cases/hemotech-ai/',
              },
            ],
            case_cards: [
              {
                id: 'case-hemotech',
                slug: 'hemotech-ai',
                name: 'Hemotech AI',
                summary: 'Спокойно объяснили сложный медицинский AI-продукт.',
                result: 'Ролик стал частью визуального языка бренда.',
                links: [
                  {
                    kind: 'case_page',
                    label: 'Открыть кейс',
                    url: 'https://studio.anix-ai.pro/cases/hemotech-ai/',
                  },
                ],
              },
            ],
            suggestions: ['Как сохранить научную точность?'],
          }),
      })
    );
    Object.defineProperty(global, 'crypto', {
      configurable: true,
      value: {
        randomUUID: () => '12345678-1234-4234-9234-123456789abd',
        getRandomValues: (array) => array.fill(7),
      },
    });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    await TestUtils.act(async () => {
      root.render(<AiChatWidget />);
      await Promise.resolve();
    });
  });

  afterEach(() => {
    if (root) TestUtils.act(() => root.unmount());
    container?.remove();
    delete global.fetch;
    delete window.turnstile;
  });

  test('uses the page-specific opening and creates a protected session', async () => {
    await TestUtils.act(async () => {
      TestUtils.Simulate.click(
        container.querySelector('.anix-ai-chat__launcher')
      );
      await Promise.resolve();
    });
    expect(container.textContent).toContain(
      'Вы изучаете направление Pharma и MedTech'
    );

    const consent = container.querySelector(
      '.anix-ai-chat__verification input'
    );
    TestUtils.act(() => {
      TestUtils.Simulate.change(consent, { target: { checked: true } });
      const textarea = container.querySelector('textarea');
      TestUtils.Simulate.change(textarea, {
        target: { value: 'Нужно объяснить медицинскую технологию врачам.' },
      });
    });

    await TestUtils.act(async () => {
      TestUtils.Simulate.submit(container.querySelector('form'));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(payload.turnstile_token).toBe('turnstile-ai-token');
    expect(payload.privacy_consent).toBe(true);
    expect(payload.context.page_path).toBe('/medicine');
    expect(payload.context.page_context.vertical).toBe('medicine');
    expect(payload.context.page_context.kind).toBe('service');
    expect(container.textContent).toContain('Покажем клинический workflow');
    expect(container.textContent).toContain('Hemotech AI');
    expect(container.querySelector('.anix-ai-chat__case-links a').href).toBe(
      'https://studio.anix-ai.pro/cases/hemotech-ai/'
    );
    expect(container.textContent).toContain('Как сохранить научную точность?');
    expect(
      JSON.parse(window.localStorage.getItem('anix_ai_chat_session_v1'))
    ).toEqual({
      id: '12345678-1234-4234-9234-123456789abc',
      token: 'session-secret',
    });
  });

  test('shows the offline handoff as a normal saved response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          ok: true,
          session_id: '12345678-1234-4234-9234-123456789abc',
          session_token: 'session-secret',
          reply: 'Сейчас AI-консультант временно недоступен. Оставьте контакт.',
          fallback: true,
        }),
    });
    await TestUtils.act(async () => {
      TestUtils.Simulate.click(
        container.querySelector('.anix-ai-chat__launcher')
      );
      await Promise.resolve();
    });
    TestUtils.act(() => {
      TestUtils.Simulate.change(
        container.querySelector('.anix-ai-chat__verification input'),
        { target: { checked: true } }
      );
      TestUtils.Simulate.change(container.querySelector('textarea'), {
        target: { value: 'Нужен HSE-ролик.' },
      });
    });
    await TestUtils.act(async () => {
      TestUtils.Simulate.submit(container.querySelector('form'));
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(container.textContent).toContain('Сообщение сохранено');
    expect(container.textContent).toContain('Оставить контакт');
  });

  test('stores feedback for a concrete assistant message', async () => {
    await TestUtils.act(async () => {
      TestUtils.Simulate.click(
        container.querySelector('.anix-ai-chat__launcher')
      );
      await Promise.resolve();
    });
    TestUtils.act(() => {
      TestUtils.Simulate.change(
        container.querySelector('.anix-ai-chat__verification input'),
        { target: { checked: true } }
      );
      TestUtils.Simulate.change(container.querySelector('textarea'), {
        target: { value: 'Покажите фармкейс.' },
      });
    });
    await TestUtils.act(async () => {
      TestUtils.Simulate.submit(
        container.querySelector('.anix-ai-chat__composer')
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    await TestUtils.act(async () => {
      TestUtils.Simulate.click(
        container.querySelector('button[aria-label="Ответ полезен"]')
      );
      await Promise.resolve();
    });

    const payload = JSON.parse(global.fetch.mock.calls[1][1].body);
    expect(payload.action).toBe('feedback');
    expect(payload.message_id).toBe('12345678-1234-4234-9234-123456789abe');
    expect(payload.rating).toBe('positive');
  });

  test('lets a visitor review and hand off a structured brief', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          ok: true,
          session_id: '12345678-1234-4234-9234-123456789abc',
          session_token: 'session-secret',
          message_id: '12345678-1234-4234-9234-123456789abe',
          reply: 'Для задачи подойдут объясняющий ролик и серия карточек.',
          handoff: {
            show: true,
            title: 'Передать бриф команде',
            summary: 'Нужно объяснить медицинскую технологию врачам.',
            qualification: { industry: 'medicine', audience: 'врачи' },
          },
        }),
    });
    await TestUtils.act(async () => {
      TestUtils.Simulate.click(
        container.querySelector('.anix-ai-chat__launcher')
      );
      await Promise.resolve();
    });
    TestUtils.act(() => {
      TestUtils.Simulate.change(
        container.querySelector('.anix-ai-chat__verification input'),
        { target: { checked: true } }
      );
      TestUtils.Simulate.change(container.querySelector('textarea'), {
        target: { value: 'Нам нужен ролик для врачей.' },
      });
    });
    await TestUtils.act(async () => {
      TestUtils.Simulate.submit(
        container.querySelector('.anix-ai-chat__composer')
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    TestUtils.act(() => {
      TestUtils.Simulate.click(
        container.querySelector('.anix-ai-chat__handoff-button')
      );
    });
    const contactInput = container.querySelector('input[placeholder^="+7"]');
    TestUtils.act(() => {
      TestUtils.Simulate.change(contactInput, {
        target: { value: '@project_owner' },
      });
    });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          ok: true,
          message_id: '12345678-1234-4234-9234-123456789abf',
          reply: 'Бриф передан команде Anix.',
          crm_sync: 'completed',
        }),
    });
    await TestUtils.act(async () => {
      TestUtils.Simulate.submit(
        container.querySelector('.anix-ai-chat__brief')
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const payload = JSON.parse(global.fetch.mock.calls[1][1].body);
    expect(payload.action).toBe('handoff');
    expect(payload.contact).toBe('@project_owner');
    expect(payload.task_summary).toContain('медицинскую технологию');
    expect(container.textContent).toContain('Бриф передан команде Anix');
  });
});
