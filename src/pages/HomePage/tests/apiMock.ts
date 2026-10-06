import { createDemoCases } from "../../../domain/surgicalCases";
import type { ApiSurgicalCase } from "../../../services/api.types";

export const createApiCases = (): ApiSurgicalCase[] => createDemoCases().map((item) => {
  const entityId = "00000000-0000-4000-8000-" + item.id.slice(-4).padStart(12, "0");

  return {
    ...item,
    entityId,
    documents: item.documents.map((document, index) => ({
      ...document,
      entityId: "10000000-0000-4000-8000-" + item.id.slice(-4).padStart(8, "0") + String(index + 1).padStart(4, "0"),
    })),
  };
});

export const mockSurgiFlowApi = (): jest.Mock => {
  const cases = createApiCases();
  const fetchMock = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";

    if (method === "POST" && url.endsWith("/api/cases")) {
      const values = JSON.parse(String(init?.body));
      if (values.operatingRoom === "OR 1") {
        return mockResponse(
          { title: "OR 1 already has a case booked during that time." },
          409,
        );
      }

      const createdCase: ApiSurgicalCase = {
        ...values,
        entityId: "20000000-0000-4000-8000-000000000001",
        id: "SF-2046",
        status: "Scheduled",
        documents: [
          { entityId: "30000000-0000-4000-8000-000000000001", id: "consent", label: "Consent", complete: false },
          { entityId: "30000000-0000-4000-8000-000000000002", id: "pre-op-assessment", label: "Pre-op assessment", complete: false },
          { entityId: "30000000-0000-4000-8000-000000000003", id: "imaging-review", label: "Imaging review", complete: false },
        ],
      };
      return mockResponse(createdCase, 201);
    }

    if (method === "PATCH") {
      return mockResponse(null, 204);
    }

    return mockResponse(cases, 200);
  });

  global.fetch = fetchMock as typeof fetch;
  return fetchMock;
};

const mockResponse = (body: unknown, status: number): Response => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
} as Response);
