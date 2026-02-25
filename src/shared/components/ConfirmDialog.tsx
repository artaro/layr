'use client';

import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[6px_6px_0px_0px_var(--color-accent)] w-full max-w-sm p-6 animate-fade-in">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 uppercase tracking-wider font-[var(--font-brand)]">
          {title}
        </h3>
        <p className="text-[var(--color-text-secondary)] mb-6 text-sm leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] border-2 border-[var(--color-border)] transition-colors uppercase tracking-wider"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-bold text-white bg-[var(--color-accent)] border-2 border-[var(--color-accent)] hover:shadow-[4px_4px_0px_0px_var(--color-accent)] transition-all uppercase tracking-wider"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
