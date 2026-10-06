import { createContext, useContext, useMemo, useState, type JSX, type ReactNode } from "react";

export interface WorkspaceNotice {
  key: string;
  caseId?: string;
}

interface WorkspaceContextValue {
  isCaseFormOpen: boolean;
  notice: WorkspaceNotice | null;
  openCaseForm: () => void;
  closeCaseForm: () => void;
  setNotice: (notice: WorkspaceNotice | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export const WorkspaceProvider = ({ children }: WorkspaceProviderProps): JSX.Element => {
  const [isCaseFormOpen, setCaseFormOpen] = useState(false);
  const [notice, setNotice] = useState<WorkspaceNotice | null>(null);
  const value = useMemo<WorkspaceContextValue>(() => ({
    isCaseFormOpen,
    notice,
    openCaseForm: () => setCaseFormOpen(true),
    closeCaseForm: () => setCaseFormOpen(false),
    setNotice,
  }), [isCaseFormOpen, notice]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspaceContext = (): WorkspaceContextValue => {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspaceContext must be used inside WorkspaceProvider");
  }

  return context;
};
