export type WorkspaceSection =
  | "Overview"
  | "Cases"
  | "Schedule"
  | "Documentation"
  | "Capacity";

export type CaseStatus =
  | "Scheduled"
  | "Pre-op"
  | "Ready"
  | "In progress"
  | "Completed";

export type CasePriority = "Routine" | "Urgent";

export interface SurgicalDocument {
  id: string;
  label: string;
  complete: boolean;
}

export interface SurgicalCase {
  id: string;
  patientId: string;
  procedure: string;
  surgeon: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  operatingRoom: string;
  status: CaseStatus;
  priority: CasePriority;
  documents: SurgicalDocument[];
}

export interface NewSurgicalCase {
  patientId: string;
  procedure: string;
  surgeon: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  operatingRoom: string;
  priority: CasePriority;
}

export const CASE_STATUSES: CaseStatus[] = [
  "Scheduled",
  "Pre-op",
  "Ready",
  "In progress",
  "Completed",
];

export const REQUIRED_DOCUMENTS = [
  "Consent",
  "Pre-op assessment",
  "Imaging review",
];

export const OPERATING_ROOMS = ["OR 1", "OR 2", "OR 3"];

export const STORAGE_KEY = "surgiflow-cases-v1";

export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayKey = (): string => toDateKey(new Date());

const makeDocuments = (completedCount: number): SurgicalDocument[] =>
  REQUIRED_DOCUMENTS.map((label, index) => ({
    id: label.toLowerCase().replaceAll(" ", "-"),
    label,
    complete: index < completedCount,
  }));

export const createDemoCases = (today = new Date()): SurgicalCase[] => {
  const todayKey = toDateKey(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  return [
    {
      id: "SF-2041",
      patientId: "Patient 1048",
      procedure: "Laparoscopic cholecystectomy",
      surgeon: "Dr. Alex Morgan",
      date: todayKey,
      startTime: "07:30",
      durationMinutes: 120,
      operatingRoom: "OR 1",
      status: "Ready",
      priority: "Routine",
      documents: makeDocuments(3),
    },
    {
      id: "SF-2042",
      patientId: "Patient 2093",
      procedure: "Total knee arthroplasty",
      surgeon: "Dr. Taylor Reed",
      date: todayKey,
      startTime: "09:45",
      durationMinutes: 150,
      operatingRoom: "OR 2",
      status: "Pre-op",
      priority: "Urgent",
      documents: makeDocuments(2),
    },
    {
      id: "SF-2043",
      patientId: "Patient 3176",
      procedure: "Cataract extraction",
      surgeon: "Dr. Jordan Lee",
      date: todayKey,
      startTime: "11:00",
      durationMinutes: 75,
      operatingRoom: "OR 3",
      status: "Scheduled",
      priority: "Routine",
      documents: makeDocuments(1),
    },
    {
      id: "SF-2044",
      patientId: "Patient 4025",
      procedure: "Inguinal hernia repair",
      surgeon: "Dr. Alex Morgan",
      date: toDateKey(tomorrow),
      startTime: "08:15",
      durationMinutes: 90,
      operatingRoom: "OR 1",
      status: "Scheduled",
      priority: "Routine",
      documents: makeDocuments(0),
    },
    {
      id: "SF-2045",
      patientId: "Patient 5182",
      procedure: "Shoulder arthroscopy",
      surgeon: "Dr. Taylor Reed",
      date: toDateKey(dayAfter),
      startTime: "10:30",
      durationMinutes: 120,
      operatingRoom: "OR 2",
      status: "Scheduled",
      priority: "Routine",
      documents: makeDocuments(0),
    },
  ];
};

export const readCasesFromStorage = (): SurgicalCase[] => {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (storedValue) {
      const parsedValue: unknown = JSON.parse(storedValue);
      if (Array.isArray(parsedValue)) {
        return parsedValue as SurgicalCase[];
      }
    }
  } catch {
    // Start with sample records when browser storage is unavailable or invalid.
  }

  return createDemoCases();
};
