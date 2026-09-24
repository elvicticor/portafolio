import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { FolderIcon } from "./Icons";
import { SectionHeading } from "./SectionHeading";
import { languageColor } from "../lib/language";
import type { FeaturedProject, GithubRepository, PortfolioConfig, ProjectCategory } from "../types/portfolio";

type ProjectFilter = "all" | ProjectCategory;

interface ProjectsProps { portfolio: PortfolioConfig; repositories: GithubRepository[] }

const filters: Array<[ProjectFilter, string]> = [["all", "Todos"], ["frontend", "Frontend"], ["backend", "Backend"], ["fullstack", "Full stack"]];

function CodeCover({ project, language }: { project: FeaturedProject; language?: string | null }) {
  const secure = project.tech.includes("Seguridad");
  const lines = secure
    ? <><span className="k">-- vulnerable</span>{"\n"}SELECT * FROM users{"\n"}WHERE user = <span className="s">'admin' OR '1'='1'</span>;{"\n\n"}<span className="k">-- seguro</span>{"\n"}db.query(<span className="s">"... WHERE user = ?"</span>, [u]);</>
    : project.category === "backend"
      ? <><span className="k">async fn</span> <span className="s">main</span>() {" {"}{"\n"}  <span className="k">let</span> app = Router::new(){"\n"}    .route(<span className="s">"/api"</span>, get(handler)){"\n"}    .layer(<span className="s">{project.tech[1] ?? "cors"}</span>);{"\n"}  serve(listener, app).<span className="k">await</span>{"\n}"}</>
      : <><span className="k">export default function</span> <span className="s">App</span>() {" {"}{"\n"}  <span className="k">const</span> [data] = useFetch(<span className="s">"/api"</span>);{"\n"}  <span className="k">return</span> &lt;<span className="s">Layout</span>&gt;{"\n"}    &lt;<span className="s">Catalogo</span> items={"{data}"} /&gt;{"\n"}  &lt;/<span className="s">Layout</span>&gt;;{"\n}"}</>;

  return <div className="project__cover" style={{ "--cover": languageColor(language) } as React.CSSProperties}><pre>{lines}</pre></div>;
}

function ProjectCard({ project, repository, index, total, github }: { project: FeaturedProject; repository?: GithubRepository; index: number; total: number; github: string }) {
  const href = project.demo || `${github}/${project.repo}`;
  return (
    <article className="project" data-project-card data-tilt data-reveal data-category={project.category}>
      <a className="project__media" href={href} target="_blank" rel="noopener noreferrer" data-view aria-label={`Abrir ${project.title}`}>
        {project.demo
          ? <span className="project__badge"><span className="status-dot" />en producción</span>
          : repository?.language && <span className="project__badge"><i style={{ background: languageColor(repository.language) }} />{repository.language}</span>}
        {project.image
          ? <img src={project.image} alt={`Captura de ${project.title}`} loading="lazy" />
          : <CodeCover project={project} language={repository?.language} />}
      </a>
      <div className="project__body">
        <span className="project__num">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <h3 className="project__title">{project.title}</h3>
        <p className="project__summary">{project.summary}</p>
        <ul className="project__list">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
        <div className="tags">{project.tech.map((technology) => <span className="tag" key={technology}>{technology}</span>)}</div>
        <div className="project__links">
          {project.demo && <a className="btn" href={project.demo} target="_blank" rel="noopener noreferrer" data-magnetic>Ver demo ↗</a>}
          <a className="btn btn--ghost" href={`${github}/${project.repo}`} target="_blank" rel="noopener noreferrer" data-magnetic>Código</a>
        </div>
      </div>
    </article>
  );
}

export function Projects({ portfolio, repositories }: ProjectsProps) {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const github = `https://github.com/${portfolio.githubUser}`;
  const byName = useMemo(() => new Map(repositories.map((repository) => [repository.name.toLowerCase(), repository])), [repositories]);
  const featured = portfolio.featured.filter((project) => !portfolio.hidden.includes(project.repo));
  const visible = filter === "all" ? featured : featured.filter((project) => project.category === filter);
  const featuredNames = new Set(featured.map((project) => project.repo.toLowerCase()));
  const others = repositories.filter((repository) => !repository.fork && !featuredNames.has(repository.name.toLowerCase()) && !portfolio.hidden.includes(repository.name) && repository.name.toLowerCase() !== portfolio.githubUser.toLowerCase());

  useLayoutEffect(() => {
    const cards = gridRef.current?.children;
    if (!cards?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = gsap.fromTo(cards, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power3.out", clearProps: "opacity,visibility,transform" });
    return () => { animation.kill(); };
  }, [filter, repositories]);

  const changeFilter = (nextFilter: ProjectFilter) => {
    if (nextFilter === filter) return;
    const cards = gridRef.current?.children;
    if (!cards?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFilter(nextFilter);
      return;
    }
    gsap.to(cards, { opacity: 0, y: 16, duration: 0.2, stagger: 0.025, onComplete: () => setFilter(nextFilter) });
  };

  return (
    <section id="proyectos" className="section container">
      <SectionHeading index="01" aside={
        <div className="filters" role="tablist" aria-label="Filtrar proyectos" data-reveal>
          {filters.map(([value, label]) => <button className={`chip${filter === value ? " is-active" : ""}`} type="button" role="tab" aria-selected={filter === value} onClick={() => changeFilter(value)} key={value}>{label}</button>)}
        </div>
      }>Proyectos <em>principales</em></SectionHeading>
      <div className="projects" ref={gridRef}>
        {visible.map((project, index) => <ProjectCard project={project} repository={byName.get(project.repo.toLowerCase())} index={index} total={visible.length} github={github} key={project.repo} />)}
      </div>

      {others.length > 0 && <div className="others">
        <h3 className="others__title" data-reveal>Otros proyectos <span className="mono">({others.length})</span></h3>
        <div className="others__grid">
          {others.map((repository) => <a className="repo" data-reveal href={repository.html_url ?? `${github}/${repository.name}`} target="_blank" rel="noopener noreferrer" key={repository.name}>
            <div className="repo__top"><FolderIcon /><span aria-hidden="true">↗</span></div>
            <span className="repo__name">{repository.name.replace(/[-_]/g, " ")}</span>
            <p className="repo__desc">{portfolio.otherDescriptions[repository.name] || repository.description || "Repositorio en GitHub."}</p>
            <div className="repo__meta">
              {repository.language && <span><i style={{ background: languageColor(repository.language) }} />{repository.language}</span>}
              <span>{new Date(repository.pushed_at).getFullYear()}</span>
              {repository.stargazers_count > 0 && <span>★ {repository.stargazers_count}</span>}
            </div>
          </a>)}
        </div>
      </div>}
    </section>
  );
}
