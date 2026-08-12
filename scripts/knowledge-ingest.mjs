import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

function argsFrom(argv) {
  const options = { files: [], urls: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--url') options.urls.push(argv[++index]);
    else if (value === '--source-slug') options.sourceSlug = argv[++index];
    else if (value === '--source-title') options.sourceTitle = argv[++index];
    else if (value === '--vertical') options.vertical = argv[++index];
    else if (value === '--env') options.envFile = argv[++index];
    else if (value === '--help') options.help = true;
    else options.files.push(value);
  }
  return options;
}

async function loadEnv(file) {
  if (!file) return;
  const content = await fs.readFile(path.resolve(file), 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function usage() {
  console.log(`
Usage:
  npm run knowledge:ingest -- <file.txt> <file.md> [options]
  npm run knowledge:ingest -- --url https://studio.anix-ai.pro/medicine/ [options]

Options:
  --source-slug anix-product
  --source-title "Anix product knowledge"
  --vertical medicine|hse|b2b|general
  --env path/to/private.env
`);
}

function stripHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function titleFromContent(content, fallback) {
  const heading = content.match(/^#{1,3}\s+(.+)$/m)?.[1];
  return (heading || fallback).trim().slice(0, 300);
}

function chunksFrom(content, maxChars = 1500, overlapChars = 180) {
  const paragraphs = content
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .map((value) => value.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .flatMap((paragraph) => {
      if (paragraph.length <= maxChars) return [paragraph];
      const parts = [];
      const step = maxChars - overlapChars;
      for (let start = 0; start < paragraph.length; start += step) {
        parts.push(paragraph.slice(start, start + maxChars));
      }
      return parts;
    });
  const chunks = [];
  let current = '';
  for (const paragraph of paragraphs) {
    if (current && current.length + paragraph.length + 2 > maxChars) {
      chunks.push(current);
      current = `${current.slice(-overlapChars)}\n\n${paragraph}`;
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
    }
  }
  if (current) chunks.push(current);
  return chunks.filter((value) => value.length >= 40);
}

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function readInputs(options) {
  const documents = [];
  for (const filename of options.files) {
    const absolute = path.resolve(filename);
    const content = await fs.readFile(absolute, 'utf8');
    documents.push({
      externalId: `file:${path.basename(absolute)}`,
      title: titleFromContent(content, path.basename(absolute)),
      sourceUrl: null,
      content,
      sourceType: 'file',
    });
  }
  for (const url of options.urls) {
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok)
      throw new Error(`Cannot fetch ${url}: HTTP ${response.status}`);
    const html = await response.text();
    const content = stripHtml(html);
    documents.push({
      externalId: `url:${url}`,
      title: titleFromContent(content, new URL(url).pathname || url),
      sourceUrl: url,
      content,
      sourceType: 'url',
    });
  }
  return documents;
}

function apiHeaders() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SB_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

function supabaseBase() {
  const value = process.env.SUPABASE_URL || process.env.SB_URL;
  if (!value) throw new Error('SUPABASE_URL is required');
  return value.replace(/\/+$/, '');
}

async function rest(
  table,
  { method = 'GET', query = '', body, prefer = '' } = {}
) {
  const headers = apiHeaders();
  if (prefer) headers.Prefer = prefer;
  const response = await fetch(`${supabaseBase()}/rest/v1/${table}${query}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `${method} ${table} failed: ${response.status} ${JSON.stringify(data)}`
    );
  }
  return data;
}

async function embed(inputs) {
  const base = (
    process.env.LOCAL_AI_GATEWAY_LOCAL_URL ||
    process.env.LOCAL_AI_GATEWAY_URL ||
    'http://127.0.0.1:8788'
  ).replace(/\/+$/, '');
  const secret = process.env.LOCAL_AI_GATEWAY_SECRET;
  if (!secret) throw new Error('LOCAL_AI_GATEWAY_SECRET is required');
  const response = await fetch(`${base}/v1/embed`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      request_id: crypto.randomUUID(),
      model: process.env.EMBEDDING_MODEL || 'embeddinggemma',
      input: inputs,
    }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(data?.embeddings)) {
    throw new Error(
      `Embedding failed: ${response.status} ${JSON.stringify(data)}`
    );
  }
  if (
    data.embeddings.some(
      (value) => !Array.isArray(value) || value.length !== 768
    )
  ) {
    throw new Error('Embedding dimension must be 768');
  }
  return data.embeddings;
}

async function upsertSource(options, sourceType) {
  const rows = await rest('knowledge_sources', {
    method: 'POST',
    query: '?on_conflict=slug',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: {
      slug: options.sourceSlug,
      title: options.sourceTitle,
      source_type: sourceType,
      metadata: { vertical: options.vertical || 'general' },
      enabled: true,
      updated_at: new Date().toISOString(),
    },
  });
  return rows[0];
}

async function upsertDocument(source, document, options) {
  const rows = await rest('knowledge_documents', {
    method: 'POST',
    query: '?on_conflict=source_id,external_id',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: {
      source_id: source.id,
      external_id: document.externalId,
      title: document.title,
      source_url: document.sourceUrl,
      content_hash: hash(document.content),
      metadata: { vertical: options.vertical || 'general' },
      enabled: true,
      updated_at: new Date().toISOString(),
    },
  });
  return rows[0];
}

async function ingestDocument(source, document, options) {
  const record = await upsertDocument(source, document, options);
  const texts = chunksFrom(document.content);
  const embeddings = [];
  for (let index = 0; index < texts.length; index += 16) {
    embeddings.push(...(await embed(texts.slice(index, index + 16))));
  }

  await rest('knowledge_chunks', {
    method: 'DELETE',
    query: `?document_id=eq.${encodeURIComponent(record.id)}`,
    prefer: 'return=minimal',
  });

  const rows = texts.map((content, index) => ({
    source_id: source.id,
    document_id: record.id,
    chunk_index: index,
    title: document.title,
    content,
    source_url: document.sourceUrl,
    metadata: { vertical: options.vertical || 'general' },
    embedding_model: process.env.EMBEDDING_MODEL || 'embeddinggemma',
    embedding: embeddings[index],
    enabled: true,
  }));
  for (let index = 0; index < rows.length; index += 100) {
    await rest('knowledge_chunks', {
      method: 'POST',
      prefer: 'return=minimal',
      body: rows.slice(index, index + 100),
    });
  }
  console.log(`${document.title}: ${rows.length} chunks`);
}

const options = argsFrom(process.argv.slice(2));
if (options.help) {
  usage();
  process.exit(0);
}
await loadEnv(options.envFile);
if (!options.files.length && !options.urls.length) {
  usage();
  process.exit(1);
}
options.sourceSlug ||= `anix-${options.vertical || 'general'}`;
options.sourceTitle ||= `Anix — ${options.vertical || 'general'}`;

const documents = await readInputs(options);
const sourceTypes = new Set(documents.map((item) => item.sourceType));
const source = await upsertSource(
  options,
  sourceTypes.size === 1 ? documents[0].sourceType : 'manual'
);
for (const document of documents)
  await ingestDocument(source, document, options);
console.log(`Done: ${documents.length} documents into ${options.sourceSlug}`);
