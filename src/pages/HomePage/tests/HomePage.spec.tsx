import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../HomePage.logic";
import { STORAGE_KEY } from "../../../domain/surgicalCases";

describe("HomePage", () => {
  beforeEach(() => {
    window.localStorage.removeItem(STORAGE_KEY);
  });

  it("shows today's cases and the operations metrics", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /here’s your day/i })).toBeInTheDocument();
    expect(screen.getByText("CASES TODAY")).toBeInTheDocument();
    expect(screen.getByText("Laparoscopic cholecystectomy")).toBeInTheDocument();
  });

  it("creates a case and makes it searchable in the case register", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "＋ Add case" }));
    await user.type(screen.getByLabelText("Patient reference"), "Patient 6401");
    await user.type(screen.getByLabelText("Procedure"), "Appendectomy");
    await user.type(screen.getByLabelText("Lead surgeon"), "Dr. Casey Stone");
    await user.selectOptions(screen.getByLabelText("Operating room"), "OR 3");
    await user.click(screen.getByRole("button", { name: "Add case" }));
    await user.click(screen.getByRole("button", { name: "Cases" }));

    expect(screen.getByText("SF-2046")).toBeInTheDocument();
    expect(screen.getByText("Appendectomy")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Search cases" }), "Patient 6401");
    expect(screen.getByText("Appendectomy")).toBeInTheDocument();
    expect(screen.queryByText("Cataract extraction")).not.toBeInTheDocument();
  });

  it("blocks a case that overlaps an existing booking in the same room", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "＋ Add case" }));
    await user.type(screen.getByLabelText("Patient reference"), "Patient 6402");
    await user.type(screen.getByLabelText("Procedure"), "Appendectomy");
    await user.type(screen.getByLabelText("Lead surgeon"), "Dr. Casey Stone");
    await user.click(screen.getByRole("button", { name: "Add case" }));

    expect(screen.getByRole("alert")).toHaveTextContent("OR 1 already has a case booked");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("updates case status and persists changes in browser storage", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "Cases" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Update status for SF-2041" }), "In progress");

    expect(screen.getByRole("combobox", { name: "Update status for SF-2041" })).toHaveValue("In progress");
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]")).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "SF-2041", status: "In progress" })]),
    );
  });

  it("marks a case ready when its required documents are complete", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "Documentation" }));
    await user.click(screen.getByRole("checkbox", { name: "Pre-op assessment for SF-2043" }));
    await user.click(screen.getByRole("checkbox", { name: "Imaging review for SF-2043" }));

    const caseCard = screen.getByText("SF-2043 · Patient 3176").closest("article");
    expect(caseCard).not.toBeNull();
    expect(within(caseCard as HTMLElement).getByText("Ready")).toBeInTheDocument();
  });
});
