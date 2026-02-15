import {
  Content,
  Item,
  Portal,
  Root,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronRight } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Dropdown menu root container.
 */
export function DropdownMenu({ ...props }: React.ComponentProps<typeof Root>) {
  return <Root {...props} />;
}

/**
 * Dropdown menu trigger element.
 */
export function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof Trigger>) {
  return <Trigger {...props} />;
}

/**
 * Dropdown menu portal wrapper.
 */
export function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof Portal>) {
  return <Portal {...props} />;
}

/**
 * Dropdown menu nested sub container.
 */
export function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof Sub>) {
  return <Sub {...props} />;
}

/**
 * Dropdown menu content panel.
 */
export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof Content>) {
  return (
    <Portal>
      <Content
        className={cn(
          "z-50 min-w-44 overflow-hidden rounded-md border border-sidebar-border bg-sidebar p-1 text-sidebar-foreground shadow-md",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        sideOffset={sideOffset}
        {...props}
      />
    </Portal>
  );
}

/**
 * Dropdown menu selectable item.
 */
export function DropdownMenuItem({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof Item> & {
  inset?: boolean;
}) {
  return (
    <Item
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 outline-none transition-colors",
        "focus:bg-sidebar-accent focus:text-sidebar-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

/**
 * Dropdown menu sub trigger item.
 */
export function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <SubTrigger
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 outline-none transition-colors",
        "focus:bg-sidebar-accent focus:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </SubTrigger>
  );
}

/**
 * Dropdown menu nested sub content panel.
 */
export function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof SubContent>) {
  return (
    <SubContent
      className={cn(
        "z-50 min-w-44 overflow-hidden rounded-md border border-sidebar-border bg-sidebar p-1 text-sidebar-foreground shadow-md",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  );
}
