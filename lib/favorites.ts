"use client";

export const favoritesStorageKey = "gitgoblins:favorites";

export function readFavoriteIds() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(favoritesStorageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function writeFavoriteIds(ids: string[]) {
  window.localStorage.setItem(favoritesStorageKey, JSON.stringify(Array.from(new Set(ids))));
}

export function toggleFavoriteId(id: string) {
  const current = readFavoriteIds();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  writeFavoriteIds(next);
  return next;
}
