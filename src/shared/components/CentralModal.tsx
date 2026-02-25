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
    className: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200',
  },
  edit: {
    icon: Edit2,
    labelKey: 'common.edit',
    className: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200',
  },
  delete: {
    icon: Trash2,
    labelKey: 'common.delete',
    className: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200',
  },
  cancel: {
    icon: ArrowLeft,
    labelKey: 'common.cancel',
    className: 'bg-transparent hover:bg-gray-100 text-gray-600',
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
        className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full ${SIZE_MAP[size]} max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200`}
      >
        {/* ── Header ── */}
        <div
          className={`px-6 py-3 border-b border-gray-100 flex items-center justify-between gap-4 flex-shrink-0 ${
            headerClassName || 'bg-gray-50/80 backdrop-blur-md'
          }`}
        >
          {/* Left: title */}
          <div className="flex items-center gap-3 min-w-0">
            {titleNode || (
              <h2 className="text-base font-bold text-gray-900 truncate">
                {title}
              </h2>
            )}
          </div>

          {/* Right: custom action or close button */}
          {headerAction || (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gray-50/30">
          {children}
        </div>

        {/* ── Footer ── */}
        {hasFooter && (
          <div className="px-6 py-3 border-t border-gray-100 bg-white flex items-center justify-between gap-3 flex-shrink-0 rounded-b-2xl">
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
                      className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${config.className}`}
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
