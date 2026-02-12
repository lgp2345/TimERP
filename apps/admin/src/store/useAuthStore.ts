import type { LoginResponse } from "@repo/schema";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  loginContext: LoginResponse | null;
  setLoginContext: (value: LoginResponse) => void;
  clearLoginContext: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loginContext: null,
      setLoginContext: (value) => set({ loginContext: value }),
      clearLoginContext: () => set({ loginContext: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ loginContext: state.loginContext }),
    }
  )
);
