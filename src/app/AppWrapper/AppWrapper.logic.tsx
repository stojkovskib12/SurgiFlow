import { useMemo, type JSX } from "react";
import { QueryClient } from "@tanstack/react-query";
import { createAppStore } from "../store";
import AppWrapperView from "./AppWrapper.view";

export interface AppWrapperProps {
  isStandaloneApp: boolean;
  baseRouteName: string;
}

const AppWrapper = ({
  isStandaloneApp = false,
  baseRouteName,
}: AppWrapperProps): JSX.Element => {
  const store = useMemo(createAppStore, []);
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
