import { saveCourseRequest } from './storage';
import { getHseSupabaseClient } from './hseSupabase';

const COURSE_REQUEST_BUCKET = 'course-request-files';

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
// Uploads to the public 'course-request-files' Storage bucket (anon insert
// allowed, see supabase/migrations for the exact policy) so the specialist
// can open a real link from the amoCRM note instead of just seeing file
// metadata. Runs from the anonymous form, so it needs no session — a
// logged-out visitor filling this form still has an anon Supabase client.
export const uploadCourseRequestFiles = async (
  files: File[]
): Promise<{ name: string; url: string }[]> => {
  const client = getHseSupabaseClient();
  if (!client || !files.length) return [];

  const uploads = await Promise.all(
    files.map(async (file) => {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
      const { error } = await client.storage
        .from(COURSE_REQUEST_BUCKET)
        .upload(path, file, { contentType: file.type || undefined });
      if (error) return null;
      const { data } = client.storage
        .from(COURSE_REQUEST_BUCKET)
        .getPublicUrl(path);
      return { name: file.name, url: data.publicUrl };
    })
  );

  return uploads.filter(Boolean) as { name: string; url: string }[];
};

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
