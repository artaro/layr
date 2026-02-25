'use client';

import React, { useState } from 'react';
import { Plus, Receipt, Upload } from 'lucide-react';
import { useUIStore } from '@/shared/stores';

export default function TransactionFAB() {
  const { openTransactionModal, openImportModal } = useUIStore();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-3">
      {/* Actions */}
      <div 
        className={`flex flex-col items-end gap-3 transition-all duration-300 origin-bottom z-50 ${
          open ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        <button 
          onClick={() => {
            openImportModal();
            setOpen(false);
          }}
          className="flex items-center gap-3 group"
        >
          <span className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] px-2 py-1 text-sm font-bold text-[var(--color-text-primary)] shadow-[2px_2px_0px_0px_var(--color-primary)] transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all uppercase tracking-wider">
            Upload Statement
          </span>
          <div className="w-12 h-12 bg-[var(--color-surface)] text-[var(--color-primary)] border-2 border-[var(--color-primary)] shadow-[3px_3px_0px_0px_var(--color-primary)] flex items-center justify-center hover:shadow-[5px_5px_0px_0px_var(--color-primary)] transition-all">
            <Upload size={20} />
          </div>
        </button>

        <button 
          onClick={() => {
            openTransactionModal();
            setOpen(false);
          }}
          className="flex items-center gap-3 group"
        >
           <span className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] px-2 py-1 text-sm font-bold text-[var(--color-text-primary)] shadow-[2px_2px_0px_0px_var(--color-primary)] transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all uppercase tracking-wider">
            Add Manually
          </span>
          <div className="w-12 h-12 bg-[var(--color-surface)] text-[var(--color-primary)] border-2 border-[var(--color-primary)] shadow-[3px_3px_0px_0px_var(--color-primary)] flex items-center justify-center hover:shadow-[5px_5px_0px_0px_var(--color-primary)] transition-all">
            <Receipt size={20} />
          </div>
        </button>
      </div>

      {/* Main Button */}
      <button
        onClick={toggle}
        className={`w-14 h-14 border-2 flex items-center justify-center text-white transition-all duration-300 z-50 ${
          open 
            ? 'bg-[var(--color-text-muted)] border-[var(--color-text-muted)] rotate-45 shadow-none' 
            : 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[4px_4px_0px_0px_var(--color-border)] hover:shadow-[6px_6px_0px_0px_var(--color-border)] hover:-translate-x-0.5 hover:-translate-y-0.5'
        }`}
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
