'use client';

import { useState, useCallback } from 'react';
import { useCreateTransactionsBulk } from './useTransactions';
import { CreateTransactionInput } from '@/domain/entities';
import { TransactionType, StatementSource } from '@/domain/enums';
import { generateMockTransactions } from '@/data/mock/mockStatementTransactions';

export interface ParsedLLMTransaction {
  date: string;
  time?: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string; // For manual category assignment in UI
}

type ImportStatus =
  | 'idle'
  | 'reading'
  | 'needs_password'
  | 'parsing'
  | 'ready'
  | 'importing'
  | 'done'
  | 'error';

interface UseStatementImportReturn {
  status: ImportStatus;
  file: File | null;
  transactions: ParsedLLMTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<ParsedLLMTransaction[]>>;
  error: string | null;
  pdfPassword: string;
  setPdfPassword: (pw: string) => void;
  handleFileSelect: (file: File) => void;
  parseWithLLM: () => Promise<void>;
  importTransactions: (accountId: string) => Promise<void>;
  loadDemoData: () => void;
  reset: () => void;
}

async function extractTextFromPDF(
  file: File,
  password?: string
): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');

  // Use a local worker bundled with the package — avoids CDN fetch failures
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadingTask: any = pdfjsLib.getDocument({
    data: arrayBuffer,
    ...(password ? { password } : {}),
  });

  const pdf = await loadingTask.promise;

  const textParts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.str)
      .join(' ');
    textParts.push(pageText);
  }

  return textParts.join('\n');
}

export function useStatementImport(): UseStatementImportReturn {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<ParsedLLMTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pdfPassword, setPdfPassword] = useState('');

  const bulkCreate = useCreateTransactionsBulk();

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setTransactions([]);
    setError(null);
    setPdfPassword('');
    setStatus('idle');
  }, []);

  const parseWithLLM = useCallback(async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setError(null);

    try {
      // Step 1: Read file
      setStatus('reading');
      let text: string;
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.pdf')) {
        try {
          text = await extractTextFromPDF(file, pdfPassword || undefined);
        } catch (pdfErr) {
          // Check if the error is a password-related error
          const errMsg =
            pdfErr instanceof Error ? pdfErr.message : String(pdfErr);
          if (
            errMsg.includes('password') ||
            errMsg.includes('PasswordException') ||
            errMsg.includes('Incorrect Password')
          ) {
            setStatus('needs_password');
            setError(
              pdfPassword
                ? 'Incorrect password — please try again'
                : 'This PDF is password-protected. Please enter the password.'
            );
            return;
          }
          throw pdfErr;
        }
      } else {
        // CSV or other text file
        text = await file.text();
      }

      if (!text.trim()) {
        setError('File appears to be empty or unreadable');
        setStatus('error');
        return;
      }

      // Step 2: Send to LLM API
      setStatus('parsing');
      const response = await fetch('/api/parse-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to parse statement');
      }

      const data = await response.json();

      if (!data.transactions || data.transactions.length === 0) {
        setError('No transactions found in the file');
        setStatus('error');
        return;
      }

      setTransactions(data.transactions);
      setStatus('ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setStatus('error');
    }
  }, [file, pdfPassword]);

  const loadDemoData = useCallback(() => {
    const mockData = generateMockTransactions(10);
    setTransactions(mockData);
    setStatus('ready');
    setError(null);
    setFile(null);
  }, []);

  const importTransactions = useCallback(
    async (accountId: string) => {
      if (transactions.length === 0) {
        setError('No transactions to import');
        return;
      }

      setStatus('importing');
      setError(null);

      try {
        const inputs: CreateTransactionInput[] = transactions.map((tx, i) => {
          // Combine date and time if available
          let transactionDate = tx.date;
          if (tx.time) {
            // Ensure time is in HH:mm format, append :00 for seconds
            transactionDate = `${tx.date}T${tx.time}:00`;
          }

          return {
            accountId,
            categoryId: tx.category, // Use assigned category if present
            type:
              tx.type === 'income'
                ? TransactionType.INCOME
                : TransactionType.EXPENSE,
            amount: tx.amount,
            description: tx.description,
            transactionDate,
            source: StatementSource.LLM_IMPORT,
            referenceId: `llm-${tx.date}-${tx.amount}-${i}-${Date.now()}`,
          };
        });

        await bulkCreate.mutateAsync(inputs);
        setStatus('done');
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to import transactions'
        );
        setStatus('error');
      }
    },
    [transactions, bulkCreate]
  );

  const reset = useCallback(() => {
    setFile(null);
    setTransactions([]);
    setStatus('idle');
    setError(null);
    setPdfPassword('');
  }, []);

  return {
    status,
    file,
    transactions,
    setTransactions, // Exposed for UI editing
    error,
    pdfPassword,
    setPdfPassword,
    handleFileSelect,
    parseWithLLM,
    importTransactions,
    loadDemoData,
    reset,
  };
}
