import { render, screen } from "@testing-library/react";
import AppWrapper from "../AppWrapper.logic";

describe("AppWrapper", () => {
  it("provides the app state and renders the workspace", async () => {
    window.history.pushState({}, "", "/home");
    render(<AppWrapper isStandaloneApp baseRouteName="" />);

    expect(await screen.findByRole("heading", { name: /here’s your day/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
  });
});
