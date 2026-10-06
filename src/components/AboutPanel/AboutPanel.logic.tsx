import type { JSX } from "react";
import type { WorkspaceSection } from "../../domain/surgicalCases";
import AboutPanelView from "./AboutPanel.view";

interface AboutPanelProps {
  activeSection: WorkspaceSection;
  onSectionChange: (section: WorkspaceSection) => void;
}

const AboutPanel = ({ activeSection, onSectionChange }: AboutPanelProps): JSX.Element => (
  <AboutPanelView
    productName="SurgiFlow"
    tagline="More time for care. Less friction in every step."
    description="A clearer way for hospitals and surgical teams to coordinate cases, schedules, and the details that keep care moving."
    capabilities={["Surgical case coordination", "Scheduling & capacity", "Patient documentation"]}
    activeSection={activeSection}
    onSectionChange={onSectionChange}
  />
);

export default AboutPanel;
