import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import AboutPanel from "../../components/AboutPanel/AboutPanel.logic";
import CaseForm from "../../components/CaseForm/CaseForm.logic";
import Header from "../../components/Header/Header.logic";
import Capacity from "./Capacity/Capacity.logic";
import CasesView from "./Cases/Cases.view";
import DocumentationView from "./Documentation/Documentation.view";
import OverviewView from "./Overview/Overview.view";
import ScheduleView from "./Schedule/Schedule.view";
import type { HomePageViewProps } from "./HomePageView.types";
import "./HomePage.scss";

const HomePageView = (props: HomePageViewProps): JSX.Element => {
  const { t } = useTranslation();
  const {
    activeSection,
    isCaseFormOpen,
    notice,
    casesLoading,
    onCloseCaseForm,
    onCreateCase,
    onRefreshCases,
    onSectionChange,
  } = props;
  const sectionViews = {
    Overview: <OverviewView {...props} />,
    Cases: <CasesView {...props} />,
    Schedule: <ScheduleView {...props} />,
    Documentation: <DocumentationView {...props} />,
    Capacity: <Capacity {...props} />,
  };

  return (
    <div className="app-layout">
      <AboutPanel activeSection={activeSection} onSectionChange={onSectionChange} />
      <div className="app-workspace">
        <Header sectionName={activeSection} />
        <main aria-busy={casesLoading} className="workspace-main">
          {notice && (
            <div aria-live="polite" className="workspace-notice" role="status">
              <span>✓</span>{t(notice.key, { caseId: notice.caseId })}
            </div>
          )}
          {sectionViews[activeSection]}
          <button className="reset-demo-button" onClick={onRefreshCases} type="button">
            {t("common.refreshCases")}
          </button>
        </main>
        <footer className="app-footer">
          <span>{t("common.footerTagline")}</span>
          <span>{t("common.footerDescription")}</span>
        </footer>
      </div>
      {isCaseFormOpen && <CaseForm onClose={onCloseCaseForm} onCreateCase={onCreateCase} />}
    </div>
  );
};

export default HomePageView;
