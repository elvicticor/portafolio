import type { GithubRepository } from "../types/portfolio";

const CACHE_TTL = 30 * 60 * 1000;

export const fallbackRepositories: GithubRepository[] = [
  { name: "Page_Santiago", language: "TypeScript", pushed_at: "2026-09-24", stargazers_count: 0, languages: { TypeScript: 40546, CSS: 40529, HTML: 34957, Astro: 23071, PLpgSQL: 3865, JavaScript: 1022 } },
  { name: "Pokeverse", language: "TypeScript", pushed_at: "2026-09-24", stargazers_count: 0, languages: { TypeScript: 61134, HTML: 1134 } },
  { name: "Back-restaurant-with-docker", language: "Rust", pushed_at: "2026-02-22", stargazers_count: 0, languages: { Rust: 45331, Dockerfile: 1677 } },
  { name: "Biblioteca", language: "JavaScript", pushed_at: "2026-02-18", stargazers_count: 0, languages: { JavaScript: 100922, CSS: 1030, HTML: 687 } },
  { name: "PRUEBA-DIPLO", language: "HTML", pushed_at: "2025-11-05", stargazers_count: 0, languages: { HTML: 12851, JavaScript: 5193, CSS: 503 } },
  { name: "SPRINT-1", language: "Python", pushed_at: "2022-11-28", stargazers_count: 0, languages: { Python: 2145 } },
  { name: "Proyecto4", language: "Python", pushed_at: "2022-11-24", stargazers_count: 0, languages: { Python: 115 } },
];

interface CachedRepositories {
  timestamp: number;
  repositories: GithubRepository[];
}

export async function getGithubRepositories(username: string, signal?: AbortSignal) {
  const cacheKey = `github-repositories-${username}`;

  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) ?? "null") as CachedRepositories | null;
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.repositories;
  } catch {
    // Storage can be unavailable in privacy modes. Network loading still works.
  }

  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, { signal });
  if (!response.ok) throw new Error(`GitHub respondió con ${response.status}`);

  const repositories = (await response.json()) as GithubRepository[];
  await Promise.all(
    repositories.map(async (repository) => {
      try {
        if (!repository.languages_url) throw new Error("Repositorio sin URL de lenguajes");
        const languagesResponse = await fetch(repository.languages_url, { signal });
        const languages = (await languagesResponse.json()) as Record<string, number> & { message?: string };
        repository.languages = languages.message ? {} : languages;
      } catch {
        repository.languages = repository.language ? { [repository.language]: 1 } : {};
      }
    }),
  );

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), repositories }));
  } catch {
    // The portfolio should remain usable without sessionStorage.
  }

  return repositories;
}
