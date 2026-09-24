import type { PortfolioConfig } from "../types/portfolio";

export function Footer({ portfolio }: { portfolio: PortfolioConfig }) {
  return <footer className="footer container"><span className="mono">© {new Date().getFullYear()} {portfolio.name}</span><a href="#top" className="mono" data-magnetic>volver arriba ↑</a></footer>;
}
