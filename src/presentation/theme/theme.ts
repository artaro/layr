'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6C5CE7',
      light: '#A29BFE',
      dark: '#5A4BD1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FD79A8',
      light: '#FEB3D2',
      dark: '#E8608E',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F7FF',
      paper: '#FFFFFF',
    },
    success: {
      main: '#00CEC9',
      light: '#81ECEC',
      dark: '#00A8A4',
    },
    warning: {
      main: '#FDCB6E',
      light: '#FFEAA7',
      dark: '#E0B050',
    },
    error: {
      main: '#FF7675',
      light: '#FFB3B2',
      dark: '#D63031',
    },
    text: {
      primary: '#2D3436',
      secondary: '#636E72',
    },
    divider: '#E8E5F5',
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.85rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(108, 92, 231, 0.08)',
    '0px 4px 16px rgba(108, 92, 231, 0.10)',
    '0px 6px 24px rgba(108, 92, 231, 0.12)',
    '0px 8px 32px rgba(108, 92, 231, 0.14)',
    '0px 10px 40px rgba(108, 92, 231, 0.16)',
    '0px 12px 48px rgba(108, 92, 231, 0.18)',
    '0px 14px 56px rgba(108, 92, 231, 0.20)',
    '0px 16px 64px rgba(108, 92, 231, 0.22)',
    // Remaining shadow slots use same elevated shadow
    ...Array(16).fill('0px 16px 64px rgba(108, 92, 231, 0.22)'),
  ] as unknown as typeof createTheme extends (o: infer O) => unknown
    ? O extends { shadows: infer S }
      ? S
      : never
    : never,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.9rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(108, 92, 231, 0.20)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5A4BD1 0%, #8B83F0 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 4px 16px rgba(108, 92, 231, 0.08)',
          border: '1px solid rgba(108, 92, 231, 0.06)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 8px 32px rgba(108, 92, 231, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: '#E8E5F5',
            },
            '&:hover fieldset': {
              borderColor: '#A29BFE',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#2D3436',
          boxShadow: '0px 2px 8px rgba(108, 92, 231, 0.06)',
        },
      },
    },
  },
});

export default theme;
