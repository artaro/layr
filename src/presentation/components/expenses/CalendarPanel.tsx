'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Tooltip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Transaction } from '@/domain/entities';
import { TransactionType } from '@/domain/enums';
import { formatCurrency } from '@/lib/formatters';

interface CalendarPanelProps {
  transactions: Transaction[];
}

type ViewType = 'expense' | 'income' | 'total';

export default function CalendarPanel({ transactions }: CalendarPanelProps) {
  const [view, setView] = useState<ViewType>('expense');
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar grid days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const days: { date: Date | null; dayNum: number }[] = [];

    // Pad previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null, dayNum: 0 });
    }

    // Fill current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), dayNum: i });
    }

    return days;
  }, [year, month]);

  // Aggregate data by date
  const dailyData = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();

    transactions.forEach((t) => {
      const dateKey = t.transactionDate.split('T')[0]; // YYYY-MM-DD
      const entry = map.get(dateKey) || { income: 0, expense: 0 };

      if (t.type === TransactionType.INCOME) {
        entry.income += t.amount;
      } else {
        entry.expense += t.amount;
      }
      map.set(dateKey, entry);
    });

    return map;
  }, [transactions]);

  const getDayValue = (date: Date) => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const data = dailyData.get(key) || { income: 0, expense: 0 };

    if (view === 'expense') return data.expense;
    if (view === 'income') return data.income;
    return data.income - data.expense;
  };

  const getDayColor = (value: number) => {
    if (value === 0) return 'transparent';
    if (view === 'expense') return `rgba(214, 48, 49, ${Math.min(value / 2000, 1)})`; // Red opacity based on value
    if (view === 'income') return `rgba(0, 184, 148, ${Math.min(value / 2000, 1)})`; // Green
    // Total view: Green for positive, Red for negative
    return value >= 0
      ? `rgba(0, 184, 148, ${Math.min(value / 2000, 1)})`
      : `rgba(214, 48, 49, ${Math.min(Math.abs(value) / 2000, 1)})`;
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handlePrevMonth} size="small">
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 140, textAlign: 'center' }}>
              {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton onClick={handleNextMonth} size="small">
              <ChevronRightIcon />
            </IconButton>
          </Box>

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v) => v && setView(v)}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            <ToggleButton value="expense" sx={{ px: 2, fontFamily: 'Outfit' }}>
              Expense
            </ToggleButton>
            <ToggleButton value="income" sx={{ px: 2, fontFamily: 'Outfit' }}>
              Income
            </ToggleButton>
            <ToggleButton value="total" sx={{ px: 2, fontFamily: 'Outfit' }}>
              Total
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Weekday Headers */}
        <Grid container columns={7} sx={{ mb: 1 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Grid key={day} size={1} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Grid */}
        <Grid container columns={7}>
          {calendarDays.map((item, index) => {
            if (!item.date) {
              return <Grid key={`empty-${index}`} size={1} sx={{ aspectRatio: '1/1' }} />;
            }

            const value = getDayValue(item.date);
            const isToday =
              item.date.toDateString() === new Date().toDateString();
            
            const intensity = Math.min(Math.abs(value) / 2000, 1);
            const isDarkBackground = intensity > 0.6;

            return (
              <Grid
                key={item.date.toISOString()}
                size={1}
                sx={{
                  aspectRatio: '1/1',
                  p: 0.5,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 2,
                    border: isToday ? '2px solid #6C5CE7' : '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pt: 0.5,
                    cursor: 'default',
                    backgroundColor: value !== 0 ? getDayColor(value) : 'transparent',
                    color: value !== 0 
                      ? (isDarkBackground ? '#fff' : '#2d3436') 
                      : 'text.primary',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 2,
                      zIndex: 1,
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: isToday ? 700 : 400,
                      opacity: value !== 0 ? 1 : 0.7,
                    }}
                  >
                    {item.dayNum}
                  </Typography>
                  {value !== 0 && (
                    <Tooltip title={formatCurrency(value)}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          mt: 0.5,
                          width: '100%',
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          px: 0.5,
                        }}
                      >
                        {Math.abs(value) >= 1000
                          ? `${(Math.abs(value) / 1000).toFixed(1)}k`
                          : Math.abs(value).toFixed(0)}
                      </Typography>
                    </Tooltip>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
