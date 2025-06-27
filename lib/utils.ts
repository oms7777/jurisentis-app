// lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date courte : 27 juin 2025
export function formatDate(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}

// Truncate texte (utile pour les titres très longs)
export function truncateText(text: string, maxLength = 100) {
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text
}

// Capitalise la première lettre
export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
