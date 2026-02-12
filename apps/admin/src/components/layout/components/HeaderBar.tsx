import { type useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { HeaderBreadcrumbs } from "./HeaderBreadcrumbs";
import { HeaderCacheTabs } from "./HeaderCacheTabs";
import { HeaderUserProfile } from "./HeaderUserProfile";
import { type HeaderNavNode } from "./types";

type HeaderBarSidebarNavItem = {
  key: string;
  label: string;
  path?: string;
  disabled?: boolean;
  children?: HeaderBarSidebarNavItem[];
};

type HeaderBarProps = {
  pathname: string;
  groups: HeaderBarSidebarNavItem[];
  navigate: ReturnType<typeof useNavigate>;
};

/**
 * Returns whether current path is active for nav item.
 */
const isRouteActive = (pathname: string, to?: string) => {
  if (!to) {
    return false;
  }
  if (to === "/") {
    return pathname === "/";
  }
  return pathname === to || pathname.startsWith(`${to}/`);
};

/**
 * Returns active nav trail from groups by pathname.
 */
const getActiveNavTrail = (
  groups: HeaderBarSidebarNavItem[],
  pathname: string
) => {
  const toHeaderNode = (item: HeaderBarSidebarNavItem): HeaderNavNode => ({
    key: item.key,
    label: item.label,
    path: item.path,
  });

  const getVisibleChildren = (item: HeaderBarSidebarNavItem) =>
    (item.children ?? []).filter((child) => !child.disabled);

  const walk = (items: HeaderBarSidebarNavItem[]): HeaderNavNode[] => {
    for (const item of items) {
      if (item.disabled) {
        continue;
      }
      if (isRouteActive(pathname, item.path)) {
        return [toHeaderNode(item)];
      }
      const visibleChildren = getVisibleChildren(item);
      if (visibleChildren.length === 0) {
        continue;
      }
      const childTrail = walk(visibleChildren);
      if (childTrail.length > 0) {
        return [toHeaderNode(item), ...childTrail];
      }
    }
    return [];
  };

  return walk(groups);
};

/**
 * Renders top header bar with breadcrumbs, cache tabs and user profile.
 */
export function HeaderBar({ pathname, groups, navigate }: HeaderBarProps) {
  const activeTrail = useMemo(
    () => getActiveNavTrail(groups, pathname),
    [groups, pathname]
  );

  const breadcrumbItems = useMemo(() => {
    const list = [...activeTrail];
    if (list.length > 1) {
      return list;
    }
    return [];
  }, [activeTrail]);

  const cacheTabItems = useMemo(() => {
    const unique: HeaderNavNode[] = [];
    for (const item of breadcrumbItems) {
      if (!item.path) {
        continue;
      }
      if (unique.some((row) => row.path === item.path)) {
        continue;
      }
      unique.push(item);
    }
    return unique;
  }, [breadcrumbItems]);

  return (
    <header className="h-20 border-b border-border/70 bg-background/95 px-4 py-2 backdrop-blur">
      <div className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <HeaderBreadcrumbs
            items={breadcrumbItems}
            onNavigate={(to) => navigate({ to: to as never })}
          />
          <HeaderCacheTabs
            activePath={pathname}
            items={cacheTabItems}
            onNavigate={(to) => navigate({ to: to as never })}
          />
        </div>
        <div className="flex items-center justify-end">
          <HeaderUserProfile userName="管理员" />
        </div>
      </div>
    </header>
  );
}
