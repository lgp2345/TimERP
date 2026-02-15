import {
  CollapsibleContent as CollapsibleContentPrimitive,
  Root,
  Trigger,
} from "@radix-ui/react-collapsible";
import type * as React from "react";

/**
 * Collapsible root container.
 */
export function Collapsible({ ...props }: React.ComponentProps<typeof Root>) {
  return <Root {...props} />;
}

/**
 * Collapsible trigger element.
 */
export function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof Trigger>) {
  return <Trigger {...props} />;
}

/**
 * Collapsible content area.
 */
export function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsibleContentPrimitive>) {
  return <CollapsibleContentPrimitive {...props} />;
}
