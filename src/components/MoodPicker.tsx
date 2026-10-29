import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { MOODS, type Mood } from "../types";

type MoodPickerProps = {
  value: Mood | null;
  onChange: (m: Mood) => void;
};

export default function MoodPicker({ value, onChange }: MoodPickerProps) {
  const { t } = useTranslation();

  return (
    <div className="mood-grid">
      {MOODS.map((m) => (
        <button
          type="button"
          key={m.key}
          onClick={() => onChange(m.key)}
          aria-pressed={value === m.key}
          className={`mood-card ${value === m.key ? "selected" : ""}`}
          style={{ "--mood-color": m.color } as CSSProperties}
        >
          <span
            className="mood-emoji"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: m.svg }}
          />

          <b>
            {t(`moods.${m.key}`, {
              defaultValue: m.label,
            })}
          </b>

          <small>
            {t(`moodDescriptions.${m.key}`, {
              defaultValue: m.description,
            })}
          </small>

          <span className="mood-check" aria-hidden="true">
            {value === m.key ? "✓" : "+"}
          </span>
        </button>
      ))}
    </div>
  );
}