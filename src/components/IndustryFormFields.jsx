import React from 'react';
import {
  industryForms,
  deadlines,
  scopes,
  budgetOptions,
  detailOptions,
  allowsMonthly,
} from '../lib/industryBrief';

export default function IndustryFormFields({
  variant,
  values,
  errors,
  onChange,
  onDetailsOpen,
}) {
  const config = industryForms[variant];
  const brief = values.brief;
  const error = (name) =>
    errors[name] ? <small id={`${name}-error`}>{errors[name]}</small> : null;
  const select = (name, label, options, required = false) => (
    <label key={name}>
      <span>
        {label}
        {required ? ' *' : ''}
      </span>
      <select
        name={name}
        value={brief[name]}
        onChange={onChange}
        required={required}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      >
        {name !== 'budget_basis' && (
          <option value="">
            {required ? 'Выберите вариант' : 'Пока не определились'}
          </option>
        )}
        {options.map(([id, text]) => (
          <option key={id} value={id}>
            {text}
          </option>
        ))}
      </select>
      {error(name)}
    </label>
  );
  return (
    <div className="industry-form-fields">
      {brief.scope_id === 'annual_program' && (
        <p role="status">
          Выбрана годовая программа: от 1 млн ₽ в месяц на 12 месяцев. Изменить
          объём можно в дополнительных вопросах.
        </p>
      )}
      <div className="website-lead__grid">
        {select('task_id', 'Какую задачу решаем?', config.tasks, true)}
        {select('context_id', config.contextLabel, config.contexts, true)}
        <label>
          <span>Компания / организация *</span>
          <input
            name="company"
            value={values.company}
            onChange={onChange}
            maxLength={180}
            autoComplete="organization"
            placeholder="Название компании или проекта"
            required
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? 'company-error' : undefined}
          />
          {error('company')}
        </label>
        <label>
          <span>Как к вам обращаться? *</span>
          <input
            name="name"
            value={values.name}
            onChange={onChange}
            maxLength={120}
            autoComplete="name"
            placeholder="Ваше имя"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {error('name')}
        </label>
      </div>
      <fieldset className="industry-contact">
        <legend>Как удобнее связаться?</legend>
        <div className="industry-contact__options">
          {[
            ['email', 'Email'],
            ['phone', 'Телефон'],
            ['telegram', 'Telegram'],
          ].map(([id, label]) => (
            <label key={id}>
              <input
                type="radio"
                name="contactMethod"
                value={id}
                checked={values.contactMethod === id}
                onChange={onChange}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        <span>
          {values.contactMethod === 'email'
            ? 'Email'
            : values.contactMethod === 'phone'
              ? 'Телефон'
              : 'Telegram'}{' '}
          *
        </span>
        <input
          name={values.contactMethod === 'email' ? 'email' : 'contact'}
          type={
            values.contactMethod === 'email'
              ? 'email'
              : values.contactMethod === 'phone'
                ? 'tel'
                : 'text'
          }
          value={
            values.contactMethod === 'email' ? values.email : values.contact
          }
          onChange={onChange}
          autoComplete={
            values.contactMethod === 'email'
              ? 'email'
              : values.contactMethod === 'phone'
                ? 'tel'
                : 'off'
          }
          maxLength={values.contactMethod === 'email' ? 254 : 120}
          placeholder={
            values.contactMethod === 'email'
              ? 'name@company.ru'
              : values.contactMethod === 'phone'
                ? '+7 999 000-00-00'
                : '@username'
          }
          required
          aria-invalid={!!(errors.email || errors.contact)}
          aria-describedby={
            errors.email
              ? 'email-error'
              : errors.contact
                ? 'contact-error'
                : undefined
          }
        />
        {error('email')}
        {error('contact')}
      </label>
      {brief.task_id === 'other' && (
        <label>
          <span>Коротко опишите задачу *</span>
          <textarea
            name="comment"
            value={brief.comment}
            onChange={onChange}
            maxLength={1000}
            rows={3}
            required
            aria-invalid={!!errors.comment}
            aria-describedby={errors.comment ? 'comment-error' : undefined}
          />
          {error('comment')}
        </label>
      )}
      <details
        className="industry-form-details"
        onToggle={(event) => {
          if (event.currentTarget.open) onDetailsOpen();
        }}
      >
        <summary>Уточнить задачу — необязательно</summary>
        <div className="website-lead__grid">
          {select('scope_id', 'Какой объём рассматриваете?', scopes)}
          {select('deadline_id', 'Когда нужен результат?', deadlines)}
          {brief.scope_id !== 'annual_program' &&
            allowsMonthly(variant, brief) &&
            select('budget_basis', 'Бюджет на…', [
              ['project', 'Разовое обновление'],
              ['monthly', 'Месяц сопровождения'],
            ])}
          {select(
            'budget_id',
            brief.budget_basis === 'monthly'
              ? 'Бюджет в месяц'
              : 'Бюджет проекта',
            budgetOptions(variant, brief)
          )}
          {select(
            'placement_id',
            'Где будет использоваться материал?',
            config.placements
          )}
          {variant === 'tourism' ? (
            <label>
              <span>{config.detailLabel}</span>
              <input
                name="detail"
                value={brief.detail}
                onChange={onChange}
                maxLength={180}
              />
              {error('detail')}
            </label>
          ) : (
            select('detail', config.detailLabel, detailOptions(variant, brief))
          )}
        </div>
        {brief.deadline_id === 'week' && (
          <p>
            Недельный срок уточним по объёму, готовности материалов и
            согласованию.
          </p>
        )}
        {brief.scope_id === 'annual_program' && (
          <p>
            От 1 млн ₽ в месяц на 12 месяцев. Состав работ и календарь согласуем
            заранее; объём не безлимитный.
          </p>
        )}
        {brief.task_id !== 'other' && (
          <label>
            <span>Что ещё важно учесть?</span>
            <textarea
              name="comment"
              value={brief.comment}
              onChange={onChange}
              maxLength={1000}
              rows={3}
            />
            {error('comment')}
          </label>
        )}
      </details>
    </div>
  );
}
