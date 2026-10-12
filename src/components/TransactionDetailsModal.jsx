import { useCurrency } from '../hooks/useCurrency';
import { useFinance } from '../hooks/useFinance';
import { formatDate } from '../utils/formatters';
import Badge from './Badge';
import Button from './Button';
import CategoryIcon from './CategoryIcon';
import Modal from './Modal';

export default function TransactionDetailsModal({ transaction, onClose, onEdit, onDelete }) {
  const { format } = useCurrency();
  const { categoriesById } = useFinance();
  if (!transaction) return null;

  const category = categoriesById[transaction.categoryId];
  const isIncome = transaction.type === 'income';
  const details = [
    ['Category', category?.name || 'Uncategorized'],
    ['Date', formatDate(transaction.date)],
    ['Payment method', transaction.paymentMethod],
    ['Notes', transaction.notes || 'No notes added'],
  ];

  return (
    <Modal
      open
      onClose={onClose}
      title="Transaction details"
      footer={
        <>
          <Button variant="ghost" icon="trash" onClick={() => onDelete(transaction)}>
            Delete
          </Button>
          <Button variant="secondary" icon="edit" onClick={() => onEdit(transaction)} data-autofocus>
            Edit
          </Button>
        </>
      }
    >
      <div className="details">
        <div className="details__hero">
          <CategoryIcon icon={category?.icon || 'tag'} tone={transaction.type} size={56} />
          <div>
            <p className="details__title">{transaction.title}</p>
            <Badge tone={transaction.type}>{isIncome ? 'Income' : 'Expense'}</Badge>
          </div>
          <p className={`details__amount tx-amount tx-amount--${transaction.type}`}>
            {isIncome ? '+' : '−'}
            {format(transaction.amount)}
          </p>
        </div>
        <dl className="details__list">
          {details.map(([term, value]) => (
            <div key={term} className="details__row">
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Modal>
  );
}
