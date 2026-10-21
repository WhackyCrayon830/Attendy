"use client";

import { useEffect, useState } from "react";
import { RiMoonLine, RiSunLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const stored = window.localStorage.getItem("attendy-theme");
    const initial: Theme = stored === "dark" || stored === "light"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    window.localStorage.setItem("attendy-theme", next);
  }

  const target = theme === "dark" ? "light" : "dark";
  return (
    <Button type="button" variant="outline" size="icon" className="fixed right-4 top-4 z-50 size-9 rounded-full bg-background/80 shadow-sm backdrop-blur" onClick={toggleTheme} aria-label={`Switch to ${target} mode`} title={`Switch to ${target} mode`}>
      {theme === "dark" ? <RiSunLine aria-hidden="true" /> : <RiMoonLine aria-hidden="true" />}
    </Button>
  );
}
