import type { JSX } from "react";
import type { SupportedLanguage } from "../../localization/i18n";
import "./Header.scss";

export interface HeaderViewProps {
  sectionName: string;
  workspaceName: string;
  todayLabel: string;
  language: SupportedLanguage;
  languageLabel: string;
  englishLabel: string;
  macedonianLabel: string;
  profileLabel: string;
  breadcrumbLabel: string;
  demoWorkspaceLabel: string;
  onLanguageChange: (language: SupportedLanguage) => void;
}

const HeaderView = ({
  sectionName,
  workspaceName,
  todayLabel,
  language,
  languageLabel,
  englishLabel,
  macedonianLabel,
  profileLabel,
  breadcrumbLabel,
  demoWorkspaceLabel,
  onLanguageChange,
}: HeaderViewProps): JSX.Element => (
  <header className="workspace-header">
    <nav className="workspace-breadcrumb" aria-label={breadcrumbLabel}>
      <span>{workspaceName}</span>
      <span className="breadcrumb-divider" aria-hidden="true">/</span>
      <span className="breadcrumb-current">{sectionName}</span>
    </nav>
    <div className="header-tools">
      <span className="header-date">{todayLabel}</span>
      <span className="workspace-status"><span aria-hidden="true" /> {demoWorkspaceLabel}</span>
      <label className="language-picker">
        <span className="visually-hidden">{languageLabel}</span>
        <select
          aria-label={languageLabel}
          onChange={(event) => onLanguageChange(event.target.value as SupportedLanguage)}
          value={language}
        >
          <option value="en">{englishLabel}</option>
          <option value="mkd">{macedonianLabel}</option>
        </select>
      </label>
      <button className="profile-button" type="button" aria-label={profileLabel}>SF</button>
    </div>
  </header>
);

export default HeaderView;
