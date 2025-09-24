import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UseraState {
  user: { id: string; name: string } | null;
  setUser: (user: { id: string; name: string }) => void;
  clearUser: () => void;
}

const useUserStore = create<UseraState>()(
  devtools(
    persist(
      set => ({
        user: null,
        setUser: user => set({ user }),
        clearUser: () => set({ user: null })
      }),
      {
        name: "userStore"
      }
    )
  )
);

export default useUserStore;
