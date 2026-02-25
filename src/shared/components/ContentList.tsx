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
      className={`flex items-center justify-between px-3 py-2`}
    >
      <span className="text-xs text-gray-400 font-medium">{label}</span>

      <div className="flex items-center gap-1">
        <button
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs font-medium text-gray-600 px-2 min-w-[48px] text-center">
          {page} / {totalPage || 1}
        </span>
        <button
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
        <div className="w-full h-0.5 bg-gray-100 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-indigo-500 animate-progress origin-left" />
        </div>
      )}

      {/* ─── Error State ─── */}
      {isError && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl mt-3 flex items-center gap-2 text-sm">
          <AlertCircle size={16} />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* ─── Top Pagination ─── */}
      {renderPaginationControls()}

      {/* ─── Content ─── */}
      <div className="min-h-0">{children}</div>

      {/* ─── Bottom Pagination (compact — nav only) ─── */}
      <div className="mt-1 border-t border-gray-100">
        {renderPaginationControls()}
      </div>
    </div>
  );
}
