import { useEffect, useState } from "react";
import { Clapperboard, ExternalLink, Play, X } from "lucide-react";
import type { Movie } from "../types";
import { useTranslation } from "react-i18next";

const allowedHosts = ["filimo.com", "namava.ir"];

function safeWatchUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      allowedHosts.some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
      )
    );
  } catch {
    return false;
  }
}

export default function MovieWatchActions({ movie }: { movie: Movie }) {
  const { t, i18n } = useTranslation();

  const isEnglish = i18n.resolvedLanguage === "en";
  const movieTitle = isEnglish ? movie.title : movie.title_fa;
  const direction = isEnglish ? "ltr" : "rtl";
  const [modal, setModal] = useState<"trailer" | "watch" | null>(null);

  const validAparatId =
    typeof movie.aparatId === "string" && /^[a-zA-Z0-9]+$/.test(movie.aparatId);

  const providers = (movie.watchProviders ?? []).filter((p) =>
    safeWatchUrl(p.url),
  );

  useEffect(() => {
    if (!modal) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [modal]);

  return (
    <>
      <div className="watch-actions" dir={direction}>
        <button
          className="btn btn-primary btn-large"
          type="button"
          disabled={!validAparatId}
          onClick={() => setModal("trailer")}
        >
          <Play size={18} />
          {t("watch.trailer")}
        </button>

        <button
          className="btn btn-ghost btn-large"
          type="button"
          disabled={!providers.length}
          onClick={() => setModal("watch")}
        >
          <ExternalLink size={18} />
          {t("watch.fullMovie")}
        </button>

        {!validAparatId && providers.length === 0 && (
          <small className="watch-note">{t("watch.unavailable")}</small>
        )}
      </div>

      {modal && (
        <div
          className="watch-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setModal(null);
            }
          }}
        >
          <section
            className="watch-modal"
            role="dialog"
            aria-modal="true"
            aria-label={
              modal === "trailer"
                ? t("watch.trailerTitle", { title: movieTitle })
                : t("watch.watchTitle", { title: movieTitle })
            }
            dir={direction}
          >
            <div className="watch-modal-head">
              <h2>
                {modal === "trailer"
                  ? t("watch.trailerTitle", { title: movieTitle })
                  : t("watch.watchTitle", { title: movieTitle })}
              </h2>

              <button
                type="button"
                className="watch-close"
                onClick={() => setModal(null)}
                aria-label={t("common.close")}
              >
                <X size={22} />
              </button>
            </div>

            {modal === "trailer" && validAparatId ? (
              <div className="watch-video">
                <iframe
                  title={t("watch.trailerTitle", { title: movieTitle })}
                  src={`https://www.aparat.com/video/video/embed/videohash/${movie.aparatId}/vt/frame`}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : (
              <div className="watch-providers">
                <p>{t("watch.providerHint")}</p>

                {providers.map((p) => (
                  <a
                    key={`${p.name}-${p.url}`}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    <Clapperboard size={18} />
                    {t("watch.watchOn", {
                      provider: isEnglish
                        ? p.name === "فیلیمو"
                          ? "Filimo"
                          : p.name === "نماوا"
                            ? "Namava"
                            : p.name
                        : p.name,
                    })}
                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
