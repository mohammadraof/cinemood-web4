import {
  Heart,
  Star,
  Clapperboard,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MovieCard from "../components/MovieCard";
import { MOODS, type Movie, type Mood } from "../types";

type DashboardProps = {
  movies: Movie[];
  favorites: number[];
  onFavorite: (id: number) => void;
  lastMood: Mood | null;
};

export default function Dashboard({
  movies,
  favorites,
  onFavorite,
  lastMood,
}: DashboardProps) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.resolvedLanguage === "en";

  const saved = movies.filter((m) => favorites.includes(m.id));
  const mood = MOODS.find((m) => m.key === lastMood);

  const moodLabel = mood
    ? t(`moods.${mood.key}`, { defaultValue: mood.label })
    : "";

  const moodDescription = mood
    ? t(`moodDescriptions.${mood.key}`, {
        defaultValue: mood.description,
      })
    : "";

  const avg = saved.length
    ? saved.reduce((sum, m) => sum + m.rating, 0) / saved.length
    : 0;

  const genreCounts = saved
    .flatMap((m) => m.genres)
    .reduce<Record<string, number>>((counts, genre) => {
      counts[genre] = (counts[genre] || 0) + 1;
      return counts;
    }, {});

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const ArrowIcon = isEnglish ? ArrowRight : ArrowLeft;

  return (
    <main className="container page-shell">
      <div className="breadcrumb">
        <Link to="/">{t("nav.home")}</Link>
        <span>/</span>
        <b>{t("nav.dashboard")}</b>
      </div>

      <section className="dashboard-heading">
        <div className="eyebrow">
          <LayoutDashboard size={15} />
          {t("dashboardPage.eyebrow")}
        </div>

        <h1>
          {t("dashboardPage.titleStart")}{" "}
          <span className="gradient-text">
            {t("dashboardPage.titleHighlight")}
          </span>
        </h1>

        <p>{t("dashboardPage.description")}</p>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-icon pink">
            <Heart />
          </span>
          <div>
            <small>{t("dashboardPage.savedMovies")}</small>
            <strong>{saved.length}</strong>
            <span>{t("dashboardPage.personalSelection")}</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon gold">
            <Star />
          </span>
          <div>
            <small>{t("dashboardPage.averageRating")}</small>
            <strong>{avg ? avg.toFixed(1) : "—"}</strong>
            <span>{t("dashboardPage.outOfTen")}</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon violet">
            <Clapperboard />
          </span>
          <div>
            <small>{t("dashboardPage.discoveredGenres")}</small>
            <strong>{Object.keys(genreCounts).length}</strong>
            <span>{t("dashboardPage.genreDiversity")}</span>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon teal">
            <TrendingUp />
          </span>
          <div>
            <small>{t("dashboardPage.lastSelectedMood")}</small>
            <strong>
              {mood && (
                <span
                  className="mood-icon"
                  dangerouslySetInnerHTML={{
                    __html: mood.svg || "",
                  }}
                />
              )}
              {mood ? moodLabel : t("dashboardPage.notYet")}
            </strong>
            <span>
              {mood
                ? t("dashboardPage.savedOnDevice")
                : t("dashboardPage.timeToTry")}
            </span>
          </div>
        </article>
      </section>

      <section className="dashboard-columns">
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>{t("dashboardPage.topGenres")}</h2>
              <p>{t("dashboardPage.topGenresDescription")}</p>
            </div>
            <span className="panel-symbol">✳</span>
          </div>

          {topGenres.length ? (
            <div className="genre-bars">
              {topGenres.map(([genre, count]) => (
                <div className="genre-bar-row" key={genre}>
                  <div>
                    <span>
                      {t(`genres.${genre.toLowerCase()}`, {
                        defaultValue: genre,
                      })}
                    </span>
                    <b>
                      {t("dashboardPage.movieCount", {
                        count,
                      })}
                    </b>
                  </div>

                  <div className="bar-track">
                    <span
                      style={{
                        width: `${
                          (count /
                            Math.max(...topGenres.map((item) => item[1]))) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="panel-empty">{t("dashboardPage.noGenreData")}</div>
          )}
        </div>

        <div className="dashboard-panel mood-history">
          <div className="panel-heading">
            <div>
              <h2>{t("dashboardPage.lastMoodTitle")}</h2>
              <p>{t("dashboardPage.lastMoodDescription")}</p>
            </div>
            <span className="panel-symbol">☾</span>
          </div>

          {mood ? (
            <div className="last-mood-card">
              <span
                className="mood-icon"
                dangerouslySetInnerHTML={{
                  __html: mood.svg || "",
                }}
              />

              <div>
                <b>
                  {t("dashboardPage.yourMoodWas", {
                    mood: moodLabel,
                  })}
                </b>
                <small>{moodDescription}</small>
              </div>
            </div>
          ) : (
            <div className="panel-empty">
              {t("dashboardPage.noMoodSelected")}
            </div>
          )}

          <Link to="/mood" className="text-link">
            {t("dashboardPage.chooseNewMood")}
            <ArrowIcon size={15} />
          </Link>
        </div>
      </section>

      <section className="section dashboard-favorites">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              {t("dashboardPage.personalCollection")}
            </div>

            <h2>
              {t("dashboardPage.favoriteTitleStart")}{" "}
              <span className="gradient-text">
                {t("dashboardPage.favoriteTitleHighlight")}
              </span>
            </h2>
          </div>

          <Link to="/movies" className="text-link">
            {t("dashboardPage.discoverMore")}
            <ArrowIcon size={15} />
          </Link>
        </div>

        {saved.length ? (
          <div className="movie-grid">
            {saved.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                favorite
                onFavorite={onFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>♡</span>
            <h3>{t("dashboardPage.noFavoritesTitle")}</h3>
            <p>{t("dashboardPage.noFavoritesDescription")}</p>

            <Link to="/movies" className="btn btn-primary">
              {t("dashboardPage.exploreMovies")}
              <ArrowIcon size={16} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}