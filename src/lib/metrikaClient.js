export function getMetrikaClientId() {
  if (typeof window === 'undefined' || typeof window.ym !== 'function')
    return Promise.resolve(null);
  return new Promise((resolve) => {
    let done = false;
    const finish = (value) => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve(
          typeof value === 'string' && value.length <= 128 ? value : null
        );
      }
    };
    const timer = setTimeout(() => finish(null), 500);
    try {
      window.ym(103290769, 'getClientID', finish);
    } catch {
      finish(null);
    }
  });
}
