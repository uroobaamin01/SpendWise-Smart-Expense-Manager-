import { useCallback } from 'react';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters';
import { useAuth } from './useAuth';

/** `format(1200)` -> "$1,200" in whichever currency the user selected. */
export function useCurrency() {
  const { currency } = useAuth();
  const format = useCallback((amount, options) => formatCurrency(amount, currency, options), [currency]);
  return { currency, symbol: getCurrencySymbol(currency), format };
}
