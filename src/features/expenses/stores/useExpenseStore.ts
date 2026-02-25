import { create } from 'zustand';
import { TransactionType } from '@/features/expenses/types';

interface ExpenseStoreState {
  // Filters
  selectedAccountId: string | null;
  selectedCategoryId: string | null;
  selectedType: TransactionType | null;
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  searchQuery: string;
  currentPage: number;
  pageSize: number;
}

interface ExpenseStoreActions {
  setSelectedAccountId: (id: string | null) => void;
  setSelectedCategoryId: (id: string | null) => void;
  setSelectedType: (type: TransactionType | null) => void;
  setDateRange: (startDate: string | null, endDate: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetFilters: () => void;
}

type ExpenseStore = ExpenseStoreState & ExpenseStoreActions;

const initialState: ExpenseStoreState = {
  selectedAccountId: null,
  selectedCategoryId: null,
  selectedType: null,
  dateRange: {
    startDate: null,
    endDate: null,
  },
  searchQuery: '',
  currentPage: 1,
  pageSize: 20,
};

export const useExpenseStore = create<ExpenseStore>((set) => ({
  ...initialState,

  setSelectedAccountId: (id) =>
    set({ selectedAccountId: id, currentPage: 1 }),

  setSelectedCategoryId: (id) =>
    set({ selectedCategoryId: id, currentPage: 1 }),

  setSelectedType: (type) =>
    set({ selectedType: type, currentPage: 1 }),

  setDateRange: (startDate, endDate) =>
    set({ dateRange: { startDate, endDate }, currentPage: 1 }),

  setSearchQuery: (query) =>
    set({ searchQuery: query, currentPage: 1 }),

  setCurrentPage: (page) =>
    set({ currentPage: page }),

  setPageSize: (size) =>
    set({ pageSize: size, currentPage: 1 }),

  resetFilters: () =>
    set(initialState),
}));
