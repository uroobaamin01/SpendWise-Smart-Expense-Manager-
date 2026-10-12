import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { budgetService } from '../services/budgetService';
import { categoryService } from '../services/categoryService';
import { transactionService } from '../services/transactionService';
import { useAuth } from '../hooks/useAuth';

export const FinanceContext = createContext(null);

const EMPTY_STATE = { loading: true, error: null, transactions: [], budgets: [], categories: [] };

/**
 * Holds the signed-in user's transactions, budgets and categories.
 * Components never call the services directly — they use the actions below,
 * which talk to the API first and only then update local state.
 */
export function FinanceProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState(EMPTY_STATE);

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const [transactions, budgets, categories] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
        categoryService.getAll(),
      ]);
      setState({ loading: false, error: null, transactions, budgets, categories });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error: error.message }));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
    else setState(EMPTY_STATE);
  }, [isAuthenticated, load]);

  const saveItem = useCallback(
    (key, item, { prepend = false } = {}) =>
      setState((current) => {
        const exists = current[key].some((entry) => entry.id === item.id);
        const list = exists
          ? current[key].map((entry) => (entry.id === item.id ? item : entry))
          : prepend
            ? [item, ...current[key]]
            : [...current[key], item];
        return { ...current, [key]: list };
      }),
    [],
  );

  const dropItem = useCallback(
    (key, id) => setState((current) => ({ ...current, [key]: current[key].filter((entry) => entry.id !== id) })),
    [],
  );

  const actions = useMemo(
    () => ({
      reload: load,
      async addTransaction(payload) {
        const created = await transactionService.create(payload);
        saveItem('transactions', created, { prepend: true });
        return created;
      },
      async updateTransaction(id, payload) {
        const updated = await transactionService.update(id, payload);
        saveItem('transactions', updated);
        return updated;
      },
      async removeTransaction(id) {
        await transactionService.remove(id);
        dropItem('transactions', id);
      },
      async addBudget(payload) {
        const created = await budgetService.create(payload);
        saveItem('budgets', created);
        return created;
      },
      async updateBudget(id, payload) {
        const updated = await budgetService.update(id, payload);
        saveItem('budgets', updated);
        return updated;
      },
      async removeBudget(id) {
        await budgetService.remove(id);
        dropItem('budgets', id);
      },
      async addCategory(payload) {
        const created = await categoryService.create(payload);
        saveItem('categories', created);
        return created;
      },
      async updateCategory(id, payload) {
        const updated = await categoryService.update(id, payload);
        saveItem('categories', updated);
        return updated;
      },
      async removeCategory(id) {
        await categoryService.remove(id);
        dropItem('categories', id);
        setState((current) => ({ ...current, budgets: current.budgets.filter((b) => b.categoryId !== id) }));
      },
    }),
    [load, saveItem, dropItem],
  );

  const categoriesById = useMemo(
    () => Object.fromEntries(state.categories.map((category) => [category.id, category])),
    [state.categories],
  );

  const value = useMemo(() => ({ ...state, categoriesById, ...actions }), [state, categoriesById, actions]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
