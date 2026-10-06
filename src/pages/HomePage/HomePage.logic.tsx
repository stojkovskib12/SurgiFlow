import type { JSX } from "react";
import HomePageView from "./HomePage.view";

const HomePage = (): JSX.Element => (
  <HomePageView
    highlights={[
      { number: "01", label: "Coordinate cases", description: "Keep case details and team handoffs connected." },
      { number: "02", label: "Plan schedules", description: "Make surgical time and resource needs easier to see." },
      { number: "03", label: "Prepare with confidence", description: "Bring essential patient documentation into view." },
    ]}
  />
);

export default HomePage;
