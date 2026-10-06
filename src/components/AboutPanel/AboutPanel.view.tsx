import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import type { WorkspaceSection } from "../../domain/surgicalCases";
import "./AboutPanel.scss";

export interface AboutPanelViewProps {
  productName: string;
  tagline: string;
  description: string;
  capabilities: string[];
  activeSection: WorkspaceSection;
  onSectionChange: (section: WorkspaceSection) => void;
}

const AboutPanelView = ({
  productName,
  tagline,
  description,
  capabilities,
  activeSection,
  onSectionChange,
}: AboutPanelViewProps): JSX.Element => (
  <AboutPanelContent
    productName={productName}
    tagline={tagline}
    description={description}
    capabilities={capabilities}
    activeSection={activeSection}
    onSectionChange={onSectionChange}
  />
);

const AboutPanelContent = ({
  productName,
  tagline,
  description,
  capabilities,
  activeSection,
  onSectionChange,
}: AboutPanelViewProps): JSX.Element => {
  const { t } = useTranslation();
  const sections: { section: WorkspaceSection; translationKey: string; icon: string }[] = [
    { section: "Overview", translationKey: "navigation.overview", icon: "◫" },
    { section: "Cases", translationKey: "navigation.cases", icon: "▤" },
    { section: "Schedule", translationKey: "navigation.schedule", icon: "▦" },
    { section: "Documentation", translationKey: "navigation.documentation", icon: "▧" },
    { section: "Capacity", translationKey: "navigation.capacity", icon: "◷" },
  ];

  return (
    <aside className="about-panel">
    <div className="about-brand">
      <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
      <div><div className="brand-name">{productName}</div><div className="brand-caption">{t("sidebar.brandCaption")}</div></div>
    </div>

    <div className="about-copy">
      <p className="panel-eyebrow">{t("sidebar.eyebrow")}</p>
      <h1>{tagline}</h1>
      <p className="panel-description">{description}</p>
    </div>

    <nav className="workspace-navigation" aria-label={t("sidebar.navigationLabel")}>
      <p className="navigation-label">{t("sidebar.workspace")}</p>
      {sections.map(({ section, translationKey, icon }) => (
        <button
          aria-current={activeSection === section ? "page" : undefined}
          className={`navigation-item${activeSection === section ? " is-active" : ""}`}
          key={section}
          onClick={() => onSectionChange(section)}
          type="button"
        >
          <span aria-hidden="true">{icon}</span>
          {t(translationKey)}
        </button>
      ))}
    </nav>
    <div className="panel-divider" />
    <section className="panel-capabilities" aria-labelledby="capabilities-heading">
      <h2 id="capabilities-heading"><span aria-hidden="true">✳</span> {t("sidebar.capabilitiesHeading")}</h2>
      <p>{t("sidebar.capabilitiesDescription")}</p>
      <ol>
        {capabilities.map((capability, index) => (
          <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span>{capability}</li>
        ))}
      </ol>
    </section>
    <div className="about-footer"><span className="footer-dot" /> {t("sidebar.footer")}</div>
    </aside>
  );
};

export default AboutPanelView;
