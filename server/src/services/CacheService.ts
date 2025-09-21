interface CacheItem {
    price: number;
    timestamp: number;
  }
  
  class PriceCache {
    private cache = new Map<string, CacheItem>();
    private readonly TTL = 5 * 60 * 1000; 
  
    set(symbol: string, price: number): void {
      this.cache.set(symbol.toUpperCase(), {
        price,
        timestamp: Date.now()
      });
    }
  
    get(symbol: string): number | null {
      const item = this.cache.get(symbol.toUpperCase());
      
      if (!item) {
        return null;
      }
  
      const isExpired = Date.now() - item.timestamp > this.TTL;
      
      if (isExpired) {
        this.cache.delete(symbol.toUpperCase());
        return null;
      }
  
      return item.price;
    }
  
    clear(): void {
      this.cache.clear();
    }
  

    // clean after 10 min
    cleanup(): void {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now - item.timestamp > this.TTL) {
          this.cache.delete(key);
        }
      }
    }
  }
  
  export const priceCache = new PriceCache();

  
  setInterval(() => {
        priceCache.cleanup();
  }, 10 * 60 * 1000);