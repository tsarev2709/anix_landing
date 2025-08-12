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

Use the Supabase SQL editor to query `lead_events` and inspect conversion rates.
