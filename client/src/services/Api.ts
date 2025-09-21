import type { PortfolioRes, QuoteItemReq } from '../types/Portfolio';

const BASE = import.meta.env.VITE_API_BASE;

export async function quotePortfolio(items: QuoteItemReq[]): Promise<PortfolioRes> {
  try {
    const res = await fetch(`${BASE}/api/portfolio/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });


    let responseData;
    try {
      responseData = await res.json();
    } catch {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Request failed with status ${res.status}`);
    }

    if (res.ok) {
      return responseData as PortfolioRes;
    }

   
    if (responseData.error) {
      let errorMessage = responseData.error;
      
      if (responseData.details && Array.isArray(responseData.details)) {
        errorMessage += ': ' + responseData.details.join(', ');
      }
      
      throw new Error(errorMessage);
    }

    // fallback
    throw new Error(`Request failed with status ${res.status}`);

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('בעיית רשת - בדוק את החיבור לאינטרנט');
    }
    throw error;
  }
}

export type { PortfolioRes, QuoteItemReq };