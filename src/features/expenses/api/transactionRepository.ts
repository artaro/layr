import { supabase } from '@/config/supabase';
import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
  TransactionSummary,
} from '@/features/expenses/types';

interface PaginatedResult<T> {
  data: T[];
  count: number;
}

function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }
  return result;
}

function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = obj[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[camelKey] = toCamelCase(value as Record<string, unknown>);
    } else {
      result[camelKey] = value;
    }
  }
  return result as T;
}

export const transactionRepository = {
  async getAll(
    userId: string,
    filter?: TransactionFilter
  ): Promise<PaginatedResult<Transaction>> {
    let query = supabase
      .from('transactions')
      .select('*, category:categories(*), account:accounts(*)', { count: 'exact' })
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (filter?.accountId) {
      query = query.eq('account_id', filter.accountId);
    }
    if (filter?.categoryId) {
      query = query.eq('category_id', filter.categoryId);
    }
    if (filter?.type) {
      query = query.eq('type', filter.type);
    }
    if (filter?.startDate) {
      query = query.gte('transaction_date', filter.startDate);
    }
    if (filter?.endDate) {
      query = query.lte('transaction_date', filter.endDate);
    }
    if (filter?.search) {
      query = query.ilike('description', `%${filter.search}%`);
    }

    // Pagination
    const page = filter?.page || 1;
    const pageSize = filter?.pageSize || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
      data: (data || []).map((row) => toCamelCase<Transaction>(row as Record<string, unknown>)),
      count: count || 0,
    };
  },

  async getById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:categories(*), account:accounts(*)')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data ? toCamelCase<Transaction>(data as Record<string, unknown>) : null;
  },

  async create(
    userId: string,
    input: CreateTransactionInput
  ): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...toSnakeCase(input as unknown as Record<string, unknown>),
        user_id: userId,
      })
      .select('*, category:categories(*), account:accounts(*)')
      .single();

    if (error) throw new Error(error.message);
    return toCamelCase<Transaction>(data as Record<string, unknown>);
  },

  async createBulk(
    userId: string,
    inputs: CreateTransactionInput[]
  ): Promise<Transaction[]> {
    const rows = inputs.map((input) => ({
      ...toSnakeCase(input as unknown as Record<string, unknown>),
      user_id: userId,
    }));

    const { data, error } = await supabase
      .from('transactions')
      .insert(rows)
      .select();

    if (error) throw new Error(error.message);
    return (data || []).map((row) => toCamelCase<Transaction>(row as Record<string, unknown>));
  },

  async update(
    id: string,
    input: UpdateTransactionInput
  ): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(toSnakeCase(input as unknown as Record<string, unknown>))
      .eq('id', id)
      .select('*, category:categories(*), account:accounts(*)')
      .single();

    if (error) throw new Error(error.message);
    return toCamelCase<Transaction>(data as Record<string, unknown>);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async getSummary(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<TransactionSummary> {
    let query = supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', userId);

    if (startDate) query = query.gte('transaction_date', startDate);
    if (endDate) query = query.lte('transaction_date', endDate);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const rows = data || [];
    let totalIncome = 0;
    let totalExpense = 0;

    rows.forEach((row) => {
      if (row.type === 'income') {
        totalIncome += Number(row.amount);
      } else {
        totalExpense += Number(row.amount);
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: rows.length,
    };
  },
};
