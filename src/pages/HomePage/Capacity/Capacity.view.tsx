import type { JSX } from "react";
import { OPERATING_ROOMS } from "../../../domain/surgicalCases";
import type { HomePageViewProps } from "../HomePageView.types";
import { useHomePageSection } from "../HomePageSection.utils";

const CapacityView = ({ cases, selectedDate, onSelectedDateChange }: HomePageViewProps): JSX.Element => {
  const { t, localizeRoom, selectedDateCases } = useHomePageSection(cases, selectedDate);
  const scheduledMinutes = selectedDateCases.reduce((total, item) => total + item.durationMinutes, 0);

  return (
    <>
      <div className="page-heading-row">
        <div><p className="page-eyebrow">{t("capacity.eyebrow")}</p><h1>{t("capacity.titleLead")} <span>{t("capacity.titleTail")}</span></h1><p className="page-description">{t("capacity.description")}</p></div>
        <label className="date-picker-label">{t("capacity.dateLabel")}<input aria-label={t("capacity.dateInput")} onChange={(event) => onSelectedDateChange(event.target.value)} type="date" value={selectedDate} /></label>
      </div>
      <section className="capacity-summary"><div><span>{t("capacity.plannedProcedures")}</span><strong>{selectedDateCases.length}</strong></div><div><span>{t("capacity.bookedRoomTime")}</span><strong>{(scheduledMinutes / 60).toFixed(1)}<small> {t("capacity.hours")}</small></strong></div><div><span>{t("capacity.availableRooms")}</span><strong>{OPERATING_ROOMS.length}</strong></div></section>
      <section className="capacity-room-list" aria-label={t("capacity.roomUtilization")}>
        {OPERATING_ROOMS.map((room) => {
          const roomCases = selectedDateCases.filter((item) => item.operatingRoom === room);
          const roomMinutes = roomCases.reduce((total, item) => total + item.durationMinutes, 0);
          const utilization = Math.min(100, Math.round(roomMinutes / 480 * 100));

          return <article className="capacity-room-card" key={room}><div className="capacity-room-heading"><div><span className="room-symbol">＋</span><strong>{localizeRoom(room)}</strong></div><span>{(roomMinutes / 60).toFixed(1)} / 8.0 {t("capacity.hours")}</span></div><div className="capacity-track" aria-label={`${t("capacity.roomUtilization")}: ${localizeRoom(room)} ${utilization}%`}><span style={{ width: `${utilization}%` }} /></div><div className="capacity-room-footer"><span>{t("capacity.scheduledPercent", { percent: utilization })}</span><span>{t("capacity.caseCount", { count: roomCases.length })}</span></div></article>;
        })}
      </section>
      <p className="capacity-footnote">{t("capacity.footnote")}</p>
    </>
  );
};

export default CapacityView;
