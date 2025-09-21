import { Request, Response } from 'express';
import { buildPortfolioQuote } from '../services/PortfolioService.js';
import { validatePortfolioRequest } from '../utils/Validation.js';


export async function quotePortfolio(req: Request, res: Response) {
  try {
    // valditade the request
    const validation = validatePortfolioRequest(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        warnings: validation.warnings
      });
    }

    const result = await buildPortfolioQuote({ items: validation.cleanedItems });
    
    // combine validation warnings with service warnings
    if (validation.warnings.length > 0) {
      result.warnings = [...(result.warnings || []), ...validation.warnings];
    }

    res.status(200).json(result);

  } catch (error: any) {
    console.error('Portfolio controller error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
