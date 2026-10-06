import type { JSX } from "react";
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
  notice: string;
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

const formatDate = (dateKey: string): string => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getStatusClass = (status: CaseStatus): string =>
  status.toLowerCase().replaceAll(" ", "-");

const getDocumentProgress = (surgicalCase: SurgicalCase): string => {
  const completedCount = surgicalCase.documents.filter((document) => document.complete).length;
  return `${completedCount}/${surgicalCase.documents.length}`;
};

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
            <th>CASE</th>
            <th>PROCEDURE</th>
            <th>SURGEON</th>
            <th>SCHEDULE</th>
            <th>DOCUMENTS</th>
            <th>STATUS</th>
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
                {surgicalCase.priority === "Urgent" && <span className="priority-badge">Urgent</span>}
              </td>
              <td>{surgicalCase.surgeon}</td>
              <td>
                <strong>{formatDate(surgicalCase.date)}</strong>
                <span className="table-subtext">{formatTime(surgicalCase.startTime)} · {surgicalCase.operatingRoom}</span>
              </td>
              <td>
                <span className={`document-count${getDocumentProgress(surgicalCase).startsWith("3/") ? " is-complete" : ""}`}>
                  {getDocumentProgress(surgicalCase)} complete
                </span>
              </td>
              <td>
                <select
                  aria-label={`Update status for ${surgicalCase.id}`}
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
                      {status}
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
          <h3>No matching cases</h3>
          <p>Try another patient reference, procedure, surgeon, or case ID.</p>
        </div>
      )}
    </div>
  );

  const renderOverview = (): JSX.Element => (
    <>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">OPERATIONS OVERVIEW</p>
          <h1>Good morning. <span>Here’s your day.</span></h1>
          <p className="page-description">A shared view of today’s surgical cases, readiness, and room activity.</p>
        </div>
        <button className="button-primary" onClick={onOpenCaseForm} type="button">＋ Add case</button>
      </div>

      <section aria-label="Today's operations" className="metric-grid">
        <article className="metric-card">
          <div className="metric-topline"><span>CASES TODAY</span><span className="metric-icon">▤</span></div>
          <strong>{todayCases.length}</strong>
          <p>Scheduled procedures</p>
        </article>
        <article className="metric-card">
          <div className="metric-topline"><span>READY TO GO</span><span className="metric-icon is-green">✓</span></div>
          <strong>{todayCases.filter((surgicalCase) => surgicalCase.status === "Ready").length}</strong>
          <p>Cases with readiness confirmed</p>
        </article>
        <article className="metric-card">
          <div className="metric-topline"><span>DOCUMENTS COMPLETE</span><span className="metric-icon">▧</span></div>
          <strong>{documentsReadyCount}<small>/{cases.length}</small></strong>
          <p>Across all scheduled cases</p>
        </article>
        <article className="metric-card">
          <div className="metric-topline"><span>ROOM TIME PLANNED</span><span className="metric-icon">◷</span></div>
          <strong>{(scheduledMinutesToday / 60).toFixed(1)}<small>h</small></strong>
          <p>Across 3 operating rooms</p>
        </article>
      </section>

      <section className="panel-section">
        <div className="section-heading">
          <div>
            <p className="page-eyebrow">{formatDate(selectedDate).toUpperCase()}</p>
            <h2>Today’s schedule</h2>
          </div>
          <button className="button-quiet" onClick={() => onSectionChange("Schedule")} type="button">View schedule <span>→</span></button>
        </div>
        <div className="schedule-preview">
          <div aria-hidden="true" className="schedule-preview-header">
            <span>TIME</span>
            <span />
            <span>CASE &amp; TEAM</span>
            <span>ROOM</span>
            <span>STATUS</span>
          </div>
          {todayCases.length > 0 ? todayCases.map((surgicalCase) => (
            <article className="schedule-preview-row" key={surgicalCase.id}>
              <div className="schedule-time">{formatTime(surgicalCase.startTime)}</div>
              <div className="schedule-marker" aria-hidden="true" />
              <div className="schedule-case-summary">
                <strong>{surgicalCase.procedure}</strong>
                <span>{surgicalCase.patientId} · {surgicalCase.surgeon}</span>
              </div>
              <span className="room-label">{surgicalCase.operatingRoom}</span>
              <span className={`status-pill status-${getStatusClass(surgicalCase.status)}`}>{surgicalCase.status}</span>
            </article>
          )) : <p className="inline-empty">No cases scheduled for today.</p>}
        </div>
      </section>

      <div className="demo-notice"><span>i</span> Sample workspace data is stored in this browser. Use the reset control below to restore the examples.</div>
    </>
  );

  const renderCases = (): JSX.Element => (
    <>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">SURGICAL REGISTER</p>
          <h1>Cases <span>and coordination.</span></h1>
          <p className="page-description">Track each case from scheduling through procedure day.</p>
        </div>
        <button className="button-primary" onClick={onOpenCaseForm} type="button">＋ Add case</button>
      </div>
      <section className="content-panel case-register">
        <div className="panel-toolbar">
          <div><h2>All cases</h2><span>{filteredCases.length} {filteredCases.length === 1 ? "case" : "cases"}</span></div>
          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Search cases"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search cases"
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
          <p className="page-eyebrow">ROOM COORDINATION</p>
          <h1>Operating room <span>schedule.</span></h1>
          <p className="page-description">Review booked procedures and room assignments by day.</p>
        </div>
        <label className="date-picker-label">SCHEDULE DATE
          <input aria-label="Schedule date" onChange={(event) => onSelectedDateChange(event.target.value)} type="date" value={selectedDate} />
        </label>
      </div>
      <section className="room-schedule-grid" aria-label={`Operating room schedule for ${formatDate(selectedDate)}`}>
        {OPERATING_ROOMS.map((room) => {
          const roomCases = selectedDateCases.filter((surgicalCase) => surgicalCase.operatingRoom === room);
          const roomMinutes = roomCases.reduce((total, surgicalCase) => total + surgicalCase.durationMinutes, 0);

          return (
            <article className="room-schedule-card" key={room}>
              <div className="room-card-heading">
                <div><span className="room-symbol">＋</span><h2>{room}</h2></div>
                <span>{(roomMinutes / 60).toFixed(1)}h booked</span>
              </div>
              {roomCases.length > 0 ? (
                <div className="room-case-list">
                  {roomCases.map((surgicalCase) => (
                    <div className="room-case" key={surgicalCase.id}>
                      <div className="room-case-time">{formatTime(surgicalCase.startTime)}<span>{surgicalCase.durationMinutes} min</span></div>
                      <div className="room-case-content">
                        <strong>{surgicalCase.procedure}</strong>
                        <span>{surgicalCase.patientId} · {surgicalCase.surgeon}</span>
                        <span className={`status-pill status-${getStatusClass(surgicalCase.status)}`}>{surgicalCase.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div className="room-empty">No cases assigned to this room.</div>}
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
          <p className="page-eyebrow">PRE-PROCEDURE CHECKLIST</p>
          <h1>Documentation <span>readiness.</span></h1>
          <p className="page-description">Keep required documentation visible and follow up on outstanding items.</p>
        </div>
        <div className="documentation-summary"><strong>{documentsReadyCount}</strong><span>of {cases.length} cases ready</span></div>
      </div>
      <section className="documentation-list" aria-label="Case documentation checklist">
        {cases.map((surgicalCase) => {
          const completeCount = surgicalCase.documents.filter((document) => document.complete).length;
          const progress = surgicalCase.documents.length === 0 ? 0 : completeCount / surgicalCase.documents.length * 100;

          return (
            <article className="documentation-card" key={surgicalCase.id}>
              <div className="documentation-card-heading">
                <div>
                  <span className="case-reference">{surgicalCase.id} · {surgicalCase.patientId}</span>
                  <h2>{surgicalCase.procedure}</h2>
                  <p>{formatDate(surgicalCase.date)} · {surgicalCase.operatingRoom} · {surgicalCase.surgeon}</p>
                </div>
                <span className={`status-pill status-${getStatusClass(surgicalCase.status)}`}>{surgicalCase.status}</span>
              </div>
              <div className="document-progress-track"><span style={{ width: `${progress}%` }} /></div>
              <div className="document-checklist">
                {surgicalCase.documents.map((document) => (
                  <label className={`document-check${document.complete ? " is-checked" : ""}`} key={document.id}>
                    <input
                      aria-label={`${document.label} for ${surgicalCase.id}`}
                      checked={document.complete}
                      onChange={() => onDocumentToggle(surgicalCase.id, document.id)}
                      type="checkbox"
                    />
                    <span className="custom-checkbox" aria-hidden="true">✓</span>
                    {document.label}
                  </label>
                ))}
              </div>
            </article>
          );
        })}
        {cases.length === 0 && <p className="inline-empty">No cases yet. Add a case to start the checklist.</p>}
      </section>
    </>
  );

  const renderCapacity = (): JSX.Element => (
    <>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">RESOURCE PLANNING</p>
          <h1>Room <span>capacity.</span></h1>
          <p className="page-description">Understand scheduled operating time across the available rooms.</p>
        </div>
        <label className="date-picker-label">CAPACITY DATE
          <input aria-label="Capacity date" onChange={(event) => onSelectedDateChange(event.target.value)} type="date" value={selectedDate} />
        </label>
      </div>
      <section className="capacity-summary">
        <div><span>PLANNED PROCEDURES</span><strong>{selectedDateCases.length}</strong></div>
        <div><span>BOOKED ROOM TIME</span><strong>{(selectedDateCases.reduce((total, surgicalCase) => total + surgicalCase.durationMinutes, 0) / 60).toFixed(1)}<small> hrs</small></strong></div>
        <div><span>AVAILABLE ROOMS</span><strong>{OPERATING_ROOMS.length}</strong></div>
      </section>
      <section className="capacity-room-list" aria-label="Operating room utilization">
        {OPERATING_ROOMS.map((room) => {
          const roomCases = selectedDateCases.filter((surgicalCase) => surgicalCase.operatingRoom === room);
          const roomMinutes = roomCases.reduce((total, surgicalCase) => total + surgicalCase.durationMinutes, 0);
          const utilization = Math.min(100, Math.round(roomMinutes / 480 * 100));

          return (
            <article className="capacity-room-card" key={room}>
              <div className="capacity-room-heading">
                <div><span className="room-symbol">＋</span><strong>{room}</strong></div>
                <span>{(roomMinutes / 60).toFixed(1)} / 8.0 hrs</span>
              </div>
              <div className="capacity-track" aria-label={`${room} ${utilization}% utilized`}>
                <span style={{ width: `${utilization}%` }} />
              </div>
              <div className="capacity-room-footer"><span>{utilization}% scheduled</span><span>{roomCases.length} {roomCases.length === 1 ? "case" : "cases"}</span></div>
            </article>
          );
        })}
      </section>
      <p className="capacity-footnote">Planning estimate uses an 8-hour operating day per room. Turnover and emergency holds are not included.</p>
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
          {notice && <div aria-live="polite" className="workspace-notice" role="status"><span>✓</span>{notice}</div>}
          {sectionContent[activeSection]()}
          <button className="reset-demo-button" onClick={onResetDemo} type="button">Restore sample data</button>
        </main>
        <footer className="app-footer">
          <span>SURGICAL CARE, IN SYNC</span>
          <span>Local demo workspace · not connected to a hospital system</span>
        </footer>
      </div>
      {isCaseFormOpen && <CaseForm onClose={onCloseCaseForm} onCreateCase={onCreateCase} />}
    </div>
  );
};

export default HomePageView;
