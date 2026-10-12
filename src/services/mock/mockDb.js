/**
 * Demo data + persistence for the mock API.
 * The shapes below ARE the API contract — a real backend should return the same JSON.
 */
import { DEFAULT_PREFERENCES, DEMO_ACCOUNT } from '../../utils/constants';
import { toISODate } from '../../utils/formatters';

const STORAGE_KEY = 'finora_mock_db_v2';

export const DEMO_CREDENTIALS = DEMO_ACCOUNT;

export const DEFAULT_CATEGORIES = [
  { id: 'inc-salary', name: 'Salary', type: 'income', icon: 'briefcase' },
  { id: 'inc-freelancing', name: 'Freelancing', type: 'income', icon: 'laptop' },
  { id: 'inc-business', name: 'Business', type: 'income', icon: 'store' },
  { id: 'inc-investment', name: 'Investment', type: 'income', icon: 'trending' },
  { id: 'inc-gift', name: 'Gift', type: 'income', icon: 'gift' },
  { id: 'inc-other', name: 'Other', type: 'income', icon: 'dots' },
  { id: 'exp-food', name: 'Food', type: 'expense', icon: 'utensils' },
  { id: 'exp-transport', name: 'Transport', type: 'expense', icon: 'car' },
  { id: 'exp-shopping', name: 'Shopping', type: 'expense', icon: 'bag' },
  { id: 'exp-bills', name: 'Bills', type: 'expense', icon: 'receipt' },
  { id: 'exp-education', name: 'Education', type: 'expense', icon: 'book' },
  { id: 'exp-health', name: 'Health', type: 'expense', icon: 'heart' },
  { id: 'exp-entertainment', name: 'Entertainment', type: 'expense', icon: 'film' },
  { id: 'exp-rent', name: 'Rent', type: 'expense', icon: 'home' },
  { id: 'exp-other', name: 'Other', type: 'expense', icon: 'dots' },
];

/* Amounts are listed for [this month, 1 month ago, ... 5 months ago]; 0 means "skip that month". */
const TRANSACTION_TEMPLATES = [
  { title: 'Monthly Salary', type: 'income', categoryId: 'inc-salary', day: 1, method: 'Bank Transfer', notes: 'Monthly payroll', amounts: [2500, 2500, 2500, 2500, 2500, 2500] },
  { title: 'Freelance Project', type: 'income', categoryId: 'inc-freelancing', day: 12, method: 'Bank Transfer', notes: 'Website redesign for a client', amounts: [500, 650, 420, 0, 380, 720] },
  { title: 'Dividend Payout', type: 'income', categoryId: 'inc-investment', day: 20, method: 'Bank Transfer', notes: 'Quarterly index fund dividend', amounts: [0, 85, 0, 70, 0, 85] },
  { title: 'Birthday Gift', type: 'income', categoryId: 'inc-gift', day: 18, method: 'Cash', notes: '', amounts: [0, 0, 100, 0, 0, 0] },
  { title: 'Apartment Rent', type: 'expense', categoryId: 'exp-rent', day: 2, method: 'Bank Transfer', notes: 'Shared apartment, monthly share', amounts: [1000, 1000, 1000, 1000, 1000, 1000] },
  { title: 'Groceries', type: 'expense', categoryId: 'exp-food', day: 5, method: 'Debit Card', notes: 'Weekly grocery run', amounts: [120, 135, 118, 126, 110, 130] },
  { title: 'Fresh Market Top-up', type: 'expense', categoryId: 'exp-food', day: 16, method: 'Cash', notes: 'Fruit, vegetables and bread', amounts: [95, 88, 102, 90, 97, 85] },
  { title: 'Dining Out', type: 'expense', categoryId: 'exp-food', day: 9, method: 'Credit Card', notes: 'Dinner with friends', amounts: [62, 74, 58, 90, 66, 71] },
  { title: 'Electricity Bill', type: 'expense', categoryId: 'exp-bills', day: 8, method: 'Bank Transfer', notes: '', amounts: [80, 92, 76, 70, 64, 60] },
  { title: 'Internet Bill', type: 'expense', categoryId: 'exp-bills', day: 10, method: 'Debit Card', notes: 'Fibre 300 Mbps plan', amounts: [45, 45, 45, 45, 45, 45] },
  { title: 'Transportation', type: 'expense', categoryId: 'exp-transport', day: 7, method: 'Cash', notes: 'Fuel and daily commute', amounts: [60, 55, 64, 58, 62, 52] },
  { title: 'Shopping', type: 'expense', categoryId: 'exp-shopping', day: 14, method: 'Credit Card', notes: 'Household items', amounts: [150, 210, 95, 130, 175, 120] },
  { title: 'Winter Jacket', type: 'expense', categoryId: 'exp-shopping', day: 22, method: 'Credit Card', notes: 'Seasonal sale', amounts: [180, 0, 0, 140, 0, 160] },
  { title: 'Streaming Subscription', type: 'expense', categoryId: 'exp-entertainment', day: 11, method: 'Credit Card', notes: '', amounts: [15, 15, 15, 15, 15, 15] },
  { title: 'Cinema & Games', type: 'expense', categoryId: 'exp-entertainment', day: 19, method: 'Debit Card', notes: '', amounts: [32, 0, 45, 28, 0, 40] },
  { title: 'Pharmacy', type: 'expense', categoryId: 'exp-health', day: 13, method: 'Cash', notes: 'Vitamins and prescriptions', amounts: [28, 0, 35, 22, 0, 31] },
  { title: 'Online Course', type: 'expense', categoryId: 'exp-education', day: 15, method: 'Credit Card', notes: 'Frontend engineering course', amounts: [49, 49, 0, 99, 0, 49] },
];

