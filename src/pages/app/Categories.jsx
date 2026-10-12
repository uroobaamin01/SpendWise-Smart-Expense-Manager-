import { useMemo, useState } from 'react';
import Button from '../../components/Button';
import CategoryCard from '../../components/CategoryCard';
import CategoryFormModal from '../../components/CategoryFormModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import PageHeader from '../../components/PageHeader';
import SegmentedControl from '../../components/SegmentedControl';
import { CardGridSkeleton } from '../../components/Skeleton';
import { useCategories } from '../../hooks/useCategories';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useToast } from '../../hooks/useToast';

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

function CategoryGroup({ title, categories, onEdit, onDelete }) {
  if (categories.length === 0) return null;
  return (
    <section className="category-group" aria-label={title}>
      <h2 className="category-group__title">{title}</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}

export default function Categories() {
  useDocumentTitle('Categories');
  const toast = useToast();
  const { incomeCategories, expenseCategories, categories, loading, error, reload, addCategory, updateCategory, removeCategory } = useCategories();
  const [tab, setTab] = useState('all');
  const [form, setForm] = useState(null); // { category } while the modal is open
  const [deleting, setDeleting] = useState(null);
  const [deleteState, setDeleteState] = useState({ loading: false, error: '' });

  const shown = useMemo(
    () => ({
      expense: tab === 'income' ? [] : expenseCategories,
      income: tab === 'expense' ? [] : incomeCategories,
    }),
    [tab, expenseCategories, incomeCategories],
  );

  const save = async (payload) => {
    if (form.category) {
      await updateCategory(form.category.id, payload);
      toast.success('Category updated.');
    } else {
      await addCategory(payload);
      toast.success('Category added.');
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
      await removeCategory(deleting.id);
      toast.success('Category deleted.');
      closeDelete();
    } catch (err) {
      setDeleteState({ loading: false, error: err.message });
    }
  };

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Organise your income and spending the way you think about it."
        actions={
          <Button icon="plus" onClick={() => setForm({ category: null })}>
            Add category
          </Button>
        }
      />

      {loading ? (
        <CardGridSkeleton count={6} height={84} />
      ) : error ? (
        <ErrorMessage title="Categories did not load" message={error} onRetry={reload} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon="tag"
          title="No categories yet"
          message="Create a category to start sorting your income and expenses."
          action={{ label: 'Add category', icon: 'plus', onClick: () => setForm({ category: null }) }}
        />
      ) : (
        <>
          <div className="toolbar">
            <SegmentedControl name="category-type" label="Show categories" value={tab} options={TABS} onChange={setTab} />
          </div>
          <CategoryGroup title="Expense categories" categories={shown.expense} onEdit={(category) => setForm({ category })} onDelete={setDeleting} />
          <CategoryGroup title="Income categories" categories={shown.income} onEdit={(category) => setForm({ category })} onDelete={setDeleting} />
        </>
      )}

      {form && (
        <CategoryFormModal
          category={form.category}
          defaultType={tab === 'income' ? 'income' : 'expense'}
          onSubmit={save}
          onClose={() => setForm(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this category?"
        message={deleting ? `“${deleting.name}” and any budget set for it will be removed.` : ''}
        confirmLabel="Delete category"
        loading={deleteState.loading}
        error={deleteState.error}
        onConfirm={confirmDelete}
        onCancel={closeDelete}
      />
    </>
  );
}
