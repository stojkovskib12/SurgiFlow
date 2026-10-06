import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { OPERATING_ROOMS } from "../../../domain/surgicalCases";
import type { ApiCapacitySummary } from "../../../services/api.types";
import type { HomePageViewProps } from "../HomePageView.types";
import { useHomePageSection } from "../HomePageSection.utils";

interface CapacityViewProps extends Pick<
  HomePageViewProps,
  "cases" | "selectedDate" | "onSelectedDateChange"
> {
  capacitySummary: ApiCapacitySummary | null;
}

const CapacityView = ({
  cases,
  selectedDate,
  onSelectedDateChange,
  capacitySummary,
}: CapacityViewProps): JSX.Element => {
  const { t } = useTranslation();
  const {
    localizeRoom,
    selectedDateCases,
  } = useHomePageSection(cases, selectedDate);
  const fallbackBookedMinutes = selectedDateCases.reduce(
    (total, surgicalCase) => total + surgicalCase.durationMinutes,
    0,
  );
  const bookedMinutes = capacitySummary?.bookedMinutes ?? fallbackBookedMinutes;
  const plannedProcedures = capacitySummary?.plannedProcedures ?? selectedDateCases.length;

  return (
    <>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">{t("capacity.eyebrow")}</p>
          <h1>
            {t("capacity.titleLead")} <span>{t("capacity.titleTail")}</span>
          </h1>
          <p className="page-description">{t("capacity.description")}</p>
        </div>
        <label className="date-picker-label">
          {t("capacity.dateLabel")}
          <input
            aria-label={t("capacity.dateInput")}
            onChange={(event) => onSelectedDateChange(event.target.value)}
            type="date"
            value={selectedDate}
          />
        </label>
      </div>

      <section className="capacity-summary">
        <div>
          <span>{t("capacity.plannedProcedures")}</span>
          <strong>{plannedProcedures}</strong>
        </div>
        <div>
          <span>{t("capacity.bookedRoomTime")}</span>
          <strong>
            {(bookedMinutes / 60).toFixed(1)}
            <small> {t("capacity.hours")}</small>
          </strong>
        </div>
        <div>
          <span>{t("capacity.availableRooms")}</span>
          <strong>{capacitySummary?.availableRooms ?? OPERATING_ROOMS.length}</strong>
        </div>
      </section>

      <section className="capacity-room-list" aria-label={t("capacity.roomUtilization")}>
        {OPERATING_ROOMS.map((room) => {
          const roomCases = selectedDateCases.filter(
            (surgicalCase) => surgicalCase.operatingRoom === room,
          );
          const fallbackMinutes = roomCases.reduce(
            (total, surgicalCase) => total + surgicalCase.durationMinutes,
            0,
          );
          const roomSummary = capacitySummary?.rooms.find(
            (summary) => summary.operatingRoom === room,
          );
          const roomMinutes = roomSummary?.bookedMinutes ?? fallbackMinutes;
          const roomCaseCount = roomSummary?.caseCount ?? roomCases.length;
          const utilization = roomSummary?.utilizationPercent
            ?? Math.min(100, Math.round(roomMinutes / 480 * 100));
          const utilizationLabel = t("capacity.roomUtilization")
            + ": " + localizeRoom(room) + " " + utilization + "%";

          return (
            <article className="capacity-room-card" key={room}>
              <div className="capacity-room-heading">
                <div>
                  <span className="room-symbol">＋</span>
                  <strong>{localizeRoom(room)}</strong>
                </div>
                <span>
                  {(roomMinutes / 60).toFixed(1)} / 8.0 {t("capacity.hours")}
                </span>
              </div>
              <div className="capacity-track" aria-label={utilizationLabel}>
                <span style={{ width: utilization + "%" }} />
              </div>
              <div className="capacity-room-footer">
                <span>{t("capacity.scheduledPercent", { percent: utilization })}</span>
                <span>{t("capacity.caseCount", { count: roomCaseCount })}</span>
              </div>
            </article>
          );
        })}
      </section>
      <p className="capacity-footnote">{t("capacity.footnote")}</p>
    </>
  );
};

export default CapacityView;
