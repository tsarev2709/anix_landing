const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function write(relativePath, content) {
  fs.writeFileSync(path.join(root, relativePath), content);
}

function replaceOnce(relativePath, marker, search, replacement) {
  let content = read(relativePath);
  if (content.includes(marker)) return;
  if (!content.includes(search)) {
    throw new Error(`Cannot patch ${relativePath}: anchor not found`);
  }
  content = content.replace(search, replacement);
  write(relativePath, content);
}

function appendOnce(relativePath, marker, addition) {
  const content = read(relativePath);
  if (content.includes(marker)) return;
  write(relativePath, `${content.trimEnd()}\n\n${addition.trim()}\n`);
}

const formPath = 'src/components/WebsiteLeadForm.jsx';

replaceOnce(
  formPath,
  "privacyConsent: false",
  "  message: '',\n};",
  "  message: '',\n  privacyConsent: false,\n};"
);

replaceOnce(
  formPath,
  "errors.privacyConsent = 'Подтвердите согласие на обработку данных'",
  "  if (!message) errors.message = 'Расскажите хотя бы немного о задаче';\n  else if (message.length < 10) {\n    errors.message = 'Добавьте пару слов о задаче';\n  }\n\n  return errors;",
  "  if (!message) errors.message = 'Расскажите хотя бы немного о задаче';\n  else if (message.length < 10) {\n    errors.message = 'Добавьте пару слов о задаче';\n  }\n  if (!values.privacyConsent) {\n    errors.privacyConsent = 'Подтвердите согласие на обработку данных';\n  }\n\n  return errors;"
);

replaceOnce(
  formPath,
  "const { name, value, type, checked } = event.target;",
  "    const { name, value } = event.target;\n    setValues((current) => ({ ...current, [name]: value }));",
  "    const { name, value, type, checked } = event.target;\n    setValues((current) => ({\n      ...current,\n      [name]: type === 'checkbox' ? checked : value,\n    }));"
);

replaceOnce(
  formPath,
  "['name', 'email', 'contact', 'message', 'privacyConsent']",
  "      const firstInvalidName = ['name', 'email', 'contact', 'message'].find(\n        (name) => nextErrors[name]\n      );",
  "      const firstInvalidName = [\n        'name',\n        'email',\n        'contact',\n        'message',\n        'privacyConsent',\n      ].find((name) => nextErrors[name]);"
);

replaceOnce(
  formPath,
  "privacy_policy_version: '2026-08-07'",
  "      turnstile_token: turnstileToken,\n      name: values.name.trim(),",
  "      turnstile_token: turnstileToken,\n      privacy_consent: values.privacyConsent,\n      privacy_consent_at: new Date().toISOString(),\n      privacy_policy_version: '2026-08-07',\n      name: values.name.trim(),"
);

replaceOnce(
  formPath,
  "error.code === 'privacy_consent_required'",
  "      if (error.code === 'turnstile_failed') {\n        setServerError('Проверка защиты не прошла. Попробуйте ещё раз.');\n      } else if (error.code === 'delivery_pending') {",
  "      if (error.code === 'privacy_consent_required') {\n        setServerError('Подтвердите согласие на обработку персональных данных.');\n      } else if (error.code === 'turnstile_configuration_error') {\n        setServerError(\n          'Защита формы настроена неверно. Мы уже видим проблему; пока напишите нам в Telegram или на email.'\n        );\n      } else if (error.code === 'turnstile_failed') {\n        setServerError('Проверка защиты не прошла. Попробуйте ещё раз.');\n      } else if (error.code === 'delivery_pending') {"
);

replaceOnce(
  formPath,
  'website-lead__consent',
  "        <div className=\"website-lead__submit-row\">",
  `        <label className="website-lead__consent">
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

        <div className="website-lead__submit-row">`
);

