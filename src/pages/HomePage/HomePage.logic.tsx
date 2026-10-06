import { useEffect, useMemo, useState, type JSX } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import type { CaseStatus, NewSurgicalCase, WorkspaceSection } from "../../domain/surgicalCases";
import { getTodayKey } from "../../domain/surgicalCases";
import {
  addSurgicalCase,
  changeSurgicalCaseStatus,
  changeSurgicalDocument,
  fetchSurgicalCases,
} from "../../app/store/surgicalCases.slice";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { useWorkspaceContext } from "../../app/WorkspaceContext/WorkspaceContext";
import HomePageView from "./HomePage.view";

interface HomePageProps {
  basePath: string;
}

const sectionPaths: Record<WorkspaceSection, string> = {
  Overview: "home",
  Cases: "cases",
  Schedule: "schedule",
  Documentation: "documentation",
  Capacity: "capacity",
};

const HomePage = ({ basePath }: HomePageProps): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cases = useAppSelector((state) => state.surgicalCases.items);
  const casesLoading = useAppSelector((state) => state.surgicalCases.loading);
  const {
    isCaseFormOpen,
    notice,
    openCaseForm,
    closeCaseForm,
    setNotice,
  } = useWorkspaceContext();
  const { pathname } = useLocation();
  const baseSegmentCount = basePath.split("/").filter(Boolean).length;
  const routeSegment = pathname.split("/").filter(Boolean).slice(baseSegmentCount).at(-1);
  const activeSection = (Object.entries(sectionPaths).find(([, path]) => path === routeSegment)?.[0]
    ?? "Overview") as WorkspaceSection;
  const [selectedDate, setSelectedDate] = useState(getTodayKey);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    void dispatch(fetchSurgicalCases())
      .unwrap()
      .catch(() => setNotice({ key: "notifications.apiUnavailable" }));
  }, [dispatch, setNotice]);

  const todayCases = useMemo(
    () => cases.filter((surgicalCase) => surgicalCase.date === getTodayKey()),
    [cases],
  );

  const filteredCases = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return cases
      .filter((surgicalCase) => (
        surgicalCase.patientId.toLowerCase().includes(normalizedSearch)
        || surgicalCase.procedure.toLowerCase().includes(normalizedSearch)
        || surgicalCase.surgeon.toLowerCase().includes(normalizedSearch)
        || surgicalCase.id.toLowerCase().includes(normalizedSearch)
      ))
      .sort((first, second) =>
        (first.date + first.startTime).localeCompare(second.date + second.startTime));
  }, [cases, searchTerm]);

  const handleCreateCase = async (newCase: NewSurgicalCase): Promise<string | null> => {
    try {
      const createdCase = await dispatch(addSurgicalCase(newCase)).unwrap();
      setNotice({ key: "notifications.added", caseId: createdCase.id });
      return null;
    } catch (error) {
      if (
        typeof error === "object"
        && error !== null
        && "message" in error
        && typeof error.message === "string"
      ) {
        return error.message;
      }

      return t("notifications.apiUnavailable");
    }
  };

  const handleStatusChange = (caseId: string, status: CaseStatus): void => {
    const surgicalCase = cases.find((item) => item.id === caseId);
    if (!surgicalCase?.entityId) {
      return;
    }

    void dispatch(changeSurgicalCaseStatus({
      caseId,
      entityId: surgicalCase.entityId,
      status,
    })).unwrap().then(
      () => setNotice({ key: "notifications.statusUpdated", caseId }),
      () => setNotice({ key: "notifications.apiUnavailable" }),
    );
  };

  const handleDocumentToggle = (caseId: string, documentId: string): void => {
    const surgicalCase = cases.find((item) => item.id === caseId);
    const document = surgicalCase?.documents.find((item) => item.id === documentId);
    if (!surgicalCase?.entityId || !document?.entityId) {
      return;
    }

    void dispatch(changeSurgicalDocument({
      caseId,
      caseEntityId: surgicalCase.entityId,
      documentId,
      documentEntityId: document.entityId,
    })).unwrap().then(
      () => setNotice({ key: "notifications.documentsUpdated", caseId }),
      () => setNotice({ key: "notifications.apiUnavailable" }),
    );
  };

  const handleRefreshCases = (): void => {
    void dispatch(fetchSurgicalCases()).unwrap().then(
      () => setNotice({ key: "notifications.refreshed" }),
      () => setNotice({ key: "notifications.apiUnavailable" }),
    );
  };

  const handleSectionChange = (section: WorkspaceSection): void => {
    navigate(basePath + "/" + sectionPaths[section]);
  };

  useEffect(() => {
    const isKnownRoute = Object.values(sectionPaths).includes(routeSegment ?? "");

    if (!isKnownRoute) {
      navigate(basePath + "/home", { replace: true });
    }
  }, [basePath, navigate, routeSegment]);

  return (
    <HomePageView
      cases={cases}
      casesLoading={casesLoading}
      todayCases={todayCases}
      filteredCases={filteredCases}
      activeSection={activeSection}
      selectedDate={selectedDate}
      searchTerm={searchTerm}
      isCaseFormOpen={isCaseFormOpen}
      notice={notice}
      onSectionChange={handleSectionChange}
      onSelectedDateChange={setSelectedDate}
      onSearchChange={setSearchTerm}
      onOpenCaseForm={openCaseForm}
      onCloseCaseForm={closeCaseForm}
      onCreateCase={handleCreateCase}
      onStatusChange={handleStatusChange}
      onDocumentToggle={handleDocumentToggle}
      onRefreshCases={handleRefreshCases}
    />
  );
};

export default HomePage;
