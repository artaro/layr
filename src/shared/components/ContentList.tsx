'use client';

import React, { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export interface ContentListProps {
  /** Custom filter UI rendered at the top (sticky) */
  filterSection?: ReactNode;
  /** Main content area */
  children: ReactNode;
  /** Current page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPage: number;
  /** Total number of items */
  totalItem: number;
  /** Items per page */
  pageSize: number;
  /** Called when page changes */
  onPageChange: (page: number) => void;
  /** Show loading progress bar */
  isLoading?: boolean;
  /** Show error state */
  isError?: boolean;
  /** Custom error message */
  errorMessage?: string;
  /** Override "Showing X–Y of Z" label. If not provided, uses default format. */
  showingLabel?: string;
}

export default function ContentList({
  filterSection,
  children,
  page,
  totalPage,
  totalItem,
  pageSize,
  onPageChange,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load data',
  showingLabel,
}: ContentListProps) {
  const from = totalItem > 0 ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, totalItem);

  const hasPrev = page > 1;
  const hasNext = page < totalPage;

  const label =
    showingLabel ?? (totalItem > 0 ? `${from}–${to} of ${totalItem}` : '0 items');

  const renderPaginationControls = () => (
    <div
      className="flex items-center justify-between px-3 py-2"
    >
      <span className="text-xs text-[var(--color-text-muted)] font-medium">{label}</span>

      <div className="flex items-center gap-1">
        <button
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          className="p-1.5 border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs font-medium text-[var(--color-text-secondary)] px-2 min-w-[48px] text-center">
          {page} / {totalPage || 1}
        </span>
        <button
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          className="p-1.5 border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* ─── Filter Section ─── */}
      {filterSection}

      {/* ─── Loading State ─── */}
      {isLoading && (
        <div className="w-full h-0.5 bg-[var(--color-surface-2)] overflow-hidden mt-2">
          <div className="h-full bg-[var(--color-primary)] animate-progress origin-left" />
        </div>
      )}

      {/* ─── Error State ─── */}
      {isError && (
        <div className="bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)] text-[var(--color-accent)] p-3 mt-3 flex items-center gap-2 text-sm">
          <AlertCircle size={16} />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* ─── Top Pagination ─── */}
      {renderPaginationControls()}

      {/* ─── Content ─── */}
      <div className="min-h-0">{children}</div>

      {/* ─── Bottom Pagination (compact — nav only) ─── */}
      <div className="mt-1 border-t-2 border-[var(--color-border)]">
        {renderPaginationControls()}
      </div>
    </div>
  );
}
