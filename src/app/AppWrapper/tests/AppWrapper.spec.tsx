import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppWrapper from "../AppWrapper.logic";

describe("AppWrapper", () => {
  it("provides the app state and renders the workspace", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/home");
    render(<AppWrapper isStandaloneApp baseRouteName="" />);

    expect(await screen.findByRole("heading", { name: /here’s your day/i })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cases" }));
    expect(window.location.pathname).toBe("/cases");
  });
});
