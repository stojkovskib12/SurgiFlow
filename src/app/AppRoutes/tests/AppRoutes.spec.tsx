import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { createAppStore } from "../../store";
import { WorkspaceProvider } from "../../WorkspaceContext/WorkspaceContext";
import AppRoutes from "../AppRoutes.logic";

const renderRoutes = (baseRouteName: string) => render(
  <Provider store={createAppStore()}>
    <WorkspaceProvider>
      <AppRoutes baseRouteName={baseRouteName} isStandaloneApp />
    </WorkspaceProvider>
  </Provider>,
);

describe("AppRoutes", () => {
  it("redirects the root path to the workspace", async () => {
    window.history.pushState({}, "", "/");
    renderRoutes("");

    expect(await screen.findByRole("heading", { name: /here’s your day/i })).toBeInTheDocument();
  });

  it("supports a configured base route", async () => {
    window.history.pushState({}, "", "/surgiflow/home");
    renderRoutes("/surgiflow/");

    expect(await screen.findByRole("heading", { name: /here’s your day/i })).toBeInTheDocument();
  });

  it("navigates between workspace sections using their URLs", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/home");
    renderRoutes("");

    await user.click(await screen.findByRole("button", { name: "Schedule" }));

    expect(window.location.pathname).toBe("/schedule");
    expect(screen.getByRole("heading", { name: /operating room schedule/i })).toBeInTheDocument();
  });
});
