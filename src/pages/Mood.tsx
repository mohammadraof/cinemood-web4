
import { useMemo, useState, useEffect } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MoodPicker from "../components/MoodPicker";
import MovieCard from "../components/MovieCard";
import { MOODS, type Mood as MoodType, type Movie } from "../types";

type MoodPageProps = {
  movies: Movie[];
  favorites: number[];
  onFavorite: (id: number) => void;
  lastMood: MoodType | null;
  onSaveMood: (m: MoodType | null) => void;
};

export default function MoodPage({
  movies,
  favorites,
  onFavorite,
  lastMood,
  onSaveMood,
}: MoodPageProps) {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<MoodType | null>(lastMood);
  const [show, setShow] = useState(false);
  const [revealCount, setRevealCount] = useState(0);

  const recommendations = useMemo(
    () =>
      selected
        ? movies
            .filter((m) => m.moods.includes(selected))
            .sort((a, b) => b.rating - a.rating)
        : [],
    [selected, movies],
  );

  const mood = MOODS.find((m) => m.key === selected);

  const moodLabel = mood
    ? t(`moods.${mood.key}`, { defaultValue: mood.label })
    : "";

  function reveal() {
    if (!selected) return;

    onSaveMood(selected);
    setShow(true);
    setRevealCount((c) => c + 1);
  }

  useEffect(() => {
    if (revealCount === 0) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.getElementById("recommendations")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [revealCount]);

  return (
    <main className="page-shell container">
      <div className="breadcrumb">
        <Link to="/">{t("nav.home")}</Link>
        <span>/</span>
        <b>{t("nav.mood")}</b>
      </div>

      <section className="mood-intro">
        <span className="mood-sun" aria-hidden="true">
          <Sparkles size={24} />
        </span>

        <div className="eyebrow">{t("moodPage.eyebrow")}</div>

        <h1>
          {t("moodPage.titleStart")}{" "}
          <span className="gradient-text">
            {t("moodPage.titleHighlight")}
          </span>{" "}
          {t("moodPage.titleEnd")}
        </h1>

        <p>{t("moodPage.description")}</p>
      </section>

      <section className="mood-selector">
        <MoodPicker
          value={selected}
          onChange={(m) => {
            setSelected(m);
            setShow(false);
            onSaveMood(m);
          }}
        />

        <p className="sr-only" role="status" aria-live="polite">
          {mood
            ? t("moodPage.selectedStatus", { mood: moodLabel })
            : t("moodPage.noSelection")}
        </p>

        <button
          type="button"
          className="btn btn-primary btn-large mood-submit"
          disabled={!selected}
          onClick={reveal}
        >
          {t("moodPage.submit")}
          <Sparkles size={18} />
        </button>
      </section>

      {show && mood && (
        <section className="recommendations" id="recommendations">
          <div className="recommendation-heading">
            <div>
              <div className="eyebrow">
                <span
                  className="mood-icon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: mood.svg }}
                />

                {t("moodPage.yourChoice", { mood: moodLabel })}
              </div>

              <h2>
                {t("moodPage.resultsTitleStart")}{" "}
                <span className="gradient-text">
                  {t("moodPage.resultsTitleHighlight")}
                </span>
              </h2>

              <p>{t("moodPage.resultsDescription")}</p>
            </div>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSelected(null);
                setShow(false);
                onSaveMood(null);
              }}
            >
              <RotateCcw size={16} />
              {t("moodPage.reset")}
            </button>
          </div>

          {recommendations.length ? (
            <div className="movie-grid">
              {recommendations.map((m) => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  favorite={favorites.includes(m.id)}
                  onFavorite={onFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              {t("moodPage.noResults")}
            </div>
          )}
        </section>
      )}

      <div className="mood-footnote">
        <span>✦</span>
        {t("moodPage.footnote")}
      </div>
    </main>
  );
}
