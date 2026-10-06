import { screen } from "@testing-library/react";
import CasesView from "../Cases.view";
import { createSectionProps, renderInLanguage } from "../../sectionTestUtils";

describe("CasesView localization", () => {
  it("renders English case-register content", async () => {
    await renderInLanguage(<CasesView {...createSectionProps()} />, "en");

    expect(screen.getByRole("heading", { name: /Cases and coordination/ })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "PROCEDURE" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search cases" })).toBeInTheDocument();
  });

  it("renders Macedonian case-register content", async () => {
    await renderInLanguage(<CasesView {...createSectionProps()} />, "mkd");

    expect(screen.getByRole("heading", { name: /Случаи и координација/ })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "ПРОЦЕДУРА" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Пребарај случаи" })).toBeInTheDocument();
  });
});
