import { parseCsvFile, toTransactionInputs, CsvColumnMapping } from '@/infrastructure/parsers/csvParser';
import { TransactionType, StatementSource } from '@/domain/enums';

describe('csvParser', () => {
  const defaultMapping: CsvColumnMapping = {
    dateColumn: 'Date',
    descriptionColumn: 'Description',
    amountColumn: 'Amount',
  };

  describe('parseCsvFile', () => {
    it('should parse valid CSV with positive (income) and negative (expense) amounts', () => {
      const csv = `Date,Description,Amount
2026-01-15,Salary,45000
2026-01-16,Lunch,-250
2026-01-17,Coffee,-120`;

      const result = parseCsvFile(csv, defaultMapping);

      expect(result.transactions).toHaveLength(3);
      expect(result.totalRows).toBe(3);
      expect(result.skippedRows).toBe(0);

      // Positive = income
      expect(result.transactions[0].type).toBe(TransactionType.INCOME);
      expect(result.transactions[0].amount).toBe(45000);
      expect(result.transactions[0].description).toBe('Salary');

      // Negative = expense
      expect(result.transactions[1].type).toBe(TransactionType.EXPENSE);
      expect(result.transactions[1].amount).toBe(250);

      expect(result.transactions[2].type).toBe(TransactionType.EXPENSE);
      expect(result.transactions[2].amount).toBe(120);
    });

    it('should skip rows with empty or zero amount', () => {
      const csv = `Date,Description,Amount
2026-01-15,Salary,45000
2026-01-16,Empty,
2026-01-17,Zero,0`;

      const result = parseCsvFile(csv, defaultMapping);

      expect(result.transactions).toHaveLength(1);
      expect(result.skippedRows).toBe(2);
    });

    it('should handle comma-separated numbers in amounts', () => {
      const csv = `Date,Description,Amount
2026-01-15,Big purchase,-1,250.50`;

      const result = parseCsvFile(csv, defaultMapping);

      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0].amount).toBe(1250.50);
    });

    it('should use type column if provided', () => {
      const csv = `Date,Description,Amount,Type
2026-01-15,Salary,45000,income
2026-01-16,Coffee,120,expense`;

      const mappingWithType: CsvColumnMapping = {
        ...defaultMapping,
        typeColumn: 'Type',
      };

      const result = parseCsvFile(csv, mappingWithType);

      expect(result.transactions[0].type).toBe(TransactionType.INCOME);
      expect(result.transactions[1].type).toBe(TransactionType.EXPENSE);
    });

    it('should return headers from CSV', () => {
      const csv = `Date,Description,Amount,Category
2026-01-15,Test,100,Food`;

      const result = parseCsvFile(csv, defaultMapping);

      expect(result.headers).toContain('Date');
      expect(result.headers).toContain('Description');
      expect(result.headers).toContain('Amount');
      expect(result.headers).toContain('Category');
    });

    it('should generate reference IDs for deduplication', () => {
      const csv = `Date,Description,Amount
2026-01-15,Test1,100
2026-01-15,Test2,200`;

      const result = parseCsvFile(csv, defaultMapping);

      expect(result.transactions[0].referenceId).toBeTruthy();
      expect(result.transactions[1].referenceId).toBeTruthy();
      expect(result.transactions[0].referenceId).not.toBe(result.transactions[1].referenceId);
    });

    it('should parse DD/MM/YYYY date format', () => {
      const csv = `Date,Description,Amount
17/02/2026,Thai bank format,500`;

      const result = parseCsvFile(csv, defaultMapping);

      expect(result.transactions[0].date).toBe('2026-02-17');
    });
  });

  describe('toTransactionInputs', () => {
    it('should convert parsed transactions to CreateTransactionInput array', () => {
      const csv = `Date,Description,Amount
2026-01-15,Salary,45000
2026-01-16,Coffee,-120`;

      const parseResult = parseCsvFile(csv, defaultMapping);
      const inputs = toTransactionInputs(parseResult.transactions, 'account-123');

      expect(inputs).toHaveLength(2);
      expect(inputs[0].accountId).toBe('account-123');
      expect(inputs[0].source).toBe(StatementSource.CSV_IMPORT);
      expect(inputs[0].amount).toBe(45000);
      expect(inputs[1].amount).toBe(120);
    });
  });
});
