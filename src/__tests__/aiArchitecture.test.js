const fs = require('fs');

describe('AI consultant production architecture', () => {
  test('keeps browser, Supabase and local Ollama separated', () => {
    const widget = fs.readFileSync('src/components/AiChatWidget.jsx', 'utf8');
    const edge = fs.readFileSync('supabase/functions/ai-chat/index.ts', 'utf8');
    const gateway = fs.readFileSync('local-ai-gateway/server.mjs', 'utf8');
    expect(widget).not.toMatch(/localhost:11434|\/api\/chat|\/api\/embed/);
    expect(edge).toContain("'/v1/chat'");
    expect(edge).toContain("'/v1/embed'");
    expect(edge).toContain("'search_knowledge_chunks'");
    expect(edge).toContain('retrieval_score');
    expect(edge).toContain('retrievalQuery(history, message)');
    expect(edge).toContain('sanitizeReplyLinks(envelope.reply');
    expect(edge).toContain('storeAssistantFallback');
    expect(gateway).toContain("'/api/chat'");
    expect(gateway).toContain("'/api/embed'");
  });

  test('does not expose server credentials through React config', () => {
    const config = fs.readFileSync('src/config.ts', 'utf8');
    for (const secret of [
      'LOCAL_AI_GATEWAY_SECRET',
      'CF_ACCESS_CLIENT_SECRET',
      'SUPABASE_SERVICE_ROLE_KEY',
      'AMOCRM_LONG_LIVED_TOKEN',
    ]) {
      expect(config).not.toContain(secret);
    }
  });
});
