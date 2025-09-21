import {
  Card, CardHeader, CardContent, Table, TableHead, TableRow, TableCell,
  TableBody, TableFooter, Skeleton, Box, Typography
} from '@mui/material';
import { fmtUSD } from '../utils/MoneyUtils';
import ErrorDisplay from './ErrorDisplay';
import type { PortfolioRes } from '../types/Portfolio';

type Props = { data: PortfolioRes | null; loading?: boolean; };

export default function ResultsTable({ data, loading = false }: Props) {
  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader title="תוצאות" subheader="טוען נתונים…" />
        <CardContent>
          <Skeleton height={36} />
          <Skeleton height={36} />
          <Skeleton height={36} />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader title="תוצאות" />
        <CardContent sx={{ color: 'text.secondary' }}>
          אין נתונים להצגה. מלא את הטופס ולחץ "חשב ערך".
        </CardContent>
      </Card>
    );
  }

  const { items, total, currency, asOf, warnings } = data;

  const successItems = items.filter(item => !item.error);
  const errorItems = items.filter(item => item.error);
  

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="תוצאות"
        subheader={`נכון ל־ ${new Date(asOf).toLocaleString()} | מטבע: ${currency}`}
      />
      <CardContent>

        {warnings?.length ? (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
            {warnings.map((warning, i) => (
              <Typography key={i} variant="body2" color="warning.dark">
                ⚠️ {warning}
              </Typography>
            ))}
          </Box>
        ) : null}


        {errorItems.length > 0 && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
            <Typography variant="body2" color="info.dark">
               הסכום מחושב עבור {successItems.length} מתוך {items.length} מניות
            </Typography>
          </Box>
        )}

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow 
                key={item.symbol}
                sx={{ 
                  backgroundColor: item.error ? 'error.50' : 'inherit'
                }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.symbol}
                    </Typography>
                    {item.error && (
                      <ErrorDisplay 
                        error={item.error} 
                        symbol={item.symbol}
                        variant="inline"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">{item.quantity.toLocaleString()}</TableCell>
                <TableCell align="right">
                  {item.error ? '-' : (item.price !== undefined ? fmtUSD(item.price) : '-')}
                </TableCell>
                <TableCell align="right">
                  {item.error ? '-' : (item.value !== undefined ? fmtUSD(item.value) : '-')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} align="right" sx={{ fontWeight: 700 }}>
                סך הכל תיק
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {fmtUSD(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}