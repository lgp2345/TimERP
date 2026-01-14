import { useAppStore } from "@/store/useAppStore";

export async function apiFetch(input: string, init?: RequestInit) {
  const token = useAppStore.getState().accessToken;

  const headers = new Headers(init?.headers);
  if (token) headers.set("authorization", `Bearer ${token}`);

  return fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });
}
