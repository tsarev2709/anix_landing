import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  HSE_MVP_DISCLAIMER,
  HSE_MVP_SYSTEM_NAME,
  demoCompany,
  demoEmployee,
} from '../data/demoData';

// jsPDF's built-in fonts only cover Latin/WinAnsi glyphs — Cyrillic text
// drawn directly with doc.text() renders as garbage or blank without
// embedding a custom Unicode font. Rendering the certificate as HTML and
// rasterizing it with html2canvas sidesteps that entirely: the browser's
// own font rendering handles Cyrillic correctly, and the result is just
// dropped into the PDF as an image.
export const openCompletionPrint = async (attempt: any) => {
  const date = attempt?.completedAt
    ? new Date(attempt.completedAt).toLocaleDateString('ru-RU')
    : new Date().toLocaleDateString('ru-RU');

  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;left:-9999px;top:0;width:700px;box-sizing:border-box;padding:32px;background:#ffffff;font-family:Arial, sans-serif;color:#172033;border:2px solid #1f4f82;';
  container.innerHTML = `
    <h1 style="margin:0 0 20px;font-size:26px;">Подтверждение прохождения обучающего модуля</h1>
    <dl style="display:grid;grid-template-columns:220px 1fr;gap:10px 18px;margin:0;">
      <dt style="font-weight:700;color:#44546a;">Система</dt><dd style="margin:0;">${HSE_MVP_SYSTEM_NAME}</dd>
      <dt style="font-weight:700;color:#44546a;">Демо-компания</dt><dd style="margin:0;">${demoCompany.name}</dd>
      <dt style="font-weight:700;color:#44546a;">Сотрудник</dt><dd style="margin:0;">${demoEmployee.fullName}</dd>
      <dt style="font-weight:700;color:#44546a;">Модуль</dt><dd style="margin:0;">${attempt?.moduleTitle || ''}</dd>
      <dt style="font-weight:700;color:#44546a;">Версия курса</dt><dd style="margin:0;">${attempt?.version || ''}</dd>
      <dt style="font-weight:700;color:#44546a;">Дата</dt><dd style="margin:0;">${date}</dd>
      <dt style="font-weight:700;color:#44546a;">Результат</dt><dd style="margin:0;">${attempt?.score || 0}% — ${attempt?.passed ? 'модуль пройден' : 'рекомендуется повторить'}</dd>
    </dl>
    <div style="margin-top:28px;padding:18px;background:#f3f6fa;border-left:5px solid #1f4f82;">
      Документ не является удостоверением, протоколом проверки знаний или допуском к работам. Используется как демонстрационное подтверждение прохождения цифрового обучающего модуля. ${HSE_MVP_DISCLAIMER}
    </div>
  `;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(`podtverzhdenie-${attempt?.moduleId || 'module'}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
};
