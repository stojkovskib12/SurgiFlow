import { screen } from "@testing-library/react";
import DocumentationView from "../Documentation.view";
import { createSectionProps, renderInLanguage } from "../../sectionTestUtils";

describe("DocumentationView localization", () => {
  it("renders English documentation content", async () => {
    await renderInLanguage(<DocumentationView {...createSectionProps()} />, "en");

    expect(screen.getByRole("heading", { name: /Documentation readiness/ })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Consent for SF-2041" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Pre-op assessment for SF-2041" })).toBeInTheDocument();
  });

  it("renders Macedonian documentation content", async () => {
    await renderInLanguage(<DocumentationView {...createSectionProps()} />, "mkd");

    expect(screen.getByRole("heading", { name: /Подготвеност на документацијата/ })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Согласност for SF-2041" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Предоперативна проценка for SF-2041" })).toBeInTheDocument();
  });
});
