
export function getErrorMessage(error: any, symbol: string): string {
    const message = error?.message?.toLowerCase() || '';
    
    if (message.includes('not found') || message.includes('invalid symbol')) {
      return `${symbol}: Symbol not found`;
    }
    
    if (message.includes('network') || message.includes('timeout') || message.includes('fetch')) {
      return `${symbol}: Network error`;
    }
    
    if (message.includes('limit') || message.includes('429')) {
      return `${symbol}: API limit exceeded`;
    }
    
    return `${symbol}: ${error?.message || 'Price unavailable'}`;
  }