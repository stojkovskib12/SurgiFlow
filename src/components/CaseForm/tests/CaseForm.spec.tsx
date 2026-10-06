import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CaseForm from "../CaseForm.logic";

describe("CaseForm", () => {
  it("collects case details and submits them", async () => {
    const user = userEvent.setup();
    const onCreateCase = jest.fn();
    render(<CaseForm onClose={jest.fn()} onCreateCase={onCreateCase} />);

    await user.type(screen.getByLabelText("Patient reference"), "Patient 6401");
    await user.type(screen.getByLabelText("Procedure"), "Appendectomy");
    await user.type(screen.getByLabelText("Lead surgeon"), "Dr. Casey Stone");
    await user.selectOptions(screen.getByLabelText("Operating room"), "OR 3");
    await user.click(screen.getByRole("button", { name: "Add case" }));

    await waitFor(() => expect(onCreateCase).toHaveBeenCalledWith(
      expect.objectContaining({
        patientId: "Patient 6401",
        procedure: "Appendectomy",
        surgeon: "Dr. Casey Stone",
        operatingRoom: "OR 3",
      }),
    ));
  });

  it("keeps the form open and shows a conflict returned by scheduling", async () => {
    const user = userEvent.setup();
    render(
      <CaseForm
        onClose={jest.fn()}
        onCreateCase={() => "OR 1 already has a case booked during that time."}
      />,
    );

    await user.type(screen.getByLabelText("Patient reference"), "Patient 6402");
    await user.type(screen.getByLabelText("Procedure"), "Appendectomy");
    await user.type(screen.getByLabelText("Lead surgeon"), "Dr. Casey Stone");
    await user.click(screen.getByRole("button", { name: "Add case" }));

    expect(screen.getByRole("alert")).toHaveTextContent("OR 1 already has a case booked");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
