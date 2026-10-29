import { Heart, Star, ArrowUpRight, Clapperboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { Movie } from "../types";
import { getPosterUrl } from "../lib/assets";

type MovieCardProps = {
  movie: Movie;
  favorite: boolean;
  onFavorite: (id: number) => void;
};

export default function MovieCard({
  movie,
  favorite,
  onFavorite,
}: MovieCardProps) {
  const { t, i18n } = useTranslation();
  const [posterFailed, setPosterFailed] = useState(false);
  const isEnglish = i18n.resolvedLanguage === "en";
  const movieTitle = isEnglish ? movie.title : movie.title_fa;
  const movieSubtitle = isEnglish ? movie.title_fa : movie.title;

  const detailUrl = `/movie/${movie.id}`;

  const posterUrl = getPosterUrl(movie.poster);
  const smallPosterUrl = posterUrl.replace(/\.webp(\?.*)?$/i, "-320.webp$1");
  return (
    <article className="movie-card movie-card--cinematic">
      <div className="movie-card__stage">
        <Link
          to={detailUrl}
          className="movie-card__poster-link"
          aria-label={`${t("movieCard.viewDetails")}: ${movieTitle}`}
        >
          {movie.poster && !posterFailed ? (
            <img
              src={posterUrl}
              srcSet={
                smallPosterUrl !== posterUrl
                  ? `${smallPosterUrl} 320w, ${posterUrl} 400w`
                  : undefined
              }
              sizes="(max-width: 600px) 45vw, (max-width: 1024px) 30vw, 22vw"
              alt={movieTitle}
              width={320}
              height={480}
              loading="lazy"
              decoding="async"
              onError={() => setPosterFailed(true)}
            />
          ) : (
            <span className="movie-card__fallback" aria-hidden="true">
              <Clapperboard size={38} strokeWidth={1.4} />
              <span>{movieTitle}</span>
            </span>
          )}
          <span className="movie-card__shade" aria-hidden="true" />
          <span className="movie-card__topline" aria-hidden="true">
            CINEMOOD / FILM COLLECTION
          </span>
          <span className="movie-card__number" aria-hidden="true">
            {String(movie.id).padStart(2, "0")}
          </span>
          <span className="movie-card__bottom">
            <span className="movie-card__eyebrow">
              <span>{movie.year}</span>
              <span className="movie-card__dot" />
              {movie.runtime != null && (
                <span>{t("movieCard.runtime", { count: movie.runtime })}</span>
              )}
            </span>
            <span className="movie-card__title">{movieTitle}</span>
            <span
              className="movie-card__subtitle"
              dir={isEnglish ? "rtl" : "ltr"}
            >
              {movieSubtitle}
            </span>
            <span className="movie-card__footer">
              <span className="movie-card__genres">
                {movie.genres.slice(0, 2).map((genre) => (
                  <span key={genre}>
                    {t(`genres.${genre.toLowerCase()}`, {
                      defaultValue: genre,
                    })}
                  </span>
                ))}
              </span>
              <span className="movie-card__open" aria-hidden="true">
                <ArrowUpRight size={18} />
              </span>
            </span>
          </span>
        </Link>
        <span
          className="movie-card__rating"
          aria-label={`${movie.rating.toFixed(1)} / 10`}
        >
          <Star size={14} fill="currentColor" aria-hidden="true" />
          <span>{movie.rating.toFixed(1)}</span>
        </span>
        <button
          type="button"
          className={`movie-card__favorite${favorite ? " is-favorite" : ""}`}
          onClick={() => onFavorite(movie.id)}
          aria-label={
            favorite
              ? t("movieCard.removeFavorite")
              : t("movieCard.addFavorite")
          }
          aria-pressed={favorite}
          title={
            favorite
              ? t("movieCard.removeFavorite")
              : t("movieCard.addFavorite")
          }
        >
          <Heart
            size={19}
            fill={favorite ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}
