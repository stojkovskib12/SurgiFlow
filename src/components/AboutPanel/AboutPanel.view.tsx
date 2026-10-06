import type { JSX } from "react";
import "./AboutPanel.scss";

export interface AboutPanelViewProps {
  productName: string;
  tagline: string;
  description: string;
  capabilities: string[];
}

const AboutPanelView = ({ productName, tagline, description, capabilities }: AboutPanelViewProps): JSX.Element => (
  <aside className="about-panel">
    <div className="about-brand">
      <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
      <div><div className="brand-name">{productName}</div><div className="brand-caption">SURGICAL OPERATIONS</div></div>
    </div>

    <div className="about-copy">
      <p className="panel-eyebrow">CARE, COORDINATED</p>
      <h1>{tagline}</h1>
      <p className="panel-description">{description}</p>
    </div>

    <div className="panel-divider" />
    <section className="panel-capabilities" aria-labelledby="capabilities-heading">
      <h2 id="capabilities-heading"><span aria-hidden="true">✳</span> ONE CONNECTED WORKSPACE</h2>
      <p>Keep every part of the surgical journey moving together.</p>
      <ol>
        {capabilities.map((capability, index) => (
          <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span>{capability}</li>
        ))}
      </ol>
    </section>
    <div className="about-footer"><span className="footer-dot" /> Built for the people behind every procedure</div>
  </aside>
);

export default AboutPanelView;
