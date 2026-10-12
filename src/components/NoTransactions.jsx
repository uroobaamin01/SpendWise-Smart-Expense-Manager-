import EmptyState from './EmptyState';

export default function NoTransactions({ compact = false }) {
  return (
    <EmptyState
      icon="inbox"
      compact={compact}
      title="No transactions yet"
      message="Start by adding your first income or expense."
      action={{ label: 'Add Transaction', to: '/app/expenses', icon: 'plus' }}
      secondaryAction={{ label: 'Add income', to: '/app/income' }}
    />
  );
}