appendOnce(
  'src/components/WebsiteLeadForm.css',
  '.website-lead__consent {',
  `.website-lead__consent {
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 10px 12px !important;
  align-items: start;
  margin-top: 20px;
  color: rgba(17, 17, 17, 0.66) !important;
  font-size: 13px !important;
  font-weight: 650 !important;
  line-height: 1.45;
}
.website-lead__consent input[type='checkbox'] {
  width: 20px;
  height: 20px;
  min-height: 20px;
  margin: 1px 0 0;
  padding: 0;
  border-radius: 5px;
  accent-color: #087d70;
  cursor: pointer;
}
.website-lead__consent > span {
  display: inline !important;
}
.website-lead__consent a {
  color: #075f56;
  text-underline-offset: 2px;
}
.website-lead__consent small {
  grid-column: 2;
}`
);

const functionPath = 'supabase/functions/submit-website-lead/index.ts';

replaceOnce(
  functionPath,
  "type TurnstileResult = { ok: boolean; error: string };",
  "async function verifyTurnstile(\n  token: string,\n  origin: string\n): Promise<boolean> {\n  const secret = env('TURNSTILE_SECRET_KEY');\n  if (!secret || !token) return false;",
  "type TurnstileResult = { ok: boolean; error: string };\n\nasync function verifyTurnstile(\n  token: string,\n  origin: string\n): Promise<TurnstileResult> {\n  const secret = env('TURNSTILE_SECRET_KEY');\n  if (!secret) return { ok: false, error: 'turnstile_configuration_error' };\n  if (!token) return { ok: false, error: 'turnstile_failed' };"
);

replaceOnce(
  functionPath,
  "const errorCodes = Array.isArray(result?.['error-codes'])",
  "  if (!response.ok) return false;\n  const result = await response.json().catch(() => null);\n  if (!result?.success || result.action !== 'website_lead') return false;",
  "  if (!response.ok) {\n    return { ok: false, error: 'turnstile_failed' };\n  }\n  const result = await response.json().catch(() => null);\n  const errorCodes = Array.isArray(result?.['error-codes'])\n    ? result['error-codes'].map(String)\n    : [];\n  if (!result?.success) {\n    console.error(\n      `[website-lead] Turnstile rejected: ${errorCodes.join(',') || 'unknown'}`\n    );\n    return {\n      ok: false,\n      error: errorCodes.includes('invalid-input-secret')\n        ? 'turnstile_configuration_error'\n        : 'turnstile_failed',\n    };\n  }\n  if (result.action !== 'website_lead') {\n    return { ok: false, error: 'turnstile_failed' };\n  }"
);

replaceOnce(
  functionPath,
  "return hostnameMatches\n    ? { ok: true, error: '' }",
  "  return !result.hostname || result.hostname === expectedHostname;\n}",
  "  const hostnameMatches =\n    !result.hostname || result.hostname === expectedHostname;\n  return hostnameMatches\n    ? { ok: true, error: '' }\n    : { ok: false, error: 'turnstile_failed' };\n}"
);

replaceOnce(
  functionPath,
  "privacy_consent_required",
  "  const payload = sanitizePayload(input);\n  if (!validatePayload(payload))",
  "  const privacyConsent = input?.privacy_consent === true;\n  const privacyConsentAt = text(input?.privacy_consent_at, 64);\n  const privacyPolicyVersion = text(input?.privacy_policy_version, 64);\n  if (!privacyConsent || !privacyConsentAt || !privacyPolicyVersion) {\n    return json({ error: 'privacy_consent_required' }, 400, origin);\n  }\n  const consentSnapshot = {\n    privacy_consent: true,\n    privacy_consent_at: privacyConsentAt,\n    privacy_policy_version: privacyPolicyVersion,\n  };\n\n  const payload = sanitizePayload(input);\n  if (!validatePayload(payload))"
);

