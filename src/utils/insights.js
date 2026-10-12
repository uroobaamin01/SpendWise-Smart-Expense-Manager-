import { formatCurrency, formatMonth, formatPercent } from './formatters';
import {
  buildBudgetOverview,
  calculateTotals,
  filterByMonth,
  shiftMonth,
  spendingByCategory,
} from './financeCalculations';

/**
 * Builds human-readable insights from the user's real data.
 * Every sentence is derived from calculations — nothing is hardcoded to a number.
 * Each insight: { id, tone: 'positive' | 'neutral' | 'warning', icon, title, text }
 */
export function generateInsights({ transactions, budgets, categories, monthKey, currency, preferences = {} }) {
  const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c]));
  const monthTransactions = filterByMonth(transactions, monthKey);
  const previousTransactions = filterByMonth(transactions, shiftMonth(monthKey, -1));
  const totals = calculateTotals(monthTransactions);
  const previous = calculateTotals(previousTransactions);
  const money = (value) => formatCurrency(value, currency);
  const insights = [];

  if (monthTransactions.length === 0) {
    return [
      {
        id: 'no-data',
        tone: 'neutral',
        icon: 'sparkles',
        title: 'Nothing recorded yet',
        text: `Add income or expenses for ${formatMonth(monthKey)} to unlock personalised insights.`,
      },
    ];
  }

  const topCategory = spendingByCategory(monthTransactions, categoriesById)[0];
  if (topCategory) {
    insights.push({
      id: 'top-category',
      tone: 'neutral',
      icon: 'pie',
      title: 'Biggest spending category',
      text: `${topCategory.name} is your highest spending category this month — ${money(topCategory.value)}, or ${formatPercent(topCategory.share)} of all expenses.`,
    });
  }

  if (previous.expenses > 0 && totals.expenses > 0) {
    const change = ((totals.expenses - previous.expenses) / previous.expenses) * 100;
    if (Math.abs(change) < 1) {
      insights.push({
        id: 'trend',
        tone: 'neutral',
        icon: 'chart',
        title: 'Spending is steady',
        text: 'Your expenses are about the same as last month.',
      });
    } else {
      const up = change > 0;
      insights.push({
        id: 'trend',
        tone: up ? 'warning' : 'positive',
        icon: up ? 'arrowUpRight' : 'arrowDownLeft',
        title: up ? 'Spending is up' : 'Spending is down',
        text: `Your expenses ${up ? 'increased' : 'decreased'} by ${formatPercent(Math.abs(change))} (${money(Math.abs(totals.expenses - previous.expenses))}) compared with last month.`,
      });
    }
  }

  if (totals.income > 0) {
    const goal = Number(preferences.savingsGoal) || 0;
    if (totals.savings > 0) {
      const metGoal = goal > 0 && totals.savingsRate >= goal;
      insights.push({
        id: 'savings',
        tone: 'positive',
        icon: 'target',
        title: metGoal ? 'Savings goal reached' : 'Saving steadily',
        text: `You have saved ${formatPercent(totals.savingsRate)} of your income this month${
          goal > 0 ? (metGoal ? `, ahead of your ${goal}% goal.` : `. Your goal is ${goal}%.`) : '.'
        }`,
      });
    } else {
      insights.push({
        id: 'savings',
        tone: 'warning',
        icon: 'alert',
        title: 'Spending exceeds income',
        text: `You have spent ${money(Math.abs(totals.savings))} more than you earned this month.`,
      });
    }
  }

  const overview = buildBudgetOverview(budgets, transactions, monthKey, preferences.alertThreshold);
  if (overview.overall) {
    const { progress } = overview.overall;
    if (progress.status === 'over') {
      insights.push({
        id: 'budget-overall',
        tone: 'warning',
        icon: 'alert',
        title: 'Monthly budget exceeded',
        text: `You are ${money(Math.abs(progress.remaining))} over your ${money(progress.limit)} monthly budget.`,
      });
    } else {
      insights.push({
        id: 'budget-overall',
        tone: progress.status === 'warning' ? 'warning' : 'positive',
        icon: 'wallet',
        title: progress.status === 'warning' ? 'Nearing your budget' : 'Within budget',
        text:
          progress.status === 'warning'
            ? `You have used ${formatPercent(progress.percent)} of your monthly budget — ${money(progress.remaining)} left.`
            : `You are currently within your monthly budget with ${money(progress.remaining)} remaining.`,
      });
    }
  }

  const overCategories = overview.categories.filter(({ progress }) => progress.status === 'over');
  if (overCategories.length > 0) {
    const names = overCategories.map(({ budget }) => categoriesById[budget.categoryId]?.name).filter(Boolean);
    insights.push({
      id: 'budget-categories',
      tone: 'warning',
      icon: 'alert',
      title: `${names.length === 1 ? 'A category is' : 'Categories are'} over budget`,
      text: `${names.join(', ')} ${names.length === 1 ? 'has' : 'have'} gone over the limit you set.`,
    });
  }

  return insights;
}
