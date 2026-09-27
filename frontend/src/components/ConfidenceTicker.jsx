import React from "react";

export default function ConfidenceTicker() {
  const statements = [
    "ARCHITECTURAL DRY SCISSOR CUTTING",
    "OZONE VAPOR SCALP PURIFICATION",
    "SINGLE-CHAIR ACOUSTIC ISOLATION",
    "TRICHOLOGICAL MICROSCOPE DIAGNOSTICS",
    "BIO-LIPID BOTANICAL FORMULATIONS",
    "NO HURRIED CHAIR ROTATIONS",
    "BY APPOINTMENT ONLY"
  ];

  return (
    <aside className="confidence-ticker hairline-b" aria-label="Atelier Philosophy Principles">
      <div className="ticker-track">
        <div className="ticker-content" aria-hidden="true">
          {statements.concat(statements).map((text, idx) => (
            <span key={idx} className="ticker-item">
              <span className="ticker-bullet">/</span>
              <span className="ticker-text">{text}</span>
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
