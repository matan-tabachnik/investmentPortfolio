import type { PortfolioRes } from '../types/Portfolio';

const KEY = 'portfolio_history';
const MAX_HISTORY = 20;

export function loadHistory(): PortfolioRes[] {
  try { 
    return JSON.parse(localStorage.getItem(KEY) || '[]'); 
  }
  catch { 
    return []; 
  }
}

export function pushHistory(entry: PortfolioRes): PortfolioRes[] {
  const arr = loadHistory();
  
  const existingIndex = arr.findIndex(item => item.asOf === entry.asOf);
  if (existingIndex >= 0) {
    arr[existingIndex] = entry; 
  } else {
    arr.unshift(entry);
  }
  
  const trimmed = arr.slice(0, MAX_HISTORY);
  
  try {
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    const reduced = trimmed.slice(0, 10);
    try {
      localStorage.setItem(KEY, JSON.stringify(reduced));
      return reduced;
    } catch {
      console.warn('Failed to save to localStorage');
    }
  }
  
  return trimmed;
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}