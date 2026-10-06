import type { JSX } from "react";
import AboutPanel from "../../components/AboutPanel/AboutPanel.logic";
import Header from "../../components/Header/Header.logic";
import "./HomePage.scss";

export interface HomePageViewProps {
  highlights: { label: string; description: string; number: string }[];
}

const HomePageView = ({ highlights }: HomePageViewProps): JSX.Element => (
  <div className="landing-layout">
    <AboutPanel />
    <div className="landing-workspace">
      <Header />
      <main className="landing-main">
        <div className="landing-heading">
          <p className="landing-eyebrow">SURGICAL OPERATIONS PLATFORM</p>
          <h2>Good care takes a <span>great team.</span></h2>
          <p className="landing-intro">Bring the people, plans, and patient details behind every procedure into one coordinated view.</p>
        </div>
        <section className="highlight-grid" aria-label="SurgiFlow capabilities">
          {highlights.map((highlight) => (
            <article className="highlight-card" key={highlight.label}>
              <span className="highlight-number">{highlight.number}</span>
              <h3>{highlight.label}</h3>
              <p>{highlight.description}</p>
              <span className="highlight-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </section>
        <div className="landing-note"><span className="note-icon" aria-hidden="true">✳</span><p><strong>One surgical journey.</strong> A shared picture from first schedule to procedure day.</p></div>
      </main>
      <footer className="landing-footer"><span>SURGICAL CARE, IN SYNC</span><span>Designed around the teams who make it happen</span></footer>
    </div>
  </div>
);

export default HomePageView;
