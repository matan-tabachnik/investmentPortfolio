# Investment Portfolio Calculator
A Full Stack web application for calculating real-time portfolio values with live stock prices, featuring Hebrew language support and smart caching.

**Developed by:** [Matan Tabachnik]

## Features
- Real-time portfolio valuation using TwelveData API
- Smart caching system (5-minute TTL) to optimize API calls
- Portfolio calculation history with localStorage
- Responsive Material-UI design
- Input validation on both client and server

## Tech Stack
**Frontend**
* React (TypeScript)
* Material UI (MUI)
* Vite 

**Backend**
* Node.js + TypeScript
* Express

**Infra**
* Render: https://investmentportfolio.onrender.com
* Vercel: https://investment-portfolio-seven.vercel.app/

### Backend
```bash
cd investment-portfolio-server
npm ci
cp .env.example .env   # fill env vars below
npm run build
npm start              # serves on process.env.PORT
```

Endpoint: POST /api/quote – accepts an array of { symbol, quantity }; returns { items, total, currency, asOf, warnings? }.

Caching: in‑memory map keyed by symbol; entries expire after 5 minutes Improves latency and reduces API usage.

Normalization & validation: symbols uppercased; invalid rows marked with error and excluded from total.

### Frontend
```bash
cd ../investment-portfolio-client
npm ci
cp .env.example .env   # set VITE_API_URL to backend URL (e.g., http://localhost:8081/api)
npm run dev            # open the printed URL

components/PortfolioForm.tsx – Add/remove up to 50 rows, validate symbol and quantity, normalize (symbol.trim().toUpperCase(), positive integer quantity).

components/ResultsTable.tsx – Loading/empty/data states, per‑row errors via ErrorDisplay, total computed from valid rows only.

components/HistoryPanel.tsx – Reads/saves history in localStorage, highlights latest run, supports “Clear”.

utils/MoneyUtils.ts – fmtUSD currency formatter 

utils/StorageUtils.ts – pushHistory, loadHistory, clearHistory helpers.
```

## Environment
**Backend (.env)**
* `TWELVE_BASE_URL` (e.g., `https://api.twelvedata.com`)
* `TWELVE_API_KEY` (e.g., `abc123def456ghi789jkl012mno345pqr678stu901`)
* `PORT` (e.g., `8081`)

**Frontend (.env)**
* `VITE_API_URL` → backend base URL (e.g., `http://localhost:8081/api`)

## API 
`POST /api/quote`
```json
[
  { "symbol": "AAPL", "quantity": 10 },
  { "symbol": "MSFT", "quantity": 5 }
]
```

Returns (shape):
```json
{
  "items": [
    { "symbol": "AAPL", "quantity": 10, "price": 238.99, "value": 2389.9 },
    { "symbol": "BAD",  "quantity": 3,  "error": "Symbol not found" }
  ],
  "total": 2389.9,
  "currency": "USD",
  "asOf": "2025-09-21T10:34:00.000Z"
}
```

Rows with `error` are displayed but excluded from `total`.
