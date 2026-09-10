import industryForms from '../content/industryForms.json';

export { industryForms };
export const isIndustry = (variant) =>
  Object.prototype.hasOwnProperty.call(industryForms, variant);
export const INDUSTRY_VERSION = 'industry-v1';
export const industryRoutes = {
  '/medicine': 'pharma',
  '/medicine/price': 'pharma',
  '/hse': 'hse',
  '/hse/price': 'hse',
  '/ships-and-ports': 'maritime',
  '/hospitality': 'hospitality',
  '/tourism': 'tourism',
  '/education': 'education',
};
export function resolveIndustry(path = '') {
  return industryRoutes[path.replace(/\/+$/, '')] || '';
}
export const deadlines = [
  ['week', 'В течение недели'],
  ['two_four_weeks', 'Через 2–4 недели'],
  ['one_two_months', 'Через 1–2 месяца'],
  ['later', 'Позже'],
  ['unknown', 'Пока не определились'],
];
export const scopes = [
  ['pilot', 'Один сценарий'],
  ['master_adaptations', 'Основной ролик и адаптации'],
  ['series', 'Серия / учебный модуль'],
  ['library_updates', 'Библиотека и обновления'],
  ['annual_program', 'Годовая программа · от 1 млн ₽ в месяц'],
  ['unknown', 'Подберите формат'],
];
export const emptyIndustryAnswers = {
  task_id: '',
  context_id: '',
  placement_id: '',
  deadline_id: '',
  scope_id: '',
  budget_id: '',
  budget_basis: 'project',
  detail: '',
  comment: '',
};
export function allowsMonthly(variant, answers) {
  return (
    answers.scope_id === 'annual_program' ||
    (variant === 'hse' &&
      (answers.task_id === 'update_library' ||
        answers.scope_id === 'library_updates'))
  );
}
export function budgetOptions(variant, answers) {
  if (answers.scope_id === 'annual_program')
    return [
      ['annual_lt1000', 'До 1 млн ₽ в месяц'],
      ['annual_1000_2000', '1–2 млн ₽ в месяц'],
      ['annual_ge2000', 'От 2 млн ₽ в месяц'],
      ['unknown', 'Бюджет ещё не определён'],
    ];
  if (allowsMonthly(variant, answers) && answers.budget_basis === 'monthly')
    return [
      ['hse_monthly_lt150', 'До 150 тыс. ₽ в месяц'],
      ['hse_monthly_150_300', '150–300 тыс. ₽ в месяц'],
      ['hse_monthly_ge300', 'От 300 тыс. ₽ в месяц'],
      ['unknown', 'Бюджет ещё не определён'],
    ];
  if (variant === 'pharma')
    return [
      ['pharma_lt400', 'До 400 тыс. ₽'],
      ['pharma_400_700', '400–700 тыс. ₽'],
      ['pharma_700_1500', '700 тыс. – 1,5 млн ₽'],
      ['pharma_ge1500', 'От 1,5 млн ₽'],
      ['unknown', 'Бюджет ещё не определён'],
    ];
  if (variant === 'hse')
    return [
      ['hse_lt350', 'До 350 тыс. ₽'],
      ['hse_350_900', '350–900 тыс. ₽'],
      ['hse_900_1500', '900 тыс. – 1,5 млн ₽'],
      ['hse_ge1500', 'От 1,5 млн ₽'],
      ['unknown', 'Бюджет ещё не определён'],
    ];
  return [
    ['project_lt400', 'До 400 тыс. ₽'],
    ['project_400_800', '400–800 тыс. ₽'],
    ['project_800_2000', '800 тыс. – 2 млн ₽'],
    ['project_ge2000', 'От 2 млн ₽'],
    ['unknown', 'Бюджет ещё не определён'],
  ];
}
export function detailOptions(variant, answers) {
  const config = isIndustry(variant) ? industryForms[variant] : null;
  if (!config) return [];
  if (variant === 'hse' && answers.task_id === 'production_training')
    return config.trainingDetails;
  return config.details;
}
const hasOption = (options, value) => options.some(([id]) => id === value);
const labelFor = (options, value) =>
  options.find(([id]) => id === value)?.[1] || 'Не указано';
