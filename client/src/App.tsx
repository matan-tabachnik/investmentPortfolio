import { useState } from 'react';
import { Container, Box, Typography, AppBar, Toolbar } from '@mui/material';
import PortfolioForm from './components/PortfolioForm';
import ResultsTable from './components/ResultsTable';
import HistoryPanel from './components/HistoryPanel';
import { quotePortfolio } from './services/Api';
import { pushHistory } from './utils/StorageUtils';
import type { PortfolioRes, QuoteItemReq } from './types/Portfolio';

export default function App() {
  const [data, setData] = useState<PortfolioRes | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const handleSubmit = async (items: QuoteItemReq[]) => {
    setLoading(true);
    try {
      const result = await quotePortfolio(items);
      pushHistory(result);
      setData(result);
      setHistoryRefreshKey(prev => prev + 1);
    } catch (error: any) {
      console.error('Portfolio error:', error);
      alert(`שגיאה בקבלת נתונים: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            מחשבון שווי תיק השקעות
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>

        <Box sx={{ mb: 3 }}>
          <PortfolioForm onSubmit={handleSubmit} loading={loading} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <ResultsTable data={data} loading={loading} />
        </Box>

        <Box>
          <HistoryPanel 
            refreshKey={historyRefreshKey} 
            onClear={() => setHistoryRefreshKey(prev => prev + 1)} 
          />
        </Box>
      </Container>
    </Box>
  );
}