import { screen } from "@testing-library/react";
import CapacityView from "../Capacity.view";
import { createSectionProps, renderInLanguage } from "../../sectionTestUtils";

describe("CapacityView localization", () => {
  it("renders English capacity content", async () => {
    await renderInLanguage(
      <CapacityView {...createSectionProps()} capacitySummary={null} />,
      "en",
    );

    expect(screen.getByRole("heading", { name: /Room capacity/ })).toBeInTheDocument();
    expect(screen.getByText("PLANNED PROCEDURES")).toBeInTheDocument();
    expect(screen.getByLabelText("Operating room utilization: OR 1 25%")).toBeInTheDocument();
  });

  it("renders Macedonian capacity content", async () => {
    await renderInLanguage(
      <CapacityView {...createSectionProps()} capacitySummary={null} />,
      "mkd",
    );

    expect(screen.getByRole("heading", { name: /Капацитет на салите/ })).toBeInTheDocument();
    expect(screen.getByText("ПЛАНИРАНИ ПРОЦЕДУРИ")).toBeInTheDocument();
    expect(screen.getByLabelText("Искористеност на операционите сали: Сала 1 25%")).toBeInTheDocument();
  });
});
