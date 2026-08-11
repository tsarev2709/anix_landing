export const buildRiskSummary = (rows: any[]) => {
  const summary: Record<string, number> = {};
  rows.forEach((row) => {
    const key = row.riskTag || 'общие правила';
    summary[key] =
      (summary[key] || 0) + (row.status === 'Рекомендуется повторить' ? 2 : 1);
  });
  return summary;
};

export const getRuleBasedRecommendations = (rows: any[]) => {
  const lowCompletion = rows.filter((row) => row.progress < 100).length;
  const hasSlipErrors = rows.some((row) => row.riskTag?.includes('скольз'));
  const hasElectricalErrors = rows.some((row) =>
    row.riskTag?.includes('электро')
  );
  const recommendations = [];

  if (hasSlipErrors) {
    recommendations.push({
      severity: 'Средняя',
      riskTag: 'скользкие поверхности',
      text: 'Провести повторное микрообучение по уборке проливов, обозначению опасной зоны и использованию нескользящей обуви.',
    });
  }

  if (hasElectricalErrors) {
    recommendations.push({
      severity: 'Высокая',
      riskTag: 'электробезопасность',
      text: 'Повторить порядок обесточивания, запрет работы с поврежденными кабелями и правила сообщения ответственному лицу.',
    });
  }

  if (lowCompletion >= 2) {
    recommendations.push({
      severity: 'Средняя',
      riskTag: 'прохождение',
      text: 'Назначить повторное уведомление сотрудникам, не завершившим модуль.',
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      severity: 'Низкая',
      riskTag: 'профилактика',
      text: 'Сохранить еженедельные микронапоминания и обновлять визуальные карточки при изменении производственных рисков.',
    });
  }

  return recommendations;
};
