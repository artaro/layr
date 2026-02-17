import { supabase } from '@/data/datasources/supabase';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/domain/entities';

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

export const categoryRepository = {
  async getAll(userId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map((row) => toCamelCase<Category>(row as Record<string, unknown>));
  },

  async getById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data ? toCamelCase<Category>(data as Record<string, unknown>) : null;
  },

  async create(userId: string, input: CreateCategoryInput): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        ...toSnakeCase(input as unknown as Record<string, unknown>),
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return toCamelCase<Category>(data as Record<string, unknown>);
  },

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(toSnakeCase(input as unknown as Record<string, unknown>))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return toCamelCase<Category>(data as Record<string, unknown>);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};
