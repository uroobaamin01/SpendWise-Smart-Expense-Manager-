import { DEFAULT_PREFERENCES } from '../../utils/constants';
import { filterAndSortTransactions, monthlySeries } from '../../utils/financeCalculations';
import { createId, parseISODate } from '../../utils/formatters';
import { isValidEmail } from '../../utils/validators';
import { DEFAULT_CATEGORIES, getDb, saveDb } from './mockDb';

export class HttpError extends Error {
  constructor(status, message, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

const fail = (field, message) => {
  throw new HttpError(422, 'The given data was invalid.', { [field]: [message] });
};

/* ---------- Helpers ---------- */

const toPublicUser = ({ password, ...user }) => user;

function requireUser(config) {
  const header = config.headers?.Authorization ?? config.headers?.get?.('Authorization') ?? '';
  const token = String(header).replace('Bearer ', '');
  const user = getDb().users.find((candidate) => `mock.${candidate.id}` === token);
  if (!user) throw new HttpError(401, 'Your session has expired. Please sign in again.');
  return user;
}

const userData = (user) => getDb().data[user.id];

function findOr404(list, id, label) {
  const item = list.find((entry) => entry.id === id);
  if (!item) throw new HttpError(404, `${label} not found.`);
  return item;
}

/* ---------- Validation (mirrors what a real backend would enforce) ---------- */

function validateTransactionPayload(payload, categories) {
  const { title, type, categoryId, amount, date, paymentMethod } = payload;
  if (!title?.trim()) fail('title', 'The title field is required.');
  if (!['income', 'expense'].includes(type)) fail('type', 'The type must be income or expense.');
  if (!(Number(amount) > 0)) fail('amount', 'The amount must be greater than zero.');
  if (!parseISODate(date)) fail('date', 'The date is not a valid date.');
  if (!paymentMethod) fail('paymentMethod', 'The payment method field is required.');
  const category = categories.find((c) => c.id === categoryId);
  if (!category) fail('categoryId', 'The selected category is invalid.');
  if (category.type !== type) fail('categoryId', `This category is not an ${type} category.`);
}

const cleanTransaction = (payload) => ({
  title: payload.title.trim(),
  type: payload.type,
  categoryId: payload.categoryId,
  amount: Math.round(Number(payload.amount) * 100) / 100,
  date: payload.date,
  paymentMethod: payload.paymentMethod,
  notes: (payload.notes || '').trim(),
});

/* ---------- Route table ---------- */

const routes = [];
const route = (method, path, handler) =>
  routes.push({ method, regex: new RegExp(`^${path.replace(/:(\w+)/g, '(?<$1>[^/]+)')}/?$`), handler });

// Auth
route('post', '/auth/login', ({ body }) => {
  const email = String(body.email || '').trim().toLowerCase();
  const user = getDb().users.find((u) => u.email.toLowerCase() === email && u.password === body.password);
  if (!user) throw new HttpError(401, 'Invalid email or password.');
  return { data: { token: `mock.${user.id}`, user: toPublicUser(user) } };
});

route('post', '/auth/register', ({ body }) => {
  const db = getDb();
  const email = String(body.email || '').trim().toLowerCase();
  if (!body.name?.trim()) fail('name', 'The name field is required.');
  if (!isValidEmail(email)) fail('email', 'The email must be a valid email address.');
  if ((body.password || '').length < 8) fail('password', 'The password must be at least 8 characters.');
  if (db.users.some((u) => u.email.toLowerCase() === email)) fail('email', 'An account with this email already exists.');

  const user = {
    id: `u-${createId()}`,
    name: body.name.trim(),
    email,
    password: body.password,
    avatar: null,
    preferences: { ...DEFAULT_PREFERENCES },
  };
  db.users.push(user);
  db.data[user.id] = { transactions: [], budgets: [], categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })) };
  saveDb();
  return { status: 201, data: { token: `mock.${user.id}`, user: toPublicUser(user) } };
});

route('post', '/auth/forgot-password', ({ body }) => {
  if (!isValidEmail(String(body.email || ''))) fail('email', 'The email must be a valid email address.');
  return { data: { message: 'If an account exists for that email, a reset link is on its way.' } };
});

route('get', '/auth/me', ({ user }) => ({ data: toPublicUser(user) }));

route('put', '/profile', ({ user, body }) => {
  const db = getDb();
  const email = String(body.email ?? user.email).trim().toLowerCase();
  if (!body.name?.trim()) fail('name', 'The name field is required.');
  if (!isValidEmail(email)) fail('email', 'The email must be a valid email address.');
  if (db.users.some((u) => u.id !== user.id && u.email.toLowerCase() === email)) fail('email', 'That email is already in use.');
  Object.assign(user, {
    name: body.name.trim(),
    email,
    avatar: body.avatar === undefined ? user.avatar : body.avatar,
    preferences: { ...user.preferences, ...body.preferences },
  });
  saveDb();
  return { data: toPublicUser(user) };
});

route('put', '/profile/password', ({ user, body }) => {
  if (body.currentPassword !== user.password) fail('currentPassword', 'Your current password is incorrect.');
  if ((body.newPassword || '').length < 8) fail('newPassword', 'The new password must be at least 8 characters.');
  user.password = body.newPassword;
  saveDb();
  return { data: { message: 'Password updated.' } };
});

// Transactions
route('get', '/transactions', ({ user, params }) => {
  const { transactions, categories } = userData(user);
  const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c]));
  return { data: filterAndSortTransactions(transactions, params, categoriesById) };
});

route('get', '/transactions/:id', ({ user, match }) => ({
  data: findOr404(userData(user).transactions, match.id, 'Transaction'),
}));

