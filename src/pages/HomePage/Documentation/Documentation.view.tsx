import type { JSX } from "react";
import type { HomePageViewProps } from "../HomePageView.types";
import { useHomePageSection } from "../HomePageSection.utils";

const DocumentationView = ({ cases, selectedDate, onDocumentToggle }: HomePageViewProps): JSX.Element => {
  const { t, locale, localizeRoom, documentsReadyCount, formatDate, getStatusClass } = useHomePageSection(cases, selectedDate);

  return (
    <>
      <div className="page-heading-row">
        <div><p className="page-eyebrow">{t("documentation.eyebrow")}</p><h1>{t("documentation.titleLead")} <span>{t("documentation.titleTail")}</span></h1><p className="page-description">{t("documentation.description")}</p></div>
        <div className="documentation-summary"><strong>{documentsReadyCount}</strong><span>{t("documentation.readyCount", { count: cases.length })}</span></div>
      </div>
      <section className="documentation-list" aria-label={t("documentation.checklist")}>
        {cases.map((item) => {
          const completeCount = item.documents.filter((document) => document.complete).length;
          const progress = item.documents.length === 0 ? 0 : completeCount / item.documents.length * 100;

          return (
            <article className="documentation-card" key={item.id}>
              <div className="documentation-card-heading"><div><span className="case-reference">{item.id} · {item.patientId}</span><h2>{item.procedure}</h2><p>{formatDate(item.date, locale)} · {localizeRoom(item.operatingRoom)} · {item.surgeon}</p></div><span className={`status-pill status-${getStatusClass(item.status)}`}>{t(`status.${item.status}`)}</span></div>
              <div className="document-progress-track"><span style={{ width: `${progress}%` }} /></div>
              <div className="document-checklist">{item.documents.map((document) => {
                const label = t(`documentation.labels.${document.id}`, { defaultValue: document.label });

                return <label className={`document-check${document.complete ? " is-checked" : ""}`} key={document.id}><input aria-label={`${label} for ${item.id}`} checked={document.complete} onChange={() => onDocumentToggle(item.id, document.id)} type="checkbox" /><span className="custom-checkbox" aria-hidden="true">✓</span>{label}</label>;
              })}</div>
            </article>
          );
        })}
        {cases.length === 0 && <p className="inline-empty">{t("common.noCasesYet")}</p>}
      </section>
    </>
  );
};

export default DocumentationView;
