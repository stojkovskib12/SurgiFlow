import type { JSX } from "react";
import { OPERATING_ROOMS } from "../../../domain/surgicalCases";
import type { HomePageViewProps } from "../HomePageView.types";
import { useHomePageSection } from "../HomePageSection.utils";

const ScheduleView = ({ cases, selectedDate, onSelectedDateChange }: HomePageViewProps): JSX.Element => {
  const { t, locale, localizeRoom, selectedDateCases, formatDate, formatTime, getStatusClass } = useHomePageSection(cases, selectedDate);

  return (
    <>
      <div className="page-heading-row">
        <div><p className="page-eyebrow">{t("schedule.eyebrow")}</p><h1>{t("schedule.titleLead")} <span>{t("schedule.titleTail")}</span></h1><p className="page-description">{t("schedule.description")}</p></div>
        <label className="date-picker-label">{t("schedule.dateLabel")}<input aria-label={t("schedule.dateInput")} onChange={(event) => onSelectedDateChange(event.target.value)} type="date" value={selectedDate} /></label>
      </div>
      <section className="room-schedule-grid" aria-label={t("schedule.roomSchedule", { date: formatDate(selectedDate, locale) })}>
        {OPERATING_ROOMS.map((room) => {
          const roomCases = selectedDateCases.filter((item) => item.operatingRoom === room);
          const roomMinutes = roomCases.reduce((total, item) => total + item.durationMinutes, 0);

          return (
            <article className="room-schedule-card" key={room}>
              <div className="room-card-heading"><div><span className="room-symbol">＋</span><h2>{localizeRoom(room)}</h2></div><span>{t("schedule.bookedHours", { hours: (roomMinutes / 60).toFixed(1) })}</span></div>
              {roomCases.length > 0 ? <div className="room-case-list">{roomCases.map((item) => <div className="room-case" key={item.id}><div className="room-case-time">{formatTime(item.startTime, locale)}<span>{t("schedule.minutes", { count: item.durationMinutes })}</span></div><div className="room-case-content"><strong>{item.procedure}</strong><span>{item.patientId} · {item.surgeon}</span><span className={`status-pill status-${getStatusClass(item.status)}`}>{t(`status.${item.status}`)}</span></div></div>)}</div> : <div className="room-empty">{t("schedule.emptyRoom")}</div>}
            </article>
          );
        })}
      </section>
    </>
  );
};

export default ScheduleView;