export function updateIndustryAnswer(variant, previous, name, value) {
  const next = { ...previous, [name]: value };
  if (name === 'task_id') next.detail = '';
  if (name === 'scope_id' || name === 'task_id' || name === 'budget_basis') {
    if (next.scope_id === 'annual_program') next.budget_basis = 'monthly';
    else if (
      !allowsMonthly(variant, next) ||
      previous.scope_id === 'annual_program'
    )
      next.budget_basis = 'project';
    if (!hasOption(budgetOptions(variant, next), next.budget_id))
      next.budget_id = '';
  }
  return next;
}
export function validateIndustry(variant, answers) {
  const config = isIndustry(variant) ? industryForms[variant] : null;
  if (
    !config ||
    !answers ||
    typeof answers !== 'object' ||
    Array.isArray(answers)
  )
    return { task_id: 'Неизвестный вариант формы' };
  const errors = {};
  const allowed = Object.keys(emptyIndustryAnswers);
  if (Object.keys(answers).some((key) => !allowed.includes(key)))
    errors.task_id = 'Неизвестное поле брифа';
  for (const [field, options, required] of [
    ['task_id', config.tasks, true],
    ['context_id', config.contexts, true],
    ['placement_id', config.placements, false],
    ['deadline_id', deadlines, false],
    ['scope_id', scopes, false],
    ['budget_id', budgetOptions(variant, answers), false],
  ]) {
    const value = answers[field];
    if (required && !value) errors[field] = 'Выберите вариант';
    else if (value && !hasOption(options, value))
      errors[field] = 'Выберите вариант из списка';
  }
  if (!['project', 'monthly'].includes(answers.budget_basis))
    errors.budget_basis = 'Укажите период бюджета';
  if (answers.budget_basis === 'monthly' && !allowsMonthly(variant, answers))
    errors.budget_basis = 'Для этой задачи нужен бюджет проекта';
  if (
    answers.scope_id === 'annual_program' &&
    answers.budget_basis !== 'monthly'
  )
    errors.budget_basis = 'Годовая программа рассчитывается по месяцам';
  if (typeof answers.comment !== 'string' || answers.comment.length > 1000)
    errors.comment = 'Не более 1000 символов';
  if (
    answers.task_id === 'other' &&
    String(answers.comment || '').trim().length < 10
  )
    errors.comment = 'Опишите задачу в нескольких словах';
  if (typeof answers.detail !== 'string' || answers.detail.length > 180)
    errors.detail = 'Не более 180 символов';
  else if (
    answers.detail &&
    variant !== 'tourism' &&
    !hasOption(detailOptions(variant, answers), answers.detail)
  )
    errors.detail = 'Выберите вариант из списка';
  return errors;
}
export function industrySummary(variant, answers) {
  const config = isIndustry(variant) ? industryForms[variant] : null;
  if (!config) return '';
  return [
    `Направление: ${config.label}`,
    `Задача: ${labelFor(config.tasks, answers.task_id)}`,
    `${config.contextLabel}: ${labelFor(config.contexts, answers.context_id)}`,
    `Размещение: ${labelFor(config.placements, answers.placement_id)}`,
    `Срок: ${labelFor(deadlines, answers.deadline_id)}`,
    `Объём: ${labelFor(scopes, answers.scope_id)}`,
    `Бюджет: ${labelFor(budgetOptions(variant, answers), answers.budget_id)} (${answers.budget_basis === 'monthly' ? 'в месяц' : 'за проект'})`,
    `${config.detailLabel}: ${variant === 'tourism' ? answers.detail || 'Не указано' : labelFor(detailOptions(variant, answers), answers.detail)}`,
    answers.comment ? `Комментарий: ${answers.comment.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 4000);
}
