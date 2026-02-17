'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Transaction } from '@/domain/entities';
import { TransactionType } from '@/domain/enums';
import { formatCurrency } from '@/lib/formatters';

interface ExpensePieChartProps {
  transactions: Transaction[];
  title?: string;
}

export default function ExpensePieChart({ transactions, title = 'Spending by Category' }: ExpensePieChartProps) {
  const filteredData = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const filtered = transactions.filter(
      (t) =>
        t.type === TransactionType.EXPENSE &&
        new Date(t.transactionDate) >= startOfMonth
    );

    const categoryMap = new Map<string, number>();
    const colorMap = new Map<string, string>();
    const iconMap = new Map<string, string>();

    filtered.forEach((t) => {
      const name = t.category?.name || 'Uncategorized';
      const color = t.category?.color || '#B2BEC3';
      const icon = t.category?.icon || '❓';
      
      categoryMap.set(name, (categoryMap.get(name) || 0) + t.amount);
      colorMap.set(name, color);
      iconMap.set(name, icon);
    });

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        color: colorMap.get(name) || '#B2BEC3',
        icon: iconMap.get(name) || '❓',
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLegendText = (value: string, entry: any) => {
    const { payload } = entry;
    return <span style={{ color: '#2d3436', fontWeight: 500 }}>{payload.icon} {value}</span>;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {title} (Monthly)
        </Typography>

        {filteredData.length > 0 ? (
          <Box sx={{ flexGrow: 1, minHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  formatter={renderLegendText}
                  iconType="circle" 
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '3rem', mb: 2 }}>📉</Typography>
            <Typography color="text.secondary">No expenses this month</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
