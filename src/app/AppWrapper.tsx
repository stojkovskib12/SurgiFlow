import type { JSX } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import AppRoutes from "./AppRoutes";

export interface ILayoutProps {
  isStandaloneApp: boolean;
  baseRouteName: string;
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

const createStore = () => configureStore({ reducer: (state = {}) => state });

const AppWrapper = ({
  isStandaloneApp = false,
  baseRouteName,
}: ILayoutProps): JSX.Element => (
  <Provider store={createStore()}>
    <QueryClientProvider client={queryClient}>
      {isStandaloneApp && <header className="app-header">SurgiFlow</header>}
      <AppRoutes baseRouteName={baseRouteName} isStandaloneApp={isStandaloneApp} />
      <div aria-live="polite" id="notification-region" />
    </QueryClientProvider>
  </Provider>
);

export default AppWrapper;
