import { Clapperboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Clapperboard size={20} />
          </span>

          <span>
            CINE<span className="brand-accent">MOOD</span>
            <small>{t("nav.tagline")}</small>
          </span>
        </Link>

        <p>{t("home.footerDescription")}</p>

        <span className="footer-copy">{t("home.footerCopyright")}</span>
      </div>
    </footer>
  );
}