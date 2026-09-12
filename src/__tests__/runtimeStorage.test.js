import { installRuntimeRecovery, recoverFromRuntimeFailure } from '../runtimeCompatibility';
test('denied browser storage cannot stop application startup or create reload loops', async () => {
  const original = Object.getOwnPropertyDescriptor(window, 'sessionStorage');
  Object.defineProperty(window, 'sessionStorage', { configurable: true, get() { throw new Error('denied'); } });
  try {
    expect(() => installRuntimeRecovery()).not.toThrow();
    await expect(recoverFromRuntimeFailure(new Error('Loading chunk 123 failed'))).resolves.toBe(false);
    await expect(recoverFromRuntimeFailure('ResizeObserver loop completed with undelivered notifications.')).resolves.toBe(false);
  } finally { Object.defineProperty(window, 'sessionStorage', original); }
});
