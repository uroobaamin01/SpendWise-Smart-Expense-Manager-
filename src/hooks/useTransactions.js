import { useFinance } from './useFinance';

export function useTransactions() {
  const { transactions, loading, error, reload, addTransaction, updateTransaction, removeTransaction } = useFinance();
  return { transactions, loading, error, reload, addTransaction, updateTransaction, removeTransaction };
}
