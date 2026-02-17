'use client';

import React from 'react';
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
import { EXPENSE_COLORS } from '@/lib/constants';

interface MonthlyDataItem {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyBarChartProps {
  data: MonthlyDataItem[];
  title?: string;
}

export default function MonthlyBarChart({ data, title = 'Monthly Overview' }: MonthlyBarChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 5 }}>
          <Typography sx={{ fontSize: '2rem', mb: 1 }}>📈</Typography>
          <Typography variant="body2" color="text.secondary">
            No monthly data yet
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E5F5" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fontFamily: 'Outfit' }}
                axisLine={{ stroke: '#E8E5F5' }}
              />
              <YAxis
                tick={{ fontSize: 12, fontFamily: 'Outfit' }}
                axisLine={{ stroke: '#E8E5F5' }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) =>
                  `฿${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                }
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
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="💸 Expense"
                fill={EXPENSE_COLORS.expense}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
