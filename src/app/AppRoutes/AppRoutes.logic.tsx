import type { JSX } from "react";
import AppRoutesView from "./AppRoutes.view";

export interface AppRoutesProps {
  baseRouteName: string;
  isStandaloneApp: boolean;
}

const AppRoutes = ({ baseRouteName }: AppRoutesProps): JSX.Element => {
  const normalizedBaseRoute = baseRouteName.split("/").filter(Boolean).join("/");
  const basePath = normalizedBaseRoute ? `/${normalizedBaseRoute}` : "";

  return <AppRoutesView basePath={basePath} />;
};

export default AppRoutes;
