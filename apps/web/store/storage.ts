import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/**
 * Production-ready storage adapter for redux-persist
 * Features:
 * - SSR-safe with no-op storage fallback
 * - Error handling for quota exceeded
 * - Graceful degradation
 */

interface NoopStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<string>;
  removeItem: (key: string) => Promise<void>;
}

/**
 * Create a no-op storage for SSR/SSG environments
 */
const createNoopStorage = (): NoopStorage => ({
  getItem: () => Promise.resolve(null),
  setItem: (_, value) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

/**
 * Create a safe storage wrapper with error handling
 */
const createSafeStorage = (baseStorage: Storage): NoopStorage => ({
  getItem: async (key: string): Promise<string | null> => {
    try {
      return baseStorage.getItem(key);
    } catch (error) {
      console.warn(`[redux-persist] Failed to get item "${key}":`, error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<string> => {
    try {
      baseStorage.setItem(key, value);
      return value;
    } catch (error) {
      // Handle quota exceeded error
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        console.warn(
          "[redux-persist] Storage quota exceeded. Clearing old data...",
        );
        try {
          // Try to clear only redux-persist data
          const keysToRemove: string[] = [];
          for (let i = 0; i < baseStorage.length; i++) {
            const storageKey = baseStorage.key(i);
            if (storageKey?.startsWith("persist:")) {
              keysToRemove.push(storageKey);
            }
          }
          keysToRemove.forEach((k) => baseStorage.removeItem(k));
          // Retry setting the item
          baseStorage.setItem(key, value);
          return value;
        } catch (retryError) {
          console.error(
            "[redux-persist] Failed to recover from quota exceeded:",
            retryError,
          );
        }
      }
      console.warn(`[redux-persist] Failed to set item "${key}":`, error);
      return value;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      baseStorage.removeItem(key);
    } catch (error) {
      console.warn(`[redux-persist] Failed to remove item "${key}":`, error);
    }
  },
});

/**
 * SSR-safe storage that uses localStorage in the browser
 * with error handling and graceful degradation
 */
const storage: NoopStorage =
  typeof window !== "undefined"
    ? createSafeStorage(window.localStorage)
    : createNoopStorage();

export default storage;

/**
 * Export session storage variant for sensitive data
 * that shouldn't persist across browser sessions
 */
export const sessionStorage: NoopStorage =
  typeof window !== "undefined"
    ? createSafeStorage(window.sessionStorage)
    : createNoopStorage();
