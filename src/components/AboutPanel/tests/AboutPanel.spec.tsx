import { render, screen } from "@testing-library/react";
import AboutPanel from "../AboutPanel.logic";
import type { WorkspaceSection } from "../../../domain/surgicalCases";

describe("AboutPanel", () => {
  it("explains the product and its core capabilities", () => {
    const onSectionChange = jest.fn<void, [WorkspaceSection]>();
    render(<AboutPanel activeSection="Overview" onSectionChange={onSectionChange} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("More time for care.");
    expect(screen.getByText(/hospitals and surgical teams/i)).toBeInTheDocument();
    expect(screen.getByText("Surgical case coordination")).toBeInTheDocument();
    expect(screen.getByText("Patient documentation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Overview" })).toHaveAttribute("aria-current", "page");
    screen.getByRole("button", { name: "Schedule" }).click();
    expect(onSectionChange).toHaveBeenCalledWith("Schedule");
  });
});
