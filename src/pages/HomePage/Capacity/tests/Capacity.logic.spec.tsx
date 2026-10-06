import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WorkspaceProvider, useWorkspaceContext } from "../../../../app/WorkspaceContext/WorkspaceContext";
import type { ApiCapacitySummary } from "../../../../services/api.types";
import { getCapacity } from "../../../../services/surgicalCasesApi";
import { createSectionProps } from "../../sectionTestUtils";
import Capacity from "../Capacity.logic";

jest.mock("../../../../services/surgicalCasesApi", () => ({
  getCapacity: jest.fn(),
}));

jest.mock("../Capacity.view", () => ({
  __esModule: true,
  default: ({ capacitySummary }: { capacitySummary: ApiCapacitySummary | null }) => (
    <output data-testid="capacity-summary">
      {capacitySummary ? `${capacitySummary.date}:${capacitySummary.plannedProcedures}` : "loading"}
    </output>
  ),
}));

const summaryFor = (date: string, plannedProcedures: number): ApiCapacitySummary => ({
  date,
  plannedProcedures,
  bookedMinutes: 90,
  availableRooms: 2,
  rooms: [],
});

const NoticeProbe = () => {
  const { notice } = useWorkspaceContext();
  return <output data-testid="notice">{notice?.key ?? "none"}</output>;
};

const renderCapacity = (selectedDate = "2026-10-06") => {
  const props = { ...createSectionProps(), selectedDate };
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <WorkspaceProvider>
        <Capacity {...props} />
        <NoticeProbe />
      </WorkspaceProvider>
    </QueryClientProvider>,
  );
};

const mockedGetCapacity = jest.mocked(getCapacity);

describe("Capacity logic", () => {
  beforeEach(() => mockedGetCapacity.mockReset());

  it("loads and displays the capacity summary for the selected date", async () => {
    mockedGetCapacity.mockResolvedValue(summaryFor("2026-10-06", 4));

    renderCapacity();

    expect(mockedGetCapacity).toHaveBeenCalledWith("2026-10-06");
    expect(await screen.findByText("2026-10-06:4")).toBeInTheDocument();
    expect(screen.getByTestId("notice")).toHaveTextContent("none");
  });

  it("requests a new summary when the selected date changes", async () => {
    mockedGetCapacity
      .mockResolvedValueOnce(summaryFor("2026-10-06", 4))
      .mockResolvedValueOnce(summaryFor("2026-10-07", 2));
    const props = { ...createSectionProps(), selectedDate: "2026-10-06" };
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceProvider><Capacity {...props} /></WorkspaceProvider>
      </QueryClientProvider>,
    );
    expect(await screen.findByText("2026-10-06:4")).toBeInTheDocument();

    rerender(
      <QueryClientProvider client={queryClient}>
        <WorkspaceProvider><Capacity {...props} selectedDate="2026-10-07" /></WorkspaceProvider>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("2026-10-07:2")).toBeInTheDocument();
    expect(mockedGetCapacity).toHaveBeenNthCalledWith(2, "2026-10-07");
  });

  it("shows the API unavailable notice when loading fails", async () => {
    mockedGetCapacity.mockRejectedValue(new Error("offline"));

    renderCapacity();

    await waitFor(() => expect(screen.getByTestId("notice")).toHaveTextContent("notifications.apiUnavailable"));
    expect(screen.getByTestId("capacity-summary")).toHaveTextContent("loading");
  });

  it("keeps the selected date's summary when an older date request resolves later", async () => {
    let resolveOldRequest!: (value: ApiCapacitySummary) => void;
    mockedGetCapacity
      .mockImplementationOnce(() => new Promise((resolve) => { resolveOldRequest = resolve; }))
      .mockResolvedValueOnce(summaryFor("2026-10-07", 2));
    const props = { ...createSectionProps(), selectedDate: "2026-10-06" };
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceProvider><Capacity {...props} /></WorkspaceProvider>
      </QueryClientProvider>,
    );
    rerender(
      <QueryClientProvider client={queryClient}>
        <WorkspaceProvider><Capacity {...props} selectedDate="2026-10-07" /></WorkspaceProvider>
      </QueryClientProvider>,
    );
    expect(await screen.findByText("2026-10-07:2")).toBeInTheDocument();

    await act(async () => resolveOldRequest(summaryFor("2026-10-06", 99)));

    expect(screen.getByTestId("capacity-summary")).toHaveTextContent("2026-10-07:2");
  });

  it("reuses cached capacity data without refetching when returning within the stale time", async () => {
    mockedGetCapacity
      .mockResolvedValueOnce(summaryFor("2026-10-06", 4))
      .mockResolvedValueOnce(summaryFor("2026-10-07", 2));
    const props = { ...createSectionProps(), selectedDate: "2026-10-06" };
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <WorkspaceProvider><Capacity {...props} /></WorkspaceProvider>
      </QueryClientProvider>,
    );
    expect(await screen.findByText("2026-10-06:4")).toBeInTheDocument();

    rerender(
      <QueryClientProvider client={queryClient}>
        <WorkspaceProvider><Capacity {...props} selectedDate="2026-10-07" /></WorkspaceProvider>
      </QueryClientProvider>,
    );
    expect(await screen.findByText("2026-10-07:2")).toBeInTheDocument();

    rerender(
      <QueryClientProvider client={queryClient}>
        <WorkspaceProvider><Capacity {...props} /></WorkspaceProvider>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("2026-10-06:4")).toBeInTheDocument();
    expect(mockedGetCapacity).toHaveBeenCalledTimes(2);
  });
});
