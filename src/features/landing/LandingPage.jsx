import { useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="lp">

      {/* Nav */}
      <nav className="lp-nav">
        <span className="lp-nav-brand">Campaign<span className="lp-nav-gold">HQ</span></span>
        <div className="lp-nav-links">
          <a href="#about" className="lp-nav-link">About</a>
          <a href="#pillars" className="lp-nav-link">Manifesto</a>
          <Link to="/login" className="lp-nav-cta">Team Login</Link>
        </div>
        <button className="lp-nav-hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
          <span className={`lp-ham-line ${menuOpen ? "lp-ham-open-1" : ""}`} />
          <span className={`lp-ham-line ${menuOpen ? "lp-ham-open-2" : ""}`} />
          <span className={`lp-ham-line ${menuOpen ? "lp-ham-open-3" : ""}`} />
        </button>
      </nav>

      {menuOpen && (
        <div className="lp-mobile-menu">
          <a href="#about" className="lp-mobile-link" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#pillars" className="lp-mobile-link" onClick={() => setMenuOpen(false)}>Manifesto</a>
          <Link to="/login" className="lp-mobile-cta" onClick={() => setMenuOpen(false)}>Team Login</Link>
        </div>
      )}

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-left">
          <p className="lp-hero-tag">JKUSA 2026 — Student President</p>
          <h1 className="lp-hero-name">
            Javas<br />
            <span className="lp-hero-name-gold">Abich</span>
          </h1>
          <div className="lp-hero-rule" />
          <p className="lp-hero-slogan">Arete in Action</p>
          <p className="lp-hero-desc">
            Excellence is not a privilege for a few — it is a standard every JKUSA
            student deserves. A campaign built on integrity, vision, and unwavering
            commitment to every student, every college, every voice.
          </p>
          <div className="lp-hero-btns">
            <a href="/manifesto.pdf" download className="lp-btn-primary">Download Manifesto</a>
            <Link to="/login" className="lp-btn-outline">Campaign Team →</Link>
          </div>
        </div>
        <div className="lp-hero-right">
          <div className="lp-hero-img-wrap">
            <img src="/images/javas1.jpg" alt="Javas Abich" className="lp-hero-img" />
            <div className="lp-hero-img-badge">
              <span className="lp-hero-img-badge-text">ARETE</span>
              <span className="lp-hero-img-badge-sub">IN ACTION</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="lp-stats">
        {[
          { value: "136+", label: "Registered Delegates" },
          { value: "5", label: "Colleges Represented" },
          { value: "2026", label: "Election Year" },
          { value: "1", label: "Clear Vision" },
        ].map((s) => (
          <div key={s.label} className="lp-stat">
            <span className="lp-stat-value">{s.value}</span>
            <span className="lp-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* About */}
      <section className="lp-about" id="about">
        <div className="lp-about-img-wrap">
          <img src="/images/javas2.jpg" alt="Javas Abich campaigning" className="lp-about-img" />
          <div className="lp-about-img-tag"><span>The Candidate</span></div>
        </div>
        <div className="lp-about-content">
          <p className="lp-section-tag">Who We Are</p>
          <h2 className="lp-section-heading">
            Crafting Excellence<br />
            <span className="lp-gold">in Every Student</span>
          </h2>
          <p className="lp-about-text">
            Javas Abich is a JKUSA student leader with a clear-eyed vision for what
            student governance can truly be — transparent, accountable, and genuinely
            student-first in every decision made.
          </p>
          <p className="lp-about-text">
            Arete, the Greek ideal of excellence in purpose and action, is not just
            a tagline. It is the standard this campaign holds itself to in every
            policy, every conversation, and every commitment made to you.
          </p>
          <a href="/manifesto.pdf" download className="lp-btn-primary lp-about-btn">Read the Full Manifesto</a>
        </div>
      </section>

      {/* Pillars */}
      <section className="lp-pillars" id="pillars">
        <div className="lp-pillars-header">
          <p className="lp-section-tag">Our Commitments</p>
          <h2 className="lp-section-heading">Pillars That <span className="lp-gold">Fit Every Student</span></h2>
        </div>
        <div className="lp-pillars-grid">
          {[
            { icon: "◈", title: "Accountability", desc: "Open books, real reporting, and no hidden agendas. Every shilling accounted for." },
            { icon: "◉", title: "Student Welfare", desc: "Healthcare, mental health support, and basic needs — prioritised, not promised." },
            { icon: "◎", title: "Academic Excellence", desc: "Resources, representation, and results that actually move the needle." },
            { icon: "◆", title: "Unity & Inclusion", desc: "Every college. Every course. Every student — represented and heard." },
            { icon: "◐", title: "Campus Infrastructure", desc: "Safe, functional spaces that support learning, rest, and student life." },
            { icon: "◑", title: "Leadership Pipeline", desc: "Building the next generation of student leaders from every faculty." },
          ].map((p) => (
            <div key={p.title} className="lp-pillar-card">
              <span className="lp-pillar-icon">{p.icon}</span>
              <h3 className="lp-pillar-title">{p.title}</h3>
              <p className="lp-pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA with creative image treatment */}
      <section className="lp-cta">
        <div className="lp-cta-img-wrap">
          <img src="/images/javas3.jpg" alt="Javas Abich" className="lp-cta-img" />
          <div className="lp-cta-img-overlay" />
          <div className="lp-cta-img-quote">
            <span className="lp-cta-quote-mark">"</span>
            <p className="lp-cta-quote-text">Excellence is a discipline,<br />not a destination.</p>
          </div>
        </div>
        <div className="lp-cta-content">
          <p className="lp-section-tag lp-section-tag--light">The Manifesto</p>
          <h2 className="lp-cta-heading">Every Promise.<br />Every Plan.<br />Documented.</h2>
          <p className="lp-cta-desc">
            No vague commitments. No empty slogans. Download the full manifesto
            and hold this campaign accountable to every word.
          </p>
          <a href="/manifesto.pdf" download className="lp-btn-gold">Download PDF</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <p className="lp-footer-name">Javas Abich</p>
            <p className="lp-footer-slogan">Arete in Action · JKUSA 2026</p>
          </div>
          <Link to="/login" className="lp-nav-cta">Team Login</Link>
        </div>
        <div className="lp-footer-line" />
        <p className="lp-footer-copy">Campaign HQ · Built for the JKUSA 2026 Student Presidential Campaign</p>
      </footer>

    </div>
  );
}