
export interface ValidationResult {
    isValid: boolean;
    cleanedItems: Array<{ symbol: string; quantity: number }>;
    warnings: string[];
  }
  
  export function validatePortfolioRequest(requestBody: any): ValidationResult {
    const warnings: string[] = [];
    const cleanedItems: Array<{ symbol: string; quantity: number }> = [];
  
    // basic valditon
    if (!requestBody || !Array.isArray(requestBody.items)) {
      return {
        isValid: false,
        cleanedItems: [],
        warnings: ['Request body must contain an array of items']
      };
    }
  
    if (requestBody.items.length === 0) {
      return {
        isValid: false,
        cleanedItems: [],
        warnings: ['At least one item is required']
      };
    }
  
    if (requestBody.items.length > 50) {
      return {
        isValid: false,
        cleanedItems: [],
        warnings: ['Maximum 50 items allowed']
      };
    }
  
    for (let i = 0; i < requestBody.items.length; i++) {
      const item = requestBody.items[i];
  
      // validate symbol
      if (!item.symbol || typeof item.symbol !== 'string' || !item.symbol.trim()) {
        warnings.push(`Item ${i + 1}: Missing symbol`);
        continue;
      }
  
      const symbol = item.symbol.trim().toUpperCase();

      if (!/^[A-Z0-9.-]{1,50}$/.test(symbol)) {
        warnings.push(`${symbol}: Invalid symbol format`);
        continue;
      }
  
      // validate quantity
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        warnings.push(`${symbol}: Invalid quantity (${item.quantity})`);
        continue;
      }
  
      if (quantity > 1000000) {
        warnings.push(`${symbol}: Quantity too large (${quantity}), limited to 1,000,000`);
        cleanedItems.push({ symbol, quantity: 1000000 });
        continue;
      }
  
      cleanedItems.push({ symbol, quantity });
    }
  
    // check if we have any valid items after cleaning
    if (cleanedItems.length === 0) {
      return {
        isValid: false,
        cleanedItems: [],
        warnings: [...warnings, 'No valid items found after validation']
      };
    }
  
    return {
      isValid: true,
      cleanedItems,
      warnings
    };
  }