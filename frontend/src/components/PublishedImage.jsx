// Load approved media and display a clear failure state when it is unavailable.
import { useState } from "react";

/** Preserve the media space on failure, without substituting invented imagery. */
export default function PublishedImage({
  src,
  alt = "",
  className = "",
  ...props
}) {
  const [failedSource, setFailedSource] = useState(null);
  if (failedSource === src) {
    return (
      <div
        className={`${className} media-unavailable`}
        role="img"
        aria-label={alt ? `${alt}. Image unavailable.` : "Image unavailable."}
      >
        <span>Image unavailable.</span>
      </div>
    );
  }
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSource(src)}
    />
  );
}
