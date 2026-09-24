import { SectionHeading } from "./SectionHeading";
import type { PortfolioConfig, TimelineItem } from "../types/portfolio";

function TimelineList({ title, items }: { title: string; items: TimelineItem[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="timeline__heading mono" data-reveal>{title}</h3>
      <ol className="timeline">
        {items.map((item) => <li data-reveal key={`${item.period}-${item.title}`}><span className="mono">{item.period}</span><h4>{item.title}</h4><p>{item.text}</p></li>)}
      </ol>
    </div>
  );
}

export function Timeline({ portfolio }: { portfolio: PortfolioConfig }) {
  return (
    <section id="trayectoria" className="section container">
      <SectionHeading index="04">Trayectoria</SectionHeading>
      <div className="timeline-grid">
        <TimelineList title="experiencia" items={portfolio.experience} />
        <TimelineList title="formación" items={portfolio.education} />
      </div>
    </section>
  );
}
