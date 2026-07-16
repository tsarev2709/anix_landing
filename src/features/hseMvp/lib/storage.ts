import { recordRealAttempt } from './auth';

const ATTEMPTS_KEY = 'anix_hse_mvp_attempts';
const COURSE_PROGRESS_KEY = 'anix_hse_mvp_course_progress';
const COURSE_REQUESTS_KEY = 'anix_hse_mvp_course_requests';
const EVENTS_KEY = 'anix_hse_mvp_events';
const MODULE_STATE_KEY = 'anix_hse_mvp_module_state';

const canUseStorage = () =>
  typeof window !== 'undefined' && Boolean(window.localStorage);

const readJson = (key: string, fallback: any) => {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_error) {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getAttempts = () => readJson(ATTEMPTS_KEY, []);

export const getAttemptsByModule = (moduleId: string) =>
  getAttempts().filter((attempt) => attempt.moduleId === moduleId);

export const getLatestAttempt = (attemptId?: string) => {
  const attempts = getAttempts();
  if (attemptId)
    return attempts.find((attempt) => attempt.id === attemptId) || null;
  return attempts[attempts.length - 1] || null;
};

export const saveAttempt = (attempt: any) => {
  const attempts = getAttempts();
  const moduleAttempts = attempts.filter(
    (item) => item.moduleId === attempt.moduleId
  );
  const storedAttempt = {
    ...attempt,
    id: attempt.id || `attempt-${Date.now()}`,
    attemptNumber: moduleAttempts.length + 1,
    completedAt: attempt.completedAt || new Date().toISOString(),
  };
  writeJson(ATTEMPTS_KEY, [...attempts, storedAttempt]);
  recordRealAttempt(storedAttempt).catch(() => {});
  saveCourseProgress(attempt.moduleId, {
    status: attempt.passed ? 'Пройден' : 'Рекомендуется повторить',
    progress: 100,
    score: attempt.score,
    attemptId: storedAttempt.id,
  });
  addEvent('attempt_completed', storedAttempt);
  return storedAttempt;
};

export const getCourseProgress = () => readJson(COURSE_PROGRESS_KEY, {});

export const saveCourseProgress = (moduleId: string, progress: any) => {
  const current = getCourseProgress();
  writeJson(COURSE_PROGRESS_KEY, {
    ...current,
    [moduleId]: {
      ...current[moduleId],
      ...progress,
      updatedAt: new Date().toISOString(),
    },
  });
};

export const getModuleLearningState = (moduleId: string) => {
  const state = readJson(MODULE_STATE_KEY, {});
  return state[moduleId] || { currentBlockIndex: 0, answers: {} };
};

export const saveModuleLearningState = (moduleId: string, patch: any) => {
  const state = readJson(MODULE_STATE_KEY, {});
  const nextModuleState = {
    ...(state[moduleId] || { currentBlockIndex: 0, answers: {} }),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  writeJson(MODULE_STATE_KEY, {
    ...state,
    [moduleId]: nextModuleState,
  });
  return nextModuleState;
};
export const getCourseRequests = () => readJson(COURSE_REQUESTS_KEY, []);

export const saveCourseRequest = (request: any) => {
  const requests = getCourseRequests();
  const storedRequest = {
    ...request,
    id: request.id || `course-request-${Date.now()}`,
    createdAt: request.createdAt || new Date().toISOString(),
  };
  writeJson(COURSE_REQUESTS_KEY, [...requests, storedRequest]);
  addEvent('course_request_saved', storedRequest);
  return storedRequest;
};

export const addEvent = (eventType: string, eventPayload: any) => {
  const events = readJson(EVENTS_KEY, []);
  writeJson(EVENTS_KEY, [
    ...events,
    {
      id: `event-${Date.now()}`,
      eventType,
      eventPayload,
      createdAt: new Date().toISOString(),
    },
  ]);
};

export const getEvents = () => readJson(EVENTS_KEY, []);
