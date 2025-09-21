
import { getPrice } from '../clients/TwelveDataClient.js';
import { getErrorMessage } from '../utils/ErrorsMessage.js';

//the main logic 

const r2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export async function buildPortfolioQuote(body: { items: { symbol: string; quantity: number }[] }) {
  const items: Array<{ 
    symbol: string; 
    price?: number; 
    quantity: number; 
    value?: number; 
    error?: string;
  }> = [];
  
  let total = 0;
  const warnings: string[] = [];
  const rows = Array.isArray(body?.items) ? body.items : [];

  const qtyBySym = new Map<string, number>();

  // check for validtion and merge the quantity if there is the same stock twtic i
  for (const row of rows) {
    const sym = String(row.symbol ?? '').trim().toUpperCase();
    const qty = Number(row.quantity);

    if (!sym) {
      warnings.push('Missing symbol');
      continue;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      warnings.push(`${sym}: Invalid quantity`);
      continue;
    }

    qtyBySym.set(sym, (qtyBySym.get(sym) ?? 0) + qty);
  }

  // get the price for each stock
  for (const [sym, qty] of qtyBySym) {
    try {
      const price = await getPrice(sym);
      const value = r2(price * qty);
      
      items.push({ 
        symbol: sym, 
        price: r2(price), 
        quantity: qty, 
        value 
      });
      
      total += value;
    } catch (err: any) {
      const errorMsg = getErrorMessage(err, sym); // adding to  stock with warning
      items.push({ 
        symbol: sym, 
        quantity: qty, 
        error: errorMsg
      });
    }
  }

  const errorCount = items.filter(item => item.error).length;
  const successCount = items.length - errorCount;
  
  if (errorCount > 0) {
    warnings.push(`${errorCount} symbols failed, ${successCount} successful`);
  }

  return {
    currency: 'USD',
    asOf: new Date().toISOString(),
    items,
    total: r2(total),
    warnings: warnings.length ? warnings : undefined
  };
}