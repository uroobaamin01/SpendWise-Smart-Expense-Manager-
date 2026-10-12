import { useCurrency } from '../hooks/useCurrency';
import { useFinance } from '../hooks/useFinance';
import { formatDate } from '../utils/formatters';
import Badge from './Badge';
import CategoryIcon from './CategoryIcon';
import TransactionActions from './TransactionActions';

/** Desktop table view of transactions. On small screens the page shows TransactionCard instead. */
export default function TransactionTable({ transactions, onView, onEdit, onDelete }) {
  const { format } = useCurrency();
  const { categoriesById } = useFinance();

  return (
    <div className="table-wrap">
      <table className="tx-table">
        <caption className="sr-only">Transactions</caption>
        <thead>
          <tr>
            <th scope="col">Transaction</th>
            <th scope="col">Type</th>
            <th scope="col">Category</th>
            <th scope="col" className="is-numeric">
              Amount
            </th>
            <th scope="col">Date</th>
            <th scope="col">Payment</th>
            <th scope="col">Notes</th>
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const category = categoriesById[transaction.categoryId];
            return (
              <tr key={transaction.id}>
                <td>
                  <div className="tx-table__title">
                    <CategoryIcon icon={category?.icon || 'tag'} tone={transaction.type} size={38} />
                    <span>{transaction.title}</span>
                  </div>
                </td>
                <td>
                  <Badge tone={transaction.type}>{transaction.type === 'income' ? 'Income' : 'Expense'}</Badge>
                </td>
                <td>{category?.name || 'Uncategorized'}</td>
                <td className="is-numeric">
                  <span className={`tx-amount tx-amount--${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '−'}
                    {format(transaction.amount)}
                  </span>
                </td>
                <td className="nowrap">{formatDate(transaction.date)}</td>
                <td>{transaction.paymentMethod}</td>
                <td className="tx-table__notes" title={transaction.notes || undefined}>
                  {transaction.notes || <span className="text-soft">—</span>}
                </td>
                <td>
                  <TransactionActions transaction={transaction} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
