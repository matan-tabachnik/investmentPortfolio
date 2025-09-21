import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Box
} from '@mui/material';
import { fmtUSD } from '../utils/MoneyUtils';
import { loadHistory, clearHistory } from '../utils/StorageUtils';
import type { PortfolioRes } from '../types/Portfolio';

export default function HistoryPanel({ 
  onClear 
}: { 
  refreshKey: number; 
  onClear?: () => void; 
}) {
  const history = loadHistory() as PortfolioRes[];

  const handleClear = () => {
    clearHistory();
    onClear?.();
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="היסטוריה"
        action={
          history.length > 0 && (
            <Button variant="outlined" size="small" onClick={handleClear}>
              נקה
            </Button>
          )
        }
      />
      
      <CardContent>
        {history.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            אין היסטוריה
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {history.map((h, i) => (
              <Box 
                key={i}
                sx={{ 
                  p: 2, 
                  borderRadius: 1, 
                  backgroundColor: i === 0 ? 'primary.50' : 'grey.50'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {new Date(h.asOf).toLocaleString('he-IL')}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {fmtUSD(h.total)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {h.items.length} מניות
                  {h.items.some(item => item.error) && 
                    ` • ${h.items.filter(item => item.error).length} שגיאות`
                  }
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}