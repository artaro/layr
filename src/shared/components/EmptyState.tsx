'use client';

import React from 'react';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  emoji = '📭',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-border)]">
      <div className="text-4xl mb-4 w-16 h-16 bg-[var(--color-surface-2)] border-2 border-[var(--color-border)] flex items-center justify-center">
        {emoji}
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 uppercase tracking-wider font-[var(--font-brand)]">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="brutal-btn px-5 py-2.5 text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
