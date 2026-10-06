import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppRoutes from "../AppRoutes.logic";

describe("AppRoutes", () => {
  it("redirects the root path to the workspace", async () => {
    window.history.pushState({}, "", "/");
    render(<AppRoutes baseRouteName="" isStandaloneApp />);

    expect(await screen.findByRole("heading", { name: /here’s your day/i })).toBeInTheDocument();
  });

  it("supports a configured base route", async () => {
    window.history.pushState({}, "", "/surgiflow/home");
    render(<AppRoutes baseRouteName="/surgiflow/" isStandaloneApp />);

    expect(await screen.findByRole("heading", { name: /here’s your day/i })).toBeInTheDocument();
  });

  it("navigates between workspace sections using their URLs", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/home");
    render(<AppRoutes baseRouteName="" isStandaloneApp />);

    await user.click(await screen.findByRole("button", { name: "Schedule" }));

    expect(window.location.pathname).toBe("/schedule");
    expect(screen.getByRole("heading", { name: /operating room schedule/i })).toBeInTheDocument();
  });
});
