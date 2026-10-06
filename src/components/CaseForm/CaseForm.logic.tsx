import { useState, type FormEvent, type JSX } from "react";
import type { NewSurgicalCase } from "../../domain/surgicalCases";
import { getTodayKey } from "../../domain/surgicalCases";
import CaseFormView from "./CaseForm.view";

interface CaseFormProps {
  onClose: () => void;
  onCreateCase: (newCase: NewSurgicalCase) => Promise<string | null>;
}

const getInitialValues = (): NewSurgicalCase => ({
  patientId: "",
  procedure: "",
  surgeon: "",
  date: getTodayKey(),
  startTime: "08:00",
  durationMinutes: 60,
  operatingRoom: "OR 1",
  priority: "Routine",
});

const CaseForm = ({ onClose, onCreateCase }: CaseFormProps): JSX.Element => {
  const [values, setValues] = useState<NewSurgicalCase>(getInitialValues);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof NewSurgicalCase, value: string | number): void => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    const error = await onCreateCase(values);
    setIsSubmitting(false);

    if (error) {
      setSubmitError(error);
      return;
    }

    onClose();
  };

  return (
    <CaseFormView
      values={values}
      submitError={submitError}
      isSubmitting={isSubmitting}
      onChange={handleChange}
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  );
};

export default CaseForm;
