import { SectionHeading } from "./SectionHeading";
import type { PortfolioConfig } from "../types/portfolio";

export function About({ portfolio }: { portfolio: PortfolioConfig }) {
  const initials = portfolio.name.split(" ").map((word) => word[0]).slice(0, 2).join("");
  return (
    <section id="sobre-mi" className="section container about">
      <SectionHeading index="03">Sobre <em>mí</em></SectionHeading>
      <div className="about__grid">
        <div className="about__photo" data-tilt data-reveal>
          {portfolio.photo
            ? <img src={portfolio.photo} alt={`Foto de ${portfolio.name}`} width="460" height="460" loading="lazy" />
            : <div className="about__monogram"><span>{initials}</span><span className="mono">@{portfolio.githubUser}</span></div>}
          <span className="about__photo-glare" />
        </div>
        <div className="about__text">{portfolio.about.map((paragraph) => <p data-reveal key={paragraph}>{paragraph}</p>)}</div>
      </div>
    </section>
  );
}
