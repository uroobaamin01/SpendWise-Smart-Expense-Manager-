export const TRANSACTION_TYPES = { INCOME: 'income', EXPENSE: 'expense' };

export const CURRENCIES = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'PKR', label: 'Pakistani Rupee' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British Pound' },
  { code: 'AED', label: 'UAE Dirham' },
  { code: 'SAR', label: 'Saudi Riyal' },
];

export const DEFAULT_CURRENCY = 'USD';

export const STORAGE_KEYS = { rememberedEmail: 'finora_remembered_email' };

/** Shown on the login screen while the app runs against the mock API. */
export const DEMO_ACCOUNT = { email: 'demo@finora.app', password: 'demo1234' };

export const PAYMENT_METHODS = ['Cash', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Mobile Wallet'];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest', label: 'Highest amount' },
  { value: 'lowest', label: 'Lowest amount' },
];

export const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'Any date' },
  { value: 'this-month', label: 'This month' },
  { value: 'last-month', label: 'Last month' },
  { value: 'last-30', label: 'Last 30 days' },
  { value: 'this-year', label: 'This year' },
];

export const DEFAULT_PREFERENCES = {
  currency: DEFAULT_CURRENCY,
  monthlyIncomeTarget: 3000,
  savingsGoal: 20,
  alertThreshold: 80,
};

export const CATEGORY_ICON_OPTIONS = [
  'briefcase', 'laptop', 'store', 'trending', 'gift', 'utensils', 'car', 'bag', 'receipt',
  'book', 'heart', 'film', 'home', 'coffee', 'plane', 'zap', 'phone', 'gamepad', 'paw', 'dots',
];

export const CHART_COLORS = ['#0B5D45', '#C9A24B', '#2A9D8F', '#C4533A', '#5B7DB1', '#8DB596', '#8E5C86', '#B9A98A', '#4F6F64'];
export const INCOME_COLOR = '#0F7A5A';
export const EXPENSE_COLOR = '#C4533A';

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  app: '/app',
  transactions: '/app/transactions',
  income: '/app/income',
  expenses: '/app/expenses',
  budget: '/app/budget',
  reports: '/app/reports',
  categories: '/app/categories',
  profile: '/app/profile',
};

export const APP_NAV_ITEMS = [
  { to: ROUTES.app, label: 'Home', icon: 'home', end: true },
  { to: ROUTES.transactions, label: 'Transactions', icon: 'list' },
  { to: ROUTES.income, label: 'Income', icon: 'arrowDownLeft' },
  { to: ROUTES.expenses, label: 'Expenses', icon: 'arrowUpRight' },
  { to: ROUTES.budget, label: 'Budget', icon: 'wallet' },
  { to: ROUTES.reports, label: 'Reports', icon: 'chart' },
  { to: ROUTES.categories, label: 'Categories', icon: 'tag' },
  { to: ROUTES.profile, label: 'Profile', icon: 'user' },
];
