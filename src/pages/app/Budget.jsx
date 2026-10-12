import { useMemo, useState } from 'react';
import BudgetCard from '../../components/BudgetCard';
import BudgetFormModal from '../../components/BudgetFormModal';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import Icon from '../../components/Icon';
import PageHeader from '../../components/PageHeader';
import { CardGridSkeleton } from '../../components/Skeleton';
import { useBudget } from '../../hooks/useBudget';
import { useCurrency } from '../../hooks/useCurrency';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFinance } from '../../hooks/useFinance';
import { useToast } from '../../hooks/useToast';
import { getCurrentMonthKey } from '../../utils/financeCalculations';
import { formatMonth } from '../../utils/formatters';

export default function Budget() {
  useDocumentTitle('Budget');
  const toast = useToast();
  const { format } = useCurrency();
  const { categoriesById } = useFinance();
  const monthKey = getCurrentMonthKey();
  const { budgets, overview, loading, error, reload, addBudget, updateBudget, removeBudget } = useBudget(monthKey);

  const [form, setForm] = useState(null); // { budget } while the modal is open
  const [deleting, setDeleting] = useState(null);
  const [deleteState, setDeleteState] = useState({ loading: false, error: '' });

  const takenCategoryIds = useMemo(() => budgets.map((budget) => budget.categoryId), [budgets]);
  const items = useMemo(() => [...(overview.overall ? [overview.overall] : []), ...overview.categories], [overview]);
  const needAttention = overview.categories.filter(({ progress }) => progress.status !== 'safe');
  const unbudgeted = overview.unbudgetedCategoryIds.map((id) => categoriesById[id]?.name).filter(Boolean);

  const save = async (payload) => {
    if (form.budget) {
      await updateBudget(form.budget.id, payload);
      toast.success('Budget updated.');
    } else {
      await addBudget(payload);
      toast.success('Budget set.');
    }
    setForm(null);
  };

  const closeDelete = () => {
    setDeleting(null);
    setDeleteState({ loading: false, error: '' });
  };

  const confirmDelete = async () => {
    setDeleteState({ loading: true, error: '' });
    try {
      await removeBudget(deleting.id);
      toast.success('Budget deleted.');
      closeDelete();
    } catch (err) {
      setDeleteState({ loading: false, error: err.message });
    }
  };

  const deletingName = deleting ? (deleting.categoryId === null ? 'monthly' : categoriesById[deleting.categoryId]?.name) : '';

  return (
    <>
      <PageHeader
        title="Budget"
        subtitle={`How your spending compares with your plan for ${formatMonth(monthKey)}.`}
        actions={
          <Button icon="plus" onClick={() => setForm({ budget: null })}>
            Set budget
          </Button>
        }
      />

      {loading ? (
        <CardGridSkeleton count={4} height={190} />
      ) : error ? (
        <ErrorMessage title="Budgets did not load" message={error} onRetry={reload} />
      ) : (
        <>
          {items.length === 0 ? (
            <EmptyState
              icon="target"
              title="No budgets yet"
              message="Set a monthly budget, or limit a single category like Food, and Finora will track it as you spend."
              action={{ label: 'Set budget', icon: 'plus', onClick: () => setForm({ budget: null }) }}
            />
          ) : (
            <>
              {needAttention.length > 0 && (
                <div className="notice notice--warning" role="status">
                  <Icon name="alert-triangle" size={18} />
                  <p>
                    {needAttention.length === 1 ? '1 category needs' : `${needAttention.length} categories need`} your attention this month:{' '}
                    {needAttention.map(({ budget }) => categoriesById[budget.categoryId]?.name).join(', ')}.
                  </p>
                </div>
              )}
              <div className="budget-grid">
                {items.map((item) => (
                  <BudgetCard key={item.budget.id} item={item} onEdit={(budget) => setForm({ budget })} onDelete={setDeleting} />
                ))}
              </div>
            </>
          )}

          {unbudgeted.length > 0 && items.length > 0 && (
            <p className="muted-note">
              Spending without a budget this month: {unbudgeted.join(', ')} ({format(overview.totalSpent)} spent in total).
            </p>
          )}
        </>
      )}

      {form && (
        <BudgetFormModal budget={form.budget} takenCategoryIds={takenCategoryIds} onSubmit={save} onClose={() => setForm(null)} />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this budget?"
        message={`Your ${deletingName} budget will be removed. Your transactions are not affected.`}
        confirmLabel="Delete budget"
        loading={deleteState.loading}
        error={deleteState.error}
        onConfirm={confirmDelete}
        onCancel={closeDelete}
      />
    </>
  );
}
