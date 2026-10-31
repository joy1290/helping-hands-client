
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Change theme"
        className="rounded-lg border px-3 py-2"
      >
        Theme
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="rounded-lg border border-gray-300 px-3 py-2 transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
