import { useCallback, useEffect, useState } from "react";
import {
  fetchContent,
  fetchLocations,
  fetchPractitioners,
  fetchSignatureFavorites,
  fetchTreatments,
} from "../api/client";

/** Fetches the shared catalog, with pull-to-refresh and request cancellation. */
export default function useCatalog() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    Promise.all([
      fetchContent(options),
      fetchTreatments(options),
      fetchLocations(options),
      fetchSignatureFavorites(options),
      fetchPractitioners(options),
    ])
      .then(([content, treatments, locations, favorites, practitioners]) => {
        if (controller.signal.aborted) return;
        if (
          !content?.sections ||
          ![treatments, locations, favorites, practitioners].every(
            Array.isArray,
          )
        )
          throw new Error("The server returned an invalid catalog.");
        setData({
          sections: content.sections,
          treatments,
          locations,
          favorites,
          practitioners,
        });
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setData(null);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [refresh]);
  const reload = useCallback(() => {
    setLoading(true);
    setError("");
    setRefresh((value) => value + 1);
  }, []);
  return { data, loading, error, reload };
}
