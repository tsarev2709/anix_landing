# HSE MVP modes

The production MVP has two contours under `/hse/mvp`.

## Showcase contour

Path: `/hse/mvp/showcase`.

Purpose: a competition-ready demo polygon for jury and stakeholders. It uses deterministic demo data and browser `localStorage`, requires no registration, and stays available even when Supabase, CRM, or LLM endpoints are not configured.

Main showcase routes:

- `/hse/mvp/showcase/organization`
- `/hse/mvp/showcase/departments/:departmentId`
- `/hse/mvp/showcase/modules/:moduleId`
- `/hse/mvp/showcase/modules/:moduleId/lessons/:lessonId`
- `/hse/mvp/showcase/modules/:moduleId/test`
- `/hse/mvp/showcase/specialist`
- `/hse/mvp/showcase/admin`
- `/hse/mvp/showcase/request-course`
- `/hse/mvp/showcase/integrations`
- `/hse/mvp/showcase/support`

Mode badge: `Витринный режим · демоданные`.

## Test contour

Path: `/hse/mvp/test`.

Purpose: a Supabase-ready contour for testing registration, roles, persistent progress, organizations, departments, assigned modules, events, and requests. If Supabase environment variables are not present, the UI renders a setup panel instead of breaking the application.

Main test routes:

- `/hse/mvp/test/login`
- `/hse/mvp/test/register`
- `/hse/mvp/test/admin-login`
- `/hse/mvp/test/organization`
- `/hse/mvp/test/me`
- `/hse/mvp/test/admin`
- `/hse/mvp/test/specialist`

Mode badge: `Тестировочный режим · Supabase` or `Тестировочный режим · Supabase не настроен`.

## Production acceptance

The work is considered complete only after the GitHub Pages deployment is green and production URLs render and can be clicked at `https://studio.anix-ai.pro/hse/mvp`.