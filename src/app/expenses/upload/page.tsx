'use client';

import React, { useState } from 'react';
import { 
  CloudUpload, 
  Map as MapIcon, 
  Eye, 
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { FileUploadZone } from '@/shared/components';
import {
  CsvColumnMapping,
  CsvParseResult,
  parseCsvFile,
} from '@/features/import/parsers/csvParser';
import { TransactionType, StatementSource } from '@/features/expenses/types';
import { formatCurrency } from '@/shared/lib/formatters';
import { useAccounts, useCreateTransactionsBulk } from '@/features/expenses';
import { CreateTransactionInput } from '@/features/expenses/types';

export default function UploadPage() {
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const bulkCreateMutation = useCreateTransactionsBulk();

  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [mapping, setMapping] = useState<CsvColumnMapping>({
    dateColumn: '',
    descriptionColumn: '',
    amountColumn: '',
  });
  const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'done'>('upload');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);

    // Read file to get headers
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const firstLine = text.split('\n')[0];
      const headers = firstLine
        .split(',')
        .map((h) => h.trim().replace(/"/g, ''));

      // Auto-map if headers match common patterns
      const autoMapping: CsvColumnMapping = {
        dateColumn: headers.find((h) => /date/i.test(h)) || headers[0] || '',
        descriptionColumn:
          headers.find((h) => /desc|detail|memo|narration/i.test(h)) ||
          headers[1] ||
          '',
        amountColumn:
          headers.find((h) => /amount|value|sum/i.test(h)) ||
          headers[2] ||
          '',
      };
      setMapping(autoMapping);
      setStep('map');
    };
    reader.readAsText(selectedFile);
  };

  const handleParse = async () => {
    if (!file) return;

    try {
      const text = await file.text();
      const result = parseCsvFile(text, mapping);

      if (result.transactions.length === 0) {
        setError('No valid transactions found. Check your column mapping.');
        return;
      }

      setParseResult(result);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  };

  const handleImport = async () => {
    if (!selectedAccount || !parseResult) return;

    try {
      const inputs: CreateTransactionInput[] = parseResult.transactions.map(
        (tx) => ({
          accountId: selectedAccount,
          amount: tx.amount,
          type: tx.type as TransactionType,
          description: tx.description,
          transactionDate: tx.date,
          source: StatementSource.CSV_IMPORT,
        })
      );

      await bulkCreateMutation.mutateAsync(inputs);
      setStep('done');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to import transactions'
      );
    }
  };

  const handleReset = () => {
    setFile(null);
    setParseResult(null);
    setSelectedAccount('');
    setMapping({ dateColumn: '', descriptionColumn: '', amountColumn: '' });
    setStep('upload');
    setError(null);
  };

  const steps = [
      { id: 'upload', label: 'Upload', icon: <CloudUpload size={16} /> },
      { id: 'map', label: 'Map Columns', icon: <MapIcon size={16} /> },
      { id: 'preview', label: 'Preview', icon: <Eye size={16} /> },
      { id: 'done', label: 'Done', icon: <CheckCircle size={16} /> }
  ];

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1 font-[var(--font-brand)] uppercase tracking-wider">
          Upload Statement 📄
        </h1>
        <p className="text-[var(--color-text-secondary)] font-bold">
          Import transactions from your bank or credit card CSV
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex flex-wrap gap-2">
        {steps.map((s, index) => {
          const stepIndex = steps.findIndex(st => st.id === step);
          const isActive = stepIndex >= index;
          return (
            <div
              key={s.id}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-bold transition-all border-2 ${
                  isActive 
                  ? 'bg-[var(--color-primary)] text-[var(--color-surface)] border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)]' 
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] opacity-50'
              }`}
            >
              <span className="opacity-80">{s.icon}</span>
              {index + 1}. {s.label}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="bg-[var(--color-expense)]/10 border-2 border-[var(--color-expense)] text-[var(--color-expense)] p-4 flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] p-6 sm:p-8">
            <FileUploadZone
              accept=".csv"
              onFileSelect={handleFileSelect}
              selectedFile={file}
              onClear={() => {
                setFile(null);
                setStep('upload');
              }}
            />
        </div>
      )}

      {/* Step 2: Map columns */}
      {step === 'map' && (
        <div className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2 font-[var(--font-brand)] uppercase tracking-wider">
                <MapIcon size={24} className="text-[var(--color-primary)]" />
                Map CSV Columns
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">Select Account</label>
                    <div className="relative">
                        <select
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            disabled={accountsLoading}
                            className="w-full px-4 py-3 border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-0 outline-none appearance-none bg-[var(--color-surface)] font-bold text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <option value="" disabled>Select an account...</option>
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.type === 'bank' ? '🏦' : '💳'} {acc.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" size={20} />
                    </div>
                </div>

                {file && (
                    <div className="bg-[var(--color-surface-2)] p-6 border-2 border-[var(--color-border)]">
                        <p className="text-sm text-[var(--color-text-secondary)] mb-4 flex items-center gap-2 font-bold">
                            <FileText size={16} />
                            Detected file: <strong className="text-[var(--color-text-primary)] tracking-wider truncate">{file.name}</strong>
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <MappingSelect 
                                label="Date Column" 
                                value={mapping.dateColumn}
                                onChange={(val) => setMapping({...mapping, dateColumn: val})}
                            />
                            <MappingSelect 
                                label="Description Column" 
                                value={mapping.descriptionColumn}
                                onChange={(val) => setMapping({...mapping, descriptionColumn: val})}
                            />
                            <MappingSelect 
                                label="Amount Column" 
                                value={mapping.amountColumn}
                                onChange={(val) => setMapping({...mapping, amountColumn: val})}
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <button 
                        onClick={handleReset}
                        className="px-5 py-2.5 text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] border-2 border-[var(--color-border)] uppercase tracking-wider transition-colors"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleParse}
                        disabled={!selectedAccount || !mapping.dateColumn}
                        className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-surface)] text-sm font-bold border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] transition-all active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_var(--color-border)] flex items-center gap-2 uppercase tracking-wider"
                    >
                        Parse & Preview <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && parseResult && (
        <div className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2 font-[var(--font-brand)] uppercase tracking-wider">
                    <Eye size={24} className="text-[var(--color-primary)]" />
                    Preview
                </h2>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-[var(--color-surface-2)] border-2 border-[var(--color-border)] text-[var(--color-text-primary)] font-bold uppercase tracking-wider text-xs">
                        {parseResult.totalRows} rows
                    </span>
                    {parseResult.skippedRows > 0 && (
                        <span className="px-3 py-1 bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] border-2 border-[var(--color-secondary)] text-xs font-bold uppercase tracking-wider">
                            {parseResult.skippedRows} skipped
                        </span>
                    )}
                </div>
            </div>

            <div className="border-2 border-[var(--color-border)] mb-6 shadow-[4px_4px_0px_0px_var(--color-border)]">
                <div className="overflow-x-auto max-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider bg-[var(--color-surface-2)] sticky top-0 z-10 font-bold border-b-2 border-[var(--color-border)]">
                            <tr>
                                <th className="px-4 py-3 whitespace-nowrap">Date</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parseResult.transactions.slice(0, 20).map((tx, idx) => (
                                <tr key={idx} className="hover:bg-[var(--color-surface-2)] border-b border-[var(--color-border)] last:border-0 transition-colors font-bold">
                                    <td className="px-4 py-3 text-[var(--color-text-muted)] whitespace-nowrap">{tx.date}</td>
                                    <td className="px-4 py-3 text-[var(--color-text-primary)] max-w-xs truncate" title={tx.description}>{tx.description}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 border-2 text-xs font-bold uppercase tracking-wider ${
                                            tx.type === TransactionType.INCOME 
                                            ? 'bg-[var(--color-income)]/10 text-[var(--color-income)] border-[var(--color-income)]' 
                                            : 'bg-[var(--color-expense)]/10 text-[var(--color-expense)] border-[var(--color-expense)]'
                                        }`}>
                                            {tx.type === TransactionType.INCOME ? '+ Income' : '- Expense'}
                                        </span>
                                    </td>
                                    <td className={`px-4 py-3 text-right font-bold tracking-wider ${tx.type === TransactionType.INCOME ? 'text-[var(--color-income)]' : 'text-[var(--color-expense)]'}`}>
                                        {formatCurrency(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {parseResult.transactions.length > 20 && (
                     <div className="bg-[var(--color-surface-2)] border-t-2 border-[var(--color-border)] px-4 py-2 text-xs text-center text-[var(--color-text-muted)] font-bold uppercase tracking-wider">
                         Showing 20 of {parseResult.transactions.length} transactions...
                     </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 pt-4 border-t-2 border-[var(--color-border)]">
                <button 
                    onClick={() => setStep('map')}
                    disabled={bulkCreateMutation.isPending}
                    className="px-5 py-2.5 text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] border-2 border-[var(--color-border)] uppercase tracking-wider transition-colors order-2 sm:order-1"
                >
                    <div className="flex items-center gap-2">
                        <ArrowLeft size={16} /> Back
                    </div>
                </button>
                <button 
                    onClick={handleImport}
                    disabled={bulkCreateMutation.isPending}
                    className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-surface)] text-sm font-bold border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] transition-all active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_var(--color-border)] flex items-center justify-center gap-2 order-1 sm:order-2 uppercase tracking-wider"
                >
                    {bulkCreateMutation.isPending ? (
                        <>
                            <Loader2 size={18} className="animate-spin" /> Importing...
                        </>
                    ) : (
                        <>
                            Import {parseResult.transactions.length} <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </div>
        </div>
      )}

      {/* Step 4: Done */}
      {step === 'done' && (
        <div className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] p-12 text-center">
            <div className="w-20 h-20 bg-[var(--color-primary)]/20 text-[var(--color-primary)] border-2 border-[var(--color-primary)] shadow-[4px_4px_0px_0px_var(--color-primary)] flex items-center justify-center text-4xl mx-auto mb-6">
                <CheckCircle size={40} />
            </div>
            
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2 font-[var(--font-brand)] uppercase tracking-wider">
                Import Complete! 🏁
            </h2>
            
            <p className="text-[var(--color-text-secondary)] mb-8 text-lg font-bold">
                <strong className="text-[var(--color-text-primary)] tracking-widest">{parseResult?.transactions.length}</strong> transactions have been imported successfully.
            </p>
            
            <button 
                onClick={handleReset}
                className="px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] text-[var(--color-surface)] font-bold border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-border)] transition-all active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_var(--color-border)] uppercase tracking-wider"
            >
                Upload Another
            </button>
        </div>
      )}
    </div>
  );
}

function MappingSelect({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div>
            <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5 ml-1">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-0 outline-none appearance-none bg-[var(--color-surface)] font-bold text-sm text-[var(--color-text-primary)] truncate transition-colors"
                >
                    <option value={value}>{value || 'Auto-detected'}</option>
                    {/* In a real app we'd populate other column headers here if available */}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" size={16} />
            </div>
        </div>
    );
}
