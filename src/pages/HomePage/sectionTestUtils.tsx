import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { createDemoCases, getTodayKey } from "../../domain/surgicalCases";
import i18n from "../../localization/i18n";
import type { HomePageViewProps } from "./HomePageView.types";

export const createSectionProps = (): HomePageViewProps => {
  const cases = createDemoCases();

  return {
    cases,
    todayCases: cases.filter((item) => item.date === getTodayKey()),
    filteredCases: cases,
    activeSection: "Overview",
    selectedDate: getTodayKey(),
    searchTerm: "",
    isCaseFormOpen: false,
    notice: null,
    onSectionChange: jest.fn(),
    onSelectedDateChange: jest.fn(),
    onSearchChange: jest.fn(),
    onOpenCaseForm: jest.fn(),
    onCloseCaseForm: jest.fn(),
    onCreateCase: jest.fn(() => null),
    onStatusChange: jest.fn(),
    onDocumentToggle: jest.fn(),
    onResetDemo: jest.fn(),
  };
};

export const renderInLanguage = async (element: ReactElement, language: "en" | "mkd") => {
  await i18n.changeLanguage(language);
  return render(element);
};
