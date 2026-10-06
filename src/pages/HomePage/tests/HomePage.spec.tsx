import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createAppStore } from "../../../app/store";
import { WorkspaceProvider } from "../../../app/WorkspaceContext/WorkspaceContext";
import HomePage from "../HomePage.logic";
import { mockSurgiFlowApi } from "./apiMock";

describe("HomePage", () => {
  let apiFetch: jest.Mock;

  const renderHomePage = () => render(
    <Provider store={createAppStore()}>
      <WorkspaceProvider>
        <MemoryRouter>
          <HomePage basePath="" />
        </MemoryRouter>
      </WorkspaceProvider>
    </Provider>,
  );

  beforeEach(() => {
    apiFetch = mockSurgiFlowApi();
  });

  it("shows today's cases and the operations metrics", async () => {
    renderHomePage();

    expect(screen.getByRole("heading", { name: /here’s your day/i })).toBeInTheDocument();
    expect(screen.getByText("CASES TODAY")).toBeInTheDocument();
    expect(await screen.findByText("Laparoscopic cholecystectomy")).toBeInTheDocument();
  });

  it("translates route content and navigation when the language changes", async () => {
    const user = userEvent.setup();
    renderHomePage();

    await user.selectOptions(screen.getByRole("combobox", { name: "Language" }), "mkd");
    expect(screen.getByRole("heading", { name: /Еве го денешниот распоред/ })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("lang", "mk");

    await user.click(screen.getByRole("button", { name: "Случаи" }));
    expect(screen.getByRole("heading", { name: /и координација/ })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "ПРОЦЕДУРА" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Распоред" }));
    expect(screen.getByRole("heading", { name: /операционите сали/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Сала 1" })).toBeInTheDocument();
  });

  it("creates a case and makes it searchable in the case register", async () => {
    const user = userEvent.setup();
    renderHomePage();

    await user.click(screen.getByRole("button", { name: "＋ Add case" }));
    await user.type(screen.getByLabelText("Patient reference"), "Patient 6401");
    await user.type(screen.getByLabelText("Procedure"), "Appendectomy");
    await user.type(screen.getByLabelText("Lead surgeon"), "Dr. Casey Stone");
    await user.selectOptions(screen.getByLabelText("Operating room"), "OR 3");
    await user.click(screen.getByRole("button", { name: "Add case" }));
    await user.click(screen.getByRole("button", { name: "Cases" }));

    expect(await screen.findByText("SF-2046")).toBeInTheDocument();
    expect(screen.getByText("Appendectomy")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Search cases" }), "Patient 6401");
    expect(screen.getByText("Appendectomy")).toBeInTheDocument();
    expect(screen.queryByText("Cataract extraction")).not.toBeInTheDocument();
  });

  it("blocks a case that overlaps an existing booking in the same room", async () => {
    const user = userEvent.setup();
    renderHomePage();

    await user.click(screen.getByRole("button", { name: "＋ Add case" }));
    await user.type(screen.getByLabelText("Patient reference"), "Patient 6402");
    await user.type(screen.getByLabelText("Procedure"), "Appendectomy");
    await user.type(screen.getByLabelText("Lead surgeon"), "Dr. Casey Stone");
    await user.click(screen.getByRole("button", { name: "Add case" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("OR 1 already has a case booked");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("updates case status through the API", async () => {
    const user = userEvent.setup();
    renderHomePage();

    await user.click(screen.getByRole("button", { name: "Cases" }));
    await user.selectOptions(
      await screen.findByRole("combobox", { name: "Update status for SF-2041" }),
      "In progress",
    );

    await screen.findByRole("status");
    expect(screen.getByRole("combobox", { name: "Update status for SF-2041" })).toHaveValue("In progress");
    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/cases/00000000-0000-4000-8000-000000002041/status"),
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("marks a case ready when its required documents are complete", async () => {
    const user = userEvent.setup();
    renderHomePage();

    await user.click(screen.getByRole("button", { name: "Documentation" }));
    await user.click(await screen.findByRole("checkbox", { name: "Pre-op assessment for SF-2043" }));
    await user.click(screen.getByRole("checkbox", { name: "Imaging review for SF-2043" }));

    const caseCard = screen.getByText("SF-2043 · Patient 3176").closest("article");
    expect(caseCard).not.toBeNull();
    expect(within(caseCard as HTMLElement).getByText("Ready")).toBeInTheDocument();
  });
});
