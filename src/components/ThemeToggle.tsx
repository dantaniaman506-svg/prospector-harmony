import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { haptic } from "@/lib/haptics";

/** Modern sun/moon crossfade switch — no labels, just a soft pill icon button. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        haptic.select();
        setTheme(dark ? "light" : "dark");
      }}
      className="press relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-secondary/70 text-foreground transition-colors"
    >
      <Sun
        className={`absolute size-4.5 text-primary transition-all duration-300 ${
          dark ? "translate-y-3 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute size-4.5 text-primary transition-all duration-300 ${
          dark ? "translate-y-0 rotate-0 opacity-100" : "-translate-y-3 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}
