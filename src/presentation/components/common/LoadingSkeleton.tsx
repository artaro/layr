'use client';

import React from 'react';
import { Skeleton, Box, Card, CardContent } from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'stat';
  count?: number;
}

function StatSkeleton() {
  return (
    <Card sx={{ background: 'linear-gradient(135deg, #e8e5f5 0%, #f0eef9 100%)' }}>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width="60%" height={40} sx={{ mt: 1 }} />
        <Skeleton variant="text" width="30%" height={16} sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="50%" height={20} />
            <Skeleton variant="text" width="30%" height={16} />
          </Box>
          <Skeleton variant="text" width={80} height={24} />
        </Box>
      ))}
    </Box>
  );
}

function CardSkeleton() {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={28} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
        <Skeleton variant="rectangular" height={120} sx={{ mt: 2, borderRadius: 2 }} />
      </CardContent>
    </Card>
  );
}

export default function LoadingSkeleton({ variant = 'card', count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'stat':
        return <StatSkeleton />;
      case 'table':
        return <TableSkeleton />;
      case 'card':
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
}
