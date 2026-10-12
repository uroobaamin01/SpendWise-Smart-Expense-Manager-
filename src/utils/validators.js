import { parseISODate } from './formatters';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isValidEmail = (value) => EMAIL_PATTERN.test(String(value).trim());

function validatePasswordRules(password) {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Use at least 8 characters.';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Include at least one letter and one number.';
  return '';
}

/** Each validator returns an object of { fieldName: 'message' } — empty when valid. */
const compact = (errors) => Object.fromEntries(Object.entries(errors).filter(([, message]) => message));

export function validateLogin({ email, password }) {
  return compact({
    email: !email.trim() ? 'Email is required.' : !isValidEmail(email) ? 'Enter a valid email address.' : '',
    password: !password ? 'Password is required.' : '',
  });
}

export function validateRegister({ name, email, password, confirmPassword }) {
  return compact({
    name: !name.trim() ? 'Full name is required.' : name.trim().length < 2 ? 'Name is too short.' : '',
    email: !email.trim() ? 'Email is required.' : !isValidEmail(email) ? 'Enter a valid email address.' : '',
    password: validatePasswordRules(password),
    confirmPassword: !confirmPassword
      ? 'Please confirm your password.'
      : confirmPassword !== password
        ? 'Passwords do not match.'
        : '',
  });
}

export function validateForgotPassword({ email }) {
  return compact({
    email: !email.trim() ? 'Email is required.' : !isValidEmail(email) ? 'Enter a valid email address.' : '',
  });
}

export function validateTransaction({ title, amount, categoryId, date, paymentMethod, notes }) {
  const numericAmount = Number(amount);
  const parsedDate = parseISODate(date);
  return compact({
    title: !title.trim() ? 'Title is required.' : title.trim().length > 80 ? 'Keep the title under 80 characters.' : '',
    amount:
      amount === '' || amount === null
        ? 'Amount is required.'
        : Number.isNaN(numericAmount)
          ? 'Enter a valid number.'
          : numericAmount <= 0
            ? 'Amount must be greater than zero.'
            : numericAmount > 1_000_000_000
              ? 'Amount is too large.'
              : '',
    categoryId: !categoryId ? 'Choose a category.' : '',
    date: !date ? 'Date is required.' : !parsedDate ? 'Enter a valid date.' : '',
    paymentMethod: !paymentMethod ? 'Choose a payment method.' : '',
    notes: notes && notes.length > 300 ? 'Keep notes under 300 characters.' : '',
  });
}

export function validateBudget({ categoryId, amount }, { requireCategory = true } = {}) {
  const numericAmount = Number(amount);
  return compact({
    categoryId: requireCategory && !categoryId ? 'Choose a category.' : '',
    amount:
      amount === '' ? 'Budget amount is required.' : Number.isNaN(numericAmount) || numericAmount <= 0 ? 'Enter an amount greater than zero.' : '',
  });
}

export function validateCategory({ name, icon }) {
  return compact({
    name: !name.trim() ? 'Category name is required.' : name.trim().length > 30 ? 'Keep the name under 30 characters.' : '',
    icon: !icon ? 'Pick an icon.' : '',
  });
}

export function validateProfile({ name, email, monthlyIncomeTarget, savingsGoal, alertThreshold }) {
  const inRange = (value, min, max) => value !== '' && Number(value) >= min && Number(value) <= max;
  return compact({
    name: !name.trim() ? 'Full name is required.' : '',
    email: !email.trim() ? 'Email is required.' : !isValidEmail(email) ? 'Enter a valid email address.' : '',
    monthlyIncomeTarget: Number(monthlyIncomeTarget) < 0 || monthlyIncomeTarget === '' ? 'Enter zero or a positive amount.' : '',
    savingsGoal: inRange(savingsGoal, 0, 100) ? '' : 'Enter a value between 0 and 100.',
    alertThreshold: inRange(alertThreshold, 50, 100) ? '' : 'Enter a value between 50 and 100.',
  });
}

export function validatePasswordChange({ currentPassword, newPassword, confirmPassword }) {
  return compact({
    currentPassword: !currentPassword ? 'Enter your current password.' : '',
    newPassword: validatePasswordRules(newPassword),
    confirmPassword:
      !confirmPassword ? 'Please confirm the new password.' : confirmPassword !== newPassword ? 'Passwords do not match.' : '',
  });
}

export function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;
  return { score, label: ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][password ? score : 0] };
}