const SEED_BUDGETS = [
  { id: 'b-overall', categoryId: null, amount: 2500 },
  { id: 'b-food', categoryId: 'exp-food', amount: 300 },
  { id: 'b-transport', categoryId: 'exp-transport', amount: 100 },
  { id: 'b-shopping', categoryId: 'exp-shopping', amount: 250 },
  { id: 'b-bills', categoryId: 'exp-bills', amount: 150 },
  { id: 'b-entertainment', categoryId: 'exp-entertainment', amount: 80 },
  { id: 'b-health', categoryId: 'exp-health', amount: 60 },
];

/** Date `monthsAgo` months back; the current month never contains dates in the future. */
function seedDate(monthsAgo, day) {
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  let safeDay = Math.min(day, lastDay);
  // Spread current-month entries over the days that have actually elapsed.
  if (monthsAgo === 0) safeDay = Math.max(1, Math.min(now.getDate(), Math.round((safeDay * now.getDate()) / 28)));
  return toISODate(new Date(base.getFullYear(), base.getMonth(), safeDay));
}

function buildSeedTransactions() {
  const transactions = [];
  TRANSACTION_TEMPLATES.forEach((template, index) => {
    template.amounts.forEach((amount, monthsAgo) => {
      if (!amount) return;
      transactions.push({
        id: `t-${monthsAgo}-${index}`,
        title: template.title,
        type: template.type,
        categoryId: template.categoryId,
        amount,
        date: seedDate(monthsAgo, template.day),
        paymentMethod: template.method,
        notes: template.notes,
      });
    });
  });
  return transactions;
}

function createSeed() {
  return {
    users: [
      {
        id: 'u-demo',
        name: 'Alex Morgan',
        email: DEMO_CREDENTIALS.email,
        password: DEMO_CREDENTIALS.password,
        avatar: null,
        preferences: { ...DEFAULT_PREFERENCES, savingsGoal: 25 },
      },
    ],
    data: {
      'u-demo': {
        transactions: buildSeedTransactions(),
        budgets: SEED_BUDGETS,
        categories: DEFAULT_CATEGORIES,
      },
    },
  };
}

let cache = null;

export function getDb() {
  if (cache) return cache;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      cache = JSON.parse(stored);
      return cache;
    }
  } catch {
    /* fall through to a fresh seed */
  }
  cache = createSeed();
  saveDb();
  return cache;
}

export function saveDb() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    /* in-memory only when storage is unavailable */
  }
}

export function resetMockDb() {
  cache = createSeed();
  saveDb();
}
