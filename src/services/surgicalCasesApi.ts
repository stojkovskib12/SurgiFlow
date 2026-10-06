import type { NewSurgicalCase } from "../domain/surgicalCases";
import type { ApiCapacitySummary, ApiSurgicalCase } from "./api.types";

const apiRoot = (window.REACT_API_URL ?? "http://localhost:5000") + "/api";

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(apiRoot + path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => null) as {
      detail?: string;
      title?: string;
      errors?: Record<string, string[]>;
    } | null;
    const validationError = Object.values(problem?.errors ?? {}).flat()[0];
    throw new Error(
      problem?.detail
      ?? validationError
      ?? problem?.title
      ?? "Request failed (" + response.status + ").",
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const getSurgicalCases = (): Promise<ApiSurgicalCase[]> =>
  request<ApiSurgicalCase[]>("/cases");

export const createSurgicalCase = (surgicalCase: NewSurgicalCase): Promise<ApiSurgicalCase> =>
  request<ApiSurgicalCase>("/cases", {
    method: "POST",
    body: JSON.stringify(surgicalCase),
  });

export const updateSurgicalCaseStatus = (entityId: string, status: string): Promise<void> =>
  request<void>("/cases/" + entityId + "/status", {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const toggleSurgicalDocument = (
  caseEntityId: string,
  documentEntityId: string,
): Promise<void> =>
  request<void>("/cases/" + caseEntityId + "/documents/" + documentEntityId, {
    method: "PATCH",
  });

export const getCapacity = (date: string): Promise<ApiCapacitySummary> =>
  request<ApiCapacitySummary>("/capacity?date=" + encodeURIComponent(date));