replaceOnce(
  functionPath,
  "let turnstileResult: TurnstileResult",
  "  let turnstileOk = false;\n  try {\n    turnstileOk = await verifyTurnstile(\n      text(input?.turnstile_token, 3000),\n      origin\n    );\n  } catch {\n    turnstileOk = false;\n  }\n  if (!turnstileOk) return json({ error: 'turnstile_failed' }, 400, origin);",
  "  let turnstileResult: TurnstileResult = {\n    ok: false,\n    error: 'turnstile_failed',\n  };\n  try {\n    turnstileResult = await verifyTurnstile(\n      text(input?.turnstile_token, 3000),\n      origin\n    );\n  } catch {\n    turnstileResult = { ok: false, error: 'turnstile_failed' };\n  }\n  if (!turnstileResult.ok) {\n    return json(\n      { error: turnstileResult.error },\n      turnstileResult.error === 'turnstile_configuration_error' ? 503 : 400,\n      origin\n    );\n  }"
);

replaceOnce(
  functionPath,
  "async function findOrInsertLead(sb: any, payload: any, consentSnapshot: any)",
  "async function findOrInsertLead(sb: any, payload: any): Promise<any> {",
  "async function findOrInsertLead(\n  sb: any,\n  payload: any,\n  consentSnapshot: any\n): Promise<any> {"
);

replaceOnce(
  functionPath,
  "payload: { ...payload, ...consentSnapshot }",
  "      payload,\n    })",
  "      payload: { ...payload, ...consentSnapshot },\n    })"
);

replaceOnce(
  functionPath,
  "findOrInsertLead(sb, payload, consentSnapshot)",
  "    let row = await findOrInsertLead(sb, payload);",
  "    let row = await findOrInsertLead(sb, payload, consentSnapshot);"
);

replaceOnce(
  functionPath,
  "`Согласие на обработку данных: ${row.payload?.privacy_consent ? 'да' : 'нет'}`",
  "    'Сообщение:',\n    row.message,",
  "    'Сообщение:',\n    row.message,\n    '',\n    `Согласие на обработку данных: ${row.payload?.privacy_consent ? 'да' : 'нет'}`,\n    `Дата согласия: ${row.payload?.privacy_consent_at || '—'}`,\n    `Версия политики: ${row.payload?.privacy_policy_version || '—'}`,"
);

replaceOnce(
  'src/__tests__/functions.test.js',
  "privacy_policy_version: '2026-08-07'",
  "    turnstile_token: 'test-token',\n    name: 'Тестовый лид',",
  "    turnstile_token: 'test-token',\n    privacy_consent: true,\n    privacy_consent_at: '2026-08-07T00:00:00.000Z',\n    privacy_policy_version: '2026-08-07',\n    name: 'Тестовый лид',"
);

replaceOnce(
  'src/__tests__/functions.test.js',
  "rejects a lead without privacy consent",
  "  test('rejects an untrusted origin before processing the request', async () => {",
  `  test('rejects a lead without privacy consent', async () => {
    const submitWebsiteLead =
      require('../../supabase/functions/submit-website-lead/index.js').default;
    const req = new Request('https://example.com', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://studio.anix-ai.pro',
      },
      body: JSON.stringify({ ...validBody, privacy_consent: false }),
    });
    const res = await submitWebsiteLead(req);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('privacy_consent_required');
  });

  test('rejects an untrusted origin before processing the request', async () => {`
);

replaceOnce(
  'src/__tests__/websiteLeadForm.test.js',
  "expect(container.textContent).toContain('Подтвердите согласие на обработку данных');",
  "    expect(container.textContent).toContain(\n      'Расскажите хотя бы немного о задаче'\n    );",
  "    expect(container.textContent).toContain(\n      'Расскажите хотя бы немного о задаче'\n    );\n    expect(container.textContent).toContain(\n      'Подтвердите согласие на обработку данных'\n    );"
);

replaceOnce(
  'src/__tests__/websiteLeadForm.test.js',
  "changeCheckbox('privacyConsent', true);",
  "      change('message', 'Нужен объясняющий ролик о сложном продукте.');",
  "      change('message', 'Нужен объясняющий ролик о сложном продукте.');\n      const checkbox = container.querySelector('[name=\"privacyConsent\"]');\n      TestUtils.Simulate.change(checkbox, {\n        target: {\n          name: 'privacyConsent',\n          type: 'checkbox',\n          checked: true,\n          value: 'on',\n        },\n      });"
);

console.log('Website lead consent and Turnstile diagnostics are ensured.');
