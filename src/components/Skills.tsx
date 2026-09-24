import { SectionHeading } from "./SectionHeading";
import type { PortfolioConfig } from "../types/portfolio";

export function Skills({ portfolio }: { portfolio: PortfolioConfig }) {
  return (
    <section id="habilidades" className="section container">
      <SectionHeading index="02">Habilidades <em>técnicas</em></SectionHeading>
      <div className="skills">
        {Object.entries(portfolio.skills).map(([category, skills]) => (
          <div className="skill-group" data-reveal key={category}>
            <h3>{category}</h3>
            <ul>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="data-flow" data-reveal aria-label="Flujo de trabajo de ingeniería de datos">
        <div className="data-flow__intro">
          <span className="mono">pipeline de datos</span>
          <h3>De datos dispersos a decisiones claras.</h3>
          <p>Diseño el recorrido completo de la información mediante procesos ETL y ELT, servicios en AWS y capas de consumo analítico.</p>
        </div>
        <ol className="data-flow__pipeline">
          {portfolio.dataPipeline.map((stage, index) => (
            <li className="data-flow__stage" style={{ "--stage": index } as React.CSSProperties} key={stage.label}>
              <span className="data-flow__number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{stage.label}</strong>
              <small>{stage.detail}</small>
            </li>
          ))}
        </ol>
      </div>
      <div className="soft" data-reveal>
        <span className="mono soft__label">habilidades blandas</span>
        <div className="soft__list">{portfolio.softSkills.map((skill) => <span key={skill}>{skill}</span>)}</div>
      </div>
      <div className="soft" data-reveal>
        <span className="mono soft__label">idiomas</span>
        <div className="soft__list">{portfolio.languages.map((language) => <span key={language}>{language}</span>)}</div>
      </div>
    </section>
  );
}
