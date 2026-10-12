import Icon from './Icon';

/** View / edit / delete icon buttons shared by the table rows and the mobile cards. */
export default function TransactionActions({ transaction, onView, onEdit, onDelete }) {
  return (
    <div className="row-actions">
      <button type="button" className="icon-button" onClick={() => onView(transaction)} aria-label={`View details for ${transaction.title}`}>
        <Icon name="eye" size={18} />
      </button>
      <button type="button" className="icon-button" onClick={() => onEdit(transaction)} aria-label={`Edit ${transaction.title}`}>
        <Icon name="edit" size={18} />
      </button>
      <button type="button" className="icon-button icon-button--danger" onClick={() => onDelete(transaction)} aria-label={`Delete ${transaction.title}`}>
        <Icon name="trash" size={18} />
      </button>
    </div>
  );
}
