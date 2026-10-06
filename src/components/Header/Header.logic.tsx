import type { JSX } from "react";
import type { WorkspaceSection } from "../../domain/surgicalCases";
import HeaderView from "./Header.view";

interface HeaderProps {
  sectionName: WorkspaceSection;
}

const Header = ({ sectionName }: HeaderProps): JSX.Element => (
  <HeaderView
    workspaceName="SURGICAL OPERATIONS"
    sectionName={sectionName}
    todayLabel={new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date())}
  />
);

export default Header;
