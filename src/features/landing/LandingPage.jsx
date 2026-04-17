import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const TEAM = [
  "Every delegate who opened a door",
  "Every team member who made a call",
  "Every college that believed in the vision",
  "Every voice that stood with Arete",
];

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroRef, heroInView] = useInView(0.1);
  const [gratitudeRef, gratitudeInView] = useInView(0.1);
  const [teamRef, teamInView] = useInView(0.1);
  const [journeyRef, journeyInView] = useInView(0.1);
  const [closingRef, closingInView] = useInView(0.1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp">

      {/* Nav */}
      <nav className={`lp-nav ${scrolled ? "lp-nav--scrolled" : ""}`}>
        <span className="lp-nav-brand">
          Pontifex<span className="lp-nav-gold"> · Arete in Action</span>
        </span>
        <div className="lp-nav-links">
          <a href="#gratitude" className="lp-nav-link">Gratitude</a>
          <a href="#journey" className="lp-nav-link">The Journey</a>
          <Link to="/login" className="lp-nav-cta">Team Login</Link>
        </div>
        <button
          className="lp-nav-hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={`lp-ham-line ${menuOpen ? "lp-ham-open-1" : ""}`} />
          <span className={`lp-ham-line ${menuOpen ? "lp-ham-open-2" : ""}`} />
          <span className={`lp-ham-line ${menuOpen ? "lp-ham-open-3" : ""}`} />
        </button>
      </nav>

      {menuOpen && (
        <div className="lp-mobile-menu">
          <a href="#gratitude" className="lp-mobile-link" onClick={() => setMenuOpen(false)}>Gratitude</a>
          <a href="#journey" className="lp-mobile-link" onClick={() => setMenuOpen(false)}>The Journey</a>
          <Link to="/login" className="lp-mobile-cta" onClick={() => setMenuOpen(false)}>Team Login</Link>
        </div>
      )}

      {/* Hero — full screen with image */}
      <section className="lp-hero" ref={heroRef}>
        <div className="lp-hero-bg">
          <img
            src="/images/javas1.jpg"
            alt="Javas Abich"
            className="lp-hero-bg-img"
          />
          <div className="lp-hero-overlay" />
        </div>
        <div className={`lp-hero-content ${heroInView ? "lp-fade-up" : "lp-hidden"}`}>
          <p className="lp-hero-tag">JKUSA 2026 · Academic Affairs Secretary</p>
          <h1 className="lp-hero-name">
            Thank<br />
            <span className="lp-hero-name-gold">You.</span>
          </h1>
          <div className="lp-hero-rule" />
          <p className="lp-hero-slogan">
            We ran with everything we had.<br />
            Arete in Action — always.
          </p>
          <a href="#gratitude" className="lp-btn-outline-light">Read our message</a>
        </div>
        <div className="lp-hero-scroll-hint">
          <span className="lp-hero-scroll-line" />
        </div>
      </section>

      {/* Stats — what the campaign achieved */}
      <section className="lp-stats">
        {[
          { value: "136+", label: "Delegates Engaged" },
          { value: "5", label: "Colleges Reached" },
          { value: "Weeks", label: "of Dedication" },
          { value: "1", label: "Unified Vision" },
        ].map((s) => (
          <div key={s.label} className="lp-stat">
            <span className="lp-stat-value">{s.value}</span>
            <span className="lp-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Gratitude message */}
      <section className="lp-gratitude" id="gratitude" ref={gratitudeRef}>
        <div className={`lp-gratitude-inner ${gratitudeInView ? "lp-fade-up" : "lp-hidden"}`}>
          <p className="lp-section-tag">A Message from Javas</p>
          <h2 className="lp-section-heading">
            The Campaign Is Over.<br />
            <span className="lp-gold">The Gratitude Is Not.</span>
          </h2>
          <div className="lp-gratitude-body">
            <p>
              To every person who believed in Arete in Action — thank you.
              Not the kind of thank you that is said in passing, but the kind
              that is felt deeply and carried forward. You gave this campaign
              meaning that goes far beyond any election result.
            </p>
            <p>
              We knocked on every door we could find. We made calls at odd hours.
              We showed up for every college, every delegate, every conversation.
              That is not nothing. That is everything.
            </p>
            <p>
              The outcome did not go our way. But the standard we held ourselves
              to — the standard of Arete — that does not change with a result.
              Excellence was never about winning. It was always about how we ran.
            </p>
            <p className="lp-gratitude-sign">
              — Javas Abich
            </p>
          </div>
        </div>
        <div className={`lp-gratitude-img-wrap ${gratitudeInView ? "lp-fade-left" : "lp-hidden"}`}>
          <img
            src="/images/javas2.jpg"
            alt="Javas Abich — the campaign journey"
            className="lp-gratitude-img"
          />
          <div className="lp-gratitude-img-caption">
            <span>The Candidate</span>
            <span className="lp-gratitude-img-caption-sub">JKUSA 2026</span>
          </div>
        </div>
      </section>

      {/* Team acknowledgement */}
      <section className="lp-team-section" id="team" ref={teamRef}>
        <div className="lp-team-section-inner">
          <div className={`lp-team-header ${teamInView ? "lp-fade-up" : "lp-hidden"}`}>
            <p className="lp-section-tag lp-section-tag--light">Our People</p>
            <h2 className="lp-section-heading lp-section-heading--light">
              This Was Never <span className="lp-gold">One Person.</span>
            </h2>
            <p className="lp-team-intro">
              Every number on that dashboard represented a human being who gave
              their time, their voice, and their trust. This page is for them.
            </p>
          </div>
          <div className="lp-team-cards">
            {TEAM.map((line, i) => (
              <div
                key={i}
                className={`lp-team-card ${teamInView ? "lp-fade-up" : "lp-hidden"}`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="lp-team-card-num">{String(i + 1).padStart(2, "0")}</div>
                <p className="lp-team-card-text">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey — image full bleed with quote */}
      <section className="lp-journey" id="journey" ref={journeyRef}>
        <div className="lp-journey-img-wrap">
          <img
            src="/images/javas3.jpg"
            alt="Javas Abich — Arete in Action campaign"
            className="lp-journey-img"
          />
          <div className="lp-journey-overlay" />
          <div className={`lp-journey-quote ${journeyInView ? "lp-fade-up" : "lp-hidden"}`}>
            <span className="lp-journey-quote-mark">"</span>
            <p className="lp-journey-quote-text">
              Excellence is a discipline,<br />not a destination.
            </p>
            <p className="lp-journey-quote-attr">— Arete in Action</p>
          </div>
        </div>
        <div className={`lp-journey-content ${journeyInView ? "lp-fade-left" : "lp-hidden"}`}>
          <p className="lp-section-tag lp-section-tag--light">What We Built</p>
          <h2 className="lp-journey-heading">
            136 Delegates.<br />5 Colleges.<br />
            <span className="lp-gold">One Standard.</span>
          </h2>
          <p className="lp-journey-text">
            In the weeks of this campaign, the Pontifex team built something
            real — a system, a network, and a culture of accountability that
            did not exist before. That infrastructure belongs to every person
            who contributed to it.
          </p>
          <p className="lp-journey-text">
            The relationships formed across colleges, the conversations had
            in corridors and lecture halls, the commitment shown by every
            team member — these are not erased by a result. They are the
            foundation of what comes next.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="lp-closing" ref={closingRef}>
        <div className={`lp-closing-inner ${closingInView ? "lp-fade-up" : "lp-hidden"}`}>
          <div className="lp-closing-rule" />
          <h2 className="lp-closing-heading">
            Arete in Action.<br />
            <span className="lp-gold">Always.</span>
          </h2>
          <p className="lp-closing-text">
            The campaign is complete. The standard lives on.
            Thank you for every moment of this journey.
          </p>
          <div className="lp-closing-rule" />
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
        <p className="lp-footer-copy">
          Pontifex Campaign HQ · JKUSA 2026 Student Election · Thank you.
        </p>
      </footer>

    </div>
  );
}