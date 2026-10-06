import { render, screen } from "@testing-library/react";
import HomePage from "../HomePage.logic";

describe("HomePage", () => {
  it("renders the surgical operations landing page", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /good care takes a great team/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Coordinate cases" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Plan schedules" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Prepare with confidence" })).toBeInTheDocument();
  });
});
