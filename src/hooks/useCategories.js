import { useMemo } from 'react';
import { useFinance } from './useFinance';

export function useCategories() {
  const { categories, categoriesById, loading, error, reload, addCategory, updateCategory, removeCategory } = useFinance();

  const byType = useMemo(
    () => ({
      income: categories.filter((category) => category.type === 'income'),
      expense: categories.filter((category) => category.type === 'expense'),
    }),
    [categories],
  );

  return {
    categories,
    categoriesById,
    incomeCategories: byType.income,
    expenseCategories: byType.expense,
    loading,
    error,
    reload,
    addCategory,
    updateCategory,
    removeCategory,
  };
}
