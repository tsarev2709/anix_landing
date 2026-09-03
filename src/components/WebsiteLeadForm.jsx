import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  LoaderCircle,
  MessageCircle,
  X,
} from 'lucide-react';
import { CONFIG } from '../config';
import {
  createLeadIdempotencyKey,
  getLeadSessionSnapshot,
} from '../lib/leadSession';
import { loadTurnstile } from '../lib/turnstile';
import { toPublicHref } from '../seo/SeoHead';
import './WebsiteLeadForm.css';

const METRIKA_COUNTER_ID = 103290769;
const initialValues = {
  name: '',
  company: '',
  email: '',
  contact: '',
  message: '',
  privacyConsent: false,
};

const publicFormRoutes = new Set([
  '/',
  '/animation',
  '/ai-video',
  '/medicine',
  '/medicine/price',
  '/hse',
  '/hse/price',
  '/stoimost',
  '/why_it_works',
  '/cases',
  '/ceo',
  '/rybki',
  '/rybki_page',
]);

function normalizedCurrentPath() {
  const base = process.env.PUBLIC_URL || '';
  const relative = window.location.pathname.replace(base, '') || '/';
  if (relative === '/') return '/';
  return relative.replace(/\/+$/, '') || '/';
}

function shouldShowForm() {
  if (typeof window === 'undefined') return false;
  const path = normalizedCurrentPath();
  return publicFormRoutes.has(path) || path.startsWith('/cases/');
}

function inferContact(contact) {
  const value = contact.trim();
  if (!value) return { contact_type: '', phone: '', telegram: '' };
  const looksLikeTelegram =
    value.startsWith('@') ||
    /(?:^|\/)t\.me\//i.test(value) ||
    /^tg:\/\//i.test(value) ||
    /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(value);
  return looksLikeTelegram
    ? { contact_type: 'telegram', phone: '', telegram: value }
    : { contact_type: 'phone', phone: value, telegram: '' };
}

function validate(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const contact = values.contact.trim();
  const message = values.message.trim();

  if (!name) errors.name = 'Укажите имя';
  else if (name.length < 2) errors.name = 'Напишите имя полностью';

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Проверьте формат email';
  }
  if (!email && !contact) {
    errors.contact = 'Оставьте email или другой способ связи';
  }
  if (contact && contact.length < 5) {
    errors.contact = 'Проверьте телефон или Telegram';
  }
  if (!message) errors.message = 'Расскажите хотя бы немного о задаче';
  else if (message.length < 10) {
    errors.message = 'Добавьте пару слов о задаче';
  }
  if (!values.privacyConsent) {
    errors.privacyConsent = 'Подтвердите согласие на обработку данных';
  }

  return errors;
}

function sendMetrikaGoal(goal, params) {
  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    try {
      window.ym(METRIKA_COUNTER_ID, 'reachGoal', goal, params);
    } catch {
      // Analytics is optional and must not affect the lead route.
    }
  }
}

