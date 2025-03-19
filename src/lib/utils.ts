import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// constants
export const SEARCH_PAGE_SIZE = 15;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
