import { MoonIcon, SunIcon } from "./Icons";
import type { Theme } from "../hooks/useTheme";
import type { PortfolioConfig } from "../types/portfolio";

interface HeaderProps {
  portfolio: PortfolioConfig;
  theme: Theme;
  onToggleTheme: () => void;
}

const links = [
  ["proyectos", "Proyectos"],
  ["habilidades", "Habilidades"],
  ["sobre-mi", "Sobre mí"],
  ["trayectoria", "Trayectoria"],
  ["contacto", "Contacto"],
];

export function Header({ portfolio, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="nav" data-nav>
      <a href="#top" className="nav__logo" data-magnetic aria-label="Ir al inicio">VN<span>.</span></a>
      <nav className="nav__links" aria-label="Secciones principales">
        {links.map(([id, label]) => <a href={`#${id}`} data-nav-link key={id}>{label}</a>)}
      </nav>
      <div className="nav__actions">
        <button className="icon-btn" type="button" aria-label={`Activar tema ${theme === "dark" ? "claro" : "oscuro"}`} onClick={onToggleTheme} data-magnetic>
          {theme === "dark" ? <MoonIcon /> : <SunIcon />}
        </button>
        <a className="btn btn--small" href={portfolio.cv} download data-magnetic>CV</a>
      </div>
    </header>
  );
}
