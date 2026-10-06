import { lazy, Suspense, type JSX } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("../pages/HomePage/HomePage.logic"));

export interface ILayoutProps {
  baseRouteName: string;
  isStandaloneApp: boolean;
}

const AppRoutes = ({ baseRouteName }: ILayoutProps): JSX.Element => {
  const normalizedBaseRoute = baseRouteName.split("/").filter(Boolean).join("/");
  const basePath = normalizedBaseRoute ? `/${normalizedBaseRoute}` : "";

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading-state">Loading…</div>}>
        <Routes>
          <Route path={`${basePath}/home`} element={<HomePage />} />
          <Route path={`${basePath}/auth`} element={<main className="empty-page" />} />
          <Route path="*" element={<Navigate to={`${basePath}/home`} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
