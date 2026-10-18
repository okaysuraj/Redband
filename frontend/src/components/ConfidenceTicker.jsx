// Display published studio principles as a static, readable list.
import React from "react";
export default function ConfidenceTicker({ content }) {
  if (!Array.isArray(content?.statements) || !content.statements.length)
    return null;
  // Static text respects reduced motion and avoids a permanently active render layer.
  return (
    <aside
      className="confidence-ticker hairline-b"
      aria-label="Atelier principles"
    >
      <div className="principles-list">
        {content.statements.map((statement, index) => (
          <span key={index} className="ticker-item">
            <span aria-hidden="true">/</span> {statement}
          </span>
        ))}
      </div>
    </aside>
  );
}
