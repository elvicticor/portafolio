import { useEffect, useState } from "react";
import { fallbackRepositories, getGithubRepositories } from "../services/github";
import type { GithubRepository } from "../types/portfolio";

export function useRepositories(username: string) {
  const [repositories, setRepositories] = useState<GithubRepository[]>(fallbackRepositories);
  const [source, setSource] = useState<"loading" | "github" | "fallback">("loading");

  useEffect(() => {
    const controller = new AbortController();

    getGithubRepositories(username, controller.signal)
      .then((result) => {
        setRepositories(result);
        setSource("github");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.warn("Usando datos locales de respaldo:", error);
        setSource("fallback");
      });

    return () => controller.abort();
  }, [username]);

  return { repositories, source };
}
