# SEO configuration

ANIX Studio uses a route-level static SEO build on top of the existing Create React App runtime.

## Source of truth

All route metadata, indexability, static SEO copy, internal related links, breadcrumbs and schema type live in:

`src/seo/routes.json`

Do not add new page-level `react-helmet` metadata to route components. Production removes legacy Helmet blocks before compilation and mounts `src/seo/SeoHead.jsx` once at the application root.

## How static HTML works

The React application still uses the existing pathname switch in `src/index.js`. It is not migrated to Next.js and does not hydrate server-rendered React.

During `npm run build`:

1. Existing image optimization runs.
2. `scripts/generate-seo-assets.js` creates route-specific Open Graph images and optimized public case images.
3. `scripts/prepare-seo-source.js` removes legacy route Helmet declarations before the CRA compiler runs.
4. CRA builds the existing client application.
5. `scripts/create-static-routes.js` creates real `route/index.html` entries for known routes.
6. `scripts/generate-static-seo.js` replaces the generic CRA head with route-specific metadata, injects a semantic static HTML shell into `#root`, writes JSON-LD, creates a dedicated noindex 404 page and generates `sitemap.xml`.
7. `scripts/normalize-seo-output.js` aligns canonical URLs, sitemap URLs, static internal links and Open Graph types with the final GitHub Pages directory URLs.
8. `scripts/verify-seo-build.js` fails the build if required metadata, canonical URLs, H1, static copy, JSON-LD, OG images, sitemap, robots or 404 checks fail.

At runtime `src/index.js` removes the static shell before `createRoot`. React renders exactly as before. This is intentionally not hydration, so existing animation, video and browser-only code does not execute during static HTML generation and cannot cause hydration mismatches.

`RouteBreadcrumbsPortal` and `RouteRelatedLinksPortal` read the same route config and keep breadcrumbs and related internal links visible after React replaces the static shell.

## URL policy

GitHub Pages serves the generated pages from `route/index.html`. Public canonical URLs therefore use a trailing slash, matching the final directory URL after GitHub Pages routing:

- `https://studio.anix-ai.pro/`
- `https://studio.anix-ai.pro/medicine/`
- `https://studio.anix-ai.pro/hse/`
- `https://studio.anix-ai.pro/cases/hemotech-ai/`

The pathname switch accepts both forms in the browser, but metadata, sitemap, breadcrumbs and generated internal SEO links always point to the canonical directory URL.

## Indexability

Indexable routes have `index, follow` and are included in the generated sitemap.

Legal pages and technical/demo routes use `noindex, follow` and are excluded from the sitemap. They remain crawlable so search engines can see the `noindex` directive.

## Adding a new public page

1. Add the route and React component to `src/index.js`.
2. Add the route to `scripts/create-static-routes.js`.
3. Add a complete route entry to `src/seo/routes.json` with:
   - `indexable`
   - `kind`
   - `title`
   - `description`
   - `ogTitle`
   - `ogDescription`
   - `ogImage`
   - `h1`
   - `intro`
   - `sections`
   - `links`
   - `breadcrumbs` for internal pages
4. Add or generate the referenced OG image. OG URLs are converted to absolute production URLs during the build.
5. Run `npm run lint`, `npm test -- --watchAll=false` and `npm run build`.

Indexable routes are added to `sitemap.xml` automatically. Do not edit `public/sitemap.xml` manually.

## Adding a case

Case routes use `kind: "case"` and are rendered by `src/components/CasePage.jsx`.

Add the case route to `src/seo/routes.json`, add its source image to the map in `scripts/generate-seo-assets.js`, add the route to `scripts/create-static-routes.js`, and expose it through the route `links` graph. The related-links portal will render those internal links in the live React page.

Do not create `VideoObject` structured data unless a real video URL and a known upload date are available.
