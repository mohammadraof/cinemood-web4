
import type { Mood } from "../types";

const KEYS = {
  favorites: "cinemood:favorites",
  mood: "cinemood:lastMood",
  theme: "cinemood:lightTheme",
} as const;

const VALID_MOODS: readonly Mood[] = [
  "happy",
  "sad",
  "angry",
  "surprise",
  "neutral",
];

function read(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Unable to save preference:", error);
  }
}

export function getFavorites(): number[] {
  const value = read(KEYS.favorites);

  if (!Array.isArray(value)) return [];

  return [...new Set(
    value.filter(
      (id): id is number =>
        typeof id === "number" &&
        Number.isSafeInteger(id) &&
        id > 0,
    ),
  )];
}

export function saveFavorites(ids: number[]): void {
  write(KEYS.favorites, ids);
}

export function getMood(): Mood | "" {
  const value = read(KEYS.mood);

  return typeof value === "string" &&
    VALID_MOODS.some((mood) => mood === value)
    ? (value as Mood)
    : "";
}

export function saveMood(mood: string): void {
  write(KEYS.mood, mood);
}

export function getTheme(): boolean {
  const value = read(KEYS.theme);
  return typeof value === "boolean" ? value : false;
}

export function saveTheme(light: boolean): void {
  write(KEYS.theme, light);
}