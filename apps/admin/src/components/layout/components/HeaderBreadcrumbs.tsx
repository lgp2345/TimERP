import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type HeaderNavNode } from "./types";

type HeaderBreadcrumbsProps = {
  items: HeaderNavNode[];
  onNavigate: (path: string) => void;
};

/**
 * Renders breadcrumb navigation in header.
 */
export function HeaderBreadcrumbs({
  items,
  onNavigate,
}: HeaderBreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className="flex min-w-0 items-center gap-1.5">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div className="flex min-w-0 items-center gap-1.5" key={item.key}>
            {index > 0 ? (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            ) : null}
            <button
              className={cn(
                "truncate text-left text-xs transition-colors duration-200",
                isLast
                  ? "cursor-default font-medium text-foreground"
                  : "cursor-pointer text-muted-foreground hover:text-foreground"
              )}
              disabled={isLast || !item.path}
              onClick={() => {
                if (!isLast && item.path) {
                  onNavigate(item.path);
                }
              }}
              title={item.label}
              type="button"
            >
              {item.label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
