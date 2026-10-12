import { DEFAULT_CURRENCY } from './constants';

const formatterCache = new Map();

function getCurrencyFormatter(currency, fractionDigits, compact = false) {
  const key = `${currency}-${fractionDigits}-${compact}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(
      key,
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        ...(compact ? { notation: 'compact', maximumFractionDigits: 1 } : { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }),
      }),
    );
  }
  return formatterCache.get(key);
}

/** Formats a number in the user's chosen currency. Whole amounts drop the decimals. */
export function formatCurrency(amount, currency = DEFAULT_CURRENCY, { forceDecimals = false, compact = false } = {}) {
  const value = Number(amount) || 0;
  const hasCents = Math.abs(value % 1) > 0.0001;
  return getCurrencyFormatter(currency, forceDecimals || hasCents ? 2 : 0, compact).format(value);
}

export function formatPercent(value, digits = 0) {
  return `${(Number(value) || 0).toFixed(digits)}%`;
}

/** Parses a "YYYY-MM-DD" string as a local date (avoids UTC shifting). */
export function parseISODate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getMonth() === month - 1 ? date : null;
}

export function formatDate(iso, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  const date = parseISODate(iso);
  return date ? date.toLocaleDateString('en-US', options) : '—';
}

export function toISODate(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** "2026-10" -> "October 2026" */
export function formatMonth(monthKey, options = { month: 'long', year: 'numeric' }) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', options);
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function createId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function getCurrencySymbol(currency = DEFAULT_CURRENCY) {
  const part = getCurrencyFormatter(currency, 0).formatToParts(0).find((item) => item.type === 'currency');
  return part ? part.value : currency;
}

/** "2026-10" -> "Oct" (or "Oct 2026" when `withYear`). */
export function formatMonthShort(monthKey, withYear = false) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', withYear ? { month: 'short', year: 'numeric' } : { month: 'short' });
}
