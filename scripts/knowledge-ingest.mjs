import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  decodeHtml,
  meaningfulHtml,
  metadataFromUrl,
  semanticChunks,
} from './lib/knowledge-ingest-utils.mjs';

function argsFrom(argv) {
  const options = { files: [], urls: [], sitemaps: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--url') options.urls.push(argv[++index]);
    else if (value === '--sitemap') options.sitemaps.push(argv[++index]);
    else if (value === '--source-slug') options.sourceSlug = argv[++index];
    else if (value === '--source-title') options.sourceTitle = argv[++index];
    else if (value === '--vertical') options.vertical = argv[++index];
    else if (value === '--env') options.envFile = argv[++index];
    else if (value === '--verify') options.verify = true;
    else if (value === '--force') options.force = true;
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
  npm run knowledge:ingest -- --sitemap https://studio.anix-ai.pro/sitemap.xml [options]

Options:
  --source-slug anix-product
  --source-title "Anix product knowledge"
  --vertical medicine|hse|b2b|general
  --env path/to/private.env
  --verify  Check that every document is retrievable after ingestion
  --force   Re-embed documents even when their checksum is unchanged
`);
}

function titleFromContent(content, fallback) {
  const heading = content.match(/^#{1,3}\s+(.+)$/m)?.[1];
  return (heading || fallback).trim().slice(0, 300);
}

function titleFromHtml(html, fallback) {
  const value =
    html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ||
    html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return decodeHtml(String(value || fallback).replace(/<[^>]+>/g, ' ')).slice(
    0,
    300
  );
}

async function urlsFromSitemap(sitemapUrl) {
  const response = await fetch(sitemapUrl, { redirect: 'follow' });
  if (!response.ok)
    throw new Error(`Cannot fetch ${sitemapUrl}: HTTP ${response.status}`);
  const xml = await response.text();
  const origin = new URL(sitemapUrl).origin;
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => decodeHtml(match[1]))
    .filter((value) => {
      try {
        const url = new URL(value);
        return (
          url.origin === origin &&
          !/^\/(privacy|personal-data|hse\/mvp)(\/|$)/.test(url.pathname)
        );
      } catch {
        return false;
      }
    });
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
      vertical: options.vertical || 'general',
      metadata: { vertical: options.vertical || 'general', page_type: 'document' },
    });
  }
  const sitemapUrls = (
    await Promise.all(options.sitemaps.map(urlsFromSitemap))
  ).flat();
  const urls = [...new Set([...options.urls, ...sitemapUrls])];
  for (const url of urls) {
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok)
      throw new Error(`Cannot fetch ${url}: HTTP ${response.status}`);
    const html = await response.text();
    const content = meaningfulHtml(html);
    const metadata = metadataFromUrl(url, options.vertical || 'general');
    documents.push({
      externalId: `url:${url}`,
      title: titleFromHtml(html, new URL(url).pathname || url),
      sourceUrl: url,
      content,
      sourceType: 'url',
      vertical: metadata.vertical,
      metadata,
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
      metadata: document.metadata || {
        vertical: document.vertical || options.vertical || 'general',
      },
      enabled: true,
      updated_at: new Date().toISOString(),
    },
  });
  return rows[0];
}

async function existingDocument(source, document) {
  const rows = await rest('knowledge_documents', {
    query: `?source_id=eq.${encodeURIComponent(source.id)}&external_id=eq.${encodeURIComponent(document.externalId)}&select=id,content_hash`,
  });
  return rows[0] || null;
}

async function verifyRetrieval(source, document, record, options) {
  const [queryEmbedding] = await embed([
    `${document.title}\n${document.content.slice(0, 500)}`,
  ]);
  const result = await rest('rpc/search_knowledge_chunks', {
    method: 'POST',
    body: {
      query_embedding: queryEmbedding,
      query_text: document.title,
      match_count: 5,
      filter_metadata: { vertical: document.vertical || options.vertical || 'general' },
    },
  });
  if (!result.some((item) => item.document_id === record.id)) {
    throw new Error(`Self-retrieval check failed for ${document.title}`);
  }
}

async function ingestDocument(source, document, options) {
  const contentHash = hash(document.content);
  const existing = await existingDocument(source, document);
  if (!options.force && existing?.content_hash === contentHash) {
    console.log(`${document.title}: unchanged, skipped`);
    return { status: 'skipped', chunks: 0 };
  }
  const record = await upsertDocument(source, document, options);
  const texts = semanticChunks(document.content);
  if (!texts.length) throw new Error(`No meaningful chunks for ${document.title}`);
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
    metadata: document.metadata || {
      vertical: document.vertical || options.vertical || 'general',
    },
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
  if (options.verify) await verifyRetrieval(source, document, record, options);
  console.log(`${document.title}: ${rows.length} chunks`);
  return { status: 'ingested', chunks: rows.length };
}

const options = argsFrom(process.argv.slice(2));
if (options.help) {
  usage();
  process.exit(0);
}
await loadEnv(options.envFile);
if (!options.files.length && !options.urls.length && !options.sitemaps.length) {
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
const summary = { ingested: 0, skipped: 0, chunks: 0 };
for (const document of documents) {
  const result = await ingestDocument(source, document, options);
  summary[result.status] += 1;
  summary.chunks += result.chunks;
}
console.log(
  `Done: ${documents.length} documents into ${options.sourceSlug}; ${summary.ingested} ingested, ${summary.skipped} unchanged, ${summary.chunks} chunks`
);
