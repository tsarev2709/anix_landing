import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUp,
  LoaderCircle,
  MessageCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { CONFIG } from '../config';
import { getLeadSessionSnapshot } from '../lib/leadSession';
import { loadTurnstile } from '../lib/turnstile';
import { track } from '../lib/analytics';
import { toPublicHref } from '../seo/SeoHead';
import './AiChatWidget.css';

const STORAGE_KEY = 'anix_ai_chat_session_v1';
const START_MESSAGE = {
  role: 'assistant',
  content: 'Что вы хотите объяснить?',
  local: true,
};

const pagePrompts = {
  medicine: {
    intro:
      'Что вы продвигаете: препарат, медицинское устройство или технологию?',
    options: [
      'Препарат для врачей',
      'MedTech или диагностика',
      'Обучение медицинской команды',
    ],
  },
  hse: {
    intro:
      'Что нужно решить: onboarding, критический риск, инструктаж или другую задачу по безопасности?',
    options: [
      'Onboarding сотрудников',
      'Критический риск',
      'Инструктаж или микрообучение',
    ],
  },
  animation: {
    intro: 'Что нужно объяснить с помощью анимации?',
    options: [
      'Сложный продукт',
      'Процесс или технологию',
      'Нужен рекламный ролик',
    ],
  },
  cases: {
    intro: 'Подберём подход к вашей задаче. Что вы хотите показать?',
    options: ['B2B-продукт', 'Медицинскую тему', 'Охрану труда'],
  },
  default: {
    intro: 'Что вы хотите объяснить?',
    options: [
      'Продукт или технологию',
      'Медицинскую тему',
      'Охрану труда',
      'Нужен рекламный ролик',
      'Пока не знаю — помогите разобраться',
    ],
  },
};

function normalizedPath() {
  if (typeof window === 'undefined') return '/';
  const base = process.env.PUBLIC_URL || '';
  const value = window.location.pathname.replace(base, '') || '/';
  return value === '/' ? '/' : value.replace(/\/+$/, '');
}

function widgetVisible() {
  const path = normalizedPath();
  if (
    path.startsWith('/hse/mvp') ||
    path === '/personal-data' ||
    path === '/privacy' ||
    path === '/design1test' ||
    path === '/design_old'
  ) {
    return false;
  }
  return (
    path === '/' ||
    path === '/medicine' ||
    path === '/hse' ||
    path === '/animation' ||
    path === '/ai-video' ||
    path === '/why_it_works' ||
    path === '/cases' ||
    path.startsWith('/cases/') ||
    path === '/ceo'
  );
}

function promptForPath() {
  const path = normalizedPath();
  if (path.startsWith('/medicine') || path.startsWith('/cases/medicine')) {
    return pagePrompts.medicine;
  }
  if (path.startsWith('/hse') || path.startsWith('/cases/hse')) {
    return pagePrompts.hse;
  }
  if (path === '/animation' || path === '/ai-video')
    return pagePrompts.animation;
  if (path.startsWith('/cases')) return pagePrompts.cases;
  return pagePrompts.default;
}

function readStoredSession() {
  try {
    const value = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) || 'null'
    );
    return value?.id && value?.token ? value : null;
  } catch {
    return null;
  }
}

function writeStoredSession(value) {
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The chat still works for the current page when local storage is unavailable.
  }
}

function makeRequestId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex
    .slice(6, 8)
    .join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
}

async function chatRequest(body, timeoutMs = 70_000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(CONFIG.AI_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok !== true) {
      const error = new Error(result.error || 'chat_failed');
      error.code = result.error;
      error.retryAfter = result.retry_after_seconds;
      throw error;
    }
    return result;
  } finally {
    window.clearTimeout(timer);
  }
}

