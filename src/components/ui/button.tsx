import { cloneElement, isValidElement, type ComponentProps } from "react";

import { cn } from "@/lib/utils";

// shadcn's Button without its helper libraries (class-variance-authority, tailwind-merge, Radix Slot),
// which only this file used. Classes are joined, not merged, so no two of them may set the same
// thing: each size carries its own text size, and a className must not repeat a utility a variant
// or size sets (e.g. px-*). Add a size instead, such as size="inline": a link with no side padding.
const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const VARIANTS = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const SIZES = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-10 px-8 text-sm",
  icon: "h-9 w-9 text-sm",
  inline: "h-9 px-0 py-2 text-sm",
};

type Variant = keyof typeof VARIANTS;
type Size = keyof typeof SIZES;

export const buttonVariants = ({ variant, size, className }: { variant?: Variant | null | undefined; size?: Size | null | undefined; className?: string | undefined } = {}) =>
  cn(BASE, VARIANTS[variant ?? "default"], SIZES[size ?? "default"], className);

export type ButtonProps = ComponentProps<"button"> & { variant?: Variant | null; size?: Size | null; asChild?: boolean };

/** Tutorcat's button. variant: default (green, primary action) | outline | secondary | ghost | link | destructive; size: default | sm | lg | icon | inline (no side padding, for links in text); asChild renders its child (e.g. an <a>) with button styling. @category Actions */
function Button({ className, variant, size, asChild = false, children, ...props }: ButtonProps) {
  const classes = buttonVariants({ variant, size, className });
  // asChild: the child element gets the button's classes and props; its own props win.
  if (asChild && isValidElement<{ className?: string }>(children)) {
    return cloneElement(children, { ...props, ...children.props, className: cn(classes, children.props.className) });
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export { Button };
