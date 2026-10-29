import type { Movie } from "../types";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL as string | undefined
)?.replace(/\/$/, "");

// Without a backend, movies are fetched from the static sample file in /public.
const MOVIES_URL = API_BASE
  ? `${API_BASE}/movies`
  : `${import.meta.env.BASE_URL}movies.json`;

const TIMEOUT_MS = 6000;

export async function fetchMovies(signal?: AbortSignal): Promise<Movie[]> {
  const timeout = new AbortController();
  const timer = window.setTimeout(() => timeout.abort(), TIMEOUT_MS);
  const onAbort = () => timeout.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const response = await fetch(MOVIES_URL, {
      signal: timeout.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok)
      throw new Error(`Movies request failed (${response.status})`);
    const data: unknown = await response.json();
    if (!Array.isArray(data))
      throw new Error("Movies response must be an array");
    return data as Movie[];
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}