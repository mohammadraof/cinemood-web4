export type Mood = "happy" | "sad" | "angry" | "surprise" | "neutral";
export interface Movie {
  id: number;
  title: string;
  title_fa: string;
  year: number;
  genres: string[];
  moods: Mood[];
  rating: number;
  poster?: string;
  runtime?: number;
  director?: string;
  synopsis?: string;
  synopsis_en?: string;
  aparatId?: string;
  watchProviders?: { name: string; url: string }[];
}

export const MOODS: {
  key: Mood;
  label: string;
  svg: string;
  description: string;
  color: string;
}[] = [
    {
      key: "happy",
      label: "شاد",
      svg: `
      <svg width="35" height="35" viewBox="0 0 40 40"
           fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="17"
                stroke="currentColor" stroke-width="2"/>
        <circle cx="14" cy="15" r="1.8" fill="currentColor"/>
        <circle cx="26" cy="15" r="1.8" fill="currentColor"/>
        <path d="M11 22 Q20 34 29 22"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round"/>
      </svg>
    `,
      description: "یه حال خوب و پرانرژی",
      color: "var(--mood-happy)",
    },
    {
      key: "sad",
      label: "غمگین",
      svg: `
      <svg width="42" height="50" viewBox="0 0 40 40"
           fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="17"
                stroke="currentColor" stroke-width="2"/>
        <circle cx="14" cy="15" r="1.8" fill="currentColor"/>
        <circle cx="26" cy="15" r="1.8" fill="currentColor"/>
        <path d="M12 29 Q20 19 28 29"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round"/>
      </svg>
    `,
      description: "یه قصه برای هم‌حسی",
      color: "var(--mood-sad)",
    },
    {
      key: "angry",
      label: "عصبانی",
      svg: `
      <svg width="35" height="35" viewBox="0 0 40 40"
           fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="17"
                stroke="currentColor" stroke-width="2"/>
        <path d="M11 12 L17 15 M29 12 L23 15"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round"/>
        <circle cx="14" cy="18" r="1.7" fill="currentColor"/>
        <circle cx="26" cy="18" r="1.7" fill="currentColor"/>
        <path d="M12 29 Q20 20 28 29"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round"/>
      </svg>
    `,
      description: "تخلیه‌ی انرژی و هیجان",
      color: "var(--mood-angry)",
    },
    {
      key: "surprise",
      label: "متعجب",
      svg: `
      <svg width="35" height="35" viewBox="0 0 40 40"
           fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="17"
                stroke="currentColor" stroke-width="2"/>
        <circle cx="14" cy="15" r="2"
                stroke="currentColor" stroke-width="1.8"/>
        <circle cx="26" cy="15" r="2"
                stroke="currentColor" stroke-width="1.8"/>
        <ellipse cx="20" cy="26" rx="3.5" ry="4.5"
                 stroke="currentColor" stroke-width="2"/>
      </svg>
    `,
      description: "یه داستان غیرقابل‌پیش‌بینی",
      color: "var(--mood-surprise)",
    },
    {
      key: "neutral",
      label: "خنثی",
      svg: `
      <svg width="35" height="35" viewBox="0 0 40 40"
           fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="17"
                stroke="currentColor" stroke-width="2"/>
        <circle cx="14" cy="15" r="1.8" fill="currentColor"/>
        <circle cx="26" cy="15" r="1.8" fill="currentColor"/>
        <path d="M13 26 H27"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round"/>
      </svg>
    `,
      description: "یه انتخاب خوش‌ساخت و مطمئن",
      color: "var(--mood-neutral)",
    },
  ];
