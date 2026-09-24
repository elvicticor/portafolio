import { useRef } from "react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PointerEffects } from "./components/PointerEffects";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Stats } from "./components/Stats";
import { Timeline } from "./components/Timeline";
import { portfolio } from "./data/portfolio";
import { usePageAnimations } from "./hooks/usePageAnimations";
import { useRepositories } from "./hooks/useRepositories";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { repositories, source } = useRepositories(portfolio.githubUser);
  usePageAnimations(appRef, `${source}-${repositories.length}`);

  return (
    <div ref={appRef}>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <PointerEffects />
      <div className="grain" aria-hidden="true" />
      <div className="progress" data-progress aria-hidden="true" />
      <Header portfolio={portfolio} theme={theme} onToggleTheme={toggleTheme} />
      <main id="contenido">
        <div id="top" />
        <Hero portfolio={portfolio} theme={theme} />
        <Stats repositories={repositories} featured={portfolio.featured} />
        <Projects portfolio={portfolio} repositories={repositories} />
        <Skills portfolio={portfolio} />
        <About portfolio={portfolio} />
        <Timeline portfolio={portfolio} />
        <Contact portfolio={portfolio} />
      </main>
      <Footer portfolio={portfolio} />
    </div>
  );
}
