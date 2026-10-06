import type { FormEvent, JSX } from "react";
import { useTranslation } from "react-i18next";
import type { CasePriority, NewSurgicalCase } from "../../domain/surgicalCases";
import "./CaseForm.scss";

export interface CaseFormViewProps {
  values: NewSurgicalCase;
  submitError: string;
  onChange: (field: keyof NewSurgicalCase, value: string | number) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const CaseFormView = ({ values, submitError, onChange, onClose, onSubmit }: CaseFormViewProps): JSX.Element => {
  const { t } = useTranslation();

  return (
  <div className="case-form-overlay" onMouseDown={onClose}>
    <section
      aria-labelledby="case-form-title"
      aria-modal="true"
      className="case-form-dialog"
      onMouseDown={(event) => event.stopPropagation()}
      role="dialog"
    >
      <div className="case-form-heading">
        <div>
          <p className="case-form-eyebrow">{t("caseForm.eyebrow")}</p>
          <h2 id="case-form-title">{t("caseForm.title")}</h2>
          <p>{t("caseForm.description")}</p>
        </div>
        <button aria-label={t("caseForm.close")} className="icon-button" onClick={onClose} type="button">×</button>
      </div>

      <form className="case-form" onSubmit={onSubmit}>
        <label>
          {t("caseForm.patientReference")}
          <input
            autoFocus
            onChange={(event) => onChange("patientId", event.target.value)}
            placeholder={t("caseForm.patientPlaceholder")}
            required
            value={values.patientId}
          />
        </label>
        <label className="form-field-wide">
          {t("caseForm.procedure")}
          <input
            onChange={(event) => onChange("procedure", event.target.value)}
            placeholder={t("caseForm.procedurePlaceholder")}
            required
            value={values.procedure}
          />
        </label>
        <label>
          {t("caseForm.leadSurgeon")}
          <input
            onChange={(event) => onChange("surgeon", event.target.value)}
            placeholder={t("caseForm.surgeonPlaceholder")}
            required
            value={values.surgeon}
          />
        </label>
        <label>
          {t("caseForm.priority")}
          <select
            onChange={(event) => onChange("priority", event.target.value as CasePriority)}
            value={values.priority}
          >
            <option value="Routine">{t("caseForm.routine")}</option>
            <option value="Urgent">{t("caseForm.urgent")}</option>
          </select>
        </label>
        <label>
          {t("caseForm.surgeryDate")}
          <input
            onChange={(event) => onChange("date", event.target.value)}
            required
            type="date"
            value={values.date}
          />
        </label>
        <label>
          {t("caseForm.startTime")}
          <input
            onChange={(event) => onChange("startTime", event.target.value)}
            required
            type="time"
            value={values.startTime}
          />
        </label>
        <label>
          {t("caseForm.duration")}
          <input
            max="600"
            min="15"
            onChange={(event) => onChange("durationMinutes", Number(event.target.value))}
            required
            step="15"
            type="number"
            value={values.durationMinutes}
          />
        </label>
        <label>
          {t("caseForm.operatingRoom")}
          <select
            onChange={(event) => onChange("operatingRoom", event.target.value)}
            value={values.operatingRoom}
          >
            <option value="OR 1">{t("caseForm.roomOption", { number: 1 })}</option>
            <option value="OR 2">{t("caseForm.roomOption", { number: 2 })}</option>
            <option value="OR 3">{t("caseForm.roomOption", { number: 3 })}</option>
          </select>
        </label>
        {submitError && <p className="form-error form-field-wide" role="alert">{submitError}</p>}
        <div className="case-form-actions form-field-wide">
          <button className="button-secondary" onClick={onClose} type="button">{t("caseForm.cancel")}</button>
          <button className="button-primary" type="submit">{t("caseForm.submit")}</button>
        </div>
      </form>
    </section>
  </div>
  );
};

export default CaseFormView;