route('post', '/transactions', ({ user, body }) => {
  const data = userData(user);
  validateTransactionPayload(body, data.categories);
  const transaction = { id: `t-${createId()}`, ...cleanTransaction(body) };
  data.transactions.unshift(transaction);
  saveDb();
  return { status: 201, data: transaction };
});

route('put', '/transactions/:id', ({ user, match, body }) => {
  const data = userData(user);
  const transaction = findOr404(data.transactions, match.id, 'Transaction');
  validateTransactionPayload(body, data.categories);
  Object.assign(transaction, cleanTransaction(body));
  saveDb();
  return { data: transaction };
});

route('delete', '/transactions/:id', ({ user, match }) => {
  const data = userData(user);
  findOr404(data.transactions, match.id, 'Transaction');
  data.transactions = data.transactions.filter((t) => t.id !== match.id);
  saveDb();
  return { status: 204, data: null };
});

// Budgets
route('get', '/budgets', ({ user }) => ({ data: userData(user).budgets }));

function validateBudgetPayload(data, body, currentId = null) {
  if (!(Number(body.amount) > 0)) fail('amount', 'The amount must be greater than zero.');
  const categoryId = body.categoryId ?? null;
  if (categoryId !== null && !data.categories.some((c) => c.id === categoryId && c.type === 'expense')) {
    fail('categoryId', 'The selected category is invalid.');
  }
  if (data.budgets.some((b) => b.id !== currentId && b.categoryId === categoryId)) {
    fail('categoryId', categoryId === null ? 'A monthly budget already exists.' : 'A budget for this category already exists.');
  }
  return { categoryId, amount: Math.round(Number(body.amount) * 100) / 100 };
}

route('post', '/budgets', ({ user, body }) => {
  const data = userData(user);
  const budget = { id: `b-${createId()}`, ...validateBudgetPayload(data, body) };
  data.budgets.push(budget);
  saveDb();
  return { status: 201, data: budget };
});

route('put', '/budgets/:id', ({ user, match, body }) => {
  const data = userData(user);
  const budget = findOr404(data.budgets, match.id, 'Budget');
  Object.assign(budget, validateBudgetPayload(data, body, budget.id));
  saveDb();
  return { data: budget };
});

route('delete', '/budgets/:id', ({ user, match }) => {
  const data = userData(user);
  findOr404(data.budgets, match.id, 'Budget');
  data.budgets = data.budgets.filter((b) => b.id !== match.id);
  saveDb();
  return { status: 204, data: null };
});

// Categories
route('get', '/categories', ({ user }) => ({ data: userData(user).categories }));

function validateCategoryPayload(data, body, currentId = null) {
  const name = String(body.name || '').trim();
  if (!name) fail('name', 'The name field is required.');
  if (!['income', 'expense'].includes(body.type)) fail('type', 'The type must be income or expense.');
  if (!body.icon) fail('icon', 'The icon field is required.');
  if (data.categories.some((c) => c.id !== currentId && c.type === body.type && c.name.toLowerCase() === name.toLowerCase())) {
    fail('name', `You already have an ${body.type} category with this name.`);
  }
  return { name, type: body.type, icon: body.icon };
}

route('post', '/categories', ({ user, body }) => {
  const data = userData(user);
  const category = { id: `c-${createId()}`, ...validateCategoryPayload(data, body) };
  data.categories.push(category);
  saveDb();
  return { status: 201, data: category };
});

route('put', '/categories/:id', ({ user, match, body }) => {
  const data = userData(user);
  const category = findOr404(data.categories, match.id, 'Category');
  const next = validateCategoryPayload(data, body, category.id);
  const inUse = data.transactions.some((t) => t.categoryId === category.id);
  if (inUse && next.type !== category.type) {
    throw new HttpError(409, 'This category has transactions, so its type cannot be changed.');
  }
  Object.assign(category, next);
  saveDb();
  return { data: category };
});

route('delete', '/categories/:id', ({ user, match }) => {
  const data = userData(user);
  const category = findOr404(data.categories, match.id, 'Category');
  const usage = data.transactions.filter((t) => t.categoryId === category.id).length;
  if (usage > 0) {
    throw new HttpError(
      409,
      `"${category.name}" is used by ${usage} transaction${usage === 1 ? '' : 's'}. Move or delete them first.`,
    );
  }
  data.categories = data.categories.filter((c) => c.id !== category.id);
  data.budgets = data.budgets.filter((b) => b.categoryId !== category.id);
  saveDb();
  return { status: 204, data: null };
});

// Summary
route('get', '/summary/monthly', ({ user, params }) => {
  const months = Math.min(Math.max(Number(params.months) || 6, 1), 24);
  return { data: monthlySeries(userData(user).transactions, months, params.end || undefined) };
});

/* ---------- Dispatcher ---------- */

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export function handleRequest(config) {
  const method = (config.method || 'get').toLowerCase();
  const path = `/${String(config.url || '').replace(config.baseURL || '', '').split('?')[0].replace(/^\/+/, '')}`;
  const body = typeof config.data === 'string' && config.data ? JSON.parse(config.data) : config.data || {};
  const params = config.params || {};

  for (const entry of routes) {
    if (entry.method !== method) continue;
    const result = entry.regex.exec(path);
    if (!result) continue;
    const user = PUBLIC_PATHS.includes(path) ? null : requireUser(config);
    const { status = 200, data } = entry.handler({ user, body, params, match: result.groups || {} });
    return { status, data };
  }
  throw new HttpError(404, `No mock route for ${method.toUpperCase()} ${path}`);
}
