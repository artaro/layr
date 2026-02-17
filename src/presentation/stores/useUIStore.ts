import { create } from 'zustand';

interface UIStoreState {
  sidebarOpen: boolean;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
}

interface UIStoreActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  showSnackbar: (message: string, severity?: UIStoreState['snackbar']['severity']) => void;
  hideSnackbar: () => void;
}

type UIStore = UIStoreState & UIStoreActions;

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
  },

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) =>
    set({ sidebarOpen: open }),

  showSnackbar: (message, severity = 'info') =>
    set({ snackbar: { open: true, message, severity } }),

  hideSnackbar: () =>
    set((state) => ({
      snackbar: { ...state.snackbar, open: false },
    })),
}));
