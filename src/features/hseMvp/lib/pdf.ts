import {
  HSE_MVP_DISCLAIMER,
  HSE_MVP_SYSTEM_NAME,
  demoCompany,
  demoEmployee,
} from '../data/demoData';

export const openCompletionPrint = (attempt: any) => {
  // `noopener` makes window.open() return null in most browsers (it
  // deliberately severs the reference), which silently broke this: the
  // popup opened blank and nothing was ever written into it.
  const printWindow = window.open(
    '',
    '_blank',
    'noreferrer,width=900,height=720'
  );
  if (!printWindow) return;
  const date = attempt?.completedAt
    ? new Date(attempt.completedAt).toLocaleDateString('ru-RU')
    : new Date().toLocaleDateString('ru-RU');
  printWindow.document.write(`
    <!doctype html>
    <html lang="ru">
      <head>
        <meta charset="utf-8" />
        <title>Подтверждение прохождения обучающего модуля</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #172033; }
          .doc { border: 2px solid #1f4f82; padding: 32px; }
          h1 { margin: 0 0 20px; font-size: 26px; }
          dl { display: grid; grid-template-columns: 220px 1fr; gap: 10px 18px; }
          dt { font-weight: 700; color: #44546a; }
          dd { margin: 0; }
          .disc { margin-top: 28px; padding: 18px; background: #f3f6fa; border-left: 5px solid #1f4f82; }
          @media print { button { display: none; } body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="doc">
          <h1>Подтверждение прохождения обучающего модуля</h1>
          <dl>
            <dt>Система</dt><dd>${HSE_MVP_SYSTEM_NAME}</dd>
            <dt>Демо-компания</dt><dd>${demoCompany.name}</dd>
            <dt>Сотрудник</dt><dd>${demoEmployee.fullName}</dd>
            <dt>Модуль</dt><dd>${attempt?.moduleTitle || ''}</dd>
            <dt>Версия курса</dt><dd>${attempt?.version || ''}</dd>
            <dt>Дата</dt><dd>${date}</dd>
            <dt>Результат</dt><dd>${attempt?.score || 0}% — ${attempt?.passed ? 'модуль пройден' : 'рекомендуется повторить'}</dd>
          </dl>
          <div class="disc">Документ не является удостоверением, протоколом проверки знаний или допуском к работам. Используется как демонстрационное подтверждение прохождения цифрового обучающего модуля. ${HSE_MVP_DISCLAIMER}</div>
        </div>
        <p><button onclick="window.print()">Сохранить как PDF / печать</button></p>
        <script>setTimeout(function(){ window.print(); }, 300);</script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
