import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
  isRejectedWithValue,
  Middleware,
} from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createMigrate,
  type MigrationManifest,
  type PersistedState,
} from "redux-persist";

import { coreApi } from "./apis/core.api";

import storage from "./storage";
import appReducer from "./slices/app.slice";

/**
 * Root reducer combining all slice reducers
 */
const rootReducers = combineReducers({
  // API reducers (RTK Query)
  [coreApi.reducerPath]: coreApi.reducer,
  // Slice reducers
  app: appReducer,
});

export type RootState = ReturnType<typeof rootReducers>;

/**
 * State migrations for handling breaking changes across versions
 * Each migration transforms state from version N to N+1
 */
const migrations: MigrationManifest = {
  // Migration from version 0 to 1 (initial)
  0: (state) => {
    return state;
  },
  // Migration from version 1 to 2
  1: (state) => {
    // Example: Clear auth state on version upgrade for security
    if (state && typeof state === "object") {
      const typedState = state as PersistedState & Partial<RootState>;
      return {
        ...typedState,
        app: undefined, // Force re-auth on major version change
      };
    }
    return state;
  },
  // Add future migrations here as needed
  // 2: (state) => { ... },
};

/**
 * Current persist version - increment when making breaking state changes
 */
const PERSIST_VERSION = 1;

/**
 * Persist configuration with selective persistence and migrations
 */
const persistConfig = {
  key: "golojan-accounts",
  storage,
  version: PERSIST_VERSION,
  // Only persist these slices (exclude API cache)
  whitelist: ["app"],
  // State migrations for version upgrades
  migrate: createMigrate(migrations, {
    debug: process.env.NODE_ENV === "development",
  }),
  // Timeout for persistence (10 seconds)
  timeout: 10000,
  // Serialize function (can be customized for encryption)
  serialize: true,
  // Write failures shouldn't crash the app
  writeFailHandler: (error: Error) => {
    console.error("[redux-persist] Write failed:", error);
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

/**
 * RTK Query error logging middleware
 * Logs API errors for debugging without crashing the app
 */
const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as {
      status?: number;
      data?: { message?: string };
    };
    console.warn("[API Error]", {
      type: action.type,
      status: payload?.status,
      message: payload?.data?.message || "Unknown error",
    });
  }
  return next(action);
};

/**
 * Singleton store instance for client-side
 */
let storeInstance: ReturnType<typeof createStore> | null = null;

/**
 * Create the Redux store with all middleware and configuration
 */
function createStore() {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore redux-persist actions for serializable check
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          // Ignore these paths in state
          ignoredPaths: ["_persist"],
        },
        // Enable immutability checks only in development
        immutableCheck: process.env.NODE_ENV === "development",
      })
        .concat(coreApi.middleware)
        .concat(rtkQueryErrorLogger),
    // Enable Redux DevTools only in development
    devTools: process.env.NODE_ENV === "development" && {
      name: "BVCloud Web Store",
      trace: true,
      traceLimit: 25,
      // Sanitize sensitive data in DevTools
      actionSanitizer: <A extends { type: string }>(action: A): A => {
        if (action.type?.includes("setAuthenticated")) {
          return { ...action, payload: "[REDACTED]" };
        }
        return action;
      },
    },
  });

  const persistor = persistStore(store, null, () => {
    // Callback when rehydration is complete
    if (process.env.NODE_ENV === "development") {
      console.log("[redux-persist] Rehydration complete");
    }
  });

  return { store, persistor };
}

/**
 * Get or create the store instance (singleton pattern for client-side)
 * Creates a new store for each request on server-side
 */
export const makeStore = () => {
  // Server-side: always create a new store
  if (typeof window === "undefined") {
    return createStore();
  }

  // Client-side: use singleton pattern
  if (!storeInstance) {
    storeInstance = createStore();
  }

  return storeInstance;
};

/**
 * Reset the store instance (useful for testing or logout)
 */
export const resetStore = () => {
  if (storeInstance) {
    storeInstance.persistor.purge();
    storeInstance = null;
  }
};

// Type exports
export type AppStore = ReturnType<typeof makeStore>["store"];
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
