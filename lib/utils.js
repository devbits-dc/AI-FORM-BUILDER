import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to merge class names using `clsx` and `tailwind-merge`.
 * @param {...string} inputs - Class name strings to be merged.
 * @returns {string} - The merged class names.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
