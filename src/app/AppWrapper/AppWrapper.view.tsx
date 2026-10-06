import type { JSX } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import AppRoutes from "../AppRoutes/AppRoutes.logic";
import type { AppStore } from "./AppWrapper.logic";

interface AppWrapperViewProps {
  isStandaloneApp: boolean;
  baseRouteName: string;
  queryClient: QueryClient;
  store: AppStore;
}

const AppWrapperView = ({
  isStandaloneApp,
  baseRouteName,
  queryClient,
  store,
}: AppWrapperViewProps): JSX.Element => (
  <div className="app-root" data-standalone={isStandaloneApp}>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRoutes baseRouteName={baseRouteName} isStandaloneApp={isStandaloneApp} />
        <div aria-live="polite" id="notification-region" />
      </QueryClientProvider>
    </Provider>
  </div>
);

export default AppWrapperView;
