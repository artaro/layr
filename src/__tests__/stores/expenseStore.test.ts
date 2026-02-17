import { useExpenseStore } from '@/presentation/stores/useExpenseStore';
import { TransactionType } from '@/domain/enums';
import { act } from '@testing-library/react';

describe('useExpenseStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    act(() => {
      useExpenseStore.getState().resetFilters();
    });
  });

  it('should have correct initial state', () => {
    const state = useExpenseStore.getState();
    expect(state.selectedAccountId).toBeNull();
    expect(state.selectedCategoryId).toBeNull();
    expect(state.selectedType).toBeNull();
    expect(state.dateRange.startDate).toBeNull();
    expect(state.dateRange.endDate).toBeNull();
    expect(state.searchQuery).toBe('');
    expect(state.currentPage).toBe(1);
    expect(state.pageSize).toBe(20);
  });

  it('should set selected account ID', () => {
    act(() => {
      useExpenseStore.getState().setSelectedAccountId('acc-1');
    });
    expect(useExpenseStore.getState().selectedAccountId).toBe('acc-1');
  });

  it('should reset current page when filters change', () => {
    act(() => {
      useExpenseStore.getState().setCurrentPage(5);
    });
    expect(useExpenseStore.getState().currentPage).toBe(5);

    act(() => {
      useExpenseStore.getState().setSelectedType(TransactionType.EXPENSE);
    });
    expect(useExpenseStore.getState().currentPage).toBe(1);
  });

  it('should set date range', () => {
    act(() => {
      useExpenseStore.getState().setDateRange('2026-01-01', '2026-01-31');
    });
    const { dateRange } = useExpenseStore.getState();
    expect(dateRange.startDate).toBe('2026-01-01');
    expect(dateRange.endDate).toBe('2026-01-31');
  });

  it('should set search query and reset page', () => {
    act(() => {
      useExpenseStore.getState().setCurrentPage(3);
      useExpenseStore.getState().setSearchQuery('lunch');
    });
    expect(useExpenseStore.getState().searchQuery).toBe('lunch');
    expect(useExpenseStore.getState().currentPage).toBe(1);
  });

  it('should reset all filters to initial state', () => {
    act(() => {
      useExpenseStore.getState().setSelectedAccountId('acc-1');
      useExpenseStore.getState().setSelectedType(TransactionType.INCOME);
      useExpenseStore.getState().setSearchQuery('test');
      useExpenseStore.getState().resetFilters();
    });

    const state = useExpenseStore.getState();
    expect(state.selectedAccountId).toBeNull();
    expect(state.selectedType).toBeNull();
    expect(state.searchQuery).toBe('');
  });
});
