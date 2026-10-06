import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import AboutPanel from "../../components/AboutPanel/AboutPanel.logic";
import CaseForm from "../../components/CaseForm/CaseForm.logic";
import Header from "../../components/Header/Header.logic";
import type {
  CaseStatus,
  NewSurgicalCase,
  SurgicalCase,
  WorkspaceSection,
} from "../../domain/surgicalCases";
import { CASE_STATUSES, OPERATING_ROOMS } from "../../domain/surgicalCases";
import "./HomePage.scss";

export interface HomePageViewProps {
  cases: SurgicalCase[];
  todayCases: SurgicalCase[];
  filteredCases: SurgicalCase[];
  activeSection: WorkspaceSection;
  selectedDate: string;
  searchTerm: string;
  isCaseFormOpen: boolean;
  notice: { key: string; caseId?: string } | null;
  onSectionChange: (section: WorkspaceSection) => void;
  onSelectedDateChange: (date: string) => void;
  onSearchChange: (searchTerm: string) => void;
  onOpenCaseForm: () => void;
  onCloseCaseForm: () => void;
  onCreateCase: (newCase: NewSurgicalCase) => string | null;
  onStatusChange: (caseId: string, status: CaseStatus) => void;
  onDocumentToggle: (caseId: string, documentId: string) => void;
  onResetDemo: () => void;
}

const formatDate = (dateKey: string, locale: string): string => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
};

