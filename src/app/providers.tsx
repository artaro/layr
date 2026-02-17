'use client';

import React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClientProvider } from '@tanstack/react-query';
import { Snackbar, Alert } from '@mui/material';
import theme from '@/presentation/theme/theme';
import { queryClient } from '@/infrastructure/query/queryClient';
import { useUIStore } from '@/presentation/stores';
import GlobalLoader from '@/presentation/components/common/GlobalLoader';

function SnackbarNotifier() {
  const { snackbar, hideSnackbar } = useUIStore();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={hideSnackbar}
        severity={snackbar.severity}
        sx={{ borderRadius: 3, fontFamily: 'Outfit' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalLoader />
          {children}
          <SnackbarNotifier />
        </ThemeProvider>
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
}
