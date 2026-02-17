'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

interface FileUploadZoneProps {
  accept?: string;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear?: () => void;
  loading?: boolean;
  label?: string;
  description?: string;
}

export default function FileUploadZone({
  accept = '.csv',
  onFileSelect,
  selectedFile,
  onClear,
  loading = false,
  label = 'Drop your statement here',
  description = 'Supports CSV files from your bank or credit card',
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Box>
      {!selectedFile ? (
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          sx={{
            border: '2px dashed',
            borderColor: isDragging ? 'primary.main' : 'divider',
            borderRadius: 4,
            p: 5,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragging ? 'rgba(108, 92, 231, 0.04)' : 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'primary.light',
              backgroundColor: 'rgba(108, 92, 231, 0.02)',
            },
          }}
        >
          <CloudUploadIcon
            sx={{
              fontSize: 56,
              color: isDragging ? 'primary.main' : 'text.secondary',
              mb: 2,
              transition: 'color 0.2s',
            }}
          />
          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
          <Button variant="outlined" size="small" component="span">
            Browse Files
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'primary.light',
            borderRadius: 3,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'rgba(108, 92, 231, 0.04)',
          }}
        >
          <InsertDriveFileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {selectedFile.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(selectedFile.size)}
            </Typography>
            {loading && <LinearProgress sx={{ mt: 1, borderRadius: 1 }} />}
          </Box>
          {onClear && !loading && (
            <IconButton size="small" onClick={onClear}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
}
