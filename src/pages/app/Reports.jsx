import { useMemo, useState } from 'react';
import ChartCard from '../../components/ChartCard';
import { ExpenseTrendChart, IncomeExpenseChart, SpendingDoughnut } from '../../components/charts';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import Icon from '../../components/Icon';
import InsightList from '../../components/InsightList';
import PageHeader from '../../components/PageHeader';
import { CardGridSkeleton } from '../../components/Skeleton';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../hooks/useAuth';
import { useCurrency } from '../../hooks/useCurrency';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useFinance } from '../../hooks/useFinance';
import { useMonthlySeries } from '../../hooks/useMonthlySeries';
import { calculateTotals, filterByMonth, getCurrentMonthKey, shiftMonth, spendingByCategory } from '../../utils/financeCalculations';
import { formatMonth, formatMonthShort, formatPercent } from '../../utils/formatters';
import { generateInsights } from '../../utils/insights';

export default function Reports() {
  useDocumentTitle('Reports');
  const { preferences } = useAuth();
  const { currency, format } = useCurrency();
  const { transactions, budgets, categories, categoriesById, loading, error, reload } = useFinance();
  const currentMonth = getCurrentMonthKey();
  const [monthKey, setMonthKey] = useState(currentMonth);
  const trend = useMonthlySeries(monthKey, 6);

  const monthTransactions = useMemo(() => filterByMonth(transactions, monthKey), [transactions, monthKey]);
  const totals = useMemo(() => calculateTotals(monthTransactions), [monthTransactions]);
  const previousTotals = useMemo(() => calculateTotals(filterByMonth(transactions, shiftMonth(monthKey, -1))), [transactions, monthKey]);
  const categorySpend = useMemo(() => spendingByCategory(monthTransactions, categoriesById), [monthTransactions, categoriesById]);
  const insights = useMemo(
    () => generateInsights({ transactions, budgets, categories, monthKey, currency, preferences }),
    [transactions, budgets, categories, monthKey, currency, preferences],
  );
  const series = useMemo(
    () => trend.series.map((point) => ({ ...point, label: formatMonthShort(point.month), fullLabel: formatMonth(point.month) })),
    [trend.series],
  );

  const expenseDelta = previousTotals.expenses > 0 ? ((totals.expenses - previousTotals.expenses) / previousTotals.expenses) * 100 : null;
  const deltaHint = expenseDelta === null ? undefined : `${expenseDelta > 0 ? 'Up' : 'Down'} ${formatPercent(Math.abs(expenseDelta))} on last month`;

  const monthPicker = (
    <div className="month-picker" role="group" aria-label="Report month">
      <button type="button" className="icon-button" onClick={() => setMonthKey((key) => shiftMonth(key, -1))} aria-label="Previous month">
        <Icon name="chevron-left" size={18} />
      </button>
      <span className="month-picker__label" aria-live="polite">
        {formatMonth(monthKey)}
      </span>
      <button type="button" className="icon-button" onClick={() => setMonthKey((key) => shiftMonth(key, 1))} disabled={monthKey >= currentMonth} aria-label="Next month">
        <Icon name="chevron-right" size={18} />
      </button>
    </div>
  );
  const header = <PageHeader title="Reports" subtitle="A look at where your money came from and where it went." actions={monthPicker} />;

  if (loading) {
    return (
      <>
        {header}
        <CardGridSkeleton count={4} height={120} />
      </>
    );
  }
  if (error) {
    return (
      <>
        {header}
        <ErrorMessage title="Reports did not load" message={error} onRetry={reload} />
      </>
    );
  }

  return (
    <>
      {header}

      <section className="stat-grid" aria-label={`${formatMonth(monthKey)} summary`}>
        <StatCard label="Total income" value={format(totals.income, { forceDecimals: true })} icon="arrow-down-left" tone="positive" />
        <StatCard label="Total expenses" value={format(totals.expenses, { forceDecimals: true })} icon="arrow-up-right" tone="negative" hint={deltaHint} />
        <StatCard label="Total savings" value={format(totals.savings, { forceDecimals: true })} icon="wallet" tone={totals.savings >= 0 ? 'positive' : 'negative'} />
        <StatCard label="Savings percentage" value={formatPercent(totals.savingsRate, 1)} icon="target" tone="gold" hint={Number(preferences.savingsGoal) ? `Goal: ${preferences.savingsGoal}%` : undefined} />
      </section>

      <section className="card panel insights-panel">
        <h2 className="panel__title">Financial insights</h2>
        <InsightList insights={insights} />
      </section>

      <div className="chart-grid">
        <ChartCard title="Spending by category" subtitle={formatMonth(monthKey)} height={300} className="chart-card--doughnut">
          {categorySpend.length > 0 ? (
            <SpendingDoughnut data={categorySpend} />
          ) : (
            <EmptyState compact icon="pie-chart" title="No spending this month" message="Expenses you add will be broken down by category here." />
          )}
        </ChartCard>

        <ChartCard title="Monthly expense trend" subtitle="Last 6 months">
          {trend.loading ? (
            <CardGridSkeleton count={1} height={240} />
          ) : trend.error ? (
            <ErrorMessage title="Trend did not load" message={trend.error} onRetry={trend.reload} />
          ) : (
            <ExpenseTrendChart data={series} />
          )}
        </ChartCard>

        <ChartCard title="Income vs expenses" subtitle="Last 6 months" className="chart-card--wide">
          {trend.loading ? (
            <CardGridSkeleton count={1} height={240} />
          ) : trend.error ? (
            <ErrorMessage title="Comparison did not load" message={trend.error} onRetry={trend.reload} />
          ) : (
            <IncomeExpenseChart data={series} />
          )}
        </ChartCard>
      </div>
    </>
  );
}
