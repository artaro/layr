'use client';

import { useState, useCallback } from 'react';
import { parseCsvFile, toTransactionInputs, CsvColumnMapping, CsvParseResult } from '@/infrastructure/parsers/csvParser';
import { useCreateTransactionsBulk } from './useTransactions';

interface UseStatementUploadReturn {
  file: File | null;
  parseResult: CsvParseResult | null;
  isUploading: boolean;
  error: string | null;
  handleFileSelect: (file: File) => void;
  parseFile: (mapping: CsvColumnMapping) => Promise<void>;
  importTransactions: (accountId: string) => Promise<void>;
  reset: () => void;
}

export function useStatementUpload(): UseStatementUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bulkCreate = useCreateTransactionsBulk();

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setParseResult(null);
    setError(null);
  }, []);

  const parseFile = useCallback(
    async (mapping: CsvColumnMapping) => {
      if (!file) {
        setError('No file selected');
        return;
      }

      try {
        const text = await file.text();
        const result = parseCsvFile(text, mapping);

        if (result.transactions.length === 0) {
          setError('No valid transactions found in the file');
          return;
        }

        setParseResult(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file');
      }
    },
    [file]
  );

  const importTransactions = useCallback(
    async (accountId: string) => {
      if (!parseResult) {
        setError('No parsed data to import');
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        const inputs = toTransactionInputs(parseResult.transactions, accountId);
        await bulkCreate.mutateAsync(inputs);
        setParseResult(null);
        setFile(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import transactions');
      } finally {
        setIsUploading(false);
      }
    },
    [parseResult, bulkCreate]
  );

  const reset = useCallback(() => {
    setFile(null);
    setParseResult(null);
    setIsUploading(false);
    setError(null);
  }, []);

  return {
    file,
    parseResult,
    isUploading,
    error,
    handleFileSelect,
    parseFile,
    importTransactions,
    reset,
  };
}
