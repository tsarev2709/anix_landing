import { prepareTelegramAttribution, telegramClick } from '../lib/telegramAttribution';
jest.mock('../config',()=>({CONFIG:{ATTRIBUTION_URL:'https://example.test/attribution'}}));
jest.mock('../lib/leadSession',()=>({getLeadSessionSnapshot:()=>({attribution_snapshot:{visitor_id:'visitor-test-123',session_id:'session-test-123',conversion_type:'telegram'}})}));
afterEach(()=>{delete global.fetch;});
test('case 8: token service failure leaves native Telegram navigation available',async()=>{
  global.fetch=jest.fn(async()=>{throw Error('offline');});
  await expect(prepareTelegramAttribution()).resolves.toBeNull();
  const anchor=document.createElement('a');anchor.href='https://t.me/anix_helper';
  telegramClick(anchor);
  expect(anchor.href).toBe('https://t.me/anix_helper');
});
test('token contains only randomness; capture is sent at click time without awaiting navigation',async()=>{
  const token='a'.repeat(32),capture_key='b'.repeat(64);
  global.fetch=jest.fn(async()=>({ok:true,json:async()=>({token,capture_key})}));
  await prepareTelegramAttribution();
  const anchor=document.createElement('a');anchor.href='https://t.me/anix_helper';
  telegramClick(anchor);
  expect(anchor.href).toBe('https://t.me/anix_helper?start='+token);
  expect(anchor.href).not.toContain(capture_key);
  const capture=JSON.parse(global.fetch.mock.calls[1][1].body);
  expect(capture.action).toBe('capture');expect(capture.snapshot.conversion_type).toBe('telegram');
  expect(global.fetch.mock.calls[1][1].keepalive).toBe(true);
});
