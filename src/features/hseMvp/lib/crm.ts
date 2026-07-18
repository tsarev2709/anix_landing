import { saveCourseRequest } from './storage';

const getCrmWebhookUrl = () =>
  process.env.VITE_CRM_WEBHOOK_URL ||
  process.env.REACT_APP_CRM_WEBHOOK_URL ||
  '';

export const getCrmMode = () => {
  const webhookUrl = getCrmWebhookUrl();
  return {
    crmWebhookConfigured: Boolean(webhookUrl),
    webhookUrl,
  };
};

export const getSupportTelegramHandle = () =>
  process.env.VITE_SUPPORT_TELEGRAM ||
  process.env.REACT_APP_SUPPORT_TELEGRAM ||
  'anix_helper';
export const buildCourseRequestPayload = (form: any, files: File[]) => ({
  source: 'ANIX HSE MVP',
  product: 'Единая визуальная система обучения по охране труда',
  companyName: form.companyName,
  industry: form.industry,
  employeesCount: form.employeesCount,
  sites: form.sites,
  riskTypes: form.riskTypes,
  courseGoal: form.courseGoal,
  materialsDescription: form.materialsDescription,
  contactName: form.contactName,
  phone: form.phone,
  email: form.email,
  comment: form.comment,
  files: files.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  })),
  createdAt: new Date().toISOString(),
});

export const submitCourseRequest = async (payload: any) => {
  const webhookUrl = getCrmWebhookUrl();

  if (!webhookUrl) {
    const stored = saveCourseRequest({
      ...payload,
      crmStatus: 'demo-localStorage',
    });
    return {
      status: 'demo',
      message: 'Демо-заявка сохранена',
      stored,
    };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const stored = saveCourseRequest({
      ...payload,
      crmStatus: 'webhook-error-localStorage',
    });
    return {
      status: 'fallback',
      message: 'Webhook недоступен, заявка сохранена в деморежиме',
      stored,
    };
  }

  return {
    status: 'sent',
    message: 'Заявка передана в CRM',
  };
};
