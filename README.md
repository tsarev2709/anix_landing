# Anix Landing

This project contains the source code for the Anix landing page built with React and Tailwind CSS.

## Setup

1. Install [Node.js](https://nodejs.org/) (version 16 or newer).
2. Install the project dependencies:
   ```bash
   npm install
   ```

## Development

Run the development server with:
```bash
npm start
```
The app will be available at `http://localhost:3000/`.

## Building

Create a production build with:
```bash
npm run build
```
The output will be placed in the `build/` directory.

## Testing

Execute the test suite using:
```bash
npm test
```

## Deployment

The project can be deployed to GitHub Pages. Use the provided script to build and push the
contents of the `build/` directory to the `gh-pages` branch:
```bash
npm run deploy
```

## Analytics

Lead events are stored in the `lead_events` table. The following events are recorded:

- `form_view`
- `form_start`
- `form_submit`
- `email_open`
- `section_transition`
- `cta_view`
- `cta_click`

Use the Supabase SQL editor to query `lead_events` and inspect conversion rates.

## Section transitions & CTA

Sections use the `<Section>` component to define their background color (`bg`) and the color of the next section (`nextBg`).

```
<Section id="hero" bg="#0f0f1f" nextBg="#141429" separator="curve" stickyTransition>
  {/* content */}
</Section>
```

- Add new sections by wrapping content in `<Section>` and giving it a unique `id`.
- `separator` can be `gradient` or `curve`.
- Include `stickyTransition` where a sticky bridge between sections is required.

The global layout listens for section visibility and CTA interactions to send:

- `section_transition` — when the user scrolls between sections.
- `cta_view` — when the sticky CTA becomes visible.
- `cta_click` — when the CTA link is clicked.
