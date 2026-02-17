'use client';

import React from 'react';
import { Chip, SxProps, Theme } from '@mui/material';

interface CategoryChipProps {
  name: string;
  icon?: string;
  color?: string;
  size?: 'small' | 'medium';
  onClick?: () => void;
  selected?: boolean;
  sx?: SxProps<Theme>;
}

export default function CategoryChip({
  name,
  icon = '📦',
  color = '#6C5CE7',
  size = 'small',
  onClick,
  selected = false,
  sx,
}: CategoryChipProps) {
  return (
    <Chip
      label={`${icon} ${name}`}
      size={size}
      onClick={onClick}
      sx={{
        backgroundColor: selected ? color : `${color}15`,
        color: selected ? '#fff' : color,
        fontWeight: 500,
        border: `1px solid ${color}30`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': onClick
          ? {
              backgroundColor: selected ? color : `${color}25`,
              transform: 'scale(1.02)',
            }
          : {},
        ...sx,
      }}
    />
  );
}
