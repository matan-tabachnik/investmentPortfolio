import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: { main: '#0b1220' },      
    secondary: { main: '#0ea5e9' },  
    background: { default: '#f6f8fb', paper: '#ffffff' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Heebo, Rubik, Arial, sans-serif',
    h6: { fontWeight: 800, letterSpacing: '.3px' },
  },
  components: {
    MuiCard: {
      styleOverrides: { root: { borderRadius: 18, border: '1px solid #eef2f7' } },
    },
    MuiTableRow: {
      styleOverrides: { hover: { transition: 'background .2s ease-in-out' } },
    },
  },
});

const cacheRtl = createCache({ key: 'mui-rtl', stylisPlugins: [prefixer, rtlPlugin] });

export default function MuiRTLProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{
          body: {
            background:
              'radial-gradient(1200px 600px at 120% -10%, #c7e7ff33 0%, transparent 60%),' +
              'radial-gradient(900px 500px at -20% 0%, #a3bffa33 0%, transparent 55%)',
          },
        }} />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
