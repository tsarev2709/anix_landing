// Shared by the browser and the static SEO build so crawlers see the whole article.
const article = require('./hseSavingsArticle.json');

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char]
  );

function inline(value) {
  let html = escapeHtml(value);
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    (_, label, url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`
  );
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(
    /\[(\d+)\]/g,
    (_, number) =>
      `<a href="#source-${number}" aria-label="Источник ${number}">[${number}]</a>`
  );
  return html;
}

function figure(key) {
  const image = article.images[key];
  if (!image) return '';
  return `<figure class="hse-article__figure"><img src="${image.src}" alt="${escapeHtml(image.alt)}" width="1672" height="941" loading="${key === 'hero' ? 'eager' : 'lazy'}" decoding="async"/><figcaption>${escapeHtml(image.caption)}</figcaption></figure>`;
}

function renderHseArticle() {
  const lines = article.markdown.trim().split(/\r?\n/);
  const output = [];
  let paragraph = [];
  let list = null;
  let table = false;
  let sourceList = false;
  let sectionOpen = false;

  function flushParagraph() {
    if (paragraph.length) output.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  }
  function closeList() {
    if (list) output.push(`</${list}>`);
    list = null;
  }
  function closeTable() {
    if (table) output.push('</tbody></table></div>');
    table = false;
  }
  function closeBlocks() {
    flushParagraph();
    closeList();
    closeTable();
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      continue;
    }
    if (line === '---') {
      closeBlocks();
      continue;
    }
    if (line.startsWith('[[image:')) {
      closeBlocks();
      output.push(figure(line.slice(8, -2)));
      continue;
    }
    const heading = line.match(/^(#{2,3}) (.*)$/);
    if (heading) {
      closeBlocks();
      if (heading[1] === '##') {
        if (sectionOpen) output.push('</section>');
        output.push('<section class="hse-article__section">');
        sectionOpen = true;
      }
      const level = heading[1].length;
      const id = heading[2] === 'Источники' ? 'sources' : undefined;
      if (id) sourceList = true;
      output.push(
        `<h${level}${id ? ` id="${id}"` : ''}>${inline(heading[2])}</h${level}>`
      );
      continue;
    }
    if (line.startsWith('|')) {
      flushParagraph();
      closeList();
      if (/^\|[\s:|-]+\|$/.test(line)) continue;
      const cells = line.slice(1, -1).split('|');
      if (!table) {
        output.push(
          '<div class="hse-article__table-wrap"><table><thead><tr>' +
            cells.map((cell) => `<th>${inline(cell.trim())}</th>`).join('') +
            '</tr></thead><tbody>'
        );
        table = true;
      } else
        output.push(
          '<tr>' +
            cells.map((cell) => `<td>${inline(cell.trim())}</td>`).join('') +
            '</tr>'
        );
      continue;
    }
    if (line.startsWith('- ') || (sourceList && /^\d+\. /.test(line))) {
      flushParagraph();
      closeTable();
      const type = line.startsWith('- ') ? 'ul' : 'ol';
      if (list !== type) {
        closeList();
        output.push(`<${type}>`);
        list = type;
      }
      const match = line.match(/^(\d+)\. /);
      const number = match?.[1];
      output.push(
        `<li${number ? ` id="source-${number}"` : ''}>${inline(line.replace(/^(?:- |\d+\. )/, ''))}</li>`
      );
      continue;
    }
    closeList();
    closeTable();
    paragraph.push(line);
  }
  closeBlocks();
  if (sectionOpen) output.push('</section>');
  return output.join('\n');
}

exports.renderHseArticle = renderHseArticle;
exports.article = article;
