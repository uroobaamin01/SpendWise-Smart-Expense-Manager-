import { useMemo } from 'react';
import { buildBudgetOverview, getCurrentMonthKey } from '../utils/financeCalculations';
import { useAuth } from './useAuth';
import { useFinance } from './useFinance';

/** Budgets plus how much of each has been spent in `monthKey`. */
export function useBudget(monthKey = getCurrentMonthKey()) {
  const { budgets, transactions, loading, error, reload, addBudget, updateBudget, removeBudget } = useFinance();
  const { preferences } = useAuth();

  const overview = useMemo(
    () => buildBudgetOverview(budgets, transactions, monthKey, preferences.alertThreshold),
    [budgets, transactions, monthKey, preferences.alertThreshold],
  );

  return { budgets, overview, loading, error, reload, addBudget, updateBudget, removeBudget };
}
