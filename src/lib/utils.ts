import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combine conditional Tailwind classes and resolve conflicting utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
