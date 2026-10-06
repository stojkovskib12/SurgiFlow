import { render, screen } from "@testing-library/react";
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
});
