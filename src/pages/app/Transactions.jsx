import { useMemo, useState } from 'react';
import Button from '../../components/Button';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import Icon from '../../components/Icon';
import Modal from '../../components/Modal';
import NoTransactions from '../../components/NoTransactions';
import PageHeader from '../../components/PageHeader';
import Pagination from '../../components/Pagination';
import SegmentedControl from '../../components/SegmentedControl';
import Select from '../../components/Select';
import { ListSkeleton } from '../../components/Skeleton';
import TransactionCard from '../../components/TransactionCard';
import TransactionDetailsModal from '../../components/TransactionDetailsModal';
import TransactionForm from '../../components/TransactionForm';
import TransactionTable from '../../components/TransactionTable';
import { useDebounce } from '../../hooks/useDebounce';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFinance } from '../../hooks/useFinance';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useToast } from '../../hooks/useToast';
import { DATE_RANGE_OPTIONS, PAYMENT_METHODS, SORT_OPTIONS } from '../../utils/constants';
import { filterAndSortTransactions, resolveDateRange } from '../../utils/financeCalculations';

const PAGE_SIZE = 10;
const FILTER_DEFAULTS = { search: '', type: 'all', categoryId: 'all', paymentMethod: 'all', dateRange: 'all', sort: 'newest' };
const TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export default function Transactions() {
  useDocumentTitle('Transactions');
  const toast = useToast();
  const { transactions, categories, categoriesById, loading, error, reload, updateTransaction, removeTransaction } = useFinance();
  const isWide = useMediaQuery('(min-width: 960px)');

  const [filters, setFilters] = useState(FILTER_DEFAULTS);
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteState, setDeleteState] = useState({ loading: false, error: '' });

  const search = useDebounce(filters.search, 200);
  const setFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  };

  const results = useMemo(
    () => filterAndSortTransactions(transactions, { ...filters, search, ...resolveDateRange(filters.dateRange) }, categoriesById),
    [transactions, filters, search, categoriesById],
  );

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const isFiltered = Object.keys(FILTER_DEFAULTS).some((key) => key !== 'sort' && filters[key] !== FILTER_DEFAULTS[key]);

  const categoryOptions = useMemo(
    () => [{ value: 'all', label: 'All categories' }, ...categories.map((c) => ({ value: c.id, label: `${c.name} (${c.type})` }))],
    [categories],
  );
  const paymentOptions = useMemo(() => [{ value: 'all', label: 'All payment methods' }, ...PAYMENT_METHODS], []);

  const closeDelete = () => {
    setDeleting(null);
    setDeleteState({ loading: false, error: '' });
  };

  const confirmDelete = async () => {
    setDeleteState({ loading: true, error: '' });
    try {
      await removeTransaction(deleting.id);
      toast.success('Transaction deleted.');
      closeDelete();
    } catch (err) {
      setDeleteState({ loading: false, error: err.message });
    }
  };

  const saveEdit = async (payload) => {
    await updateTransaction(editing.id, payload);
    toast.success('Transaction updated.');
    setEditing(null);
  };

  const handlers = {
    onView: setViewing,
    onEdit: (transaction) => {
      setViewing(null);
      setEditing(transaction);
    },
    onDelete: (transaction) => {
      setViewing(null);
      setDeleting(transaction);
    },
  };

  const header = (
    <PageHeader
      title="Transactions"
      subtitle="Every payment in and out, searchable and sortable."
      actions={
        <>
          <Button to="/app/income" variant="secondary" icon="plus">
            Income
          </Button>
          <Button to="/app/expenses" variant="expense" icon="plus">
            Expense
          </Button>
        </>
      }
    />
  );

  if (loading) {
    return (
      <>
        {header}
        <ListSkeleton rows={7} />
      </>
    );
  }
  if (error) {
    return (
      <>
        {header}
        <ErrorMessage title="Transactions did not load" message={error} onRetry={reload} />
      </>
    );
  }
  if (transactions.length === 0) {
    return (
      <>
        {header}
        <NoTransactions />
      </>
    );
  }

  return (
    <>
      {header}

      <section className="card filters" aria-label="Search and filter transactions">
        <div className="filters__top">
          <div className="filters__search">
            <Icon name="search" size={18} />
            <input
              type="search"
              value={filters.search}
              onChange={(event) => setFilter('search', event.target.value)}
              placeholder="Search by title or category"
              aria-label="Search transactions"
            />
          </div>
          <SegmentedControl name="type" label="Transaction type" value={filters.type} options={TYPE_OPTIONS} onChange={(value) => setFilter('type', value)} />
        </div>
        <div className="filters__grid">
          <Select label="Category" value={filters.categoryId} onChange={(e) => setFilter('categoryId', e.target.value)} options={categoryOptions} />
          <Select label="Payment method" value={filters.paymentMethod} onChange={(e) => setFilter('paymentMethod', e.target.value)} options={paymentOptions} />
          <Select label="Date" value={filters.dateRange} onChange={(e) => setFilter('dateRange', e.target.value)} options={DATE_RANGE_OPTIONS} />
          <Select label="Sort by" value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)} options={SORT_OPTIONS} />
        </div>
      </section>

      <div className="results-bar" role="status" aria-live="polite">
        <p>
          Showing <strong>{results.length}</strong> of {transactions.length} transactions
        </p>
        {isFiltered && (
          <button type="button" className="link-button" onClick={() => { setFilters(FILTER_DEFAULTS); setPage(1); }}>
            Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon="search"
          title="No matching transactions"
          message="Try a different search term or loosen the filters."
          action={{ label: 'Clear filters', onClick: () => { setFilters(FILTER_DEFAULTS); setPage(1); } }}
        />
      ) : isWide ? (
        <div className="card table-card">
          <TransactionTable transactions={visible} {...handlers} />
        </div>
      ) : (
        <div className="tx-list tx-list--cards">
          {visible.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} {...handlers} />
          ))}
        </div>
      )}

      <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} total={results.length} pageSize={PAGE_SIZE} />

      <TransactionDetailsModal transaction={viewing} onClose={() => setViewing(null)} onEdit={handlers.onEdit} onDelete={handlers.onDelete} />

      {editing && (
        <Modal open onClose={() => setEditing(null)} title={`Edit ${editing.type}`} variant="sheet">
          <TransactionForm key={editing.id} type={editing.type} initialValues={editing} onSubmit={saveEdit} onCancel={() => setEditing(null)} submitLabel="Save changes" />
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this transaction?"
        message={deleting ? `“${deleting.title}” will be removed from your records. This cannot be undone.` : ''}
        confirmLabel="Delete transaction"
        loading={deleteState.loading}
        error={deleteState.error}
        onConfirm={confirmDelete}
        onCancel={closeDelete}
      />
    </>
  );
}
