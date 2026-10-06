import { useEffect, useMemo, useState, type JSX } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import type { NewSurgicalCase, WorkspaceSection } from "../../domain/surgicalCases";
import {
  getTodayKey,
  STORAGE_KEY,
} from "../../domain/surgicalCases";
import {
  caseAdded,
  caseStatusChanged,
  demoCasesRestored,
  documentToggled,
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
  const cases = useAppSelector((state) => state.surgicalCases);
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
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch {
      setNotice({ key: "notifications.storageUnavailable" });
    }
  }, [cases]);

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
      .sort((first, second) => (
        `${first.date}${first.startTime}`.localeCompare(`${second.date}${second.startTime}`)
      ));
  }, [cases, searchTerm]);

  const handleCreateCase = (newCase: NewSurgicalCase): string | null => {
    const startMinutes = timeToMinutes(newCase.startTime);
    const endMinutes = startMinutes + newCase.durationMinutes;
    const hasRoomConflict = cases.some((existingCase) => {
      if (
        existingCase.date !== newCase.date
        || existingCase.operatingRoom !== newCase.operatingRoom
        || existingCase.status === "Completed"
      ) {
        return false;
      }

      const existingStart = timeToMinutes(existingCase.startTime);
      const existingEnd = existingStart + existingCase.durationMinutes;
      return startMinutes < existingEnd && endMinutes > existingStart;
    });

    if (hasRoomConflict) {
      return t("caseForm.roomConflict", {
        room: t("common.operatingRoom", {
          number: newCase.operatingRoom.replace(/\D/g, ""),
        }),
      });
    }

    const largestId = cases.reduce((largest, surgicalCase) => {
      const numericId = Number(surgicalCase.id.replace("SF-", ""));
      return Number.isNaN(numericId) ? largest : Math.max(largest, numericId);
    }, 2040);
    const caseId = `SF-${largestId + 1}`;
    dispatch(caseAdded(newCase));
    setNotice({ key: "notifications.added", caseId });
    return null;
  };

  const handleStatusChange = (caseId: string, status: import("../../domain/surgicalCases").CaseStatus): void => {
    dispatch(caseStatusChanged({ caseId, status }));
    setNotice({ key: "notifications.statusUpdated", caseId });
  };

  const handleDocumentToggle = (caseId: string, documentId: string): void => {
    dispatch(documentToggled({ caseId, documentId }));
    setNotice({ key: "notifications.documentsUpdated", caseId });
  };

  const handleResetDemo = (): void => {
    dispatch(demoCasesRestored());
    setNotice({ key: "notifications.sampleRestored" });
  };

  const handleSectionChange = (section: WorkspaceSection): void => {
    navigate(`${basePath}/${sectionPaths[section]}`);
  };

  useEffect(() => {
    const isKnownRoute = Object.values(sectionPaths).includes(routeSegment ?? "");

    if (!isKnownRoute) {
      navigate(`${basePath}/home`, { replace: true });
    }
  }, [basePath, navigate, routeSegment]);

  return (
    <HomePageView
      cases={cases}
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
      onResetDemo={handleResetDemo}
    />
  );
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export default HomePage;
