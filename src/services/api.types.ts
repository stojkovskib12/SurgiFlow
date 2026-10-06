import type { CasePriority, CaseStatus } from "../domain/surgicalCases";

export interface ApiSurgicalDocument {
  entityId: string;
  id: string;
  label: string;
  complete: boolean;
}

export interface ApiSurgicalCase {
  entityId: string;
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
  documents: ApiSurgicalDocument[];
}

export interface ApiCapacityRoom {
  operatingRoom: string;
  caseCount: number;
  bookedMinutes: number;
  utilizationPercent: number;
}

export interface ApiCapacitySummary {
  date: string;
  plannedProcedures: number;
  bookedMinutes: number;
  availableRooms: number;
  rooms: ApiCapacityRoom[];
}
