import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { changeAppLanguage, type SupportedLanguage } from "../../localization/i18n";
import type { WorkspaceSection } from "../../domain/surgicalCases";
import HeaderView from "./Header.view";

interface HeaderProps {
  sectionName: WorkspaceSection;
}

const Header = ({ sectionName }: HeaderProps): JSX.Element => (
  <HeaderContent sectionName={sectionName} />
);

const sectionTranslationKeys: Record<WorkspaceSection, string> = {
  Overview: "navigation.overview",
  Cases: "navigation.cases",
  Schedule: "navigation.schedule",
  Documentation: "navigation.documentation",
  Capacity: "navigation.capacity",
};

const HeaderContent = ({ sectionName }: HeaderProps): JSX.Element => {
  const { t, i18n } = useTranslation();
  const language: SupportedLanguage = i18n.resolvedLanguage === "mkd" ? "mkd" : "en";
  const locale = language === "mkd" ? "mk-MK" : "en-US";

  return (
    <HeaderView
      workspaceName={t("header.workspace")}
      sectionName={t(sectionTranslationKeys[sectionName])}
      todayLabel={new Intl.DateTimeFormat(locale, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(new Date())}
      language={language}
      languageLabel={t("language")}
      englishLabel={t("languages.en")}
      macedonianLabel={t("languages.mkd")}
      profileLabel={t("header.profile")}
      breadcrumbLabel={t("header.breadcrumb")}
      demoWorkspaceLabel={t("header.demoWorkspace")}
      onLanguageChange={changeAppLanguage}
    />
  );
}

export default Header;
