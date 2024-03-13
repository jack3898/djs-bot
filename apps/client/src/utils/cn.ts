import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Intelligently merge tailwind classes together and trim whitespace.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
