// Render the published studio story, quotes, and images.
import React from "react";
import { mediaUrl } from "../api/client";
import PublishedImage from "./PublishedImage";
export default function AtelierStory({ content }) {
  if (!content) return null;
  return (
    <section
      className="story-section hairline-b"
      id="story"
      aria-labelledby="story-title"
    >
      <div className="editorial-shell story-grid">
        <div className="story-text-col">
          <div className="story-header-wrap">
            {content.eyebrow && (
              <span className="eyebrow">{content.eyebrow}</span>
            )}
            <h2 id="story-title" className="story-heading">
              {content.title || "Our story"}
            </h2>
          </div>
          <div className="story-body">
            {(content.paragraphs || []).map((paragraph, index) => (
              <p className="story-paragraph" key={index}>
                {paragraph}
              </p>
            ))}
            {content.quote?.text && (
              <div className="story-pullquote">
                <blockquote className="quote-text">
                  {content.quote.text}
                </blockquote>
                <cite className="quote-author">
                  <span className="author-name">{content.quote.author}</span>
                  <span className="author-role">{content.quote.role}</span>
                </cite>
              </div>
            )}
            {!!content.pillars?.length && (
              <div className="story-pillars-grid hairline-t">
                {content.pillars.map((pillar, index) => (
                  <div className="pillar-card" key={index}>
                    <span className="pillar-num">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <strong className="pillar-title">{pillar.title}</strong>
                    <p className="pillar-copy">{pillar.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {!!content.images?.length && (
          <div className="story-media-col hairline-l">
            <div className="story-image-stack">
              {content.images.map(
                (image, index) =>
                  mediaUrl(image.url) && (
                    <figure className="stack-card stack-primary" key={index}>
                      <PublishedImage
                        src={mediaUrl(image.url)}
                        alt={image.alt || ""}
                        className="story-img"
                        loading="lazy"
                        decoding="async"
                      />
                      {image.caption && (
                        <figcaption className="caption-strip">
                          <span className="caption-desc">{image.caption}</span>
                        </figcaption>
                      )}
                    </figure>
                  ),
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
