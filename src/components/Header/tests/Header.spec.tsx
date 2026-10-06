import { render, screen } from "@testing-library/react";
import Header from "../Header.logic";

describe("Header", () => {
  it("shows the active workspace and section", () => {
    render(<Header sectionName="Overview" />);

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent("SURGICAL OPERATIONS");
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Demo workspace")).toBeInTheDocument();
  });
});
