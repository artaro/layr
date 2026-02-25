import { supabase } from '@/config/supabase';
import { Account, CreateAccountInput, UpdateAccountInput } from '@/features/expenses/types';

function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result as T;
}

function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }
  return result;
}

export const accountRepository = {
  async getAll(userId: string): Promise<Account[]> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((row) => toCamelCase<Account>(row as Record<string, unknown>));
  },

  async getById(id: string): Promise<Account | null> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data ? toCamelCase<Account>(data as Record<string, unknown>) : null;
  },

  async create(userId: string, input: CreateAccountInput): Promise<Account> {
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        ...toSnakeCase(input as unknown as Record<string, unknown>),
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return toCamelCase<Account>(data as Record<string, unknown>);
  },

  async update(id: string, input: UpdateAccountInput): Promise<Account> {
    const { data, error } = await supabase
      .from('accounts')
      .update(toSnakeCase(input as unknown as Record<string, unknown>))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return toCamelCase<Account>(data as Record<string, unknown>);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};
