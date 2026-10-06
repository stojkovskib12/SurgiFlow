import type { JSX } from "react";
import "./Header.scss";

export interface HeaderViewProps {
  sectionName: string;
  workspaceName: string;
}

const HeaderView = ({ sectionName, workspaceName }: HeaderViewProps): JSX.Element => (
  <header className="workspace-header">
    <nav className="workspace-breadcrumb" aria-label="Breadcrumb">
      <span>{workspaceName}</span>
      <span className="breadcrumb-divider" aria-hidden="true">/</span>
      <span className="breadcrumb-current">{sectionName}</span>
    </nav>
    <div className="header-tools">
      <span className="workspace-status"><span aria-hidden="true" /> Workspace ready</span>
      <button className="profile-button" type="button" aria-label="User profile">SF</button>
    </div>
  </header>
);

export default HeaderView;
