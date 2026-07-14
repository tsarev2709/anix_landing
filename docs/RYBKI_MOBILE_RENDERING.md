# Rybki mobile slide rendering

The source pitch deck remains in `public/rybki-assets/Слайд N.pdf`.

Production and quality builds install `poppler-utils` and run `scripts/render-rybki-pdf-slides.js` before the React build. The script renders page 1 of each PDF and creates responsive WebP previews in `public/rybki-rendered/`.

`/rybki/` displays those WebP previews with `<picture>`/`srcset` instead of embedding PDF viewers. This avoids inconsistent Android and iOS inline PDF rendering. The original PDF remains available through the “Открыть PDF” link.
