"use client";

import { ReactNode, useMemo } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { makeStore } from "./store";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const { store, persistor } = useMemo(() => makeStore(), []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
