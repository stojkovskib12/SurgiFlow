import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import type { WorkspaceSection } from "../../domain/surgicalCases";
import AboutPanelView from "./AboutPanel.view";

interface AboutPanelProps {
  activeSection: WorkspaceSection;
  onSectionChange: (section: WorkspaceSection) => void;
}

const AboutPanel = ({ activeSection, onSectionChange }: AboutPanelProps): JSX.Element => (
  <AboutPanelContent activeSection={activeSection} onSectionChange={onSectionChange} />
);

const AboutPanelContent = ({ activeSection, onSectionChange }: AboutPanelProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <AboutPanelView
      productName="SurgiFlow"
      tagline={t("sidebar.tagline")}
      description={t("sidebar.description")}
      capabilities={[
        t("sidebar.capabilities.cases"),
        t("sidebar.capabilities.schedule"),
        t("sidebar.capabilities.documentation"),
      ]}
      activeSection={activeSection}
      onSectionChange={onSectionChange}
    />
  );
};

export default AboutPanel;
