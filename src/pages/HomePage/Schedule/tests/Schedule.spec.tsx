import { screen } from "@testing-library/react";
import ScheduleView from "../Schedule.view";
import { createSectionProps, renderInLanguage } from "../../sectionTestUtils";

describe("ScheduleView localization", () => {
  it("renders English schedule content", async () => {
    await renderInLanguage(<ScheduleView {...createSectionProps()} />, "en");

    expect(screen.getByRole("heading", { name: /Operating room schedule/ })).toBeInTheDocument();
    expect(screen.getByLabelText("Schedule date")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "OR 1" })).toBeInTheDocument();
  });

  it("renders Macedonian schedule content", async () => {
    await renderInLanguage(<ScheduleView {...createSectionProps()} />, "mkd");

    expect(screen.getByRole("heading", { name: /Распоред на операционите сали/ })).toBeInTheDocument();
    expect(screen.getByLabelText("Датум на распоред")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Сала 1" })).toBeInTheDocument();
  });
});
