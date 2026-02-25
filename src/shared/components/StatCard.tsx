'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon,
  gradient,
  trend,
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden p-6 bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-primary)] brutal-hover transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1 uppercase tracking-wider text-[11px]">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            {value}
          </h3>
        </div>
        <div 
          className="w-12 h-12 flex items-center justify-center text-white border-2 border-[var(--color-border)]"
          style={{ background: gradient }}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-2">
          {trend.positive ? (
            <div className="flex items-center text-xs font-bold text-[var(--color-income)] bg-[var(--color-income)]/15 px-2 py-1">
              ↗ {trend.value}
            </div>
          ) : (
            <div className="flex items-center text-xs font-bold text-[var(--color-expense)] bg-[var(--color-expense)]/15 px-2 py-1">
              ↘ {trend.value}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
