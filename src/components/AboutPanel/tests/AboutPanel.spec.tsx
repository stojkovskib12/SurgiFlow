import { render, screen } from "@testing-library/react";
import AboutPanel from "../AboutPanel.logic";

describe("AboutPanel", () => {
  it("explains the product and its core capabilities", () => {
    render(<AboutPanel />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("More time for care.");
    expect(screen.getByText(/hospitals and surgical teams/i)).toBeInTheDocument();
    expect(screen.getByText("Surgical case coordination")).toBeInTheDocument();
    expect(screen.getByText("Patient documentation")).toBeInTheDocument();
  });
});
