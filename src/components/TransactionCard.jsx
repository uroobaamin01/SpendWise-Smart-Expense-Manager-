import { useCurrency } from '../hooks/useCurrency';
import { useFinance } from '../hooks/useFinance';
import { formatDate } from '../utils/formatters';
import CategoryIcon from './CategoryIcon';
import TransactionActions from './TransactionActions';

/**
 * Compact transaction row. Used on mobile lists and in "recent activity" panels.
 * Pass onView / onEdit / onDelete to show actions; omit them for a read-only row.
 */
export default function TransactionCard({ transaction, onView, onEdit, onDelete }) {
  const { format } = useCurrency();
  const { categoriesById } = useFinance();
  const category = categoriesById[transaction.categoryId];
  const isIncome = transaction.type === 'income';
  const hasActions = onView && onEdit && onDelete;

  return (
    <article className="tx-card">
      <CategoryIcon icon={category?.icon || 'tag'} tone={transaction.type} />
      <div className="tx-card__main">
        <h3 className="tx-card__title">{transaction.title}</h3>
        <p className="tx-card__meta">
          <span>{category?.name || 'Uncategorized'}</span>
          <span>{formatDate(transaction.date)}</span>
          <span>{transaction.paymentMethod}</span>
        </p>
        {transaction.notes && <p className="tx-card__notes">{transaction.notes}</p>}
      </div>
      <p className={`tx-amount tx-amount--${transaction.type}`}>
        {isIncome ? '+' : '−'}
        {format(transaction.amount)}
      </p>
      {hasActions && (
        <div className="tx-card__actions">
          <TransactionActions transaction={transaction} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        </div>
      )}
    </article>
  );
}
