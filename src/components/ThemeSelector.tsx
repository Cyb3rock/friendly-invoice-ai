
import React from "react";
import { useTheme } from "./ThemeProvider";
import { Palette } from "lucide-react";

const themeCircle = (color: string) => (
  <span
    className="inline-block w-4 h-4 rounded-full border border-gray-200"
    style={{ background: `hsl(${color})` }}
  ></span>
);

export default function ThemeSelector() {
  const { theme, setTheme, allThemes } = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="fixed z-50 right-4 bottom-4">
      <button
        aria-label="Switch color theme"
        onClick={() => setOpen((v) => !v)}
        className="bg-card border border-border rounded-full shadow-lg p-3 hover:bg-muted transition-colors flex items-center gap-2"
      >
        <Palette className="w-5 h-5 mr-1 text-primary" />
        <span className="hidden md:inline text-base font-medium">Theme</span>
      </button>
      {open && (
        <div className="absolute bottom-16 right-0 bg-popover border border-border rounded-xl shadow-lg p-2 min-w-[160px] flex flex-col gap-1">
          {allThemes.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t); setOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition text-sm ${theme.id === t.id ? "font-bold ring-1 ring-primary" : ""}`}
            >
              {themeCircle(t.variables["--primary"] ?? "#000")}
              {t.name}
            </button>
          ))}
        </div>
      )}
      {/* Overlay for closing */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
