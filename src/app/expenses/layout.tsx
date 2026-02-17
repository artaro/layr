'use client';

import React, { useState, useEffect } from 'react';
import { Box, Toolbar, CircularProgress, Typography } from '@mui/material';
import { AppSidebar, AppHeader } from '@/presentation/components/layout';
import { SIDEBAR_WIDTH } from '@/lib/constants';
import TransactionFAB from '@/presentation/components/expenses/TransactionFAB';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Track client-side mount to prevent SSR hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated (in useEffect to avoid setState during render)
  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push('/login');
    }
  }, [mounted, loading, user, router]);

  // Show loading while checking auth, waiting for mount, or waiting for redirect
  if (!mounted || loading || !user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          background: 'linear-gradient(135deg, #F8F7FF 0%, #EDE8FF 50%, #F0EEFF 100%)',
        }}
      >
        <CircularProgress sx={{ color: '#6C5CE7' }} />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
        }}
      >
        <AppHeader onMenuClick={() => setSidebarOpen(true)} />
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
      <TransactionFAB />
    </Box>
  );
}
