import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  type LucideIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { HeaderBar } from "./components/HeaderBar";

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
  onClick?: () => void;
};

type SidebarCollapsedDropdownItemsProps = {
  items: SidebarNavItem[];
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
 * Collects route keys that contain children.
 */
const getDefaultOpenRouteKeys = (groups: SidebarNavItem[]) => {
  const keys: Record<string, boolean> = {};
  const walk = (items: SidebarNavItem[]) => {
    for (const item of items) {
      if (item.disabled) {
        continue;
      }
      const visibleChildren = (item.children ?? []).filter(
        (child) => !child.disabled
      );
      if (visibleChildren.length > 0) {
        keys[item.key] = true;
        walk(visibleChildren);
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
 * Renders collapsed sidebar dropdown items recursively.
 */
function SidebarCollapsedDropdownItems({
  items,
  navigate,
}: SidebarCollapsedDropdownItemsProps) {
  const visibleItems = items.filter((entry) => !entry.disabled);

  return visibleItems.map((entry) => {
    const visibleChildren = (entry.children ?? []).filter(
      (child) => !child.disabled
    );
    const hasChildren = visibleChildren.length > 0;

    if (hasChildren) {
      return (
        <DropdownMenuSub key={entry.key}>
          <DropdownMenuSubTrigger>
            {entry.icon ? <entry.icon className="h-4 w-4 shrink-0" /> : null}
            <span className="flex-1 truncate">{entry.label}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <SidebarCollapsedDropdownItems
                items={visibleChildren}
                navigate={navigate}
              />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      );
    }

    return (
      <DropdownMenuItem
        disabled={!entry.path}
        key={entry.key}
        onSelect={() => {
          if (entry.path) {
            navigate({ to: entry.path as never });
          }
        }}
      >
        {entry.icon ? <entry.icon className="h-4 w-4 shrink-0" /> : null}
        <span className="flex-1 truncate">{entry.label}</span>
      </DropdownMenuItem>
    );
  });
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
  if (item.disabled) {
    return null;
  }

  const visibleChildren = (item.children ?? []).filter(
    (child) => !child.disabled
  );
  const itemIsActive = isRouteActive(pathname, item.path);
  const hasChildren = visibleChildren.length > 0;
  const routeOpen = hasChildren ? (openRouteKeys[item.key] ?? false) : false;
  const useCollapsedDropdown = Boolean(isSidebarCollapsed && hasChildren);
  const isNestedItem = depth > 0;

  const handleItemClick = () => {
    if (item.path && !item.disabled) {
      navigate({ to: item.path as never });
    }
  };

  if (useCollapsedDropdown) {
    return (
      <SidebarMenuItem key={item.key}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarNavEntryButton
              depth={depth}
              hasChildren={hasChildren}
              isSidebarCollapsed={isSidebarCollapsed}
              item={item}
              itemIsActive={itemIsActive}
              routeOpen={routeOpen}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56" side="right">
            <SidebarCollapsedDropdownItems
              items={visibleChildren}
              navigate={navigate}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }

  if (hasChildren) {
    return (
      <Collapsible
        asChild
        key={item.key}
        onOpenChange={(open) => {
          setOpenRouteKeys((prev) => ({
            ...prev,
            [item.key]: open,
          }));
        }}
        open={routeOpen}
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarNavEntryButton
              depth={depth}
              hasChildren={hasChildren}
              isSidebarCollapsed={isSidebarCollapsed}
              item={item}
              itemIsActive={itemIsActive}
              routeOpen={routeOpen}
            />
          </CollapsibleTrigger>
          <CollapsibleContent
            className={cn(
              "CollapsibleContent mt-1 overflow-hidden",
              "data-[state=open]:animate-[collapsible-down_200ms_ease-out]",
              "data-[state=closed]:animate-[collapsible-up_200ms_ease-out]"
            )}
          >
            <SidebarMenu
              className={cn(
                "border-sidebar-border border-l pl-2",
                isNestedItem ? "ml-4" : "ml-5"
              )}
            >
              {visibleChildren.map((child) => (
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
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

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
    </SidebarMenuItem>
  );
}

/**
 * Admin page layout with collapsible sidebar and nested route folding.
 */
export function SidebarLayout({ groups, children }: SidebarLayoutProps) {
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
          "transition-all duration-200 md:h-screen",
          isSidebarCollapsed && "md:w-20"
        )}
      >
        <SidebarHeader className="px-3 h-20 flex items-center">
          <div className="flex items-center justify-between gap-2 relative w-full">
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
          {groupedNav
            .filter((group) => !group.disabled)
            .map((group) => (
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
      </Sidebar>

      <SidebarInset className="max-h-screen overflow-hidden flex flex-col">
        <HeaderBar
          groups={groupedNav}
          navigate={navigate}
          pathname={pathname}
        />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
