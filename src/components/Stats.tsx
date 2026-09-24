import { useMemo } from "react";
import { languageColor } from "../lib/language";
import type { FeaturedProject, GithubRepository } from "../types/portfolio";

interface StatsProps { repositories: GithubRepository[]; featured: FeaturedProject[] }

export function Stats({ repositories, featured }: StatsProps) {
  const languageStats = useMemo(() => {
    const totals: Record<string, number> = {};
    repositories.forEach((repository) => Object.entries(repository.languages ?? {}).forEach(([language, bytes]) => {
      totals[language] = (totals[language] ?? 0) + bytes;
    }));
    const sum = Object.values(totals).reduce((total, bytes) => total + bytes, 0) || 1;
    const all = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    return {
      count: all.length,
      top: all.slice(0, 6).map(([name, bytes]) => ({ name, bytes, percentage: (bytes / sum) * 100 })),
    };
  }, [repositories]);

  const stats = [
    [repositories.length, "repositorios públicos"],
    [languageStats.count, "lenguajes"],
    [featured.filter((project) => project.demo).length, "proyectos en producción"],
  ] as const;

  return (
    <section className="stats container" aria-label="Resumen de GitHub">
      {stats.map(([value, label]) => (
        <div className="stat" data-reveal key={label}>
          <span className="stat__num" data-counter={value}>0</span>
          <span className="stat__label">{label}</span>
        </div>
      ))}
      <div className="stat stat--langs" data-reveal>
        <div className="langbar" aria-label="Distribución de lenguajes">
          {languageStats.top.map(({ name, bytes }) => <span key={name} style={{ flex: bytes, background: languageColor(name) }} title={name} />)}
        </div>
        <ul className="langlegend">
          {languageStats.top.map(({ name, percentage }) => <li key={name}><i style={{ background: languageColor(name) }} />{name} {percentage.toFixed(1)}%</li>)}
        </ul>
      </div>
    </section>
  );
}
