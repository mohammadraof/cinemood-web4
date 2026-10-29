import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Clock3,
  CalendarDays,
  Clapperboard,
  ArrowLeft,
  Ticket,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Movie } from "../types";
import MovieWatchActions from "../components/MovieWatchActions";
import { MOODS } from "../types";
import { getPosterUrl } from "../lib/assets";

type MovieDetailProps = {
  movies: Movie[];
  favorites: number[];
  onFavorite: (id: number) => void;
};

const RING_RADIUS = 24;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

export default function MovieDetail({
  movies,
  favorites,
  onFavorite,
}: MovieDetailProps) {
  const { t, i18n } = useTranslation();
  const { id } = useParams();

  const isEnglish = i18n.resolvedLanguage === "en";
  const movie = movies.find((m) => m.id === Number(id));

  if (!movie) {
    return (
      <main className="container page-shell">
        <div className="empty-state">
          <h2>{t("movieDetail.notFound")}</h2>

          <Link to="/" className="btn btn-primary">
            {t("movieDetail.backHome")}
          </Link>
        </div>
      </main>
    );
  }

  const movieTitle = isEnglish ? movie.title : movie.title_fa;

  // Arrow direction follows the reading direction (RTL for Persian, LTR for English)
  const NextArrow = isEnglish ? ArrowRight : ArrowLeft;
  const BackArrow = isEnglish ? ArrowLeft : ArrowRight;
  const isFavorite = favorites.includes(movie.id);

  const posterSrc = getPosterUrl(movie.poster);

  // Rating ring: fills proportionally to the rating (0-10)
  const ratio = Math.min(Math.max(movie.rating / 10, 0), 1);
  const ringDash = `${(ratio * RING_LENGTH).toFixed(1)} ${RING_LENGTH.toFixed(1)}`;

  return (
    <main className="container page-shell movie-detail">
      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <Link to="/">{t("nav.home")}</Link>
        <span>/</span>
        <b>{movieTitle}</b>
      </div>

      <section className="detail-layout">
        {/* POSTER + RATING RING */}
        <div className="detail-poster-wrap">
          <div className="detail-poster">
            <img
              src={posterSrc}
              alt={t("movieCard.posterAlt", { title: movieTitle })}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            <div className="poster-fallback">
              <Clapperboard size={42} strokeWidth={1.5} aria-hidden="true" />
              <b>{movieTitle}</b>
            </div>
          </div>

          <div
            className="detail-rating"
            role="img"
            aria-label={`${movie.rating} / 10`}
          >
            <svg viewBox="0 0 56 56" aria-hidden="true">
              <circle className="ring-track" cx="28" cy="28" r={RING_RADIUS} />
              <circle
                className="ring-value"
                cx="28"
                cy="28"
                r={RING_RADIUS}
                strokeDasharray={ringDash}
                transform="rotate(-90 28 28)"
              />
            </svg>
            <b>{movie.rating}</b>
          </div>
        </div>

        {/* MOVIE INFORMATION */}
        <div className="detail-copy">
          <div className="eyebrow">
            <Clapperboard size={15} />
            {t("movieDetail.eyebrow")}
          </div>

          <h1>{movieTitle}</h1>

          {!isEnglish && <h2 className="detail-original">{movie.title}</h2>}

          {/* FACTS */}
          <div className="detail-facts">
            <span>
              <CalendarDays size={16} />
              {movie.year}
            </span>

            {movie.runtime != null && (
              <span>
                <Clock3 size={16} />
                {t("movieCard.runtime", { count: movie.runtime })}
              </span>
            )}
          </div>

          {/* GENRES */}
          <div className="genre-list detail-genres">
            {movie.genres.map((genre) => (
              <span key={genre}>
                {t(`genres.${genre.toLowerCase()}`, { defaultValue: genre })}
              </span>
            ))}
          </div>

          {/* SYNOPSIS */}
          <p className="detail-synopsis">
            {(isEnglish
              ? (movie.synopsis_en ?? movie.synopsis)
              : movie.synopsis) || t("movieDetail.noSynopsis")}
          </p>

          {/* DIRECTOR */}
          {movie.director && (
            <p className="director">
              <b>{t("movieDetail.director")}</b> {movie.director}
            </p>
          )}

          {/* MOOD METER: every mood, the matching ones light up */}
          <div className="mood-meter">
            <b>
              <Sparkles size={14} />
              {t("movieDetail.suitableMoods")}
            </b>

            <ul>
              {MOODS.filter((mood) => movie.moods.includes(mood.key)).map(
                (mood) => (
                  <li key={mood.key} className={`mm-${mood.key}`}>
                    {t(`moods.${mood.key}`, { defaultValue: mood.label })}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* TICKET: watch + personal actions */}
          <div className="detail-ticket">
            <div className="ticket-part">
              <span className="ticket-label">
                <Ticket size={14} />
                {t("movieDetail.ticketWatch", {
                  defaultValue: isEnglish ? "Watch" : "تماشا",
                })}
              </span>

              <MovieWatchActions movie={movie} />
            </div>

            <div className="ticket-part">
              <span className="ticket-label">
                <Heart size={14} />
                {t("movieDetail.ticketForYou", {
                  defaultValue: isEnglish ? "For you" : "برای خودت",
                })}
              </span>

              <div className="ticket-actions">
                <button
                  type="button"
                  className={`btn ${
                    isFavorite ? "btn-favorited" : "btn-primary"
                  }`}
                  onClick={() => onFavorite(movie.id)}
                  aria-pressed={isFavorite}
                >
                  <Heart
                    size={17}
                    fill={isFavorite ? "currentColor" : "none"}
                  />

                  {isFavorite
                    ? t("movieDetail.savedFavorite")
                    : t("movieCard.addFavorite")}
                </button>

                <Link to="/mood" className="btn btn-ghost">
                  {t("movieDetail.moreRecommendations")}
                  <NextArrow size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* BACK LINK */}
          <Link to="/movies" className="back-link">
            <BackArrow size={15} />
            {t("movieDetail.backToMovies")}
          </Link>
        </div>
      </section>
    </main>
  );
}
