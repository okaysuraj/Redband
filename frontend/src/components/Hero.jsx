// Render the published introduction and reservation entry point.
import React from "react";
import { mediaUrl } from "../api/client";
import PublishedImage from "./PublishedImage";
export default function Hero({ content, onOpenBooking, bookingAvailable }) {
  if (!content) return null;
  const image = mediaUrl(content.image_url);
  return (
    <section className="hero-section hairline-b" aria-label="Introduction">
      <div className="editorial-shell hero-grid">
        <div className="hero-copy-col">
          <div className="hero-eyebrow-row">
            {content.eyebrow && (
              <span className="eyebrow">{content.eyebrow}</span>
            )}
            {content.badge && (
              <span className="badge-tag">{content.badge}</span>
            )}
          </div>
          {content.title ? (
            <h1 className="hero-heading">
              {content.title}
              {content.subtitle && (
                <em className="hero-heading-italic"> {content.subtitle}</em>
              )}
            </h1>
          ) : (
            content.subtitle && (
              <p className="hero-heading">{content.subtitle}</p>
            )
          )}
          <div className="hero-foot-wrap">
            {content.description && (
              <p className="hero-lead">{content.description}</p>
            )}
            <div className="hero-actions-row">
              <button
                className="btn-ink hero-cta-btn"
                disabled={!bookingAvailable}
                onClick={onOpenBooking}
              >
                Reserve a Chair <span aria-hidden="true">&rarr;</span>
              </button>
              <a
                className="circle-scroll-btn"
                href="#treatments"
                aria-label="Explore treatments"
              >
                &darr;
              </a>
            </div>
            {Array.isArray(content.stats) && (
              <div className="hero-meta-strip">
                {content.stats.map((stat, index) => (
                  <div className="meta-item" key={index}>
                    <span className="meta-label">{stat.label}</span>
                    <span className="meta-val">{stat.value}</span>
                  </div>
                ))}
              </div>
            )}
            {!image && content.location_caption && (
              <p className="hero-lead">{content.location_caption}</p>
            )}
          </div>
        </div>
        {image && (
          <div className="hero-media-col hairline-l">
            <div className="hero-portrait-frame">
              <PublishedImage
                src={image}
                alt={content.image_alt || ""}
                className="hero-portrait-img"
                fetchPriority="high"
                decoding="async"
              />
              {content.image_caption && (
                <div className="portrait-overlay-tag">
                  {content.image_caption}
                </div>
              )}
              {content.location_caption && (
                <div className="portrait-location-tag">
                  {content.location_caption}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
