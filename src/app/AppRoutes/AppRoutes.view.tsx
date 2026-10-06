import { lazy, Suspense, type JSX } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("../../pages/HomePage/HomePage.logic"));

interface AppRoutesViewProps {
  basePath: string;
}

const AppRoutesView = ({ basePath }: AppRoutesViewProps): JSX.Element => (
  <BrowserRouter>
    <Suspense fallback={<div className="loading-state">Loading workspace…</div>}>
      <Routes>
        <Route path={`${basePath}/home`} element={<HomePage />} />
        <Route path={`${basePath}/auth`} element={<main className="empty-page" />} />
        <Route path="*" element={<Navigate to={`${basePath}/home`} replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRoutesView;
