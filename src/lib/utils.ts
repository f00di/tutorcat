import { clsx, type ClassValue } from "clsx";

// Joins class names (no tailwind-merge; see src/components/ui/button.tsx).
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
