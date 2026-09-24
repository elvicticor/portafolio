import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

function initialTheme(): Theme {
  const stored = document.documentElement.dataset.theme;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0a0b0d" : "#f4f3ef");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Theme remains active even if persistence is unavailable.
    }
  }, [theme]);

  return { theme, toggleTheme: () => setTheme((value) => (value === "dark" ? "light" : "dark")) };
}
