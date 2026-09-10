import {
  industryForms,
  emptyIndustryAnswers,
  validateIndustry,
  updateIndustryAnswer,
  industrySummary,
  resolveIndustry,
} from '../lib/industryBrief';

test.each(Object.keys(industryForms))(
  'validates the minimal %s brief and preserves its readable answers',
  (variant) => {
    const config = industryForms[variant];
    const brief = {
      ...emptyIndustryAnswers,
      task_id: config.tasks[0][0],
      context_id: config.contexts[0][0],
    };
    expect(validateIndustry(variant, brief)).toEqual({});
    expect(industrySummary(variant, brief)).toContain(config.tasks[0][1]);
    expect(industrySummary(variant, brief)).toContain(config.contexts[0][1]);
    expect(
      validateIndustry(variant, { ...brief, task_id: 'injected' })
    ).toHaveProperty('task_id');
    expect(
      validateIndustry(variant, { ...brief, qualification_status: 'qualified' })
    ).toHaveProperty('task_id');
  }
);
test.each(['__proto__', 'constructor', 'unknown'])(
  'rejects unknown variant %s without throwing',
  (variant) => {
    expect(validateIndustry(variant, emptyIndustryAnswers)).toHaveProperty(
      'task_id'
    );
    expect(industrySummary(variant, emptyIndustryAnswers)).toBe('');
  }
);
test('resets incompatible budget and detail when the task or scope changes', () => {
  const annual = updateIndustryAnswer(
    'pharma',
    { ...emptyIndustryAnswers, budget_id: 'pharma_400_700' },
    'scope_id',
    'annual_program'
  );
  expect(annual.budget_basis).toBe('monthly');
  expect(annual.budget_id).toBe('');
  const project = updateIndustryAnswer(
    'pharma',
    { ...annual, budget_id: 'annual_1000_2000' },
    'scope_id',
    'pilot'
  );
  expect(project.budget_basis).toBe('project');
  expect(project.budget_id).toBe('');
  expect(
    updateIndustryAnswer(
      'hse',
      { ...emptyIndustryAnswers, detail: 'old' },
      'task_id',
      'production_training'
    ).detail
  ).toBe('');
});
test('routes pricing pages to their sector without treating unrelated paths as sectors', () => {
  expect(resolveIndustry('/medicine/price/')).toBe('pharma');
  expect(resolveIndustry('/hse/price/')).toBe('hse');
  expect(resolveIndustry('/cases/hse/')).toBe('');
});
