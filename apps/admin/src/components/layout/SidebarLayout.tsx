import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  type LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { ThemeModeButton } from "@/components/ThemeMode";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type SidebarNavItem = {
  key: string;
  label: string;
  icon?: LucideIcon;
  path?: string;
  disabled?: boolean;
  children?: SidebarNavItem[];
};

export type SidebarNavGroup = SidebarNavItem;

type SidebarLayoutProps = {
  title: string;
  subtitle: string;
  groups: SidebarNavItem[];
  children: React.ReactNode;
};

type SidebarNavEntryProps = {
  item: SidebarNavItem;
  pathname: string;
  navigate: ReturnType<typeof useNavigate>;
  isSidebarCollapsed: boolean;
  openRouteKeys: Record<string, boolean>;
  setOpenRouteKeys: Dispatch<SetStateAction<Record<string, boolean>>>;
  depth?: number;
};

type SidebarNavEntryButtonProps = {
  item: SidebarNavItem;
  itemIsActive: boolean;
  hasChildren: boolean;
  routeOpen: boolean;
  isSidebarCollapsed: boolean;
  depth: number;
  onClick: () => void;
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
 * Collects route keys that contain children.
 */
const getDefaultOpenRouteKeys = (groups: SidebarNavItem[]) => {
  const keys: Record<string, boolean> = {};
  const walk = (items: SidebarNavItem[]) => {
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        keys[item.key] = true;
        walk(item.children);
      }
    }
  };
  walk(groups);
  return keys;
};

/**
 * Renders sidebar entry button.
 */
function SidebarNavEntryButton({
  item,
  itemIsActive,
  hasChildren,
  routeOpen,
  isSidebarCollapsed,
  depth,
  onClick,
}: SidebarNavEntryButtonProps) {
  const isTopLevel = depth === 0;
  const showCollapsedTopLevelIconOnly =
    isSidebarCollapsed && isTopLevel && Boolean(item.icon);
  const showCollapsedTopLevelLabel =
    isSidebarCollapsed && isTopLevel && !item.icon;
  const showExpandedLabel = !isSidebarCollapsed;

  return (
    <SidebarMenuButton
      className={cn(
        showCollapsedTopLevelIconOnly ? "justify-center px-0" : undefined,
        itemIsActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
          : undefined
      )}
      disabled={item.disabled}
      onClick={onClick}
      type="button"
    >
      {item.icon ? <item.icon className="h-4 w-4 shrink-0" /> : null}
      {showCollapsedTopLevelLabel && (
        <span className="w-full truncate" title={item.label}>
          {item.label}
        </span>
      )}
      {showExpandedLabel && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {hasChildren ? (
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                routeOpen ? "rotate-180" : "rotate-0"
              )}
            />
          ) : null}
        </>
      )}
    </SidebarMenuButton>
  );
}

/**
 * Renders a single sidebar navigation entry with optional nested routes.
 */
function SidebarNavEntry({
  item,
  pathname,
  navigate,
  isSidebarCollapsed,
  openRouteKeys,
  setOpenRouteKeys,
  depth = 0,
}: SidebarNavEntryProps) {
  const itemIsActive = isRouteActive(pathname, item.path);
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const routeOpen = hasChildren ? (openRouteKeys[item.key] ?? false) : false;
  const canShowChildren = Boolean(
    !isSidebarCollapsed && hasChildren && routeOpen
  );
  const isNestedItem = depth > 0;

  const handleItemClick = () => {
    if (hasChildren) {
      setOpenRouteKeys((prev) => ({
        ...prev,
        [item.key]: !(prev[item.key] ?? true),
      }));
      return;
    }
    if (item.path && !item.disabled) {
      navigate({ to: item.path as never });
    }
  };

  return (
    <SidebarMenuItem key={item.key}>
      <SidebarNavEntryButton
        depth={depth}
        hasChildren={hasChildren}
        isSidebarCollapsed={isSidebarCollapsed}
        item={item}
        itemIsActive={itemIsActive}
        onClick={handleItemClick}
        routeOpen={routeOpen}
      />

      {canShowChildren && item.children ? (
        <SidebarMenu
          className={cn(
            "mt-1 border-sidebar-border border-l pl-2",
            isNestedItem ? "ml-4" : "ml-5"
          )}
        >
          {item.children.map((child) => (
            <SidebarNavEntry
              depth={depth + 1}
              isSidebarCollapsed={isSidebarCollapsed}
              item={child}
              key={child.key}
              navigate={navigate}
              openRouteKeys={openRouteKeys}
              pathname={pathname}
              setOpenRouteKeys={setOpenRouteKeys}
            />
          ))}
        </SidebarMenu>
      ) : null}
    </SidebarMenuItem>
  );
}

/**
 * Admin page layout with collapsible sidebar and nested route folding.
 */
export function SidebarLayout({
  title,
  subtitle,
  groups,
  children,
}: SidebarLayoutProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [openRouteKeys, setOpenRouteKeys] = useState<Record<string, boolean>>(
    () => getDefaultOpenRouteKeys(groups)
  );

  const groupedNav = useMemo(() => groups, [groups]);

  return (
    <SidebarProvider>
      <Sidebar
        className={cn(
          "overflow-hidden transition-all duration-200 md:h-screen",
          isSidebarCollapsed && "md:w-20"
        )}
      >
        <SidebarHeader className="px-3">
          <div className="flex items-center justify-between gap-2 relative">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
                <span className="font-semibold text-sidebar-primary-foreground text-sm">
                  T
                </span>
              </div>
              {isSidebarCollapsed ? null : (
                <div className="min-w-0">
                  <p className="truncate font-semibold text-sm">TimERP Admin</p>
                  <p className="truncate text-sidebar-foreground/70 text-xs">
                    Control Console
                  </p>
                </div>
              )}
            </div>
            <button
              className={cn(
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-sidebar-border border bg-sidebar text-sidebar-foreground transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isSidebarCollapsed &&
                  "absolute top-1/2 -right-6 z-10 -translate-y-1/2"
              )}
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              type="button"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>
        </SidebarHeader>

        <SidebarContent className={cn("min-h-0", isSidebarCollapsed && "px-2")}>
          {groupedNav.map((group) => (
            <SidebarMenu key={group.key}>
              <SidebarNavEntry
                isSidebarCollapsed={isSidebarCollapsed}
                item={group}
                key={group.key}
                navigate={navigate}
                openRouteKeys={openRouteKeys}
                pathname={pathname}
                setOpenRouteKeys={setOpenRouteKeys}
              />
            </SidebarMenu>
          ))}
        </SidebarContent>

        <SidebarFooter className="space-y-3">
          {isSidebarCollapsed ? null : (
            <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/45 p-3">
              <p className="font-medium text-sm">企业看板</p>
              <p className="mt-1 text-sidebar-foreground/75 text-xs">
                数据刷新中，保持节奏。
              </p>
            </div>
          )}
          <div
            className={cn(
              "flex",
              isSidebarCollapsed ? "justify-center" : "justify-end"
            )}
          >
            <ThemeModeButton />
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-h-screen">
        <header className="border-b bg-background/80 px-5 py-4 backdrop-blur">
          <p className="font-semibold text-lg">{title}</p>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
