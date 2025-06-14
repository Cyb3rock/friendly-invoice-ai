
import React, { createContext, useContext, useEffect, useState } from "react";

const THEMES = [
  {
    name: "Light",
    id: "theme-light",
    variables: {
      "--primary": "222.2 47.4% 11.2%",
      "--primary-foreground": "210 40% 98%",
      "--background": "0 0% 100%",
      "--foreground": "222.2 84% 4.9%",
      "--card": "0 0% 100%",
      "--accent": "195 85% 60%",      // blue
      "--muted": "210 40% 96.1%",
    },
  },
  {
    name: "Dark",
    id: "theme-dark",
    variables: {
      "--primary": "210 40% 98%",
      "--primary-foreground": "222.2 47.4% 11.2%",
      "--background": "222.2 84% 4.9%",
      "--foreground": "210 40% 98%",
      "--card": "222.2 84% 4.9%",
      "--accent": "294 72% 67%",      // purple
      "--muted": "217.2 32.6% 17.5%",
    },
  },
  {
    name: "Emerald",
    id: "theme-emerald",
    variables: {
      "--primary": "158 64% 52%",
      "--primary-foreground": "165 81% 14%",
      "--background": "150 60% 98%",
      "--foreground": "165 81% 14%",
      "--card": "0 0% 100%",
      "--accent": "170 74% 60%",    // teal
      "--muted": "150 30% 96%",
    },
  },
  {
    name: "Blush",
    id: "theme-blush",
    variables: {
      "--primary": "340 80% 60%",
      "--primary-foreground": "342 48% 14%",
      "--background": "342 100% 98%",
      "--foreground": "342 48% 14%",
      "--card": "0 0% 100%",
      "--accent": "24 100% 70%",    // orange
      "--muted": "13 40% 96%",
    },
  },
];

type Theme = typeof THEMES[number];

type ThemeContextType = {
  theme: Theme,
  setTheme: (theme: Theme) => void,
  allThemes: Theme[]
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const [theme, setTheme] = useState<Theme>(() => THEMES[0]);

  useEffect(() => {
    // Apply theme variables to :root
    const root = document.documentElement;
    Object.entries(theme.variables).forEach(([k,v]) => {
      root.style.setProperty(k, v);
    });
    // Set data-theme for targeting in CSS
    root.setAttribute("data-theme", theme.id);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{theme, setTheme, allThemes: THEMES}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
