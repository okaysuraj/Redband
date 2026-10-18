// Send bounded HTTP requests and release cancellation listeners after each request.
export function createTransport({
  baseUrl,
  allowHttp = false,
  fetchImpl = globalThis.fetch,
  timeoutMs = 15000,
}) {
  return async function request(endpoint, options = {}) {
    if (
      !baseUrl ||
      !(allowHttp ? /^https?:\/\//i : /^https:\/\//i).test(baseUrl)
    ) {
      throw new Error(
        "Configure EXPO_PUBLIC_API_URL with your HTTPS backend address.",
      );
    }
    const controller = new AbortController();
    const cancel = () => controller.abort(options.signal?.reason);
    if (options.signal?.aborted) cancel();
    else options.signal?.addEventListener("abort", cancel, { once: true });
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    try {
      const response = await fetchImpl(
        `${baseUrl.replace(/\/$/, "")}${endpoint}`,
        {
          ...options,
          headers: {
            Accept: "application/json",
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers,
          },
          signal: controller.signal,
        },
      );
      const data = response.status === 204 ? null : await response.json();
      if (!response.ok) {
        const detail =
          typeof data?.detail === "string"
            ? data.detail
            : Array.isArray(data?.detail)
              ? data.detail.map((item) => item.msg).join(". ")
              : `Request failed (${response.status}).`;
        const error = new Error(detail);
        error.status = response.status;
        throw error;
      }
      return data;
    } catch (error) {
      if (timedOut)
        throw new Error(
          "The server took too long to respond. Check your connection and try again.",
        );
      if (error instanceof SyntaxError)
        throw new Error(
          "The server returned an invalid response. Please try again.",
        );
      throw error;
    } finally {
      clearTimeout(timeout);
      options.signal?.removeEventListener("abort", cancel);
    }
  };
}
