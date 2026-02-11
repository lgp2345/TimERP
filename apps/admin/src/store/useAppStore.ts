import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

type AppState = {
  initialized: boolean;
  setInitialized: (value: boolean) => void;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
};

export const applyTheme = (mode: ThemeMode) => {
  if (typeof window === "undefined") {
    return "light";
  }
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
};

// export const useAppStore = create<AppState>((set) => ({
//   initialized: false,
//   setInitialized: (value) => set({ initialized: value }),
//   themeMode: getInitialThemeMode(),
//   toggleThemeMode: () =>
//     set((state) => {
//       const root = document.documentElement;
//       root.classList.toggle("dark", state.themeMode === "dark");
//       window.localStorage.setItem("theme-mode", state.themeMode);
//       return {
//         themeMode: state.themeMode === "dark" ? "light" : "dark",
//       };
//     }),
// }));
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      initialized: false,
      setInitialized: (value) => set({ initialized: value }),
      themeMode: "light",
      toggleThemeMode: () =>
        set((state) => {
          const nextThemeMode = state.themeMode === "dark" ? "light" : "dark";
          applyTheme(nextThemeMode);
          return {
            themeMode: nextThemeMode,
          };
        }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        themeMode: state.themeMode, // 只持久化主题
      }),
    }
  )
);
