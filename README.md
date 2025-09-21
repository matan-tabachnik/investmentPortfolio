# Investment Portfolio Calculator

A full‑stack web application for calculating **real‑time portfolio values** from live stock prices, with a **Hebrew UI** and **smart caching** to reduce API calls. Enter ticker symbols and quantities, submit, and get a per‑position breakdown (price, value) and a **total**—with inline error messages for invalid symbols and a local **history** of calculations.

**Developed by:** Matan Tabachnik

---

## 🔗 Live Demo

* **Frontend (Vercel):** [https://investment-portfolio-seven.vercel.app/](https://investment-portfolio-seven.vercel.app/)
* **Backend (Render):** [https://investmentportfolio.onrender.com](https://investmentportfolio.onrender.com)

> The frontend consumes the backend at `VITE_API_URL`. In production, set it to the Render API base (e.g., `https://investmentportfolio.onrender.com/api`).

---

## 🚀 How to Use (End Users)

1. Open the **frontend** link.
2. In **"הזן מניות"**, add rows for each position (e.g., `AAPL`, `MSFT`) and set quantities.
3. Click **"חשב תיק"**.
4. See the **results table**: each row shows `Symbol, Quantity, Price, Value`. Errors are shown inline and excluded from the total.
5. Review **history** at the bottom; the latest run is highlighted. Use **"נקה"** to clear history.

---

## ✨ Features

* Real‑time portfolio valuation (via Twelve Data API)
* **Smart in‑memory cache** (5‑minute TTL) to reduce provider calls
* **History** persisted in `localStorage`
* Responsive **Material‑UI** design
* **Validation** on both client and server (symbols & quantities)

---

## 🧱 Tech Stack

**Frontend:** React (TypeScript), Material UI (MUI), Vite
**Backend:** Node.js (TypeScript), Express
**Infra:** Frontend on Vercel/Render Static • Backend on Render

---

## 🧭 Architecture Overview (What each side does)

### Frontend Overview

* **`App.tsx`** – Orchestrates the flow: submit → call API → store result → refresh history
* **`components/PortfolioForm.tsx`** – Add/remove up to 50 rows; validate `symbol` & `quantity`; normalize (`symbol.trim().toUpperCase()`, positive integer)
* **`components/ResultsTable.tsx`** – Loading/empty/data states; per‑row errors via `ErrorDisplay`; total computed from **valid** rows only
* **`components/HistoryPanel.tsx`** – Reads/saves results in `localStorage`; shows latest at top; supports **Clear**
* **`utils/MoneyUtils.ts`** – `fmtUSD` formatter (can be generalized to `fmtMoney(amount, currency)`)
* **`utils/StorageUtils.ts`** – `pushHistory`, `loadHistory`, `clearHistory`

### Backend Overview

* **Endpoint:** `POST /api/quote` → accepts an array of `{ symbol, quantity }`; returns `{ items, total, currency, asOf, warnings? }`
* **Caching:** in‑memory map per `symbol` with **5‑minute TTL** (configurable) to reduce latency and API usage
* **Normalization & Validation:** symbols uppercased; invalid rows return `error` and are excluded from `total`
* **Error Handling:** maps upstream issues (invalid symbol / network / 429) to a stable error shape
* **Health Check:** `/healthz` returns `200 OK`

---

## 🛠️ Run Locally (Developers)

### Backend

```bash
cd investment-portfolio-server
npm ci
cp .env.example .env   # fill env vars (see Environment below)
npm run build
npm start              # listens on $PORT (or default if implemented)
```

### Frontend

```bash
cd ../investment-portfolio-client
npm ci
cp .env.example .env   # set VITE_API_URL to your backend (e.g., http://localhost:8081/api)
npm run dev            # open the printed URL
```

---

## 🔐 Environment

> Include **examples**, never real secrets. Commit a `.env.example` with placeholders and keep your real `.env` out of Git (use `.gitignore`).

### Backend (`investment-portfolio-server/.env.example`)

```env
PORT=8081                               # optional; hosting often sets this automatically
TWELVE_BASE_URL=https://api.twelvedata.com
TWELVE_API_KEY=YOUR_TWELVE_API_KEY_HERE # <-- placeholder only
CACHE_TTL_MS=300000                     # 5 minutes
```

### Frontend (`investment-portfolio-client/.env.example`)

```env
VITE_API_URL=http://localhost:8081/api
```

---

## 📡 API (Quick Reference)

`POST /api/quote`

```json
[
  { "symbol": "AAPL", "quantity": 10 },
  { "symbol": "MSFT", "quantity": 5 }
]
```

Returns:

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

Rows with `error` are displayed but excluded from the `total`.

---

## 📦 Deployment (Summary)

**Backend (Render → Web Service)**

* Root Directory: `investment-portfolio-server`
* Build: `npm ci && npm run build`
* Start: `node dist/index.js`
* Ensure the app listens on `process.env.PORT`; expose `/healthz`

**Frontend (Static Site on Vercel/Netlify/Render)**

* Build: `npm ci && npm run build`
* Publish dir: `dist` (Vite)
* Env: `VITE_API_URL` → backend URL

---

## 📄 License

MIT (or update to your preferred license).
