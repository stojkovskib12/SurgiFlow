import { useMemo, type JSX } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient } from "@tanstack/react-query";
import AppWrapperView from "./AppWrapper.view";

export interface AppWrapperProps {
  isStandaloneApp: boolean;
  baseRouteName: string;
}

const createStore = () => configureStore({ reducer: (state = {}) => state });

export type AppStore = ReturnType<typeof createStore>;

const AppWrapper = ({
  isStandaloneApp = false,
  baseRouteName,
}: AppWrapperProps): JSX.Element => {
  const store = useMemo(createStore, []);
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }), []);

  return (
    <AppWrapperView
      baseRouteName={baseRouteName}
      isStandaloneApp={isStandaloneApp}
      queryClient={queryClient}
      store={store}
    />
  );
};

export default AppWrapper;
