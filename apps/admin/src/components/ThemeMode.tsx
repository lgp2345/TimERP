import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const ThemeModeIcon = () => {
  const themeMode = useAppStore((state) => state.themeMode);
  if (themeMode === "dark") {
    return <Sun className="h-4 w-4" />;
  }
  return <Moon className="h-4 w-4" />;
};

export const ThemeModeButton = () => {
  const toggleThemeMode = useAppStore((state) => state.toggleThemeMode);
  return (
    <button
      className="absolute top-5 right-5 z-20 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card/85 text-foreground shadow-sm transition-colors duration-200 hover:border-primary hover:text-primary"
      onClick={toggleThemeMode}
      type="button"
    >
      <ThemeModeIcon />
    </button>
  );
};
