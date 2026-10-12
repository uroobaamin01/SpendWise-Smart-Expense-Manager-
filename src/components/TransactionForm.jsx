import { useMemo, useState } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { useFinance } from '../hooks/useFinance';
import { useForm } from '../hooks/useForm';
import { PAYMENT_METHODS } from '../utils/constants';
import { toISODate } from '../utils/formatters';
import { validateTransaction } from '../utils/validators';
import Button from './Button';
import FormAlert from './FormAlert';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';

const emptyValues = () => ({
  title: '',
  amount: '',
  categoryId: '',
  date: toISODate(),
  paymentMethod: 'Bank Transfer',
  notes: '',
});

/**
 * One form for adding income, adding expenses and editing either.
 * `onSubmit` receives an API-ready payload and returns a promise.
 */
export default function TransactionForm({ type, initialValues, onSubmit, onCancel, submitLabel, successMessage }) {
  const { symbol } = useCurrency();
  const { categories } = useFinance();
  const isIncome = type === 'income';
  const noun = isIncome ? 'Income' : 'Expense';
  const [saved, setSaved] = useState(false);

  const categoryOptions = useMemo(
    () => categories.filter((category) => category.type === type).map((category) => ({ value: category.id, label: category.name })),
    [categories, type],
  );

  const startValues = useMemo(
    () =>
      initialValues
        ? { ...emptyValues(), ...initialValues, amount: String(initialValues.amount), notes: initialValues.notes || '' }
        : emptyValues(),
    [initialValues],
  );

  const { values, errors, formError, submitting, handleChange, handleSubmit, reset } = useForm({
    initialValues: startValues,
    validate: validateTransaction,
    onSubmit: async (formValues) => {
      await onSubmit({
        title: formValues.title.trim(),
        type,
        categoryId: formValues.categoryId,
        amount: Number(formValues.amount),
        date: formValues.date,
        paymentMethod: formValues.paymentMethod,
        notes: formValues.notes.trim(),
      });
      if (!initialValues) {
        reset(emptyValues());
        setSaved(true);
      }
    },
  });

  const onFieldChange = (event) => {
    setSaved(false);
    handleChange(event);
  };

  return (
    <form className={`form form--${type}`} onSubmit={handleSubmit} noValidate>
      {saved && !formError && <FormAlert tone="success">{successMessage || `${noun} saved. Add another or head back to your activity.`}</FormAlert>}
      <FormAlert tone="error">{formError}</FormAlert>

      <Input
        label={`${noun} title`}
        name="title"
        value={values.title}
        onChange={onFieldChange}
        error={errors.title}
        placeholder={isIncome ? 'e.g. Monthly salary' : 'e.g. Weekly groceries'}
        required
        data-autofocus
        autoComplete="off"
      />

      <div className="form__row">
        <Input
          label="Amount"
          name="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          prefix={symbol}
          value={values.amount}
          onChange={onFieldChange}
          error={errors.amount}
          placeholder="0.00"
          required
        />
        <Input label="Date" name="date" type="date" value={values.date} onChange={onFieldChange} error={errors.date} required />
      </div>

      <div className="form__row">
        <Select
          label={`${noun} category`}
          name="categoryId"
          value={values.categoryId}
          onChange={onFieldChange}
          options={categoryOptions}
          placeholder="Select a category"
          error={errors.categoryId}
          required
        />
        <Select
          label="Payment method"
          name="paymentMethod"
          value={values.paymentMethod}
          onChange={onFieldChange}
          options={PAYMENT_METHODS}
          error={errors.paymentMethod}
          required
        />
      </div>

      <Textarea
        label="Description"
        name="notes"
        value={values.notes}
        onChange={onFieldChange}
        placeholder="Optional notes"
        error={errors.notes}
        hint="Optional"
      />

      <div className="form__actions">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant={isIncome ? 'primary' : 'expense'} loading={submitting}>
          {submitLabel || `Save ${noun.toLowerCase()}`}
        </Button>
      </div>
    </form>
  );
}
