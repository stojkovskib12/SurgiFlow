import { useEffect, useMemo, useState, type JSX } from "react";
import type {
  CaseStatus,
  NewSurgicalCase,
  SurgicalCase,
  SurgicalDocument,
  WorkspaceSection,
} from "../../domain/surgicalCases";
import {
  createDemoCases,
  getTodayKey,
  readCasesFromStorage,
  REQUIRED_DOCUMENTS,
  STORAGE_KEY,
} from "../../domain/surgicalCases";
import HomePageView from "./HomePage.view";

const HomePage = (): JSX.Element => {
  const [cases, setCases] = useState<SurgicalCase[]>(readCasesFromStorage);
  const [activeSection, setActiveSection] = useState<WorkspaceSection>("Overview");
  const [selectedDate, setSelectedDate] = useState(getTodayKey);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCaseFormOpen, setCaseFormOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch {
      setNotice("Changes are available for this session but could not be saved in this browser.");
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
      return `${newCase.operatingRoom} already has a case booked during that time. Choose another room or start time.`;
    }

    const largestId = cases.reduce((largest, surgicalCase) => {
      const numericId = Number(surgicalCase.id.replace("SF-", ""));
      return Number.isNaN(numericId) ? largest : Math.max(largest, numericId);
    }, 2040);
    const surgicalCase: SurgicalCase = {
      ...newCase,
      id: `SF-${largestId + 1}`,
      status: "Scheduled",
      documents: REQUIRED_DOCUMENTS.map((label) => ({
        id: label.toLowerCase().replaceAll(" ", "-"),
        label,
        complete: false,
      })),
    };

    setCases((currentCases) => [...currentCases, surgicalCase]);
    setNotice(`${surgicalCase.id} added to the surgical schedule.`);
    return null;
  };

  const handleStatusChange = (caseId: string, status: CaseStatus): void => {
    setCases((currentCases) => currentCases.map((surgicalCase) => (
      surgicalCase.id === caseId ? { ...surgicalCase, status } : surgicalCase
    )));
    setNotice(`${caseId} status updated.`);
  };

  const handleDocumentToggle = (caseId: string, documentId: string): void => {
    setCases((currentCases) => currentCases.map((surgicalCase) => {
      if (surgicalCase.id !== caseId) {
        return surgicalCase;
      }

      const documents: SurgicalDocument[] = surgicalCase.documents.map((document) => (
        document.id === documentId ? { ...document, complete: !document.complete } : document
      ));
      const allDocumentsComplete = documents.every((document) => document.complete);
      let status = surgicalCase.status;

      if (allDocumentsComplete && ["Scheduled", "Pre-op"].includes(status)) {
        status = "Ready";
      } else if (!allDocumentsComplete && status === "Ready") {
        status = "Pre-op";
      }

      return { ...surgicalCase, documents, status };
    }));
    setNotice(`${caseId} documentation updated.`);
  };

  const handleResetDemo = (): void => {
    setCases(createDemoCases());
    setNotice("Sample cases restored.");
  };

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
      onSectionChange={setActiveSection}
      onSelectedDateChange={setSelectedDate}
      onSearchChange={setSearchTerm}
      onOpenCaseForm={() => setCaseFormOpen(true)}
      onCloseCaseForm={() => setCaseFormOpen(false)}
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
