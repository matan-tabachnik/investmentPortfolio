
import { 
    Box, 
    Typography, 
    Chip,
    Tooltip
  } from '@mui/material';
  import { 
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon
  } from '@mui/icons-material';
  
  interface ErrorDisplayProps {
    error: string;
    symbol: string;
    variant?: 'inline' | 'chip';
  }
  
  function getErrorInfo(error: string) {
    const lower = error.toLowerCase();
    
    if (lower.includes('not found') || lower.includes('symbol')) {
      return {
        text: 'מניה לא נמצאה',
        color: 'error' as const,
        icon: <ErrorIcon fontSize="small" />
      };
    }
    
    if (lower.includes('network') || lower.includes('timeout')) {
      return {
        text: 'בעיית רשת',
        color: 'warning' as const,
        icon: <WarningIcon fontSize="small" />
      };
    }
    
    if (lower.includes('limit') || lower.includes('429')) {
      return {
        text: 'חריגה ממכסה',
        color: 'info' as const,
        icon: <InfoIcon fontSize="small" />
      };
    }
    
    return {
      text: 'שגיאה',
      color: 'error' as const,
      icon: <ErrorIcon fontSize="small" />
    };
  }
  
  export default function ErrorDisplay({ error, variant = 'inline' }: ErrorDisplayProps) {
    const errorInfo = getErrorInfo(error);
    
    if (variant === 'chip') {
      return (
        <Tooltip title={error} arrow>
          <Chip
            icon={errorInfo.icon}
            label={errorInfo.text}
            color={errorInfo.color}
            size="small"
            variant="outlined"
          />
        </Tooltip>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {errorInfo.icon}
        <Typography 
          variant="body2" 
          color={`${errorInfo.color}.main`}
          sx={{ fontSize: '0.875rem' }}
        >
          {errorInfo.text}
        </Typography>
      </Box>
    );
  }