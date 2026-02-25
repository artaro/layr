'use client';

import React, { useState } from 'react';
import { useStatementImport } from '@/features/import/hooks/useStatementImport';
import { Account, Category } from '@/features/expenses/types';
import { formatCurrency, formatDate } from '@/shared/lib/formatters';
import { FileUploadZone, CentralModal } from '@/shared/components';
import ImportPreviewCards from './ImportPreviewCards';
import { X, AlertCircle, FileText, Loader2, RotateCcw, ArrowRight, Trash2, Eye, Send } from 'lucide-react';
import { useUIStore } from '@/shared/stores';
import { useTranslation } from '@/shared/lib/i18n';
import { ConfirmDialog } from '@/shared/components';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
}

export default function ImportDialog({ open, onClose, accounts, categories }: ImportDialogProps) {
  const { showSnackbar } = useUIStore();
  const { t } = useTranslation();
  const [targetAccountId, setTargetAccountId] = useState<string>('');
  
  // Selection & Batch State (Lifted from ImportPreviewCards)
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [batchCategory, setBatchCategory] = useState<string>('');
  const [showStartOverConfirm, setShowStartOverConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const FILL_IN_LATER_CATEGORY = 'a537a81c-22b4-4d01-b24c-e56ad5ba05a6';
  
  const {
    file,
    status,
    transactions,
    setTransactions,
    pdfPassword: password,
    setPdfPassword: setPassword,
    handleFileSelect,
    reset,
    parseWithLLM: handleParse,
    importTransactions: handleImport,
    hasLastImport,
    loadLastImport,
  } = useStatementImport();

  // Auto-assign fill-in-later category to all uncategorized transactions
  const autoAssignCategory = (txs: typeof transactions) => {
    return txs.map(tx => ({
      ...tx,
      category: tx.category || FILL_IN_LATER_CATEGORY,
    }));
  };

  const handleClose = () => {
    reset();
    setTargetAccountId('');
    setSelectedIndices(new Set());
    setShowReview(false);
    setShowCloseConfirm(false);
    onClose();
  };

  // Guard backdrop click — confirm if there's parsed data
  const handleBackdropClick = () => {
    if (status === 'ready' && transactions.length > 0) {
      setShowCloseConfirm(true);
    } else {
      handleClose();
    }
  };

  // --- Start Over with Confirm ---
  const handleStartOverClick = () => {
    setShowStartOverConfirm(true);
  };

  const handleConfirmStartOver = () => {
    setShowStartOverConfirm(false);
    setShowReview(false);
    reset();
  };

  // --- Batch Handlers ---
  const handleSelectOne = (index: number) => {
    // Enforce single type selection logic
    const currentSelectedType = getSelectedType();
    const newTxType = transactions[index].type;
    
    if (currentSelectedType && currentSelectedType !== newTxType && selectedIndices.size > 0) {
       return; 
    }

    const next = new Set(selectedIndices);
    if (next.has(index)) {
        next.delete(index);
    } else {
        next.add(index);
    }
    setSelectedIndices(next);
  };

  const getSelectedType = (): 'income' | 'expense' | null => {
    if (selectedIndices.size === 0) return null;
    const firstIdx = Array.from(selectedIndices)[0];
    return transactions[firstIdx]?.type || null;
  };

  const handleSelectAllOfType = (type: 'income' | 'expense', indices: number[]) => {
    const currentSelectedType = getSelectedType();
    if (currentSelectedType && currentSelectedType !== type) return;

    // Check if all are currently selected
    const allSelected = indices.every(i => selectedIndices.has(i));
    const next = new Set(selectedIndices);
    
    if (allSelected) {
       indices.forEach(i => next.delete(i));
    } else {
       indices.forEach(i => next.add(i));
    }
    setSelectedIndices(next);
  };

  const handleBatchCategoryChange = (categoryId: string) => {
    if (!categoryId) return;
    const next = [...transactions];
    selectedIndices.forEach((i) => { next[i] = { ...next[i], category: categoryId }; });
    setTransactions(next);
    setBatchCategory('');
    setSelectedIndices(new Set());
  };

  const handleDeleteBatch = () => {
    if (confirm(t('import.deleteSelected', { count: selectedIndices.size }))) {
      const next = transactions.filter((_, i) => !selectedIndices.has(i));
      setTransactions(next);
      setSelectedIndices(new Set());
    }
  };

  // Show review step
  const handleShowReview = () => {
    if (!targetAccountId) {
      showSnackbar(t('import.selectAccountFirst'), 'error');
      return;
    }
    // Auto-assign category before review
    setTransactions(autoAssignCategory(transactions));
    setShowReview(true);
  };

  const onImport = async () => {
    if (!targetAccountId) {
      showSnackbar(t('import.selectAccountFirst'), 'error');
      return;
    }
    await handleImport(targetAccountId);
    handleClose();
    showSnackbar(t('import.importSuccess'), 'success');
  };

  // Review summary calculations
  const reviewExpenses = transactions.filter(tx => tx.type === 'expense');
  const reviewIncomes = transactions.filter(tx => tx.type === 'income');
  const reviewExpenseTotal = reviewExpenses.reduce((s, tx) => s + tx.amount, 0);
  const reviewIncomeTotal = reviewIncomes.reduce((s, tx) => s + tx.amount, 0);

  if (!open) return null;

  const selectedType = getSelectedType();

  // ── Derive current modal props based on state ──
  const getTitle = () => {
    if (selectedIndices.size > 0) return undefined;
    if (status === 'ready' && showReview) return undefined;
    if (status === 'ready') return undefined;
    return t('import.title');
  };

  const getTitleNode = () => {
    if (selectedIndices.size > 0) {
      return (
        <div className="flex items-center gap-3">
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {selectedIndices.size} {t('common.selected')}
          </span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            {selectedType === 'income' ? t('transactions.income') : t('transactions.expense')}
          </span>
        </div>
      );
    }
    if (status === 'ready' && showReview) {
      return <span className="text-sm font-bold text-emerald-700">📋 {t('import.reviewTitle')}</span>;
    }
    if (status === 'ready') {
      return (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('import.targetAccount')}</span>
            <select
              value={targetAccountId}
              onChange={(e) => setTargetAccountId(e.target.value)}
              className="text-sm font-medium bg-transparent border-none p-0 pr-6 focus:ring-0 cursor-pointer text-gray-900"
            >
              <option value="">{t('import.selectAccount')}</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>
          <div className="h-8 w-px bg-gray-300 mx-2" />
          <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
            {transactions.length} {t('import.items')}
          </span>
        </div>
      );
    }
    return undefined;
  };

  const getHeaderAction = () => {
    if (selectedIndices.size > 0) {
      return (
        <div className="flex items-center gap-2">
          <select 
            value={batchCategory}
            onChange={(e) => handleBatchCategoryChange(e.target.value)}
            className="text-sm py-1.5 pl-3 pr-8 rounded-lg border-gray-300 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-[160px]"
          >
            <option value="">{t('transactions.setCategory')}</option>
            {categories.filter(c => c.type === selectedType).map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
          <button 
            onClick={handleDeleteBatch}
            className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title={t('common.delete')}
          >
            <Trash2 size={18} />
          </button>
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <button 
            onClick={() => setSelectedIndices(new Set())}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {t('common.cancel')}
          </button>
        </div>
      );
    }
    // No custom header action for other states — CentralModal shows X by default
    return undefined;
  };

  const getHeaderClassName = () => {
    if (selectedIndices.size > 0) return 'bg-indigo-50/90 backdrop-blur-md';
    if (status === 'ready' && showReview) return 'bg-emerald-50/80 backdrop-blur-md';
    return 'bg-gray-50/80 backdrop-blur-md';
  };

  const getFooterNode = () => {
    if (status === 'ready' && showReview) {
      return (
        <>
          <button 
            onClick={() => setShowReview(false)}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← {t('common.back')}
          </button>
          <button 
            onClick={onImport}
            disabled={!targetAccountId}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-200 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            {t('import.submit')} <Send size={16} />
          </button>
        </>
      );
    }
    if (status === 'ready' && !showReview && selectedIndices.size === 0) {
      return (
        <>
          <button 
            onClick={handleStartOverClick}
            className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t('import.startOver')}
          </button>
          <button 
            onClick={handleShowReview}
            disabled={!targetAccountId}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-200 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            {t('import.review')} <ArrowRight size={16} />
          </button>
        </>
      );
    }
    return undefined;
  };

  return (
    <>
      <CentralModal
        open={open}
        onClose={handleBackdropClick}
        size="xl"
        title={getTitle()}
        titleNode={getTitleNode()}
        headerAction={getHeaderAction()}
        headerClassName={getHeaderClassName()}
        footerNode={getFooterNode()}
      >
        {/* ── Idle: File Upload ── */}
        {status === 'idle' && (
          <div className="max-w-xl mx-auto space-y-6">
            <FileUploadZone 
              onFileSelect={handleFileSelect} 
              selectedFile={file} 
              onClear={reset} 
            />
            
            {file && (
              <div className="animate-fade-in space-y-4">
                {file.type === 'application/pdf' && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3">
                     <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                     <div className="space-y-2">
                        <p className="text-sm text-amber-800 font-medium">{t('import.passwordProtected')}</p>
                        <input 
                          type="password" 
                          placeholder={t('import.enterPassword')} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                     </div>
                  </div>
                )}
                <button
                  onClick={handleParse}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  {t('import.parseStatement')}
                </button>
              </div>
            )}

            {hasLastImport && !file && (
               <div className="flex justify-center">
                 <button 
                   onClick={loadLastImport}
                   className="text-sm text-indigo-600 font-medium hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                 >
                   <RotateCcw size={14} />
                   {t('import.restoreLastSession')}
                 </button>
               </div>
            )}
          </div>
        )}

        {/* ── Reading ── */}
        {status === 'reading' && (
           <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
             <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
             <div>
                <h3 className="text-lg font-bold text-gray-900">{t('import.analyzingStatement')}</h3>
                <p className="text-gray-500">{t('import.extractingWithAI')}</p>
             </div>
           </div>
        )}

        {/* ── Parsing ── */}
        {status === 'parsing' && (
           <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
             <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
             <div>
                <h3 className="text-lg font-bold text-gray-900">{t('import.structuringData')}</h3>
                <p className="text-gray-500">{t('import.almostThere')}</p>
             </div>
           </div>
        )}

        {/* ── Ready: Data Management ── */}
        {status === 'ready' && !showReview && (
           <ImportPreviewCards 
              transactions={transactions}
              onTransactionsChange={setTransactions}
              categories={categories}
              selectedIndices={selectedIndices}
              onSelectOne={handleSelectOne}
              onSelectAllOfType={handleSelectAllOfType}
              selectedType={selectedType}
            />
        )}

        {/* ── Ready: Review ── */}
        {status === 'ready' && showReview && (
          <div className="animate-fade-in space-y-6">
            {/* Summary Panel */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-teal-50/60 rounded-xl p-3 border border-teal-100">
                <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">{t('transactions.income')}</div>
                <div className="text-lg font-bold text-teal-700">+{formatCurrency(reviewIncomeTotal)}</div>
                <div className="text-xs text-teal-500 mt-0.5">{reviewIncomes.length} {t('import.items')}</div>
              </div>
              <div className="bg-rose-50/60 rounded-xl p-3 border border-rose-100">
                <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">{t('transactions.expense')}</div>
                <div className="text-lg font-bold text-rose-700">-{formatCurrency(reviewExpenseTotal)}</div>
                <div className="text-xs text-rose-500 mt-0.5">{reviewExpenses.length} {t('import.items')}</div>
              </div>
            </div>

            {/* Per-Category Breakdown */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('import.categoryBreakdown')}</div>
              <div className="space-y-1.5">
                {(() => {
                  const catMap = new Map<string, { icon: string; name: string; income: number; expense: number }>();
                  transactions.forEach(tx => {
                    const cat = categories.find(c => c.id === tx.category);
                    const key = tx.category || '_none';
                    const existing = catMap.get(key) || { icon: cat?.icon || '📦', name: cat?.name || '-', income: 0, expense: 0 };
                    if (tx.type === 'income') existing.income += tx.amount;
                    else existing.expense += tx.amount;
                    catMap.set(key, existing);
                  });
                  return Array.from(catMap.entries()).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <span>{val.icon}</span>
                        <span className="font-medium">{val.name}</span>
                      </span>
                      <div className="flex items-center gap-3">
                        {val.income > 0 && <span className="text-teal-600 font-semibold">+{formatCurrency(val.income)}</span>}
                        {val.expense > 0 && <span className="text-rose-600 font-semibold">-{formatCurrency(val.expense)}</span>}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Income Table */}
            {reviewIncomes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <h3 className="font-bold text-gray-900 text-sm">{t('transactions.income')} ({reviewIncomes.length})</h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-2 py-1.5 font-semibold text-gray-500 whitespace-nowrap">{t('txForm.date')}</th>
                        <th className="text-left px-2 py-1.5 font-semibold text-gray-500">{t('txForm.category')}</th>
                        <th className="text-left px-2 py-1.5 font-semibold text-gray-500">{t('txForm.description')}</th>
                        <th className="text-right px-2 py-1.5 font-semibold text-gray-500">{t('txForm.amount')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewIncomes.map((tx, i) => {
                        const cat = categories.find(c => c.id === tx.category);
                        const d = new Date(tx.date + (tx.time ? `T${tx.time}` : ''));
                        const dd = String(d.getDate()).padStart(2, '0');
                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                        const yyyy = d.getFullYear();
                        const time = tx.time ? ` ${tx.time.slice(0, 5)}` : '';
                        const dateStr = `${dd}/${mm}/${yyyy}${time}`;
                        return (
                          <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="px-2 py-1.5 text-gray-500 whitespace-nowrap">{dateStr}</td>
                            <td className="px-2 py-1.5 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 text-gray-700">
                                {cat?.icon && <span>{cat.icon}</span>}
                                <span className="hidden md:inline">{cat?.name || '-'}</span>
                              </span>
                            </td>
                            <td className="px-2 py-1.5 text-gray-900 truncate max-w-[100px] md:max-w-[200px]">{tx.description}</td>
                            <td className="px-2 py-1.5 text-right font-bold text-teal-600 whitespace-nowrap">+{formatCurrency(tx.amount)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-teal-50/50 border-t border-teal-100">
                        <td colSpan={3} className="px-2 py-1.5 font-bold text-gray-700 text-xs uppercase">{t('import.incomeTotal')}</td>
                        <td className="px-2 py-1.5 text-right font-bold text-teal-600">+{formatCurrency(reviewIncomeTotal)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Expense Table */}
            {reviewExpenses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <h3 className="font-bold text-gray-900 text-sm">{t('transactions.expense')} ({reviewExpenses.length})</h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-2 py-1.5 font-semibold text-gray-500 whitespace-nowrap">{t('txForm.date')}</th>
                        <th className="text-left px-2 py-1.5 font-semibold text-gray-500">{t('txForm.category')}</th>
                        <th className="text-left px-2 py-1.5 font-semibold text-gray-500">{t('txForm.description')}</th>
                        <th className="text-right px-2 py-1.5 font-semibold text-gray-500">{t('txForm.amount')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewExpenses.map((tx, i) => {
                        const cat = categories.find(c => c.id === tx.category);
                        const d = new Date(tx.date + (tx.time ? `T${tx.time}` : ''));
                        const dd = String(d.getDate()).padStart(2, '0');
                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                        const yyyy = d.getFullYear();
                        const time = tx.time ? ` ${tx.time.slice(0, 5)}` : '';
                        const dateStr = `${dd}/${mm}/${yyyy}${time}`;
                        return (
                          <tr key={i} className="border-b border-gray-50 last:border-0">
                            <td className="px-2 py-1.5 text-gray-500 whitespace-nowrap">{dateStr}</td>
                            <td className="px-2 py-1.5 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 text-gray-700">
                                {cat?.icon && <span>{cat.icon}</span>}
                                <span className="hidden md:inline">{cat?.name || '-'}</span>
                              </span>
                            </td>
                            <td className="px-2 py-1.5 text-gray-900 truncate max-w-[100px] md:max-w-[200px]">{tx.description}</td>
                            <td className="px-2 py-1.5 text-right font-bold text-rose-600 whitespace-nowrap">-{formatCurrency(tx.amount)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-rose-50/50 border-t border-rose-100">
                        <td colSpan={3} className="px-2 py-1.5 font-bold text-gray-700 text-xs uppercase">{t('import.expenseTotal')}</td>
                        <td className="px-2 py-1.5 text-right font-bold text-rose-600">-{formatCurrency(reviewExpenseTotal)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
           <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center animate-fade-in">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-2">
               <AlertCircle size={32} />
             </div>
             <div>
                <h3 className="text-lg font-bold text-gray-900">{t('import.errorTitle')}</h3>
                <p className="text-gray-500 max-w-sm mx-auto">{t('import.errorDesc')}</p>
             </div>
             <button onClick={reset} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors">
               {t('import.tryAgain')}
             </button>
           </div>
        )}
      </CentralModal>

      {/* Start Over Confirm Modal */}
      <ConfirmDialog
        open={showStartOverConfirm}
        title={t('import.confirmStartOver')}
        message={t('import.confirmStartOverMsg')}
        confirmLabel={t('import.startOver')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmStartOver}
        onCancel={() => setShowStartOverConfirm(false)}
      />

      {/* Close Confirm */}
      <ConfirmDialog
        open={showCloseConfirm}
        title={t('import.confirmClose')}
        message={t('import.confirmCloseMsg')}
        confirmLabel={t('common.confirm')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleClose}
        onCancel={() => setShowCloseConfirm(false)}
      />
    </>
  );
}

