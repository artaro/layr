'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, SxProps, Theme } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  gradient?: string;
  sx?: SxProps<Theme>;
}

export default function StatCard({ title, value, icon, trend, gradient, sx }: StatCardProps) {
  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: gradient || 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
        color: '#fff',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 12px 40px rgba(108, 92, 231, 0.25)',
        },
        ...sx,
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ opacity: 0.85, fontWeight: 500, fontSize: '0.85rem' }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {value}
        </Typography>

        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <Typography
              variant="caption"
              sx={{
                backgroundColor: trend.positive
                  ? 'rgba(85, 239, 196, 0.3)'
                  : 'rgba(255, 118, 117, 0.3)',
                px: 1,
                py: 0.25,
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Decorative circle */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
      />
    </Card>
  );
}
