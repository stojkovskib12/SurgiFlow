import { screen } from "@testing-library/react";
import OverviewView from "../Overview.view";
import { createSectionProps, renderInLanguage } from "../../sectionTestUtils";

describe("OverviewView localization", () => {
  it("renders English overview content", async () => {
    await renderInLanguage(<OverviewView {...createSectionProps()} />, "en");

    expect(screen.getByRole("heading", { name: /Here’s your day/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Today’s schedule" })).toBeInTheDocument();
    expect(screen.getByText("CASES TODAY")).toBeInTheDocument();
  });

  it("renders Macedonian overview content", async () => {
    await renderInLanguage(<OverviewView {...createSectionProps()} />, "mkd");

    expect(screen.getByRole("heading", { name: /Еве го денешниот распоред/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Денешен распоред" })).toBeInTheDocument();
    expect(screen.getByText("ДЕНЕШНИ СЛУЧАИ")).toBeInTheDocument();
  });
});
