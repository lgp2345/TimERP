import { create } from "zustand";

type AppState = {
  initialized: boolean;
  setInitialized: (value: boolean) => void;
  accessToken: string | null;
  setAccessToken: (
    token: string | null,
    persist: "session" | "local" | "none"
  ) => void;
};

export const useAppStore = create<AppState>((set) => ({
  initialized: false,
  setInitialized: (value) => set({ initialized: value }),
  accessToken:
    localStorage.getItem("accessToken") ??
    sessionStorage.getItem("accessToken") ??
    null,
  setAccessToken: (token, persist) =>
    set(() => {
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      if (token) {
        if (persist === "local") localStorage.setItem("accessToken", token);
        if (persist === "session") sessionStorage.setItem("accessToken", token);
      }
      return { accessToken: token };
    }),
}));
