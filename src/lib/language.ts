const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Rust: "#dea584",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#8f5bd6",
  Astro: "#ff5a03",
  PLpgSQL: "#336790",
  Dockerfile: "#384d54",
  Shell: "#89e051",
  Go: "#00add8",
  Java: "#b07219",
};

export const languageColor = (language?: string | null) =>
  (language && languageColors[language]) || "#8a919c";
