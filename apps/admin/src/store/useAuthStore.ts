import type { LoginResponse } from "@repo/schema";
import { create } from "zustand";

type AuthState = {
  loginContext: LoginResponse | null;
  setLoginContext: (value: LoginResponse) => void;
  clearLoginContext: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  loginContext: null,
  setLoginContext: (value) => set({ loginContext: value }),
  clearLoginContext: () => set({ loginContext: null }),
}));
