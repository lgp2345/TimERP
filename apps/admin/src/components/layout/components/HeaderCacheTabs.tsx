import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type HeaderNavNode } from "./types";

type HeaderCacheTabsProps = {
  items: HeaderNavNode[];
  activePath: string;
  onNavigate: (path: string) => void;
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
 * Renders cached page tabs in header.
 */
export function HeaderCacheTabs({
  items,
  activePath,
  onNavigate,
}: HeaderCacheTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {items.map((item) => {
        const isActive = Boolean(
          item.path && isRouteActive(activePath, item.path)
        );
        return (
          <button
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs transition-colors duration-200",
              isActive
                ? "border-sidebar-primary bg-sidebar-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
            key={item.key}
            onClick={() => {
              if (item.path) {
                onNavigate(item.path);
              }
            }}
            title={item.label}
            type="button"
          >
            <span className="max-w-28 truncate">{item.label}</span>
            <X className="h-3.5 w-3.5 shrink-0 opacity-70" />
          </button>
        );
      })}
    </div>
  );
}
