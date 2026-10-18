import { useCallback, useEffect, useState } from "react";
import {
  fetchTreatments,
  fetchLocations,
  fetchSignatureFavorites,
  fetchPractitioners,
  fetchContent,
} from "../api/client";

/** Loads one consistent catalog and cancels stale requests on reload or unmount. */
export default function useCatalog() {
  const [catalog, setCatalog] = useState({
    treatments: [],
    locations: [],
    favorites: [],
    practitioners: [],
    sections: {},
  });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    Promise.all([
      fetchTreatments(options),
      fetchLocations(options),
      fetchSignatureFavorites(options),
      fetchPractitioners(options),
      fetchContent(options),
    ])
      .then(([treatments, locations, favorites, practitioners, content]) => {
        if (controller.signal.aborted) return;
        if (
          ![treatments, locations, favorites, practitioners].every(
            Array.isArray,
          )
        )
          throw new Error(
            "The studio catalog could not be read. Please try again.",
          );
        setCatalog({
          treatments,
          locations,
          favorites,
          practitioners,
          sections: content.sections || {},
        });
        setStatus("ready");
      })
      .catch((failure) => {
        if (controller.signal.aborted) return;
        setError(failure.message);
        setStatus("error");
        controller.abort();
      });
    return () => controller.abort();
  }, [reload]);
  const retry = useCallback(() => {
    setStatus("loading");
    setError("");
    setReload((value) => value + 1);
  }, []);
  return { catalog, status, error, retry };
}
