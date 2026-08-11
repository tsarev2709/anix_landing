import { getRuleBasedRecommendations } from './recommendations';

const getLlmEndpoint = () =>
  process.env.VITE_LLM_ENDPOINT || process.env.REACT_APP_LLM_ENDPOINT || '';

export const generateAiRecommendation = async (rows: any[]) => {
  const endpoint = getLlmEndpoint();
  const localText = getRuleBasedRecommendations(rows)
    .map((item) => `${item.riskTag}: ${item.text}`)
    .join('\n');

  if (!endpoint) {
    return {
      mode: 'local-rule-based',
      text: `AI-рекомендация сформирована локально на основе результатов прохождения, частых ошибок и правил курса.\n${localText}`,
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'ANIX HSE MVP',
        anonymizedRows: rows.map(({ name, ...row }) => row),
      }),
    });
    if (!response.ok) throw new Error('LLM endpoint error');
    const data = await response.json();
    return {
      mode: 'backend-llm-endpoint',
      text: data.recommendation || localText,
    };
  } catch (_error) {
    return {
      mode: 'fallback-rule-based',
      text: `Backend LLM endpoint недоступен, использованы локальные правила.\n${localText}`,
    };
  }
};
