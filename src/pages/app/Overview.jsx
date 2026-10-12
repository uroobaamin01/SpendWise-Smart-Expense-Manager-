import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import Icon from '../../components/Icon';
import InsightList from '../../components/InsightList';
import NoTransactions from '../../components/NoTransactions';
import PageHeader from '../../components/PageHeader';
import ProgressBar from '../../components/ProgressBar';
import { CardGridSkeleton, ListSkeleton } from '../../components/Skeleton';
import TransactionCard from '../../components/TransactionCard';
import { useAuth } from '../../hooks/useAuth';
import { useCurrency } from '../../hooks/useCurrency';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFinance } from '../../hooks/useFinance';
import {
  buildBudgetOverview,
  calculateTotals,
  filterAndSortTransactions,
  filterByMonth,
  getCurrentMonthKey,
} from '../../utils/financeCalculations';
import { formatMonth, formatPercent, getGreeting } from '../../utils/formatters';
import { generateInsights } from '../../utils/insights';

/** The month "ledger": what is left after spending, and how much of income has gone out. */
function MonthLedger({ monthKey, totals, budgetLeft, savingsGoal }) {
  const { format } = useCurrency();
  const spentShare = totals.income > 0 ? Math.min(100, (totals.expenses / totals.income) * 100) : totals.expenses > 0 ? 100 : 0;
  const positive = totals.savings >= 0;

  return (
    <section className="ledger" aria-label={`${formatMonth(monthKey)} summary`}>
      <div className="ledger__main">
        <p className="ledger__label">{positive ? 'Left from income in' : 'Overspent in'} {formatMonth(monthKey, { month: 'long' })}</p>
        <p className="ledger__figure">{format(Math.abs(totals.savings), { forceDecimals: true })}</p>
        <div className="ledger__split" role="img" aria-label={`${Math.round(spentShare)}% of income spent`}>
          <span className="ledger__split-spent" style={{ width: `${spentShare}%` }} />
        </div>
        <p className="ledger__note">
          {totals.income > 0
            ? `You have spent ${formatPercent(spentShare)} of what came in${savingsGoal ? `, and your savings goal is ${savingsGoal}%` : ''}.`
            : 'Add your income to see how much of it you keep.'}
        </p>
      </div>
      <dl className="ledger__facts">
        <div>
          <dt>Income</dt>
          <dd>{format(totals.income)}</dd>
        </div>
        <div>
          <dt>Expenses</dt>
          <dd>{format(totals.expenses)}</dd>
        </div>
        <div>
          <dt>Savings rate</dt>
          <dd>{formatPercent(totals.savingsRate)}</dd>
        </div>
        <div>
          <dt>Budget left</dt>
          <dd>{budgetLeft === null ? 'Not set' : format(budgetLeft)}</dd>
        </div>
      </dl>
    </section>
  );
}

function BudgetGlance({ overview }) {
  const { format } = useCurrency();
  const { categoriesById } = useFinance();
  const attention = overview.categories.filter(({ progress }) => progress.status !== 'safe').slice(0, 3);

  return (
    <section className="card panel">
      <header className="panel__header">
        <h2 className="panel__title">Budget</h2>
        <Link to="/app/budget" className="panel__link">
          Manage
        </Link>
      </header>
      {overview.overall ? (
        <>
          <div className="glance">
            <p className="glance__figure">{format(overview.overall.progress.spent)}</p>
            <p className="glance__of">of {format(overview.overall.progress.limit)} spent</p>
          </div>
          <ProgressBar value={overview.overall.progress.percent} status={overview.overall.progress.status} label="Monthly budget used" />
        </>
      ) : (
        <p className="panel__empty">
          You have not set a monthly budget yet. <Link to="/app/budget">Set one</Link> to see how your spending compares.
        </p>
      )}
      {attention.length > 0 && (
        <ul className="glance__alerts">
          {attention.map(({ budget, progress }) => (
            <li key={budget.id} className={`glance__alert glance__alert--${progress.status}`}>
              <Icon name="alert-triangle" size={16} />
              <span>
                {categoriesById[budget.categoryId]?.name}: {progress.status === 'over' ? `${format(Math.abs(progress.remaining))} over` : `${Math.round(progress.percent)}% used`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Overview() {
  useDocumentTitle('Home');
  const { user, preferences } = useAuth();
  const { currency } = useCurrency();
  const { transactions, budgets, categories, loading, error, reload } = useFinance();
  const monthKey = getCurrentMonthKey();

  const totals = useMemo(() => calculateTotals(filterByMonth(transactions, monthKey)), [transactions, monthKey]);
  const overview = useMemo(
    () => buildBudgetOverview(budgets, transactions, monthKey, preferences.alertThreshold),
    [budgets, transactions, monthKey, preferences.alertThreshold],
  );
  const recent = useMemo(() => filterAndSortTransactions(transactions, { sort: 'newest' }).slice(0, 6), [transactions]);
  const insights = useMemo(
    () => generateInsights({ transactions, budgets, categories, monthKey, currency, preferences }),
    [transactions, budgets, categories, monthKey, currency, preferences],
  );

  const header = (
    <PageHeader
      title={`${getGreeting()}, ${user?.name?.split(' ')[0] || 'there'}`}
      subtitle={`Here is where your money stands for ${formatMonth(monthKey)}.`}
      actions={
        <>
          <Button to="/app/income" variant="secondary" icon="arrow-down-left">
            Add income
          </Button>
          <Button to="/app/expenses" variant="expense" icon="arrow-up-right">
            Add expense
          </Button>
        </>
      }
    />
  );

  if (loading) {
    return (
      <>
        {header}
        <CardGridSkeleton count={1} height={220} />
        <div className="two-col">
          <ListSkeleton rows={5} />
          <CardGridSkeleton count={2} height={180} />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {header}
        <ErrorMessage title="We could not load your finances" message={error} onRetry={reload} />
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
      <MonthLedger
        monthKey={monthKey}
        totals={totals}
        budgetLeft={overview.overall ? overview.overall.progress.remaining : null}
        savingsGoal={Number(preferences.savingsGoal) || 0}
      />

      <div className="two-col">
        <section className="card panel">
          <header className="panel__header">
            <h2 className="panel__title">Recent activity</h2>
            <Link to="/app/transactions" className="panel__link">
              View all
            </Link>
          </header>
          <div className="tx-list">
            {recent.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </section>

        <div className="stack">
          <BudgetGlance overview={overview} />
          <section className="card panel">
            <header className="panel__header">
              <h2 className="panel__title">What stands out</h2>
              <Link to="/app/reports" className="panel__link">
                Full report
              </Link>
            </header>
            <InsightList insights={insights} limit={3} />
          </section>
        </div>
      </div>
    </>
  );
}
