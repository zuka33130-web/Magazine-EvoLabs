/**
 * EVO LABS // Storage Polyfill for Sandboxed iframes
 * Prevents DOMException / SecurityError when localStorage is blocked or restricted.
 */
(function initSafeStorage() {
  if (typeof window === 'undefined') return;

  let isWorking = false;
  try {
    const testKey = '__evo_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    isWorking = true;
  } catch {
    isWorking = false;
  }

  if (!isWorking) {
    const memoryStore = new Map<string, string>();
    const storageMock: Storage = {
      getItem: (key: string): string | null => {
        return memoryStore.has(key) ? memoryStore.get(key)! : null;
      },
      setItem: (key: string, value: string): void => {
        memoryStore.set(key, String(value));
      },
      removeItem: (key: string): void => {
        memoryStore.delete(key);
      },
      clear: (): void => {
        memoryStore.clear();
      },
      key: (index: number): string | null => {
        const keys = Array.from(memoryStore.keys());
        return keys[index] ?? null;
      },
      get length(): number {
        return memoryStore.size;
      },
    };

    try {
      Object.defineProperty(window, 'localStorage', {
        value: storageMock,
        writable: true,
        configurable: true,
      });
    } catch {
      // If defineProperty fails, fallback to window assignment
      try {
        (window as any).localStorage = storageMock;
      } catch {
        // ignore
      }
    }
  }
})();

export {};
