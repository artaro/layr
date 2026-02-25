'use client';

import React, { ReactNode } from 'react';
import { X, Edit2, Send, Trash2, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/shared/lib/i18n';

// ── Footer Action Types ──
export type ModalActionType = 'edit' | 'submit' | 'delete' | 'cancel';

export interface ModalAction {
  type: ModalActionType;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// ── Props ──
export interface CentralModalProps {
  open: boolean;
  onClose: () => void;

  // Size
  size?: 'sm' | 'md' | 'lg' | 'xl';

  // Header
  title?: string;
  titleNode?: ReactNode;
  headerAction?: ReactNode;
  headerClassName?: string;

  // Content
  children: ReactNode;

  // Footer
  actions?: ModalAction[];
  footerNode?: ReactNode;
}

// ── Action button styles by type ──
const ACTION_CONFIG: Record<ModalActionType, {
  icon: typeof Send;
  labelKey: string;
  className: string;
}> = {
  submit: {
    icon: Send,
    labelKey: 'common.submit',
    className: 'bg-[var(--color-primary)] hover:shadow-[4px_4px_0px_0px_var(--color-primary)] text-[var(--color-text-inverse)] border-2 border-[var(--color-primary)]',
  },
  edit: {
    icon: Edit2,
    labelKey: 'common.edit',
    className: 'bg-[var(--color-secondary)] hover:shadow-[4px_4px_0px_0px_var(--color-secondary)] text-[var(--color-text-inverse)] border-2 border-[var(--color-secondary)]',
  },
  delete: {
    icon: Trash2,
    labelKey: 'common.delete',
    className: 'bg-[var(--color-accent)] hover:shadow-[4px_4px_0px_0px_var(--color-accent)] text-white border-2 border-[var(--color-accent)]',
  },
  cancel: {
    icon: ArrowLeft,
    labelKey: 'common.cancel',
    className: 'bg-transparent hover:bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-2 border-[var(--color-border)]',
  },
};

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function CentralModal({
  open,
  onClose,
  size = 'xl',
  title,
  titleNode,
  headerAction,
  headerClassName,
  children,
  actions,
  footerNode,
}: CentralModalProps) {
  const { t } = useTranslation();

  if (!open) return null;

  const hasFooter = (actions && actions.length > 0) || footerNode;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`relative bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[6px_6px_0px_0px_var(--color-primary)] w-full ${SIZE_MAP[size]} max-h-[90vh] flex flex-col animate-fade-in`}
      >
        {/* ── Header ── */}
        <div
          className={`px-6 py-3 border-b-2 border-[var(--color-border)] flex items-center justify-between gap-4 flex-shrink-0 ${
            headerClassName || 'bg-[var(--color-surface-2)]'
          }`}
        >
          {/* Left: title */}
          <div className="flex items-center gap-3 min-w-0">
            {titleNode || (
              <h2 className="text-base font-bold text-[var(--color-text-primary)] uppercase tracking-wider font-[var(--font-brand)] truncate">
                {title}
              </h2>
            )}
          </div>

          {/* Right: custom action or close button */}
          {headerAction || (
            <button
              onClick={onClose}
              className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[var(--color-surface)]">
          {children}
        </div>

        {/* ── Footer ── */}
        {hasFooter && (
          <div className="px-6 py-3 border-t-2 border-[var(--color-border)] bg-[var(--color-surface-2)] flex items-center justify-between gap-3 flex-shrink-0">
            {footerNode}
            {actions && actions.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                {actions.map((action) => {
                  const config = ACTION_CONFIG[action.type];
                  const Icon = config.icon;
                  return (
                    <button
                      key={action.type}
                      onClick={action.onClick}
                      disabled={action.disabled || action.loading}
                      className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${config.className}`}
                    >
                      {action.type !== 'cancel' && <Icon size={16} />}
                      {t(config.labelKey)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
