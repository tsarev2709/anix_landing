import { reportChatLeadOnce } from '../lib/chatLeadEvent';
test('repeated CRM-completed responses produce one lead event per chat', () => {
  const send = jest.fn();
  reportChatLeadOnce('chat-one', send);
  reportChatLeadOnce('chat-one', send);
  reportChatLeadOnce('chat-two', send);
  expect(send).toHaveBeenCalledTimes(2);
});
test('analytics exceptions cannot break the chat', () => {
  expect(() => reportChatLeadOnce('chat-failed', () => { throw Error('offline'); })).not.toThrow();
});
