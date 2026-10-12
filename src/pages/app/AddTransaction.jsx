import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import PageHeader from '../../components/PageHeader';
import { CardGridSkeleton } from '../../components/Skeleton';
import TransactionCard from '../../components/TransactionCard';
import TransactionForm from '../../components/TransactionForm';
import { useCurrency } from '../../hooks/useCurrency';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFinance } from '../../hooks/useFinance';
import { useToast } from '../../hooks/useToast';
import { filterAndSortTransactions, filterByMonth, getCurrentMonthKey, sumByType } from '../../utils/financeCalculations';
import { formatMonth } from '../../utils/formatters';

const COPY = {
  income: {
    title: 'Add income',
    subtitle: 'Record money coming in so your savings stay accurate.',
    asideTitle: 'Income this month',
    recentTitle: 'Recent income',
    saved: 'Income saved.',
    empty: 'No income recorded yet. Your entries will show up here.',
  },
  expense: {
    title: 'Add expense',
    subtitle: 'Log what you spent to keep your budgets up to date.',
    asideTitle: 'Spent this month',
    recentTitle: 'Recent expenses',
    saved: 'Expense saved.',
    empty: 'No expenses recorded yet. Your entries will show up here.',
  },
};

/** Shared by the Income and Expenses pages; `type` drives copy, categories and accent colour. */
export default function AddTransaction({ type }) {
  const copy = COPY[type];
  useDocumentTitle(copy.title);
  const navigate = useNavigate();
  const toast = useToast();
  const { format } = useCurrency();
  const { transactions, loading, error, reload, addTransaction } = useFinance();
  const monthKey = getCurrentMonthKey();

  const monthTotal = useMemo(() => sumByType(filterByMonth(transactions, monthKey), type), [transactions, monthKey, type]);
  const recent = useMemo(() => filterAndSortTransactions(transactions, { type, sort: 'newest' }).slice(0, 4), [transactions, type]);

  const handleSubmit = async (payload) => {
    await addTransaction(payload);
    toast.success(copy.saved);
  };

  return (
    <div className={`add-page add-page--${type}`}>
      <PageHeader title={copy.title} subtitle={copy.subtitle} />
      {loading ? (
        <CardGridSkeleton count={1} height={420} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={reload} />
      ) : (
        <div className="add-layout">
          <section className="card add-form-card" aria-label={copy.title}>
            <TransactionForm type={type} onSubmit={handleSubmit} onCancel={() => navigate('/app/transactions')} />
          </section>
          <aside className="add-aside">
            <div className="add-total">
              <p className="add-total__label">{copy.asideTitle}</p>
              <p className="add-total__figure">{format(monthTotal, { forceDecimals: true })}</p>
              <p className="add-total__month">{formatMonth(monthKey)}</p>
            </div>
            <section className="card panel">
              <h2 className="panel__title">{copy.recentTitle}</h2>
              {recent.length === 0 ? (
                <p className="panel__empty">{copy.empty}</p>
              ) : (
                <div className="tx-list">
                  {recent.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
