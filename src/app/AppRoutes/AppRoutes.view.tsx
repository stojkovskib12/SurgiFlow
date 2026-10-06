import { lazy, Suspense, type JSX } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("../../pages/HomePage/HomePage.logic"));

interface AppRoutesViewProps {
  basePath: string;
}

const AppRoutesView = ({ basePath }: AppRoutesViewProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading-state">{t("common.loading")}</div>}>
        <Routes>
          <Route path={`${basePath}/auth`} element={<main className="empty-page" />} />
          <Route path={`${basePath}/*`} element={<HomePage basePath={basePath} />} />
          <Route path="*" element={<Navigate to={`${basePath}/home`} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutesView;
