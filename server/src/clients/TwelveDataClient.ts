import axios from 'axios';
import { config } from '../config/Env.js';
import { priceCache } from '../services/CacheService.js';

export async function getPrice(symbol: string): Promise<number> {
  const upperSymbol = symbol.toUpperCase();
  
 
  // check in the cache
  const cachedPrice = priceCache.get(upperSymbol);
  if (cachedPrice !== null) {
    console.log(`Cache hit for ${upperSymbol}`);
    return cachedPrice;
  }


  console.log(`Fetching ${upperSymbol} from API...`);
  

  // fetch from api 
  try {
    const { data } = await axios.get(`${config.twelve.baseUrl}/price`, {
      params: { 
        symbol: upperSymbol, 
        apikey: config.twelve.apiKey 
      },
      timeout: 5000
    });

    if (data?.code || data?.status === 'error') {
      throw new Error(`Symbol ${upperSymbol} not found`);
    }

    const price = Number(data?.price);
    if (!Number.isFinite(price)) {
      throw new Error(`Invalid price for ${upperSymbol}`);
    }

    priceCache.set(upperSymbol, price);

    return price;

  } catch (err: any) {
    console.error(`Failed to fetch price for ${upperSymbol}:`, err.message);
    
    if (err.response?.status === 404) {
      throw new Error(`Symbol ${upperSymbol} not found`);
    }
    if (err.response?.status === 429) {
      throw new Error('API rate limit exceeded');
    }
    if (err.code === 'ECONNREFUSED' || err.code === 'TIMEOUT') {
      throw new Error('Network connection failed');
    }
    
    throw new Error(err.message || 'Price unavailable');
  }
}