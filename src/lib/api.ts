import type { Movie } from "../types";

// ---------------------------------------------
// API Configuration
// ---------------------------------------------

const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");

const MOVIES_URL = API_BASE
  ? `${API_BASE}/movies`
  : `${import.meta.env.BASE_URL}movies.json`;

const TIMEOUT_MS = 6000;

const VALID_MOODS = new Set(["happy", "sad", "angry", "surprise", "neutral"]);

// ---------------------------------------------
// Movie Data Validation
// ---------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

function isOptionalString(value: unknown): boolean {
  return value == null || typeof value === "string";
}

function isValidWatchProviders(value: unknown): boolean {
  if (value == null) return true;

  if (!Array.isArray(value)) return false;

  return value.every((provider) => {
    if (!isRecord(provider)) return false;

    if (
      typeof provider.name !== "string" ||
      provider.name.trim().length === 0 ||
      typeof provider.url !== "string"
    ) {
      return false;
    }

    try {
      const url = new URL(provider.url);

      return url.protocol === "https:";
    } catch {
      return false;
    }
  });
}

function isValidMovie(value: unknown): value is Movie {
  if (!isRecord(value)) return false;

  return (
    Number.isSafeInteger(value.id) &&
    (value.id as number) > 0 &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.title_fa === "string" &&
    value.title_fa.trim().length > 0 &&
    Number.isInteger(value.year) &&
    (value.year as number) > 0 &&
    typeof value.rating === "number" &&
    Number.isFinite(value.rating) &&
    value.rating >= 0 &&
    value.rating <= 10 &&
    isStringArray(value.genres) &&
    isStringArray(value.moods) &&
    value.moods.length > 0 &&
    value.moods.every((mood: string) => VALID_MOODS.has(mood)) &&
    isOptionalString(value.poster) &&
    isOptionalString(value.director) &&
    isOptionalString(value.synopsis) &&
    isOptionalString(value.synopsis_en) &&
    (value.runtime == null ||
      (typeof value.runtime === "number" &&
        Number.isFinite(value.runtime) &&
        value.runtime > 0)) &&
    isOptionalString(value.aparatId) &&
    isValidWatchProviders(value.watchProviders)
  );
}

function validateMovies(data: unknown): Movie[] {
  if (!Array.isArray(data)) {
    throw new Error("Movies response must be an array.");
  }

  if (data.length === 0) {
    throw new Error("Movies response is empty.");
  }

  if (!data.every(isValidMovie)) {
    throw new Error("Movies response contains invalid data.");
  }

  const ids = new Set(data.map((movie: Movie) => movie.id));

  if (ids.size !== data.length) {
    throw new Error("Duplicate movie IDs detected.");
  }

  return data;
}

// ---------------------------------------------
// Fetch Movies
// ---------------------------------------------

export async function fetchMovies(signal?: AbortSignal): Promise<Movie[]> {
  const controller = new AbortController();

  const onAbort = () => controller.abort();

  if (signal?.aborted) {
    controller.abort();
  } else {
    signal?.addEventListener("abort", onAbort, {
      once: true,
    });
  }

  let timedOut = false;

  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);

  try {
    const response = await fetch(MOVIES_URL, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Movies request failed: HTTP ${response.status}`);
    }

    const data: unknown = await response.json();

    if (controller.signal.aborted) {
      throw new DOMException("Request aborted", "AbortError");
    }

    return validateMovies(data);
  } catch (error) {
    if (signal?.aborted) {
      throw new DOMException("Request cancelled", "AbortError");
    }

    if (timedOut) {
      throw new Error("Movies request timed out after 6 seconds.");
    }

    throw error;
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
