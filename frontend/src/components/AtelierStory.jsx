import React from "react";

export default function AtelierStory() {
  return (
    <section className="story-section hairline-b" id="story" aria-labelledby="story-title">
      <div className="editorial-shell story-grid">
        <div className="story-text-col">
          <div className="story-header-wrap">
            <span className="eyebrow">
              <span className="eyebrow-accent">01</span> The Environment & The Discipline
            </span>
            <h2 id="story-title" className="story-heading">
              An architecture created to silence sensory noise.
            </h2>
          </div>

          <div className="story-body">
            <p className="story-paragraph">
              Most salons are designed like transit hubs: rows of synchronized mirrors, whirring blow dryers, 
              intrusive background playlists, and synthetic aerosols that overwhelm the senses. 
              The guest is rushed between stations while three stylists rotate through the chair.
            </p>

            <p className="story-paragraph">
              Redband was constructed as an antidote. Our suites hold exactly one guest at a time. 
              The walls are hand-troweled limestone plaster that absorbs ambient resonance. 
              The basins are carved from solid travertine blocks, plumbed with temperature-stable, 
              de-chlorinated mountain water.
            </p>

            <div className="story-pullquote">
              <blockquote className="quote-text">
                “Hair is living architecture worn in motion every day. When you diagnose in silence under natural 
                morning light, you see bone angles and growth vectors that busy salons miss.”
              </blockquote>
              <cite className="quote-author">
                <span className="author-name">Elena Vane</span>
                <span className="author-role">Master Sculptor & Founder</span>
              </cite>
            </div>

            <div className="story-pillars-grid hairline-t">
              <div className="pillar-card">
                <span className="pillar-num">A</span>
                <strong className="pillar-title">Diagnostic First</strong>
                <p className="pillar-copy">Micro-scalp scan & dry head-shape mapping before any scissors open.</p>
              </div>
              <div className="pillar-card hairline-l">
                <span className="pillar-num">B</span>
                <strong className="pillar-title">Botanical Apothecary</strong>
                <p className="pillar-copy">Small-batch bio-lipids, wild hinoki, and organic cold-pressed jojoba.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="story-media-col hairline-l">
          <div className="story-image-stack">
            <div className="stack-card stack-primary">
              <img
                src="/images/studio-interior.jpg"
                alt="Minimalist Redband studio interior featuring walnut joinery and monolithic stone basin"
                className="story-img"
                loading="lazy"
              />
              <div className="caption-strip">
                <span className="caption-num">Pl. 01</span>
                <span className="caption-desc">Private Suite 1 — Honed Italian travertine basin & linen screen</span>
              </div>
            </div>

            <div className="stack-card stack-secondary hairline-t">
              <div className="secondary-media-inner">
                <img
                  src="/images/craft-tools.jpg"
                  alt="Hand-forged matte shears and horn comb resting on travertine stone"
                  className="story-img-secondary"
                  loading="lazy"
                />
                <div className="caption-strip">
                  <span className="caption-num">Pl. 02</span>
                  <span className="caption-desc">Custom cobalt shears (6.2" Japanese steel) & carved buffalo horn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
