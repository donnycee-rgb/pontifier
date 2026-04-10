import { Link } from "react-router-dom";
import "./LandingPage.css";

export function LandingPage() {
  return (
    <div className="lp">
      {/* Nav */}
      <nav className="lp-nav">
        <span className="lp-nav-brand">Campaign<span className="lp-nav-brand-hq">HQ</span></span>
        <Link to="/login" className="lp-nav-login">Team Login</Link>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-bg">
          <div className="lp-hero-grid" />
          <div className="lp-hero-glow" />
        </div>
        <div className="lp-hero-content">
          <p className="lp-hero-tagline">JKUASU 2026</p>
          <h1 className="lp-hero-name">
            Javas<br />Abich
          </h1>
          <div className="lp-hero-divider" />
          <p className="lp-hero-slogan">Arete in Action</p>
          <p className="lp-hero-sub">
            Excellence is not a destination — it is a discipline.<br />
            A campaign built on integrity, vision, and service to every student.
          </p>
          <div className="lp-hero-actions">
            <a
              href="/manifesto.pdf"
              download
              className="lp-btn-primary"
            >
              Download Manifesto
            </a>
            <Link to="/login" className="lp-btn-ghost">
              Campaign Team →
            </Link>
          </div>
        </div>
        <div className="lp-hero-badge">
          <span className="lp-hero-badge-text">ARETE</span>
        </div>
      </section>

      {/* About */}
      <section className="lp-about">
        <div className="lp-about-inner">
          <div className="lp-about-label">The Candidate</div>
          <h2 className="lp-about-heading">Built for every student.<br />Not just a few.</h2>
          <div className="lp-about-grid">
            <div className="lp-about-text">
              <p>
                Javas Abich is a JKUA student leader with a clear-eyed vision for what
                student governance can be — transparent, accountable, and genuinely
                student-first.
              </p>
              <p>
                Arete, the Greek ideal of excellence in purpose and action, is not just
                a tagline. It is the standard this campaign holds itself to — in every
                policy, every conversation, every commitment made to you.
              </p>
            </div>
            <div className="lp-about-pillars">
              {[
                { icon: "◈", title: "Accountability", desc: "Open books. Real reporting. No hidden agendas." },
                { icon: "◉", title: "Student Welfare", desc: "Healthcare, mental health, and basic needs first." },
                { icon: "◎", title: "Academic Excellence", desc: "Resources, representation, and results that matter." },
                { icon: "◆", title: "Unity", desc: "Every college. Every course. Every student." },
              ].map((p) => (
                <div key={p.title} className="lp-pillar">
                  <span className="lp-pillar-icon">{p.icon}</span>
                  <div>
                    <h3 className="lp-pillar-title">{p.title}</h3>
                    <p className="lp-pillar-desc">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto CTA */}
      <section className="lp-manifesto">
        <div className="lp-manifesto-inner">
          <div className="lp-manifesto-line" />
          <h2 className="lp-manifesto-heading">Read the full manifesto</h2>
          <p className="lp-manifesto-sub">
            Every promise. Every plan. Every commitment — documented and downloadable.
          </p>
          <a href="/manifesto.pdf" download className="lp-btn-primary lp-manifesto-btn">
            Download PDF
          </a>
          <div className="lp-manifesto-line" />
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <p className="lp-footer-name">Javas Abich · JKUASU 2026</p>
        <p className="lp-footer-tag">Arete in Action</p>
      </footer>
    </div>
  );
}
