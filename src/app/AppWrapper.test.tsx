import { render, screen } from "@testing-library/react";
import AppWrapper from "./AppWrapper";

describe("AppWrapper", () => {
  it("renders the standalone header and the starter route", async () => {
    window.history.pushState({}, "", "/home");
    render(<AppWrapper isStandaloneApp baseRouteName="" />);

    expect(screen.getByRole("banner")).toHaveTextContent("SurgiFlow");
    expect(await screen.findByRole("main")).toBeInTheDocument();
  });
});
