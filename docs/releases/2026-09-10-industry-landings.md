# Industry landing pages and qualified briefs

## Release scope

Four public, indexable direct-link landing pages: `/ships-and-ports/`, `/hospitality/`, `/tourism/`, `/education/`. They are intentionally absent from global header navigation. Each page has a dedicated brief, contextual task buttons, prices, annual program, acceptance rules and links to real cases from related sectors. No completed projects in these four sectors are claimed; illustrative scenarios are explicitly hypothetical.

New-sector pricing: a short animation up to 30 seconds from RUB 200,000; a one-minute animation from RUB 400,000; a series with two minutes of total animation from RUB 800,000. Fixed preparation costs, complexity, adaptations, course methodology and integrations are scoped separately. Annual program from RUB 1,000,000/month for 12 months (RUB 12,000,000/year), agreed monthly deliverables, not unlimited output. Existing Pharma and HSE product tiers are retained.

## Forms

Six variants, including Pharma and HSE (their price guides inherit the variant). Two required sector selects, company, name, one contact method, existing consent and Turnstile. Optional details include placement, deadline, scope, budget and sector-specific detail. Annual CTA prefills annual scope and monthly budget basis. Budget resets when incompatible with the selected task/scope. Other task requires a short explanation.

`src/content/industryForms.json` and `src/lib/industryBrief.js` are the source of truth. Run `node scripts/sync-industry-brief.js` after editing either; CI checks the generated backend module for drift.

Migration 014 adds columns without changing access policies. The public Edge Function validates the brief before persistence; it stores structured answers and forwards a readable Russian summary into the existing amoCRM note. Optional CRM text-field enrichment is tracked by `brief_crm_synced`. If field administration is unavailable, the contact and complete note remain the delivery path; false enrichment status requires CRM administrator follow-up. Qualification is a staff decision and is never accepted from a browser submission. No automated qualification or fabricated conversion is sent.

## Direct preparation and remaining account setup

Existing first-touch attribution and Yclid remain; Metrika ClientID is added when available. Form view/start/details/submit/success/error goals carry fixed variant/task codes, not contact data or comments. Existing success attribution is preserved. A sent form is not a qualified lead.

Before enabling qualified-lead bidding, configure the counter goals, choose a CRM qualification rule and connect a server-side offline-conversion export using the account's authorized Metrika credentials. This release does not claim to have enabled that export or launched advertising. No Metrika OAuth credentials are available in this workspace. Verify the first real industry lead in amoCRM and the optional custom fields; the full brief is always included in the note.

## Deployment and verification

GitHub Pages waits for a successful Supabase workflow for the same commit when backend files or migrations change. Failed backend deployment keeps the old site live. Tests cover six minimal briefs, invalid variants/answers, budget resets, contact switching, and persistence/CRM arguments using mocked external services. Static SEO verification and the runtime smoke suite include the four routes. Production visual checks follow deployment; mocked tests are not proof of a real CRM delivery.
