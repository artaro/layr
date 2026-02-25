'use client';

import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  selectedFile?: File | null;
  onClear?: () => void;
}

export default function FileUploadZone({
  onFileSelect,
  accept = '.csv,.pdf,.jpg,.jpeg,.png',
  selectedFile,
  onClear,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative group cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed transition-all duration-200 ${
        selectedFile 
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' 
          : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-2)]'
      }`}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex flex-col items-center gap-2 animate-fade-in">
          <div className="w-12 h-12 bg-[var(--color-primary)]/15 flex items-center justify-center text-[var(--color-primary)] border-2 border-[var(--color-primary)]">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {selectedFile.name}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {(selectedFile.size / 1024).toFixed(1)} KB
          </p>
          
          {onClear && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="mt-2 text-xs font-bold text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 flex items-center gap-1 px-3 py-1.5 border-2 border-[var(--color-accent)] transition-colors uppercase tracking-wider"
            >
              <X size={14} /> Remove
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-[var(--color-surface-2)] group-hover:bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors border-2 border-[var(--color-border)]">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">
            Click to upload statement
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Supports PDF, CSV, Images
          </p>
        </div>
      )}
    </div>
  );
}
