'use client';

import React from 'react';
import { Category } from '@/features/expenses/types';

interface CategoryChipProps {
  category?: Category;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export default function CategoryChip({
  category,
  selected,
  onClick,
  compact = false,
}: CategoryChipProps) {
  if (!category) return null;

  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer border-2
        ${compact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
        ${
          selected
            ? 'border-transparent'
            : 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
        }
      `}
      style={{
        backgroundColor: selected ? `${category.color}20` : undefined,
        color: selected ? category.color : undefined,
        borderColor: selected ? `${category.color}60` : undefined,
      }}
    >
      <span className={compact ? 'text-sm' : 'text-base'}>
        {category.icon}
      </span>
      <span className="font-medium">
        {category.name}
      </span>
    </div>
  );
}
