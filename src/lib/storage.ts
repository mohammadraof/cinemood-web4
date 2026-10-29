const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
export const getFavorites = (): number[] =>
  read<number[]>("cinemood:favorites", []);
export const saveFavorites = (ids: number[]) =>
  localStorage.setItem("cinemood:favorites", JSON.stringify(ids));
export const getMood = (): string => read<string>("cinemood:lastMood", "");
export const saveMood = (mood: string) =>
  localStorage.setItem("cinemood:lastMood", JSON.stringify(mood));
export const getTheme = (): boolean =>
  read<boolean>("cinemood:lightTheme", false);
export const saveTheme = (light: boolean) =>
  localStorage.setItem("cinemood:lightTheme", JSON.stringify(light));
