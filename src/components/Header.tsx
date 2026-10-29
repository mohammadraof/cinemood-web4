import { Film, Heart, LayoutDashboard, Moon, Sun, Menu, X } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

function MoodIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* fice */}
      <circle cx="10.5" cy="14.5" r="7" />

      {/* eyes */}
      <circle cx="8" cy="13" r="0.65" fill="currentColor" stroke="none" />
      <circle cx="13" cy="13" r="0.65" fill="currentColor" stroke="none" />

      {/* smail */}
      <path d="M7.3 16 Q10.5 19 13.7 16" />

      {/* big star */}
      <path d="M18 2.5 L19 4.9 L21.5 5.8 L19 6.7 L18 9.2 L17 6.7 L14.5 5.8 L17 4.9 Z" />

      {/* small star */}
      <path d="M4.2 4.5 L4.7 5.8 L6 6.3 L4.7 6.8 L4.2 8.1 L3.7 6.8 L2.4 6.3 L3.7 5.8 Z" />
    </svg>
  );
}
export default function Header({
  light,
  onToggleTheme,
}: {
  light: boolean;
  onToggleTheme: () => void;
}) {
  const [open, setOpen] = useState(false);

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLanguage = i18n.resolvedLanguage === "fa" ? "en" : "fa";

    localStorage.setItem("cinemood-language", nextLanguage);
    void i18n.changeLanguage(nextLanguage);
  };

  const nav = [
    { to: "/", label: t("nav.home"), icon: Film },
    { to: "/mood", label: t("nav.mood"), icon: MoodIcon },
    {
      to: "/dashboard",
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
    },
  ];
  return (
    <header className="topbar">
      <div className="nav-wrap">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <Film size={21} />
          </span>
          <span>
            CINE<span className="brand-accent">MOOD</span>
            <small>{t("nav.tagline")}</small>
          </span>
        </Link>

        <nav
          id="cinemood-navigation"
          className={open ? "nav-links open" : "nav-links"}
        >
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <n.icon size={17} />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {/* Favorites */}
          <Link
            to="/dashboard"
            className="icon-btn"
            aria-label={t("nav.favorites")}
            title={t("nav.favorites")}
          >
            <Heart size={19} />
          </Link>

          {/* Theme toggle */}
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={t("nav.theme")}
            title={t("nav.theme")}
          >
            {light ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          {/* Language toggle */}
          <button
            type="button"
            className="language-toggle"
            onClick={toggleLanguage}
            aria-label={
              i18n.resolvedLanguage === "fa"
                ? "Switch to English"
                : "تغییر زبان به فارسی"
            }
            title={
              i18n.resolvedLanguage === "fa"
                ? "Switch to English"
                : "تغییر زبان به فارسی"
            }
          >
            {i18n.resolvedLanguage === "fa" ? "EN" : "FA"}
          </button>

          {/* Mobile menu — inside the same actions group */}
          <button
            type="button"
            className="mobile-menu icon-btn"
            onClick={() => setOpen((previous) => !previous)}
            aria-label={t("nav.menu")}
            aria-expanded={open}
            aria-controls="cinemood-navigation"
            title={t("nav.menu")}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>

          {/* Desktop CTA */}
          <Link to="/mood" className="btn btn-primary nav-cta">
            {t("nav.findMovie")}
            <span>
              {i18n.resolvedLanguage === "fa" ? (
                <ArrowLeft size={20} />
              ) : (
                <ArrowRight size={20} />
              )}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
