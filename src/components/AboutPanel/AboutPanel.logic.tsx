import type { JSX } from "react";
import AboutPanelView from "./AboutPanel.view";

const AboutPanel = (): JSX.Element => (
  <AboutPanelView
    productName="SurgiFlow"
    tagline="More time for care. Less friction in every step."
    description="A clearer way for hospitals and surgical teams to coordinate cases, schedules, and the details that keep care moving."
    capabilities={["Surgical case coordination", "Scheduling & capacity", "Patient documentation"]}
  />
);

export default AboutPanel;
