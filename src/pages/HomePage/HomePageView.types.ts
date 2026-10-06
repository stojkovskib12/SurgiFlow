import type {
  CaseStatus,
  NewSurgicalCase,
  SurgicalCase,
  WorkspaceSection,
} from "../../domain/surgicalCases";

export interface HomePageViewProps {
  cases: SurgicalCase[];
  casesLoading: boolean;
  todayCases: SurgicalCase[];
  filteredCases: SurgicalCase[];
  activeSection: WorkspaceSection;
  selectedDate: string;
  searchTerm: string;
  isCaseFormOpen: boolean;
  notice: { key: string; caseId?: string } | null;
  onSectionChange: (section: WorkspaceSection) => void;
  onSelectedDateChange: (date: string) => void;
  onSearchChange: (searchTerm: string) => void;
  onOpenCaseForm: () => void;
  onCloseCaseForm: () => void;
  onCreateCase: (newCase: NewSurgicalCase) => Promise<string | null>;
  onStatusChange: (caseId: string, status: CaseStatus) => void;
  onDocumentToggle: (caseId: string, documentId: string) => void;
  onRefreshCases: () => void;
}
