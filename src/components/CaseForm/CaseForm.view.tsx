import type { FormEvent, JSX } from "react";
import type { CasePriority, NewSurgicalCase } from "../../domain/surgicalCases";
import "./CaseForm.scss";

export interface CaseFormViewProps {
  values: NewSurgicalCase;
  submitError: string;
  onChange: (field: keyof NewSurgicalCase, value: string | number) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const CaseFormView = ({ values, submitError, onChange, onClose, onSubmit }: CaseFormViewProps): JSX.Element => (
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
          <p className="case-form-eyebrow">CASE INTAKE</p>
          <h2 id="case-form-title">Add a surgical case</h2>
          <p>Capture the essentials to coordinate the procedure.</p>
        </div>
        <button aria-label="Close form" className="icon-button" onClick={onClose} type="button">×</button>
      </div>

      <form className="case-form" onSubmit={onSubmit}>
        <label>
          Patient reference
          <input
            autoFocus
            onChange={(event) => onChange("patientId", event.target.value)}
            placeholder="e.g. Patient 1048"
            required
            value={values.patientId}
          />
        </label>
        <label className="form-field-wide">
          Procedure
          <input
            onChange={(event) => onChange("procedure", event.target.value)}
            placeholder="Procedure name"
            required
            value={values.procedure}
          />
        </label>
        <label>
          Lead surgeon
          <input
            onChange={(event) => onChange("surgeon", event.target.value)}
            placeholder="Surgeon name"
            required
            value={values.surgeon}
          />
        </label>
        <label>
          Priority
          <select
            onChange={(event) => onChange("priority", event.target.value as CasePriority)}
            value={values.priority}
          >
            <option value="Routine">Routine</option>
            <option value="Urgent">Urgent</option>
          </select>
        </label>
        <label>
          Surgery date
          <input
            onChange={(event) => onChange("date", event.target.value)}
            required
            type="date"
            value={values.date}
          />
        </label>
        <label>
          Start time
          <input
            onChange={(event) => onChange("startTime", event.target.value)}
            required
            type="time"
            value={values.startTime}
          />
        </label>
        <label>
          Duration (minutes)
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
          Operating room
          <select
            onChange={(event) => onChange("operatingRoom", event.target.value)}
            value={values.operatingRoom}
          >
            <option value="OR 1">Operating room 1</option>
            <option value="OR 2">Operating room 2</option>
            <option value="OR 3">Operating room 3</option>
          </select>
        </label>
        {submitError && <p className="form-error form-field-wide" role="alert">{submitError}</p>}
        <div className="case-form-actions form-field-wide">
          <button className="button-secondary" onClick={onClose} type="button">Cancel</button>
          <button className="button-primary" type="submit">Add case</button>
        </div>
      </form>
    </section>
  </div>
);

export default CaseFormView;
