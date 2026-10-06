import type { JSX } from "react";
import type { HomePageViewProps } from "../HomePageView.types";
import { useHomePageSection } from "../HomePageSection.utils";

const OverviewView = ({ cases, todayCases, selectedDate, onSectionChange, onOpenCaseForm }: HomePageViewProps): JSX.Element => {
  const {
    t,
    locale,
    localizeRoom,
    documentsReadyCount,
    formatDate,
    formatTime,
    getStatusClass,
  } = useHomePageSection(cases, selectedDate);
  const scheduledMinutes = todayCases.reduce((total, item) => total + item.durationMinutes, 0);

  return (
    <>
      <div className="page-heading-row">
        <div><p className="page-eyebrow">{t("overview.eyebrow")}</p><h1>{t("overview.titleLead")} <span>{t("overview.titleTail")}</span></h1><p className="page-description">{t("overview.description")}</p></div>
        <button className="button-primary" onClick={onOpenCaseForm} type="button">{t("common.addCase")}</button>
      </div>
      <section aria-label={t("overview.operationsLabel")} className="metric-grid">
        <article className="metric-card"><div className="metric-topline"><span>{t("overview.casesToday")}</span><span className="metric-icon">▤</span></div><strong>{todayCases.length}</strong><p>{t("overview.scheduledProcedures")}</p></article>
        <article className="metric-card"><div className="metric-topline"><span>{t("overview.readyToGo")}</span><span className="metric-icon is-green">✓</span></div><strong>{todayCases.filter((item) => item.status === "Ready").length}</strong><p>{t("overview.readinessConfirmed")}</p></article>
        <article className="metric-card"><div className="metric-topline"><span>{t("overview.documentsComplete")}</span><span className="metric-icon">▧</span></div><strong>{documentsReadyCount}<small>/{cases.length}</small></strong><p>{t("overview.allScheduledCases")}</p></article>
        <article className="metric-card"><div className="metric-topline"><span>{t("overview.roomTimePlanned")}</span><span className="metric-icon">◷</span></div><strong>{(scheduledMinutes / 60).toFixed(1)}<small>h</small></strong><p>{t("overview.acrossRooms")}</p></article>
      </section>
      <section className="panel-section">
        <div className="section-heading"><div><p className="page-eyebrow">{formatDate(selectedDate, locale).toUpperCase()}</p><h2>{t("overview.todaySchedule")}</h2></div><button className="button-quiet" onClick={() => onSectionChange("Schedule")} type="button">{t("overview.viewSchedule")} <span>→</span></button></div>
        <div className="schedule-preview">
          <div aria-hidden="true" className="schedule-preview-header"><span>{t("scheduleColumns.time")}</span><span /><span>{t("scheduleColumns.caseAndTeam")}</span><span>{t("scheduleColumns.room")}</span><span>{t("scheduleColumns.status")}</span></div>
          {todayCases.length > 0 ? todayCases.map((item) => <article className="schedule-preview-row" key={item.id}><div className="schedule-time">{formatTime(item.startTime, locale)}</div><div className="schedule-marker" aria-hidden="true" /><div className="schedule-case-summary"><strong>{item.procedure}</strong><span>{item.patientId} · {item.surgeon}</span></div><span className="room-label">{localizeRoom(item.operatingRoom)}</span><span className={`status-pill status-${getStatusClass(item.status)}`}>{t(`status.${item.status}`)}</span></article>) : <p className="inline-empty">{t("common.noCasesToday")}</p>}
        </div>
      </section>
      <div className="demo-notice"><span>i</span> {t("overview.sampleNotice")}</div>
    </>
  );
};

export default OverviewView;
