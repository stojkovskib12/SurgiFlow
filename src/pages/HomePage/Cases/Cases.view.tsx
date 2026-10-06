import type { JSX } from "react";
import type { CaseStatus } from "../../../domain/surgicalCases";
import { CASE_STATUSES } from "../../../domain/surgicalCases";
import type { HomePageViewProps } from "../HomePageView.types";
import { useHomePageSection } from "../HomePageSection.utils";

const CasesView = ({
  cases,
  filteredCases,
  selectedDate,
  searchTerm,
  onOpenCaseForm,
  onSearchChange,
  onStatusChange,
}: HomePageViewProps): JSX.Element => {
  const { t, locale, localizeRoom, formatDate, formatTime, getStatusClass } = useHomePageSection(cases, selectedDate);

  return (
    <>
      <div className="page-heading-row">
        <div><p className="page-eyebrow">{t("cases.eyebrow")}</p><h1>{t("cases.titleLead")} <span>{t("cases.titleTail")}</span></h1><p className="page-description">{t("cases.description")}</p></div>
        <button className="button-primary" onClick={onOpenCaseForm} type="button">{t("common.addCase")}</button>
      </div>
      <section className="content-panel case-register">
        <div className="panel-toolbar">
          <div><h2>{t("cases.allCases")}</h2><span>{t("cases.caseCount", { count: filteredCases.length })}</span></div>
          <label className="search-field"><span aria-hidden="true">⌕</span><input aria-label={t("cases.search")} onChange={(event) => onSearchChange(event.target.value)} placeholder={t("cases.search")} value={searchTerm} /></label>
        </div>
        <div className="table-scroll">
          <table className="case-table">
            <thead><tr><th>{t("cases.columns.case")}</th><th>{t("cases.columns.procedure")}</th><th>{t("cases.columns.surgeon")}</th><th>{t("cases.columns.schedule")}</th><th>{t("cases.columns.documents")}</th><th>{t("cases.columns.status")}</th></tr></thead>
            <tbody>
              {filteredCases.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.id}</strong><span className="table-subtext">{item.patientId}</span></td>
                  <td><span className="procedure-name">{item.procedure}</span>{item.priority === "Urgent" && <span className="priority-badge">{t("cases.urgent")}</span>}</td>
                  <td>{item.surgeon}</td>
                  <td><strong>{formatDate(item.date, locale)}</strong><span className="table-subtext">{formatTime(item.startTime, locale)} · {localizeRoom(item.operatingRoom)}</span></td>
                  <td><span className={`document-count${item.documents.every((document) => document.complete) ? " is-complete" : ""}`}>{t("cases.documentProgress", { complete: item.documents.filter((document) => document.complete).length, total: item.documents.length })}</span></td>
                  <td><select aria-label={t("status.updateLabel", { caseId: item.id })} className={`status-select status-${getStatusClass(item.status)}`} onChange={(event) => onStatusChange(item.id, event.target.value as CaseStatus)} value={item.status}>
                    {CASE_STATUSES.map((status) => <option disabled={status === "Ready" && !item.documents.every((document) => document.complete)} key={status} value={status}>{t(`status.${status}`)}</option>)}
                  </select></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCases.length === 0 && <div className="empty-state"><span aria-hidden="true">⌕</span><h3>{t("cases.noMatchesTitle")}</h3><p>{t("cases.noMatchesDescription")}</p></div>}
        </div>
      </section>
    </>
  );
};

export default CasesView;