function SuccessDialog({ onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  return (
    <div
      className="website-lead-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="website-lead-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="website-lead-success-title"
        aria-describedby="website-lead-success-description"
      >
        <button
          ref={closeRef}
          className="website-lead-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть сообщение"
        >
          <X aria-hidden="true" />
        </button>
        <span className="website-lead-modal__icon" aria-hidden="true">
          <Check />
        </span>
        <h2 id="website-lead-success-title">Заявка успешно отправлена</h2>
        <p id="website-lead-success-description">
          Наш менеджер свяжется с вами по указанному контакту.
        </p>
        <a
          className="website-lead-modal__cta"
          href={toPublicHref('/why_it_works')}
        >
          Почему подход Anix работает
          <ArrowRight aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}

export default function WebsiteLeadForm() {
  const visible = useMemo(shouldShowForm, []);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState('');
  const idempotencyKeyRef = useRef(createLeadIdempotencyKey());
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetRef = useRef(null);
  const succeeded = status === 'success';

  useEffect(() => {
    if (!visible || succeeded) return undefined;
    if (!CONFIG.TURNSTILE_SITE_KEY) {
      setTurnstileError('Защита формы ещё не настроена');
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
            action: 'website_lead',
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
              setTurnstileError('Не удалось запустить защиту формы');
            },
          }
        );
      })
      .catch(() => setTurnstileError('Не удалось запустить защиту формы'));

    return () => {
      cancelled = true;
      if (turnstileWidgetRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetRef.current);
        } catch {
          // The widget may already have removed itself during navigation.
        }
      }
      turnstileWidgetRef.current = null;
    };
  }, [succeeded, visible]);

  if (!visible) return null;

  const resetTurnstile = () => {
    setTurnstileToken('');
    if (turnstileWidgetRef.current !== null && window.turnstile) {
      try {
        window.turnstile.reset(turnstileWidgetRef.current);
      } catch {
        // A fresh widget will be rendered when the component remounts.
      }
    }
  };

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setServerError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalidName = [
        'name',
        'email',
        'contact',
        'message',
        'privacyConsent',
      ].find((name) => nextErrors[name]);
      event.currentTarget.elements[firstInvalidName]?.focus();
      return;
    }
    if (!turnstileToken) {
      setTurnstileError('Подтвердите, что вы не робот');
      return;
    }

    setStatus('sending');
    setServerError('');
    const session = getLeadSessionSnapshot();
    const inferredContact = inferContact(values.contact);
    const payload = {
      idempotency_key: idempotencyKeyRef.current,
      turnstile_token: turnstileToken,
      privacy_consent: values.privacyConsent,
      privacy_consent_at: new Date().toISOString(),
      privacy_policy_version: '2026-08-07',
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      contact_value: values.contact.trim(),
      ...inferredContact,
      message: values.message.trim(),
      ...session,
    };

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 18000);
    try {
      const response = await fetch(CONFIG.WEBSITE_LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) {
        const error = new Error(result.error || 'submission_failed');
        error.code = result.error;
        throw error;
      }

      setStatus('success');
      setShowDialog(true);
      sendMetrikaGoal('lead_form_success', {
        page_path: session.page_path,
        source: session.source,
        utm_source: session.utm_source,
        utm_campaign: session.utm_campaign,
      });
    } catch (error) {
      setStatus('failed');
      if (error.code === 'privacy_consent_required') {
        setServerError(
          'Подтвердите согласие на обработку персональных данных.'
        );
      } else if (error.code === 'turnstile_configuration_error') {
        setServerError(
          'Защита формы настроена неверно. Мы уже видим проблему; пока напишите нам в Telegram или на email.'
        );
      } else if (error.code === 'turnstile_failed') {
        setServerError('Проверка защиты не прошла. Попробуйте ещё раз.');
      } else if (error.code === 'delivery_pending') {
        setServerError(
          'Заявка сохранена, но пока не дошла до менеджера. Нажмите «Обсудить проект» ещё раз.'
        );
      } else {
        setServerError(
          'Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.'
        );
      }
      sendMetrikaGoal('lead_form_error', {
        page_path: session.page_path,
        source: session.source,
      });
    } finally {
      window.clearTimeout(timeout);
      resetTurnstile();
    }
  };

  if (status === 'success' && !showDialog) {
    return (
      <section
        className="website-lead website-lead--confirmed"
        aria-live="polite"
      >
        <div className="website-lead__confirmation">
          <span aria-hidden="true">
            <Check />
          </span>
          <div>
            <h2>Заявка у нас</h2>
            <p>Свяжемся с вами по указанному контакту.</p>
          </div>
          <a href={toPublicHref('/why_it_works')}>
            Почему подход Anix работает <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </section>
    );
  }

  const fieldError = (name) => (errors[name] ? `${name}-error` : undefined);

  return (
    <section className="website-lead" aria-labelledby="website-lead-title">
      <div className="website-lead__intro">
        <p className="website-lead__eyebrow">Есть задача?</p>
        <h2 id="website-lead-title">Обсудим ваш проект</h2>
        <p>
          Расскажите, что вам нужно объяснить, показать или запустить. Мы изучим
          задачу и свяжемся с вами.
        </p>
        <div className="website-lead__direct">
          <span>Можно сразу написать:</span>
          <a href="https://t.me/anix_helper" target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" /> Telegram
          </a>
          <a href="mailto:studio@anix-ai.pro">studio@anix-ai.pro</a>
        </div>
      </div>

      <form
        className="website-lead__form"
        id="website-lead-form"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="website-lead__grid">
          <label>
            <span>Имя</span>
            <input
              name="name"
              value={values.name}
              onChange={onChange}
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={fieldError('name')}
              placeholder="Как к вам обращаться"
            />
            {errors.name ? <small id="name-error">{errors.name}</small> : null}
          </label>

          <label>
            <span>
              Компания <em>необязательно</em>
            </span>
            <input
              name="company"
              value={values.company}
              onChange={onChange}
              autoComplete="organization"
              maxLength={180}
              placeholder="Где вы работаете"
            />
          </label>

          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
              autoComplete="email"
              maxLength={254}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={fieldError('email')}
              placeholder="name@company.ru"
            />
            {errors.email ? (
              <small id="email-error">{errors.email}</small>
            ) : null}
          </label>

          <label>
            <span>Телефон или Telegram</span>
            <input
              name="contact"
              value={values.contact}
              onChange={onChange}
              autoComplete="tel"
              maxLength={120}
              aria-invalid={Boolean(errors.contact)}
              aria-describedby={fieldError('contact')}
              placeholder="+7 999 000-00-00 или @username"
            />
            {errors.contact ? (
              <small id="contact-error">{errors.contact}</small>
            ) : null}
          </label>
        </div>

        <label className="website-lead__message">
          <span>Что нужно сделать</span>
          <textarea
            name="message"
            value={values.message}
            onChange={onChange}
            rows={5}
            maxLength={4000}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={fieldError('message')}
            placeholder="Задача, продукт, сроки — в свободной форме"
          />
          {errors.message ? (
            <small id="message-error">{errors.message}</small>
          ) : null}
        </label>

        <label className="website-lead__consent">
          <input
            name="privacyConsent"
            type="checkbox"
            checked={values.privacyConsent}
            onChange={onChange}
            aria-invalid={Boolean(errors.privacyConsent)}
            aria-describedby={fieldError('privacyConsent')}
          />
          <span>
            Я ознакомлен с{' '}
            <a href={toPublicHref('/privacy')}>политикой конфиденциальности</a>{' '}
            и даю согласие на{' '}
            <a href={toPublicHref('/personal-data')}>
              обработку персональных данных
            </a>
            .
          </span>
          {errors.privacyConsent ? (
            <small id="privacyConsent-error">{errors.privacyConsent}</small>
          ) : null}
        </label>

        <div className="website-lead__submit-row">
          <div className="website-lead__turnstile-wrap">
            <div
              ref={turnstileContainerRef}
              className="website-lead__turnstile"
            />
            {turnstileError ? (
              <small className="website-lead__turnstile-error" role="status">
                {turnstileError}
              </small>
            ) : null}
          </div>
          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <LoaderCircle
                  className="website-lead__spinner"
                  aria-hidden="true"
                />
                Отправляем…
              </>
            ) : (
              <>
                Обсудить проект <ArrowRight aria-hidden="true" />
              </>
            )}
          </button>
        </div>

        {serverError ? (
          <div className="website-lead__server-error" role="alert">
            <p>{serverError}</p>
            <span>
              <a
                href="https://t.me/anix_helper"
                target="_blank"
                rel="noreferrer"
              >
                Telegram
              </a>
              {' · '}
              <a href="mailto:studio@anix-ai.pro">Email</a>
            </span>
          </div>
        ) : null}
      </form>

      {showDialog ? (
        <SuccessDialog onClose={() => setShowDialog(false)} />
      ) : null}
    </section>
  );
}
