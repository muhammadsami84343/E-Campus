// lib/format.ts
export function formatInt(n: number) {
  return new Intl.NumberFormat("en-PK").format(n);
}

export function formatCompact(n: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatPKRCompact(n: number) {
  return `₨ ${formatCompact(n)}`;
}