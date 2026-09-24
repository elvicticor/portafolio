import { lazy, Suspense } from "react";
import { ArrowDownIcon, GithubIcon, LinkedinIcon } from "./Icons";
import type { Theme } from "../hooks/useTheme";
import type { PortfolioConfig } from "../types/portfolio";

const HeroScene = lazy(() => import("./HeroScene").then((module) => ({ default: module.HeroScene })));

interface HeroProps { portfolio: PortfolioConfig; theme: Theme }

function AnimatedText({ children }: { children: string }) {
  return <>{[...children].map((character, index) => <span className="char" aria-hidden="true" key={`${character}-${index}`}>{character === " " ? " " : character}</span>)}</>;
}

export function Hero({ portfolio, theme }: HeroProps) {
  const [firstRole, ...remainingRole] = portfolio.role.split(" ");
  const github = `https://github.com/${portfolio.githubUser}`;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <Suspense fallback={null}><HeroScene theme={theme} /></Suspense>
      <div className="hero__inner">
        {portfolio.available && <p className="eyebrow" data-reveal><span className="status-dot" /><span>{portfolio.availabilityLabel ?? "Disponible para trabajar"}</span></p>}
        <h1 className="hero__title" id="hero-title">
          <span className="line split" aria-label={portfolio.name}><AnimatedText>{portfolio.name}</AnimatedText></span>
          <span className="line line--role split hero__role" aria-label={portfolio.role}>
            <em><AnimatedText>{firstRole}</AnimatedText></em><span aria-hidden="true"> </span><AnimatedText>{remainingRole.join(" ")}</AnimatedText>
          </span>
        </h1>
        <p className="hero__tagline" data-reveal>{portfolio.tagline}</p>
        <div className="hero__cta" data-reveal>
          <a href="#proyectos" className="btn" data-magnetic>Ver proyectos <ArrowDownIcon /></a>
          <a href={`mailto:${portfolio.email}`} className="btn btn--ghost" data-magnetic>Contactar</a>
          <div className="socials">
            <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-magnetic><GithubIcon /></a>
            {portfolio.linkedin && <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-magnetic><LinkedinIcon /></a>}
          </div>
        </div>
      </div>
      <div className="hero__meta" data-reveal>
        <span className="mono">// {portfolio.location}</span>
        <span className="mono scroll-hint">scroll<span className="scroll-hint__bar" /></span>
      </div>
    </section>
  );
}
