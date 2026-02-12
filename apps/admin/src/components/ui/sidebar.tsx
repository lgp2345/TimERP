import { Slot } from "@radix-ui/react-slot";
import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Sidebar layout provider container.
 */
export function SidebarProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-screen w-full", className)}>{children}</div>
  );
}

/**
 * Sidebar root container.
 */
export function Sidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "hidden border-sidebar-border border-r bg-sidebar text-sidebar-foreground md:flex md:w-72 md:flex-col",
        className
      )}
    >
      {children}
    </aside>
  );
}

/**
 * Sidebar header section.
 */
export function SidebarHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-sidebar-border border-b px-4 py-4", className)}>
      {children}
    </div>
  );
}

/**
 * Sidebar scrollable content section.
 */
export function SidebarContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-3", className)}>
      {children}
    </div>
  );
}

/**
 * Sidebar footer section.
 */
export function SidebarFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-sidebar-border border-t p-3", className)}>
      {children}
    </div>
  );
}

/**
 * Sidebar menu list.
 */
export function SidebarMenu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <ul className={cn("space-y-1", className)}>{children}</ul>;
}

/**
 * Sidebar menu item.
 */
export function SidebarMenuItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <li className={cn("list-none", className)}>{children}</li>;
}

/**
 * Sidebar interactive menu button.
 */
export function SidebarMenuButton({
  children,
  className,
  asChild = false,
  isActive = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 text-left font-medium text-sm transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

/**
 * Main content container next to sidebar.
 */
export function SidebarInset({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <main className={cn("flex-1", className)}>{children}</main>;
}
