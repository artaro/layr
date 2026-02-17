'use client';

import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export default function GlobalLoader() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  // Show if any query or mutation is in progress
  // We can filter specific queries if needed to avoid blocking on background polling
  const isLoading = isFetching > 0 || isMutating > 0;

  if (!isLoading) return null;

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 9999, // High z-index to cover everything
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent dim
        backdropFilter: 'blur(4px)', // Nice blur effect
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" size={60} thickness={4} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          Processing...
        </Typography>
        {isMutating > 0 && (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Saving changes
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
}
