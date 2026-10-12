import { TRANSACTION_TYPES } from './constants';
import { toISODate } from './formatters';

const { INCOME, EXPENSE } = TRANSACTION_TYPES;

const round = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

/* ---------- Month helpers ---------- */

export const getMonthKey = (isoDate) => isoDate.slice(0, 7);

export const getCurrentMonthKey = () => toISODate(new Date()).slice(0, 7);

export function shiftMonth(monthKey, delta) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export const filterByMonth = (transactions, monthKey) =>
  transactions.filter((transaction) => getMonthKey(transaction.date) === monthKey);

/* ---------- Totals ---------- */

export const sumByType = (transactions, type) =>
  round(transactions.filter((t) => t.type === type).reduce((sum, t) => sum + Number(t.amount), 0));

export const calculateSavingsRate = (income, expenses) =>
  income > 0 ? round(((income - expenses) / income) * 100) : 0;

/** Total income, expenses, net savings and savings percentage. */
export function calculateTotals(transactions) {
  const income = sumByType(transactions, INCOME);
  const expenses = sumByType(transactions, EXPENSE);
  return {
    income,
    expenses,
    savings: round(income - expenses),
    savingsRate: calculateSavingsRate(income, expenses),
  };
}

/* ---------- Category spending ---------- */

/** Expense totals grouped by category, largest first. */
export function spendingByCategory(transactions, categoriesById = {}) {
  const totals = new Map();
  transactions
    .filter((t) => t.type === EXPENSE)
    .forEach((t) => totals.set(t.categoryId, (totals.get(t.categoryId) || 0) + Number(t.amount)));

  const grandTotal = [...totals.values()].reduce((sum, value) => sum + value, 0);
  return [...totals.entries()]
    .map(([categoryId, value]) => ({
      categoryId,
      name: categoriesById[categoryId]?.name || 'Uncategorized',
      value: round(value),
      share: grandTotal ? round((value / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

/* ---------- Trends ---------- */

/** Income / expense / savings for the `count` months ending at `endMonthKey`. */
export function monthlySeries(transactions, count = 6, endMonthKey = getCurrentMonthKey()) {
  return Array.from({ length: count }, (_, index) => {
    const month = shiftMonth(endMonthKey, index - (count - 1));
    const totals = calculateTotals(filterByMonth(transactions, month));
    return { month, income: totals.income, expenses: totals.expenses, savings: totals.savings };
  });
}

/* ---------- Budgets ---------- */

export function calculateBudgetProgress(limit, spent, alertThreshold = 80) {
  const percent = limit > 0 ? (spent / limit) * 100 : 0;
  let status = 'safe';
  if (percent > 100) status = 'over';
  else if (percent >= alertThreshold) status = 'warning';
  return {
    limit,
    spent: round(spent),
    remaining: round(limit - spent),
    percent: round(percent),
    status,
  };
}

/** Joins budgets with this month's spending. The overall budget has `categoryId === null`. */
export function buildBudgetOverview(budgets, transactions, monthKey, alertThreshold = 80) {
  const monthExpenses = filterByMonth(transactions, monthKey).filter((t) => t.type === EXPENSE);
  const spentByCategory = {};
  monthExpenses.forEach((t) => {
    spentByCategory[t.categoryId] = (spentByCategory[t.categoryId] || 0) + Number(t.amount);
  });
  const totalSpent = Object.values(spentByCategory).reduce((sum, value) => sum + value, 0);

  const overallBudget = budgets.find((b) => b.categoryId === null) || null;
  const categoryBudgets = budgets
    .filter((b) => b.categoryId !== null)
    .map((budget) => ({
      budget,
      progress: calculateBudgetProgress(budget.amount, spentByCategory[budget.categoryId] || 0, alertThreshold),
    }))
    .sort((a, b) => b.progress.percent - a.progress.percent);

  return {
    overall: overallBudget
      ? { budget: overallBudget, progress: calculateBudgetProgress(overallBudget.amount, totalSpent, alertThreshold) }
      : null,
    categories: categoryBudgets,
    totalSpent: round(totalSpent),
    unbudgetedCategoryIds: Object.keys(spentByCategory).filter(
      (id) => !budgets.some((b) => b.categoryId === id),
    ),
  };
}

/* ---------- Search / filter / sort ---------- */

export const DEFAULT_FILTERS = {
  search: '',
  type: 'all',
  categoryId: 'all',
  paymentMethod: 'all',
  dateFrom: '',
  dateTo: '',
  sort: 'newest',
};

const SORTERS = {
  newest: (a, b) => b.date.localeCompare(a.date) || String(b.id).localeCompare(String(a.id)),
  oldest: (a, b) => a.date.localeCompare(b.date) || String(a.id).localeCompare(String(b.id)),
  highest: (a, b) => Number(b.amount) - Number(a.amount),
  lowest: (a, b) => Number(a.amount) - Number(b.amount),
};

export function filterAndSortTransactions(transactions, filters = {}, categoriesById = {}) {
  const { search, type, categoryId, paymentMethod, dateFrom, dateTo, sort } = { ...DEFAULT_FILTERS, ...filters };
  const query = search.trim().toLowerCase();

  return transactions
    .filter((t) => {
      if (type !== 'all' && t.type !== type) return false;
      if (categoryId !== 'all' && t.categoryId !== categoryId) return false;
      if (paymentMethod !== 'all' && t.paymentMethod !== paymentMethod) return false;
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;
      if (query) {
        const categoryName = categoriesById[t.categoryId]?.name || '';
        return t.title.toLowerCase().includes(query) || categoryName.toLowerCase().includes(query);
      }
      return true;
    })
    .sort(SORTERS[sort] || SORTERS.newest);
}

export const countActiveFilters = (filters) =>
  Object.keys(DEFAULT_FILTERS).filter((key) => key !== 'sort' && filters[key] !== DEFAULT_FILTERS[key]).length;

/** Turns a date-range preset ('this-month', 'last-30', ...) into `{ dateFrom, dateTo }` ISO strings. */
export function resolveDateRange(preset, today = new Date()) {
  const thisMonth = toISODate(today).slice(0, 7);
  switch (preset) {
    case 'this-month':
      return { dateFrom: `${thisMonth}-01`, dateTo: `${thisMonth}-31` };
    case 'last-month': {
      const last = shiftMonth(thisMonth, -1);
      return { dateFrom: `${last}-01`, dateTo: `${last}-31` };
    }
    case 'last-30': {
      const from = new Date(today);
      from.setDate(from.getDate() - 30);
      return { dateFrom: toISODate(from), dateTo: toISODate(today) };
    }
    case 'this-year':
      return { dateFrom: `${thisMonth.slice(0, 4)}-01-01`, dateTo: `${thisMonth.slice(0, 4)}-12-31` };
    default:
      return { dateFrom: '', dateTo: '' };
  }
}
