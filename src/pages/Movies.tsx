import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowRight, Clapperboard, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MovieCard from "../components/MovieCard";
import Dropdown from "../components/Dropdown";
import type { Movie } from "../types";

type SortOption = "rating" | "newest" | "oldest" | "title";

type MoviesPageProps = {
  movies: Movie[];
  favorites: number[];
  onFavorite: (id: number) => void;
};

function useIsMobile() {
  const query = "(max-width: 760px)";

  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setIsMobile(mq.matches);

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

export default function MoviesPage({
  movies,
  favorites,
  onFavorite,
}: MoviesPageProps) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.resolvedLanguage === "en";

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  const isMobile = useIsMobile();
  const resultsRef = useRef<HTMLDivElement>(null);

  const genres = useMemo(
    () => Array.from(new Set(movies.flatMap((movie) => movie.genres))).sort(),
    [movies],
  );

  const sortOptions: {
    value: SortOption;
    label: string;
  }[] = [
    { value: "rating", label: t("moviesPage.sortRating") },
    { value: "newest", label: t("moviesPage.sortNewest") },
    { value: "oldest", label: t("moviesPage.sortOldest") },
    { value: "title", label: t("moviesPage.sortTitle") },
  ];

  const filteredMovies = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return movies
      .filter((movie) => {
        const matchesSearch =
          !query ||
          movie.title.toLocaleLowerCase().includes(query) ||
          movie.title_fa.toLocaleLowerCase().includes(query) ||
          movie.genres.some((genre) =>
            genre.toLocaleLowerCase().includes(query),
          ) ||
          movie.genres.some((genre) =>
            t(`genres.${genre.toLowerCase()}`, {
              defaultValue: genre,
            })
              .toLocaleLowerCase()
              .includes(query),
          );

        const matchesGenre =
          selectedGenre === "all" || movie.genres.includes(selectedGenre);

        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.year - a.year;
        if (sortBy === "oldest") return a.year - b.year;

        if (sortBy === "title") {
          return isEnglish
            ? a.title.localeCompare(b.title, "en")
            : a.title_fa.localeCompare(b.title_fa, "fa");
        }

        return b.rating - a.rating;
      });
  }, [movies, search, selectedGenre, sortBy, isEnglish, t]);

  useEffect(() => {
    if (!isMobile) setSearch(input);
  }, [isMobile, input]);

  useEffect(() => {
    if (submitCount === 0) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    resultsRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [submitCount]);

  function handleSearchChange(value: string) {
    setInput(value);

    if (!isMobile || value.trim() === "") {
      setSearch(value);
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(input);
    setSubmitCount((count) => count + 1);

    (document.activeElement as HTMLElement | null)?.blur();
  }

  function resetFilters() {
    setInput("");
    setSearch("");
    setSelectedGenre("all");
    setSortBy("rating");
  }

  return (
    <main className="container page-shell movies-page">
      <div className="breadcrumb">
        <Link to="/">{t("nav.home")}</Link>
        <span>/</span>
        <b>{t("moviesPage.breadcrumb")}</b>
      </div>

      <section className="catalog-heading">
        <div>
          <div className="eyebrow">
            <Clapperboard size={16} />
            {t("moviesPage.eyebrow")}
          </div>

          <h1>
            {t("moviesPage.titleStart")}{" "}
            <span className="gradient-text">
              {t("moviesPage.titleHighlight")}
            </span>
          </h1>

          <p>{t("moviesPage.description")}</p>
        </div>

        <Link to="/" className="text-link">
          {t("moviesPage.backHome")}
          {isEnglish ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
        </Link>
      </section>

      <section
        className="catalog-toolbar"
        aria-label={t("moviesPage.toolbarLabel")}
      >
        <form className="catalog-search" role="search" onSubmit={submitSearch}>
          <Search size={18} />

          <input
            type="search"
            value={input}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={t("moviesPage.searchPlaceholder")}
            aria-label={t("moviesPage.searchLabel")}
            enterKeyHint="search"
          />

          {input && (
            <button
              type="button"
              className="catalog-clear"
              onClick={() => handleSearchChange("")}
              aria-label={t("moviesPage.clearSearch")}
            >
              <X size={16} />
            </button>
          )}

          {isMobile && input.trim() !== "" && (
            <button
              type="submit"
              className="catalog-submit"
              aria-label={t("common.search")}
            >
              <Search size={18} />
            </button>
          )}
        </form>

        <Dropdown
          label={t("moviesPage.genre")}
          value={selectedGenre}
          onChange={setSelectedGenre}
          options={[
            {
              value: "all",
              label: t("moviesPage.allGenres"),
            },
            ...genres.map((genre) => ({
              value: genre,
              label: t(`genres.${genre.toLowerCase()}`, {
                defaultValue: genre,
              }),
            })),
          ]}
        />

        <Dropdown
          label={t("moviesPage.sort")}
          value={sortBy}
          onChange={(value) => setSortBy(value as SortOption)}
          options={sortOptions}
        />
      </section>

      <div className="catalog-results" ref={resultsRef}>
        <span>
          {t("moviesPage.resultsCount", {
            shown: filteredMovies.length,
            total: movies.length,
          })}
        </span>

        {(input ||
          search ||
          selectedGenre !== "all" ||
          sortBy !== "rating") && (
          <button
            type="button"
            className="catalog-reset"
            onClick={resetFilters}
          >
            {t("moviesPage.clearFilters")}
            <X size={14} />
          </button>
        )}
      </div>

      {filteredMovies.length > 0 ? (
        <section className="movie-grid" aria-label={t("moviesPage.movieList")}>
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              favorite={favorites.includes(movie.id)}
              onFavorite={onFavorite}
            />
          ))}
        </section>
      ) : (
        <div className="empty-state">
          <span>⌕</span>
          <h3>{t("moviesPage.noResultsTitle")}</h3>
          <p>{t("moviesPage.noResultsDescription")}</p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={resetFilters}
          >
            {t("moviesPage.showAll")}
          </button>
        </div>
      )}
    </main>
  );
}
