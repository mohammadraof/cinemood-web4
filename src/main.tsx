import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import Home from "./pages/Home";
import MoviesPage from "./pages/Movies";
import MoodPage from "./pages/Mood";
import MovieDetail from "./pages/MovieDetail";
import Dashboard from "./pages/Dashboard";
import moviesData from "./data/movies.json";
import "./lib/i18n";
import type { Movie, Mood } from "./types";
import Footer from "./components/Footer";
import {
  getFavorites,
  saveFavorites,
  getMood,
  saveMood,
  getTheme,
  saveTheme,
} from "./lib/storage";
import { fetchMovies } from "./lib/api";
import "./styles.css";
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}
function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<number[]>(getFavorites);
  const [lastMood, setLastMood] = useState<Mood | null>(() => {
    const m = getMood();
    return m ? (m as Mood) : null;
  });
  const [light, setLight] = useState(getTheme);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const data = await fetchMovies(controller.signal);
        setMovies(data);
      } catch {
        if (!controller.signal.aborted) {
          setMovies(moviesData as Movie[]);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
    saveTheme(light);
  }, [light]);
  useEffect(() => {
    if (lastMood) document.documentElement.dataset.mood = lastMood;
    else delete document.documentElement.dataset.mood;
  }, [lastMood]);
  function toggleFavorite(id: number) {
    setFavorites((old) => {
      const next = old.includes(id)
        ? old.filter((x) => x !== id)
        : [...old, id];
      saveFavorites(next);
      return next;
    });
  }
  function chooseMood(m: Mood | null) {
    setLastMood(m);
    saveMood(m ?? "");
  }
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.resolvedLanguage === "en" ? "en" : "fa";

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";

    localStorage.setItem("cinemood-language", lang);
  }, [i18n.resolvedLanguage]);
  return (
    <div className="app">
      <ScrollToTop />
      <Header light={light} onToggleTheme={() => setLight((x) => !x)} />
      {loading ? (
        <main className="loading-state">
          <span className="loading-spinner" />
          <b>{t("app.loadingTitle")}</b>
          <small>{t("app.loadingDescription")}</small>
        </main>
      ) : (
        <>
          {error && (
            <div className="data-notice" role="status">
              {t("app.dataFallback")}
            </div>
          )}
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  movies={movies}
                  favorites={favorites}
                  onFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/movies"
              element={
                <MoviesPage
                  movies={movies}
                  favorites={favorites}
                  onFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/mood"
              element={
                <MoodPage
                  movies={movies}
                  favorites={favorites}
                  onFavorite={toggleFavorite}
                  lastMood={lastMood}
                  onSaveMood={chooseMood}
                />
              }
            />
            <Route
              path="/movie/:id"
              element={
                <MovieDetail
                  movies={movies}
                  favorites={favorites}
                  onFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  movies={movies}
                  favorites={favorites}
                  onFavorite={toggleFavorite}
                  lastMood={lastMood}
                />
              }
            />

            <Route
              path="*"
              element={
                <main className="container page-shell empty-state">
                  <h2>{t("app.notFoundTitle")}</h2>
                  <Link to="/" className="btn btn-primary">
                    {t("app.backHome")}
                  </Link>
                </main>
              }
            />
          </Routes>
        </>
      )}

      {!loading && <Footer />}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
