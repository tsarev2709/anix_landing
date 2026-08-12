import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';

const OLLAMA_PORT = 11435;
const GATEWAY_PORT = 8788;
const secret = 'test-secret-that-is-long-enough';

function response(res, body) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const fakeOllama = http.createServer(async (req, res) => {
  if (req.url === '/api/tags') {
    return response(res, {
      models: [{ name: 'qwen3:8b' }, { name: 'embeddinggemma' }],
    });
  }
  if (req.url === '/api/embed') {
    return response(res, {
      model: 'embeddinggemma',
      embeddings: [Array.from({ length: 768 }, (_, index) => index / 768)],
      prompt_eval_count: 4,
    });
  }
  if (req.url === '/api/chat') {
    return response(res, {
      model: 'qwen3:8b',
      message: { role: 'assistant', content: '{"reply":"Готово"}' },
      prompt_eval_count: 20,
      eval_count: 4,
    });
  }
  res.writeHead(404);
  res.end();
});

await new Promise((resolve) =>
  fakeOllama.listen(OLLAMA_PORT, '127.0.0.1', resolve)
);
const gateway = spawn(process.execPath, ['local-ai-gateway/server.mjs'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    GATEWAY_HOST: '127.0.0.1',
    GATEWAY_PORT: String(GATEWAY_PORT),
    OLLAMA_BASE_URL: `http://127.0.0.1:${OLLAMA_PORT}`,
    LOCAL_AI_GATEWAY_SECRET: secret,
    CHAT_MODEL: 'qwen3:8b',
    EMBEDDING_MODEL: 'embeddinggemma',
  },
  stdio: ['ignore', 'ignore', 'inherit'],
});

async function waitForGateway() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const result = await fetch(`http://127.0.0.1:${GATEWAY_PORT}/health`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (result.ok) return;
    } catch {
      // Gateway is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('gateway_start_timeout');
}

try {
  await waitForGateway();

  const unauthorized = await fetch(`http://127.0.0.1:${GATEWAY_PORT}/health`);
  assert.equal(unauthorized.status, 401);

  const embed = await fetch(`http://127.0.0.1:${GATEWAY_PORT}/v1/embed`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ request_id: 'embed-test', input: ['Anix'] }),
  });
  const embedBody = await embed.json();
  assert.equal(embed.status, 200);
  assert.equal(embedBody.embeddings[0].length, 768);

  const chat = await fetch(`http://127.0.0.1:${GATEWAY_PORT}/v1/chat`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      request_id: 'chat-test',
      system_prompt: 'Ты консультант Anix',
      retrieved_context: 'Подтверждённый тестовый контекст',
      messages: [{ role: 'user', content: 'Привет' }],
    }),
  });
  const chatBody = await chat.json();
  assert.equal(chat.status, 200);
  assert.equal(chatBody.message.content, '{"reply":"Готово"}');
  console.log('Local AI gateway contract: OK');
} finally {
  gateway.kill('SIGTERM');
  await new Promise((resolve) => fakeOllama.close(resolve));
}
