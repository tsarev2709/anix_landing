import { classifyAiReferral } from '../lib/aiReferral';
test('known hosts and subdomains are recognized', () => {
  expect(classifyAiReferral({referrer:'https://www.perplexity.ai/search/x'}).provider).toBe('perplexity');
  expect(classifyAiReferral({referrer:'https://chatgpt.com/c/x'}).evidence).toBe('referrer');
});
test('spoofed hosts and search engines do not prove AI traffic', () => {
  for (const referrer of ['https://chatgpt.com.evil.test/', 'https://google.com/', 'https://yandex.ru/', 'broken']) {
    expect(classifyAiReferral({referrer}).provider).toBe('');
  }
});
test('campaign source wins and conflicts are explicit', () => {
  expect(classifyAiReferral({utmSource:'newsletter',referrer:'https://chatgpt.com/'})).toEqual({provider:'',evidence:'other_campaign',conflict:true});
  expect(classifyAiReferral({utmSource:'chatgpt.com'})).toEqual({provider:'chatgpt',evidence:'utm',conflict:false});
});
test('direct visits remain unattributed', () => {
  expect(classifyAiReferral()).toEqual({provider:'',evidence:'unattributed',conflict:false});
});
