import { useMemo } from 'react';
import { useCurrency } from '../hooks/useCurrency';
import { useFinance } from '../hooks/useFinance';
import { useForm } from '../hooks/useForm';
import { validateBudget } from '../utils/validators';
import Button from './Button';
import FormAlert from './FormAlert';
import Input from './Input';
import Modal from './Modal';
import Select from './Select';

const OVERALL_VALUE = '__overall';

/**
 * Create or edit a budget. `budget` set = edit mode (the target is then locked).
 * Mount it only while open so each use starts with fresh values.
 * `takenCategoryIds` holds category ids (and `null` for the overall budget) that already have a budget.
 */
export default function BudgetFormModal({ budget, takenCategoryIds = [], onSubmit, onClose }) {
  const { symbol } = useCurrency();
  const { categories } = useFinance();
  const isEdit = Boolean(budget);

  const options = useMemo(() => {
    const all = [
      { value: OVERALL_VALUE, id: null, label: 'Overall monthly budget' },
      ...categories.filter((c) => c.type === 'expense').map((c) => ({ value: c.id, id: c.id, label: c.name })),
    ];
    return (isEdit ? all : all.filter((option) => !takenCategoryIds.includes(option.id))).map(({ value, label }) => ({ value, label }));
  }, [categories, takenCategoryIds, isEdit]);

  const initialValues = useMemo(
    () => ({
      categoryId: budget ? budget.categoryId ?? OVERALL_VALUE : '',
      amount: budget ? String(budget.amount) : '',
    }),
    [budget],
  );

  const { values, errors, formError, submitting, handleChange, handleSubmit } = useForm({
    initialValues,
    validate: validateBudget,
    onSubmit: (formValues) =>
      onSubmit({
        categoryId: formValues.categoryId === OVERALL_VALUE ? null : formValues.categoryId,
        amount: Number(formValues.amount),
      }),
  });

  return (
    <Modal
      open
      onClose={submitting ? undefined : onClose}
      title={isEdit ? 'Edit budget' : 'Set a budget'}
      description="Budgets apply every month and track your spending as you add expenses."
      variant="sheet"
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <FormAlert tone="error">{formError}</FormAlert>
        <Select
          label="Budget for"
          name="categoryId"
          value={values.categoryId}
          onChange={handleChange}
          options={options}
          placeholder="Choose overall or a category"
          error={errors.categoryId}
          disabled={isEdit}
          required
          data-autofocus={!isEdit || undefined}
        />
        <Input
          label="Monthly amount"
          name="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          prefix={symbol}
          value={values.amount}
          onChange={handleChange}
          error={errors.amount}
          placeholder="0.00"
          required
          data-autofocus={isEdit || undefined}
        />
        <div className="form__actions">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEdit ? 'Save changes' : 'Set budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
