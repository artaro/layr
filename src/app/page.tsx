'use client';

import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8F7FF 0%, #EDE8FF 50%, #F0EEFF 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          py: 2,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
            }}
          >
            💜
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            LifePulse
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/expenses"
          variant="contained"
          size="small"
          endIcon={<ArrowForwardIcon />}
        >
          Open App
        </Button>
      </Box>

      {/* Hero */}
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '3rem', md: '4.5rem' },
            mb: 2,
            lineHeight: 1,
          }}
        >
          💸
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', md: '3.5rem' },
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6C5CE7, #FD79A8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Your Money, Your Rules.
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: 'text.secondary',
            maxWidth: 520,
            mb: 4,
            fontSize: { xs: '1rem', md: '1.2rem' },
            lineHeight: 1.6,
          }}
        >
          Track expenses, import bank statements, and crush your budget goals —
          all in one beautiful app designed for the way you live. ✨
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            component={Link}
            href="/expenses"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started Free
          </Button>
        </Box>

        {/* Feature cards */}
        <Grid container spacing={3} sx={{ mt: 8 }}>
          {[
            { emoji: '📊', title: 'Expense Tracking', desc: 'See where every baht goes' },
            { emoji: '📄', title: 'Import Statements', desc: 'Upload CSV from your bank' },
            { emoji: '🎯', title: 'Budget Goals', desc: 'Set targets & stay on track' },
            { emoji: '📈', title: 'Smart Charts', desc: 'Beautiful spending breakdowns' },
          ].map((feature) => (
            <Grid size={{ xs: 6, md: 3 }} key={feature.title}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(108,92,231,0.08)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 8px 32px rgba(108,92,231,0.12)',
                  },
                }}
              >
                <Typography sx={{ fontSize: '2rem', mb: 1 }}>{feature.emoji}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {feature.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {feature.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Built with 💜 by LifePulse Team • 2026
        </Typography>
      </Box>
    </Box>
  );
}
