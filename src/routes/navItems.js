/** Single source of truth for navigation, shared by the desktop bar, tab bar and "More" sheet. */
export const APP_NAV_ITEMS = [
  { to: '/app', label: 'Home', icon: 'home', end: true },
  { to: '/app/transactions', label: 'Transactions', icon: 'list' },
  { to: '/app/income', label: 'Income', icon: 'arrow-down-left' },
  { to: '/app/expenses', label: 'Expenses', icon: 'arrow-up-right' },
  { to: '/app/budget', label: 'Budget', icon: 'target' },
  { to: '/app/reports', label: 'Reports', icon: 'bar-chart' },
  { to: '/app/categories', label: 'Categories', icon: 'tag' },
  { to: '/app/profile', label: 'Profile', icon: 'user' },
];

export const MARKETING_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#insights', label: 'Insights' },
];
