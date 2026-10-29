import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Play,
  ShieldCheck,
  Clapperboard,
  Heart,
  WandSparkles,
} from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWobble } from "../lib/useWobble";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types";

type HomeProps = {
  movies: Movie[];
  favorites: number[];
  onFavorite: (id: number) => void;
};

export default function Home({ movies, favorites, onFavorite }: HomeProps) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.resolvedLanguage === "en";

  const titleRef = useRef<HTMLHeadingElement>(null);
  useWobble(titleRef);

  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={15} />
            {t("home.eyebrow")}
          </div>

          <h1 ref={titleRef} key={i18n.resolvedLanguage}>
            {isEnglish ? (
              <>
                <span className="wobble-word">Every</span>{" "}
                <span className="wobble-word">mood</span>
                <br />
                <span className="wobble-word">has</span>{" "}
                <span className="wobble-word">a</span>{" "}
                <span className="wobble-word gradient-text">story.</span>
              </>
            ) : (
              <>
                <span className="wobble-word">هر</span>{" "}
                <span className="wobble-word">حالی</span>{" "}
                <span className="wobble-word">داری،</span>
                <br />
                <span className="wobble-word">یه</span>{" "}
                <span className="wobble-word gradient-text">قصه</span>{" "}
                <span className="wobble-word">براش</span>{" "}
                <span className="wobble-word">هست.</span>
              </>
            )}
          </h1>

          <p className="hero-description">{t("home.description")}</p>

          <div className="hero-actions">
            <Link to="/mood" className="btn btn-primary btn-large">
              {t("home.findMood")}
              <ArrowLeft size={18} />
            </Link>

            <button
              type="button"
              className="btn btn-ghost btn-large"
              onClick={() => {
                document.getElementById("popular")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <Play size={16} />
              {t("home.explore")}
            </button>
          </div>

          <div className="hero-proof">
            <div className="avatar-stack">
              <span>🎞️</span>
              <span>🍿</span>
              <span>✨</span>
            </div>

            <div>
              <b>{t("home.proofTitle")}</b>
              <small>{t("home.proofDescription")}</small>
            </div>

            <span className="proof-separator" />

            <div className="proof-stat">
              <b>{t("home.moodCount")}</b>
              <small>{t("home.moodCountLabel")}</small>
            </div>
          </div>
        </div>

        {/* HERO ART */}
        <div className="hero-art">
          <div className="art-glow" />

          <div className="floating-note note-top">
            <span>✦</span>
            <div>
              <b className="different-text-colors">{t("home.tonightPick")}</b>
              <small>{t("home.basedOnMood")}</small>
            </div>
          </div>

          <div className="feature-poster">
            <img
              src={`${import.meta.env.BASE_URL}posters/feature-poster.webp`}
              alt={t("home.posterAlt")}
              width={400}
              height={600}
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />

            <div className="feature-poster-shade" />

            <div className="poster-caption">
              <span>{t("home.specialPick")}</span>

              <h2 className="different-text-colors">
                {t("home.interstellar")}
              </h2>

              <div>
                ★★★★★ <small>{t("home.rating")}</small>
              </div>
            </div>

            <span className="poster-orbit orbit-one" />
            <span className="poster-orbit orbit-two" />
          </div>

          <div className="floating-note note-bottom">
            <span className="note-icon">♡</span>

            <div>
              <b className="different-text-colors">
                {t("home.specialMoments")}
              </b>
              <small>{t("home.freshPick")}</small>
            </div>
          </div>

          <div className="art-sticker">
            YOUR
            <br />
            NEXT
            <br />
            <b>FAVORITE.</b>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="trust-strip">
        <div className="container trust-items">
          <span>
            <ShieldCheck size={18} />
            {t("home.trustEasy")}
          </span>

          <span>
            <Clapperboard size={18} />
            {t("home.trustStories")}
          </span>

          <span>
            <Heart size={18} />
            {t("home.trustTaste")}
          </span>

          <span>
            <WandSparkles size={18} />
            {t("home.trustMood")}
          </span>
        </div>
      </section>

      {/* POPULAR MOVIES */}
      <section className="section container" id="popular">
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t("home.popularEyebrow")}</div>

            <h2>
              {t("home.popularTitleStart")}{" "}
              <span className="gradient-text">
                {t("home.popularTitleHighlight")}
              </span>{" "}
              {t("home.popularTitleEnd")}
            </h2>

            <p>{t("home.popularDescription")}</p>
          </div>

          <Link to="/movies" className="text-link">
            {t("home.viewAll")}
            {i18n.resolvedLanguage === "fa" ? (
              <ArrowLeft size={16} />
            ) : (
              <ArrowRight size={16} />
            )}
          </Link>
        </div>

        <div className="movie-grid">
          {movies.slice(0, 8).map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              favorite={favorites.includes(movie.id)}
              onFavorite={onFavorite}
            />
          ))}
        </div>
      </section>

      {/* MOOD BANNER */}
      <section className="mood-banner container">
        <div className="banner-orb">✦</div>

        <div>
          <div className="eyebrow">{t("home.bannerEyebrow")}</div>

          <h2>{t("home.bannerTitle")}</h2>

          <p>{t("home.bannerDescription")}</p>
        </div>

        <Link to="/mood" className="btn btn-light">
          {t("home.chooseMood")}
          <ArrowLeft size={17} />
        </Link>
      </section>
    </main>
  );
}
