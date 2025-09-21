import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

interface PortfolioItem {
  symbol: string;
  quantity: number;
}

export default function PortfolioForm({ 
  onSubmit, 
  loading = false 
}: { 
  onSubmit: (items: PortfolioItem[]) => void;
  loading?: boolean;
}) {
  const [items, setItems] = useState<PortfolioItem[]>([
    { symbol: '', quantity: 0 }
  ]);
  const [error, setError] = useState('');

  const addItem = () => {
    if (items.length < 50) {
      setItems([...items, { symbol: '', quantity: 0 }]);
    }
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof PortfolioItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = () => {
    setError('');
    
    const invalidRows = items.filter((item) => 
      !item.symbol.trim() || item.quantity <= 0
    );

    if (invalidRows.length > 0) {
      if (invalidRows.some(item => !item.symbol.trim())) {
        setError('יש למלא את שם המניה בכל השורות');
      } else {
        setError('כמות המניות חייבת להיות גדולה מאפס בכל השורות');
      }
      return;
    }

    if (items.length > 50) {
      setError('יותר מידי מניות מקסימום 50');
      return;
    }

  
    const validItems = items.filter(item => 
      item.symbol.trim() && item.quantity > 0
    );

    if (validItems.length === 0) {
      setError('הזן לפחות מניה אחת תקינה');
      return;
    }

    const cleanItems = validItems.map(item => ({
      symbol: item.symbol.trim().toUpperCase(),
      quantity: Math.floor(Math.abs(item.quantity))
    }));

    onSubmit(cleanItems);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          הזן מניות
        </Typography>

        {error && (
          <Box sx={{ 
            mb: 2, 
            p: 2, 
            backgroundColor: 'error.50',
            border: '1px solid',
            borderColor: 'error.200',
            borderRadius: 1
          }}>
            <Typography color="error.main" variant="body2" sx={{ fontWeight: 500 }}>
              {error}
            </Typography>
          </Box>
        )}

        {items.map((item, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 2, 
              alignItems: 'flex-start',
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <TextField
              label="סימבול"
              value={item.symbol}
              onChange={(e) => updateItem(index, 'symbol', e.target.value)}
              placeholder="AAPL"
              size="small"
              sx={{ minWidth: 120, flex: 1 }}
            />
            <TextField
              label="כמות"
              type="number"
              value={item.quantity || ''}
              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
              placeholder="100"
              size="small"
              sx={{ minWidth: 100, flex: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <IconButton
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                size="small"
                color="error"
                sx={{ 
                  backgroundColor: 'error.50',
                  '&:hover': { backgroundColor: 'error.100' }
                }}
              >
                <Remove />
              </IconButton>
              {index === items.length - 1 && (
                <IconButton
                  onClick={addItem}
                  disabled={items.length >= 50}
                  size="small"
                  color="primary"
                  sx={{ 
                    backgroundColor: 'primary.50',
                    '&:hover': { backgroundColor: 'primary.100' }
                  }}
                >
                  <Add />
                </IconButton>
              )}
            </Box>
          </Box>
        ))}

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? 'מחשב...' : 'חשב תיק'}
        </Button>
      </CardContent>
    </Card>
  );
}