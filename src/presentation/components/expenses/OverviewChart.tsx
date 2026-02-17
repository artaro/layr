'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Transaction } from '@/domain/entities';
import { TransactionType } from '@/domain/enums';
import { EXPENSE_COLORS } from '@/lib/constants';
import { formatCurrency } from '@/lib/formatters';

interface OverviewChartProps {
  transactions: Transaction[];
  title?: string;
}

export default function OverviewChart({ transactions, title = 'Financial Overview' }: OverviewChartProps) {
  const data = useMemo(() => {
    const today = new Date();
    const dataMap = new Map<string, { label: string; income: number; expense: number; date: Date }>();

    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      dataMap.set(key, {
        label: d.toLocaleString('default', { month: 'short' }),
        income: 0,
        expense: 0,
        date: d,
      });
    }

    transactions.forEach((t) => {
      const tDate = new Date(t.transactionDate);
      const key = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (dataMap.has(key)) {
        const entry = dataMap.get(key)!;
        if (t.type === TransactionType.INCOME) entry.income += t.amount;
        else entry.expense += t.amount;
      }
    });

    return Array.from(dataMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [transactions]);

  const averages = useMemo(() => {
    if (data.length === 0) return { income: 0, expense: 0 };
    const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
    const totalExpense = data.reduce((sum, item) => sum + item.expense, 0);
    return {
      income: totalIncome / data.length,
      expense: totalExpense / data.length,
    };
  }, [data]);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Avg. Exp: {(averages.expense / 1000).toFixed(1)}k / mo
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, minHeight: 300 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E5F5" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fontFamily: 'Outfit' }}
                axisLine={{ stroke: '#E8E5F5' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fontFamily: 'Outfit' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: 16,
                  border: 'none',
                  boxShadow: '0px 4px 16px rgba(0,0,0,0.1)',
                  fontFamily: 'Outfit',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
              <Bar
                dataKey="income"
                name="💰 Income"
                fill={EXPENSE_COLORS.income}
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
              <Bar
                dataKey="expense"
                name="💸 Expense"
                fill={EXPENSE_COLORS.expense}
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
