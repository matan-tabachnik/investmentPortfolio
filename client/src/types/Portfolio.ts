export interface QuoteItemReq {
    symbol: string;
    quantity: number;
  }
  
  export interface QuoteItemRes {
    symbol: string;
    quantity: number;
    price?: number;
    value?: number;
    error?: string;
  }
  
  export interface PortfolioRes {
    currency: string;
    asOf: string;
    items: QuoteItemRes[];
    total: number;
    warnings?: string[];
  }
  