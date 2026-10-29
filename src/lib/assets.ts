
export function getPosterUrl(poster?: string): string {
  if (!poster) return "";

  if (/^https?:\/\//i.test(poster)) {
    return poster;
  }

  const base = import.meta.env.BASE_URL;
  const cleanPath = poster.replace(/^\/+/, "");

  return `${base}${cleanPath}`;
}