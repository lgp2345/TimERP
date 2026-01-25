import { jwtClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_HOST,
  plugins: [usernameClient(), jwtClient()],
});

export { jwtClient, usernameClient };
