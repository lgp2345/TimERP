import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Check the current path access permissions, redirect to the login page when not logged in.
 */
const guardAuthRoute = (pathname: string, href: string) => {
  const accessToken = useAuthStore.getState().loginContext?.accessToken;
  if (!accessToken && pathname !== "/login") {
    throw redirect({ to: "/login", search: { redirect: href } });
  }
};

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    guardAuthRoute(location.pathname, location.href);
  },
  component: Root,
});

/**
 * 根路由组件。
 */
function Root() {
  return <Outlet />;
}
