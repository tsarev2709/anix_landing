import {
  normalizeAiChatPath,
  resolveAiChatPageContext,
} from '../lib/aiChatPageContext';

describe('AI chat page context', () => {
  test('normalizes static route variants', () => {
    expect(normalizeAiChatPath('/medicine/')).toBe('/medicine');
    expect(normalizeAiChatPath('/cases/mosfarma/?utm_source=test')).toBe(
      '/cases/mosfarma'
    );
    expect(normalizeAiChatPath('/')).toBe('/');
  });

  test('recognizes a concrete public case page', () => {
    const context = resolveAiChatPageContext({
      pathname: '/cases/mosfarma/',
      title: 'Кейс Мосфарма',
    });
    expect(context.kind).toBe('case');
    expect(context.vertical).toBe('medicine');
    expect(context.caseSlug).toBe('mosfarma');
    expect(context.caseName).toBe('Мосфарма');
    expect(context.intro).toContain('Вы смотрите кейс «Мосфарма»');
    expect(context.options).toContain('Какой результат у кейса «Мосфарма»?');
  });

  test('uses useful service-specific questions', () => {
    const medicine = resolveAiChatPageContext({ pathname: '/medicine/' });
    const hse = resolveAiChatPageContext({ pathname: '/hse/' });
    const cases = resolveAiChatPageContext({ pathname: '/cases/' });
    expect(medicine.vertical).toBe('medicine');
    expect(medicine.options.join(' ')).toMatch(/фармкейсы|механизм действия/);
    expect(hse.vertical).toBe('hse');
    expect(hse.options.join(' ')).toMatch(/маскот|инструктаж/);
    expect(cases.kind).toBe('catalog');
    expect(cases.options.join(' ')).toMatch(/измеримым результатом/);
  });

  test('keeps pricing pages inside their commercial context', () => {
    const medicinePrice = resolveAiChatPageContext({
      pathname: '/medicine/price/',
    });
    const hsePrice = resolveAiChatPageContext({ pathname: '/hse/price/' });
    const pricingHub = resolveAiChatPageContext({ pathname: '/stoimost/' });

    expect(medicinePrice.vertical).toBe('medicine');
    expect(hsePrice.vertical).toBe('hse');
    expect(pricingHub.kind).toBe('pricing');
    expect(pricingHub.options.join(' ')).toMatch(/сметы|закупок/);
  });
});
