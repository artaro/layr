'use client';

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import CategoryIcon from '@mui/icons-material/Category';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SIDEBAR_WIDTH, APP_NAME } from '@/lib/constants';

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, href: '/expenses', emoji: '📊' },
  { label: 'Transactions', icon: <ReceiptLongIcon />, href: '/expenses/transactions', emoji: '💸' },
  { label: 'Categories', icon: <CategoryIcon />, href: '/expenses/categories', emoji: '🏷️' },
  { label: 'Accounts', icon: <AccountBalanceIcon />, href: '/expenses/accounts', emoji: '🏦' },
];

export default function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
          }}
        >
          💜
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
            {APP_NAME}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
            Expense Tracker
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1.5, mt: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 2,
                  backgroundColor: isActive ? 'rgba(108, 92, 231, 0.08)' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: isActive
                      ? 'rgba(108, 92, 231, 0.12)'
                      : 'rgba(108, 92, 231, 0.04)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    fontSize: '1.1rem',
                  }}
                >
                  <Typography sx={{ fontSize: '1.2rem' }}>{item.emoji}</Typography>
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      borderRadius: 2,
                      backgroundColor: 'primary.main',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom section */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            background: 'linear-gradient(135deg, rgba(108,92,231,0.06), rgba(162,155,254,0.06))',
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: '1.6rem', mb: 0.5 }}>🚀</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            Pro features coming soon!
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '2px 0 16px rgba(108, 92, 231, 0.04)',
          backgroundColor: 'background.paper',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
