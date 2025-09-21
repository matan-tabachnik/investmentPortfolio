import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
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
              mb: 2, 
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Box sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'stretch'
            }}>
              <TextField
                label="סימבול"
                value={item.symbol}
                onChange={(e) => updateItem(index, 'symbol', e.target.value)}
                placeholder="AAPL"
                size="small"
                sx={{ 
                  flex: 1,
                  minWidth: { xs: '100%', sm: 120 }
                }}
              />
              <TextField
                label="כמות"
                type="number"
                value={item.quantity || ''}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                placeholder="100"
                size="small"
                sx={{ 
                  flex: 1,
                  minWidth: { xs: '100%', sm: 100 }
                }}
              />
            </Box>

            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              justifyContent: { xs: 'center', sm: 'flex-start' },
              flexWrap: 'wrap'
            }}>
              <Button
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Remove />}
                sx={{ 
                  minWidth: { xs: 120, sm: 80 },
                  minHeight: { xs: 44, sm: 36 },
                  fontSize: { xs: '0.875rem', sm: '0.75rem' }
                }}
              >
                הסר שורה
              </Button>
              
              {index === items.length - 1 && (
                <Button
                  onClick={addItem}
                  disabled={items.length >= 50}
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Add />}
                  sx={{ 
                    minWidth: { xs: 120, sm: 80 },
                    minHeight: { xs: 44, sm: 36 },
                    fontSize: { xs: '0.875rem', sm: '0.75rem' }
                  }}
                >
                  הוסף שורה
                </Button>
              )}
            </Box>
          </Box>
        ))}

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
          sx={{ 
            mt: 2,
            minHeight: { xs: 48, sm: 36 },
            fontSize: { xs: '1rem', sm: '0.875rem' }
          }}
        >
          {loading ? 'מחשב...' : 'חשב תיק'}
        </Button>
      </CardContent>
    </Card>
  );
}