function Message({ item }) {
  return (
    <div
      className={`anix-ai-chat__message anix-ai-chat__message--${item.role}`}
    >
      {item.role === 'assistant' ? (
        <span className="anix-ai-chat__avatar" aria-hidden="true">
          <Sparkles />
        </span>
      ) : null}
      <div>
        {item.content.split('\n').map((line, index) => (
          <React.Fragment key={`${index}-${line.slice(0, 12)}`}>
            {index ? <br /> : null}
            {line}
          </React.Fragment>
        ))}
        {item.fallback ? (
          <span className="anix-ai-chat__fallback-label">
            Сообщение сохранено
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function AiChatWidget() {
  const visible = useMemo(widgetVisible, []);
  const pagePrompt = useMemo(promptForPath, []);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { ...START_MESSAGE, content: pagePrompt.intro },
  ]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [session, setSession] = useState(null);
  const [restoring, setRestoring] = useState(true);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState('');
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetRef = useRef(null);

  useEffect(() => {
    if (!visible) return undefined;
    const stored = readStoredSession();
    if (!stored) {
      setRestoring(false);
      return undefined;
    }
    let cancelled = false;
    chatRequest({
      action: 'resume',
      session_id: stored.id,
      session_token: stored.token,
    })
      .then((result) => {
        if (cancelled) return;
        setSession(stored);
        if (result.messages?.length) setMessages(result.messages);
      })
      .catch(() => writeStoredSession(null))
      .finally(() => {
        if (!cancelled) setRestoring(false);
      });
    return () => {
      cancelled = true;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || !open || session || restoring) return undefined;
    if (!CONFIG.TURNSTILE_SITE_KEY) {
      setTurnstileError('Защита чата пока не настроена');
      return undefined;
    }
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !turnstileContainerRef.current) return;
        turnstileWidgetRef.current = turnstile.render(
          turnstileContainerRef.current,
          {
            sitekey: CONFIG.TURNSTILE_SITE_KEY,
            action: 'ai_chat',
            theme: 'light',
            size: 'flexible',
            appearance: 'interaction-only',
            callback: (token) => {
              setTurnstileToken(token);
              setTurnstileError('');
            },
            'expired-callback': () => {
              setTurnstileToken('');
              setTurnstileError('Проверка истекла. Подтвердите её ещё раз.');
            },
            'error-callback': () => {
              setTurnstileToken('');
              setTurnstileError('Не удалось запустить защиту чата');
            },
          }
        );
      })
      .catch(() => setTurnstileError('Не удалось запустить защиту чата'));
    return () => {
      cancelled = true;
      if (turnstileWidgetRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetRef.current);
        } catch {
          // It may already be removed by Turnstile.
        }
      }
      turnstileWidgetRef.current = null;
    };
  }, [open, restoring, session, visible]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open || !messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, open, sending]);

  if (!visible) return null;

  const resetTurnstile = () => {
    setTurnstileToken('');
    if (turnstileWidgetRef.current !== null && window.turnstile) {
      try {
        window.turnstile.reset(turnstileWidgetRef.current);
      } catch {
        // The widget will be rendered again on the next open.
      }
    }
  };

  const openWidget = () => {
    setOpen(true);
    track('ai_chat_open', { page_path: normalizedPath() });
  };

  const submit = async (value = draft) => {
    const message = value.trim();
    if (!message || sending || restoring) return;
    if (!session && !privacyConsent) {
      setError('Подтвердите согласие на обработку данных.');
      return;
    }
    if (!session && !turnstileToken) {
      setTurnstileError('Подтвердите, что вы не робот');
      return;
    }

    setError('');
    setDraft('');
    setSending(true);
    const requestId = makeRequestId();
    setMessages((current) => [...current, { role: 'user', content: message }]);

    try {
      const result = await chatRequest({
        request_id: requestId,
        message,
        session_id: session?.id,
        session_token: session?.token,
        turnstile_token: session ? undefined : turnstileToken,
        privacy_consent: session ? undefined : privacyConsent,
        privacy_policy_version: '2026-08-07',
        context: getLeadSessionSnapshot(),
      });
      let activeSession = session;
      if (!session && result.session_id && result.session_token) {
        activeSession = { id: result.session_id, token: result.session_token };
        setSession(activeSession);
        writeStoredSession(activeSession);
      }
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: result.reply,
          fallback: Boolean(result.fallback),
        },
      ]);
      track(result.fallback ? 'ai_chat_fallback' : 'ai_chat_message', {
        page_path: normalizedPath(),
        crm_sync: result.crm_sync,
      });
      if (result.crm_sync === 'completed') {
        track('ai_chat_lead', { page_path: normalizedPath() });
      }
    } catch (requestError) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            requestError.code === 'rate_limited'
              ? 'Сообщений слишком много. Подождите немного — разговор сохранён.'
              : 'Не удалось получить ответ. Сообщение можно отправить ещё раз.',
          local: true,
        },
      ]);
      setError(
        requestError.name === 'AbortError'
          ? 'Ответ занимает больше обычного. Попробуйте ещё раз.'
          : 'Соединение прервалось. Попробуйте ещё раз.'
      );
      if (!session) resetTurnstile();
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className={`anix-ai-chat${open ? ' anix-ai-chat--open' : ''}`}>
      {open ? (
        <section
          ref={panelRef}
          className="anix-ai-chat__panel"
          aria-label="AI-консультант Anix"
        >
          <header className="anix-ai-chat__header">
            <span className="anix-ai-chat__mark" aria-hidden="true">
              <Sparkles />
            </span>
            <div>
              <strong>Спросить Anix</strong>
              <span>Консультант по сложным задачам</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть чат"
            >
              <X aria-hidden="true" />
            </button>
          </header>

          <div
            className="anix-ai-chat__messages"
            ref={messagesRef}
            aria-live="polite"
          >
            {messages.map((item, index) => (
              <Message
                item={item}
                key={`${item.role}-${index}-${item.content.slice(0, 16)}`}
              />
            ))}
            {messages.length === 1 ? (
              <div className="anix-ai-chat__quick-list">
                {pagePrompt.options.map((option) => (
                  <button
                    type="button"
                    onClick={() => submit(option)}
                    key={option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
            {messages.some((item) => item.fallback) ? (
              <button
                type="button"
                className="anix-ai-chat__contact-shortcut"
                onClick={() => {
                  setDraft('Мой удобный контакт: ');
                  inputRef.current?.focus();
                }}
              >
                Оставить контакт
              </button>
            ) : null}
            {sending ? (
              <div
                className="anix-ai-chat__typing"
                aria-label="Anix готовит ответ"
              >
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>

          {!session && !restoring ? (
            <div className="anix-ai-chat__verification">
              <label>
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(event) => {
                    setPrivacyConsent(event.target.checked);
                    setError('');
                  }}
                />
                <span>
                  Согласен с{' '}
                  <a href={toPublicHref('/privacy')}>
                    политикой конфиденциальности
                  </a>{' '}
                  и{' '}
                  <a href={toPublicHref('/personal-data')}>обработкой данных</a>
                </span>
              </label>
              <div
                ref={turnstileContainerRef}
                className="anix-ai-chat__turnstile"
              />
              {turnstileError ? <small>{turnstileError}</small> : null}
            </div>
          ) : null}

          <form
            className="anix-ai-chat__composer"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setError('');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  submit();
                }
              }}
              rows={1}
              maxLength={4000}
              placeholder="Опишите задачу"
              aria-label="Сообщение для Anix"
              disabled={sending || restoring}
            />
            <button
              type="submit"
              disabled={sending || restoring || !draft.trim()}
              aria-label="Отправить"
            >
              {sending ? (
                <LoaderCircle className="anix-ai-chat__spinner" />
              ) : (
                <ArrowUp />
              )}
            </button>
          </form>
          {error ? (
            <p className="anix-ai-chat__error" role="alert">
              {error}
            </p>
          ) : null}
          <footer>Ответы основаны на материалах Anix</footer>
        </section>
      ) : null}

      <button
        type="button"
        className="anix-ai-chat__launcher"
        onClick={open ? () => setOpen(false) : openWidget}
        aria-expanded={open}
        aria-label={open ? 'Закрыть AI-консультант Anix' : 'Спросить Anix'}
      >
        {open ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
        <span>{open ? 'Закрыть' : 'Спросить Anix'}</span>
      </button>
    </div>
  );
}
