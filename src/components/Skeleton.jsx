import React from 'react';

// Single reusable shimmer block. Use composed in lists / tables / cards to
// indicate that a placeholder will be replaced by real content soon.
//
//   <Skeleton className="h-4 w-32" />
//
// `className` controls the shape; the shimmer comes from the Tailwind
// `animate-pulse` utility plus a neutral surface colour.
export function Skeleton({ className = '' }) {
  return (
    <div aria-hidden="true" className={`animate-pulse bg-surface-container-high rounded ${className}`} />
  );
}

// Skeleton for a single table row. Renders N cells matching the real table.
// Pass `cells` (= number of <td> in the real row) and `widths` (per-cell
// Tailwind width classes) to mimic the real shape.
export function SkeletonRow({ cells = 6, widths }) {
  const w = widths || Array(cells).fill('w-3/4');
  return (
    <tr className="border-b border-outline-variant/40 last:border-b-0">
      {Array.from({ length: cells }).map((_, i) => (
        <td key={i} className="p-md">
          <Skeleton className={`h-3.5 ${w[i] || 'w-3/4'}`} />
        </td>
      ))}
    </tr>
  );
}

// Skeleton for a list of cards (used on /admin/customers etc.).
export function SkeletonCard() {
  return (
    <div className="p-md border-b border-outline-variant/40 last:border-b-0 flex items-center gap-md">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
