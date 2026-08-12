export function decodeHtml(value) {
  return String(value || '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

export function meaningfulHtml(html) {
  let source = String(html || '');
  const main = source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (main) source = main;
  return source
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(
      /<(script|style|svg|noscript|template|nav|header|footer|form|button)\b[^>]*>[\s\S]*?<\/\1>/gi,
      ' '
    )
    .replace(/<(h[1-3])\b[^>]*>([\s\S]*?)<\/\1>/gi, (_match, tag, value) => {
      const level = Number(tag.slice(1));
      return `\n\n${'#'.repeat(level)} ${decodeHtml(value.replace(/<[^>]+>/g, ' '))}\n\n`;
    })
    .replace(/<(p|li|blockquote|figcaption|dt|dd)\b[^>]*>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/((p|li|blockquote|figcaption|dt|dd|section|article|div))>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .split(/\n{2,}/)
    .map((part) => decodeHtml(part))
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

function splitLongParagraph(value, maxChars, overlapChars) {
  if (value.length <= maxChars) return [value];
  const sentences = value.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length < 2) {
    const result = [];
    const step = Math.max(1, maxChars - overlapChars);
    for (let start = 0; start < value.length; start += step) {
      result.push(value.slice(start, start + maxChars));
    }
    return result;
  }
  const result = [];
  let current = '';
  for (const sentence of sentences) {
    if (current && current.length + sentence.length + 1 > maxChars) {
      result.push(current);
      current = `${current.slice(-overlapChars)} ${sentence}`.trim();
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) result.push(current);
  return result;
}

export function semanticChunks(content, options = {}) {
  const maxChars = Number(options.maxChars || 1500);
  const minChars = Number(options.minChars || 40);
  const overlapChars = Number(options.overlapChars || 160);
  const blocks = String(content || '')
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .map((value) => value.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean);

  const sections = [];
  let heading = '';
  let paragraphs = [];
  const flush = () => {
    if (paragraphs.length) sections.push({ heading, paragraphs });
    paragraphs = [];
  };
  for (const block of blocks) {
    if (/^#{1,3}\s+/.test(block)) {
      flush();
      heading = block.replace(/^#{1,3}\s+/, '').trim();
    } else {
      paragraphs.push(...splitLongParagraph(block, maxChars, overlapChars));
    }
  }
  flush();

  const chunks = [];
  for (const section of sections) {
    const prefix = section.heading ? `${section.heading}\n\n` : '';
    let current = '';
    for (const paragraph of section.paragraphs) {
      const candidate = current ? `${current}\n\n${paragraph}` : `${prefix}${paragraph}`;
      if (current && candidate.length > maxChars) {
        chunks.push(current);
        const overlap = current.slice(-overlapChars);
        current = `${prefix}${overlap}\n\n${paragraph}`.slice(0, maxChars);
      } else {
        current = candidate;
      }
    }
    if (current) chunks.push(current);
  }
  return chunks
    .map((value) => value.trim())
    .filter((value, index, all) => value.length >= minChars && all.indexOf(value) === index);
}

export function metadataFromUrl(url, fallbackVertical = 'general') {
  const pathname = new URL(url).pathname.toLowerCase();
  const caseSlug = pathname.match(/^\/cases\/([a-z0-9-]+)\/?$/)?.[1] || null;
  let vertical = fallbackVertical;
  if (
    pathname.startsWith('/medicine') ||
    /\/cases\/(medicine|hemotech-ai|mosfarma|aviandr)/.test(pathname)
  ) {
    vertical = 'medicine';
  } else if (
    pathname.startsWith('/hse') ||
    /\/cases\/(hse|multon-partners)/.test(pathname)
  ) {
    vertical = 'hse';
  } else if (/\/cases\/(little-prince|borodino)/.test(pathname)) {
    vertical = 'cinema';
  } else if (/\/cases\/(rchk)/.test(pathname)) {
    vertical = 'events';
  } else if (caseSlug) {
    vertical = 'b2b';
  }
  return {
    vertical,
    page_type: caseSlug ? 'case' : pathname === '/cases/' ? 'case_hub' : 'page',
    ...(caseSlug ? { case_slug: caseSlug } : {}),
    page_path: pathname,
  };
}