const formatTime = (time: string, locale: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getStatusClass = (status: CaseStatus): string =>
  status.toLowerCase().replaceAll(" ", "-");

const HomePageView = ({
  cases,
  todayCases,
  filteredCases,
  activeSection,
  selectedDate,
  searchTerm,
  isCaseFormOpen,
  notice,
  onSectionChange,
  onSelectedDateChange,
  onSearchChange,
  onOpenCaseForm,
  onCloseCaseForm,
  onCreateCase,
  onStatusChange,
  onDocumentToggle,
  onResetDemo,
}: HomePageViewProps): JSX.Element => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === "mkd" ? "mk-MK" : "en-US";
  const localizeRoom = (room: string): string => t("common.operatingRoom", {
    number: room.replace(/\D/g, ""),
  });
  const selectedDateCases = cases
    .filter((surgicalCase) => surgicalCase.date === selectedDate)
    .sort((first, second) => first.startTime.localeCompare(second.startTime));
  const documentsReadyCount = cases.filter((surgicalCase) => (
    surgicalCase.documents.every((document) => document.complete)
  )).length;
  const scheduledMinutesToday = todayCases.reduce(
    (total, surgicalCase) => total + surgicalCase.durationMinutes,
    0,
  );

  const renderCaseTable = (): JSX.Element => (
    <div className="table-scroll">
      <table className="case-table">
        <thead>
          <tr>
                <th>{t("cases.columns.case")}</th>
                <th>{t("cases.columns.procedure")}</th>
                <th>{t("cases.columns.surgeon")}</th>
                <th>{t("cases.columns.schedule")}</th>
                <th>{t("cases.columns.documents")}</th>
                <th>{t("cases.columns.status")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredCases.map((surgicalCase) => (
            <tr key={surgicalCase.id}>
              <td>
                <strong>{surgicalCase.id}</strong>
                <span className="table-subtext">{surgicalCase.patientId}</span>
              </td>
              <td>
                <span className="procedure-name">{surgicalCase.procedure}</span>
                {surgicalCase.priority === "Urgent" && <span className="priority-badge">{t("cases.urgent")}</span>}
              </td>
              <td>{surgicalCase.surgeon}</td>
              <td>
                <strong>{formatDate(surgicalCase.date, locale)}</strong>
                <span className="table-subtext">{formatTime(surgicalCase.startTime, locale)} · {localizeRoom(surgicalCase.operatingRoom)}</span>
              </td>
              <td>
                <span className={`document-count${surgicalCase.documents.every((document) => document.complete) ? " is-complete" : ""}`}>
                  {t("cases.documentProgress", {
                    complete: surgicalCase.documents.filter((document) => document.complete).length,
                    total: surgicalCase.documents.length,
                  })}
                </span>
              </td>
              <td>
                <select
                  aria-label={t("status.updateLabel", { caseId: surgicalCase.id })}
                  className={`status-select status-${getStatusClass(surgicalCase.status)}`}
                  onChange={(event) => onStatusChange(surgicalCase.id, event.target.value as CaseStatus)}
                  value={surgicalCase.status}
                >
                  {CASE_STATUSES.map((status) => (
                    <option
                      disabled={status === "Ready" && !surgicalCase.documents.every((document) => document.complete)}
                      key={status}
                      value={status}
                    >
                      {t(`status.${status}`)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredCases.length === 0 && (
        <div className="empty-state">
          <span aria-hidden="true">⌕</span>
          <h3>{t("cases.noMatchesTitle")}</h3>
          <p>{t("cases.noMatchesDescription")}</p>
        </div>
      )}
    </div>
  );

  const renderOverview = (): JSX.Element => (
    <>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">{t("overview.eyebrow")}</p>
          <h1>{t("overview.titleLead")} <span>{t("overview.titleTail")}</span></h1>
          <p className="page-description">{t("overview.description")}</p>
        </div>
        <button className="button-primary" onClick={onOpenCaseForm} type="button">{t("common.addCase")}</button>
      </div>

        <section aria-label={t("overview.operationsLabel")} className="metric-grid">
        <article className="metric-card">
          <div className="metric-topline"><span>{t("overview.casesToday")}</span><span className="metric-icon">▤</span></div>
          <strong>{todayCases.length}</strong>
          <p>{t("overview.scheduledProcedures")}</p>
        </article>
        <article className="metric-card">
          <div className="metric-topline"><span>{t("overview.readyToGo")}</span><span className="metric-icon is-green">✓</span></div>
          <strong>{todayCases.filter((surgicalCase) => surgicalCase.status === "Ready").length}</strong>
          <p>{t("overview.readinessConfirmed")}</p>
        </article>
        <article className="metric-card">
          <div className="metric-topline"><span>{t("overview.documentsComplete")}</span><span className="metric-icon">▧</span></div>
          <strong>{documentsReadyCount}<small>/{cases.length}</small></strong>
          <p>{t("overview.allScheduledCases")}</p>
        </article>
        <article className="metric-card">
          <div className="metric-topline"><span>{t("overview.roomTimePlanned")}</span><span className="metric-icon">◷</span></div>
          <strong>{(scheduledMinutesToday / 60).toFixed(1)}<small>h</small></strong>
          <p>{t("overview.acrossRooms")}</p>
        </article>
      </section>

      <section className="panel-section">
        <div className="section-heading">
          <div>
            <p className="page-eyebrow">{formatDate(selectedDate, locale).toUpperCase()}</p>
            <h2>{t("overview.todaySchedule")}</h2>
          </div>
          <button className="button-quiet" onClick={() => onSectionChange("Schedule")} type="button">{t("overview.viewSchedule")} <span>→</span></button>
        </div>
        <div className="schedule-preview">
          <div aria-hidden="true" className="schedule-preview-header">
            <span>{t("scheduleColumns.time")}</span>
            <span />
            <span>{t("scheduleColumns.caseAndTeam")}</span>
            <span>{t("scheduleColumns.room")}</span>
            <span>{t("scheduleColumns.status")}</span>
          </div>
          {todayCases.length > 0 ? todayCases.map((surgicalCase) => (
            <article className="schedule-preview-row" key={surgicalCase.id}>
              <div className="schedule-time">{formatTime(surgicalCase.startTime, locale)}</div>
              <div className="schedule-marker" aria-hidden="true" />
              <div className="schedule-case-summary">
                <strong>{surgicalCase.procedure}</strong>
                <span>{surgicalCase.patientId} · {surgicalCase.surgeon}</span>
              </div>
              <span className="room-label">{localizeRoom(surgicalCase.operatingRoom)}</span>
            <span className={`status-pill status-${getStatusClass(surgicalCase.status)}`}>{t(`status.${surgicalCase.status}`)}</span>
            </article>
          )) : <p className="inline-empty">{t("common.noCasesToday")}</p>}
        </div>
      </section>

      <div className="demo-notice"><span>i</span> {t("overview.sampleNotice")}</div>
    </>
  );

  const renderCases = (): JSX.Element => (
    <>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">{t("cases.eyebrow")}</p>
          <h1>{t("cases.titleLead")} <span>{t("cases.titleTail")}</span></h1>
          <p className="page-description">{t("cases.description")}</p>
        </div>
        <button className="button-primary" onClick={onOpenCaseForm} type="button">{t("common.addCase")}</button>
      </div>
      <section className="content-panel case-register">
        <div className="panel-toolbar">
          <div><h2>{t("cases.allCases")}</h2><span>{t("cases.caseCount", { count: filteredCases.length })}</span></div>
          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label={t("cases.search")}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t("cases.search")}
              value={searchTerm}
            />
          </label>
        </div>
        {renderCaseTable()}
      </section>
    </>
  );

  const renderSchedule = (): JSX.Element => (
    <>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">{t("schedule.eyebrow")}</p>
          <h1>{t("schedule.titleLead")} <span>{t("schedule.titleTail")}</span></h1>
          <p className="page-description">{t("schedule.description")}</p>
        </div>
        <label className="date-picker-label">{t("schedule.dateLabel")}
          <input aria-label={t("schedule.dateInput")} onChange={(event) => onSelectedDateChange(event.target.value)} type="date" value={selectedDate} />
        </label>
      </div>
      <section className="room-schedule-grid" aria-label={t("schedule.roomSchedule", { date: formatDate(selectedDate, locale) })}>
        {OPERATING_ROOMS.map((room) => {
          const roomCases = selectedDateCases.filter((surgicalCase) => surgicalCase.operatingRoom === room);
          const roomMinutes = roomCases.reduce((total, surgicalCase) => total + surgicalCase.durationMinutes, 0);

          return (
            <article className="room-schedule-card" key={room}>
              <div className="room-card-heading">
                <div><span className="room-symbol">＋</span><h2>{localizeRoom(room)}</h2></div>
                <span>{t("schedule.bookedHours", { hours: (roomMinutes / 60).toFixed(1) })}</span>
              </div>
              {roomCases.length > 0 ? (
                <div className="room-case-list">
                  {roomCases.map((surgicalCase) => (
                    <div className="room-case" key={surgicalCase.id}>
                      <div className="room-case-time">{formatTime(surgicalCase.startTime, locale)}<span>{t("schedule.minutes", { count: surgicalCase.durationMinutes })}</span></div>
                      <div className="room-case-content">
                        <strong>{surgicalCase.procedure}</strong>
                        <span>{surgicalCase.patientId} · {surgicalCase.surgeon}</span>
                        <span className={`status-pill status-${getStatusClass(surgicalCase.status)}`}>{t(`status.${surgicalCase.status}`)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div className="room-empty">{t("schedule.emptyRoom")}</div>}
            </article>
          );
        })}
      </section>
    </>
  );

  const renderDocumentation = (): JSX.Element => (
    <>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">{t("documentation.eyebrow")}</p>
          <h1>{t("documentation.titleLead")} <span>{t("documentation.titleTail")}</span></h1>
          <p className="page-description">{t("documentation.description")}</p>
        </div>
        <div className="documentation-summary"><strong>{documentsReadyCount}</strong><span>{t("documentation.readyCount", { count: cases.length })}</span></div>
      </div>
      <section className="documentation-list" aria-label={t("documentation.checklist")}>
        {cases.map((surgicalCase) => {
          const completeCount = surgicalCase.documents.filter((document) => document.complete).length;
          const progress = surgicalCase.documents.length === 0 ? 0 : completeCount / surgicalCase.documents.length * 100;

          return (
            <article className="documentation-card" key={surgicalCase.id}>
              <div className="documentation-card-heading">
                <div>
                  <span className="case-reference">{surgicalCase.id} · {surgicalCase.patientId}</span>
                  <h2>{surgicalCase.procedure}</h2>
                      <p>{formatDate(surgicalCase.date, locale)} · {localizeRoom(surgicalCase.operatingRoom)} · {surgicalCase.surgeon}</p>
                </div>
                <span className={`status-pill status-${getStatusClass(surgicalCase.status)}`}>{t(`status.${surgicalCase.status}`)}</span>
              </div>
              <div className="document-progress-track"><span style={{ width: `${progress}%` }} /></div>
              <div className="document-checklist">
                {surgicalCase.documents.map((document) => (
                  <label className={`document-check${document.complete ? " is-checked" : ""}`} key={document.id}>
                    <input
                      aria-label={`${t(`documentation.labels.${document.id}`, { defaultValue: document.label })} for ${surgicalCase.id}`}
                      checked={document.complete}
                      onChange={() => onDocumentToggle(surgicalCase.id, document.id)}
                      type="checkbox"
                    />
                    <span className="custom-checkbox" aria-hidden="true">✓</span>
                    {t(`documentation.labels.${document.id}`, { defaultValue: document.label })}
                  </label>
                ))}
              </div>
            </article>
          );
        })}
        {cases.length === 0 && <p className="inline-empty">{t("common.noCasesYet")}</p>}
      </section>
    </>
  );

  const renderCapacity = (): JSX.Element => (
    <>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">{t("capacity.eyebrow")}</p>
          <h1>{t("capacity.titleLead")} <span>{t("capacity.titleTail")}</span></h1>
          <p className="page-description">{t("capacity.description")}</p>
        </div>
        <label className="date-picker-label">{t("capacity.dateLabel")}
          <input aria-label={t("capacity.dateInput")} onChange={(event) => onSelectedDateChange(event.target.value)} type="date" value={selectedDate} />
        </label>
      </div>
      <section className="capacity-summary">
        <div><span>{t("capacity.plannedProcedures")}</span><strong>{selectedDateCases.length}</strong></div>
        <div>
          <span>{t("capacity.bookedRoomTime")}</span>
          <strong>
            {(selectedDateCases.reduce((total, surgicalCase) => total + surgicalCase.durationMinutes, 0) / 60).toFixed(1)}
            <small> {t("capacity.hours")}</small>
          </strong>
        </div>
        <div><span>{t("capacity.availableRooms")}</span><strong>{OPERATING_ROOMS.length}</strong></div>
      </section>
      <section className="capacity-room-list" aria-label={t("capacity.roomUtilization")}>
        {OPERATING_ROOMS.map((room) => {
          const roomCases = selectedDateCases.filter((surgicalCase) => surgicalCase.operatingRoom === room);
          const roomMinutes = roomCases.reduce((total, surgicalCase) => total + surgicalCase.durationMinutes, 0);
          const utilization = Math.min(100, Math.round(roomMinutes / 480 * 100));

          return (
            <article className="capacity-room-card" key={room}>
              <div className="capacity-room-heading">
              <div><span className="room-symbol">＋</span><strong>{localizeRoom(room)}</strong></div>
                <span>{(roomMinutes / 60).toFixed(1)} / 8.0 {t("capacity.hours")}</span>
              </div>
              <div className="capacity-track" aria-label={t("capacity.roomUtilization") + `: ${localizeRoom(room)} ${utilization}%`}>
                <span style={{ width: `${utilization}%` }} />
              </div>
              <div className="capacity-room-footer">
                <span>{t("capacity.scheduledPercent", { percent: utilization })}</span>
                <span>{t("capacity.caseCount", { count: roomCases.length })}</span>
              </div>
            </article>
          );
        })}
      </section>
      <p className="capacity-footnote">{t("capacity.footnote")}</p>
    </>
  );

  const sectionContent: Record<WorkspaceSection, () => JSX.Element> = {
    Overview: renderOverview,
    Cases: renderCases,
    Schedule: renderSchedule,
    Documentation: renderDocumentation,
    Capacity: renderCapacity,
  };

  return (
    <div className="app-layout">
      <AboutPanel activeSection={activeSection} onSectionChange={onSectionChange} />
      <div className="app-workspace">
        <Header sectionName={activeSection} />
        <main className="workspace-main">
          {notice && <div aria-live="polite" className="workspace-notice" role="status"><span>✓</span>{t(notice.key, { caseId: notice.caseId })}</div>}
          {sectionContent[activeSection]()}
          <button className="reset-demo-button" onClick={onResetDemo} type="button">{t("common.restoreSampleData")}</button>
        </main>
        <footer className="app-footer">
          <span>{t("common.footerTagline")}</span>
          <span>{t("common.footerDescription")}</span>
        </footer>
      </div>
      {isCaseFormOpen && <CaseForm onClose={onCloseCaseForm} onCreateCase={onCreateCase} />}
    </div>
  );
};

export default HomePageView;
