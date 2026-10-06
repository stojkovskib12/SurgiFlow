import type { JSX } from "react";
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
  <aside className="about-panel">
    <div className="about-brand">
      <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
      <div><div className="brand-name">{productName}</div><div className="brand-caption">SURGICAL OPERATIONS</div></div>
    </div>

    <div className="about-copy">
      <p className="panel-eyebrow">CARE, COORDINATED</p>
      <h1>{tagline}</h1>
      <p className="panel-description">{description}</p>
    </div>

    <nav className="workspace-navigation" aria-label="Main navigation">
      <p className="navigation-label">WORKSPACE</p>
      {(["Overview", "Cases", "Schedule", "Documentation", "Capacity"] as WorkspaceSection[]).map((section, index) => (
        <button
          aria-current={activeSection === section ? "page" : undefined}
          className={`navigation-item${activeSection === section ? " is-active" : ""}`}
          key={section}
          onClick={() => onSectionChange(section)}
          type="button"
        >
          <span aria-hidden="true">{["◫", "▤", "▦", "▧", "◷"][index]}</span>
          {section}
        </button>
      ))}
    </nav>
    <div className="panel-divider" />
    <section className="panel-capabilities" aria-labelledby="capabilities-heading">
      <h2 id="capabilities-heading"><span aria-hidden="true">✳</span> BUILT FOR THE CARE TEAM</h2>
      <p>Keep the people, plans, and patient details behind every procedure moving together.</p>
      <ol>
        {capabilities.map((capability, index) => (
          <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span>{capability}</li>
        ))}
      </ol>
    </section>
    <div className="about-footer"><span className="footer-dot" /> Built for the people behind every procedure</div>
  </aside>
);

export default AboutPanelView;
