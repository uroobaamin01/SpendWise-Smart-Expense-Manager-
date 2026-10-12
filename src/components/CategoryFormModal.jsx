import { useMemo } from 'react';
import { useForm } from '../hooks/useForm';
import { CATEGORY_ICON_OPTIONS } from '../utils/constants';
import { validateCategory } from '../utils/validators';
import Button from './Button';
import FormAlert from './FormAlert';
import Icon from './Icon';
import Input from './Input';
import Modal from './Modal';

const TYPES = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

/** Create or edit a category. In edit mode the type is locked so existing records stay consistent. */
export default function CategoryFormModal({ category, defaultType = 'expense', onSubmit, onClose }) {
  const isEdit = Boolean(category);

  const initialValues = useMemo(
    () => ({
      name: category?.name || '',
      type: category?.type || defaultType,
      icon: category?.icon || 'tag',
    }),
    [category, defaultType],
  );

  const { values, errors, formError, submitting, setValue, handleChange, handleSubmit } = useForm({
    initialValues,
    validate: validateCategory,
    onSubmit: async (formValues) => {
      await onSubmit({ name: formValues.name.trim(), type: formValues.type, icon: formValues.icon });
    },
  });

  return (
    <Modal open onClose={submitting ? undefined : onClose} title={isEdit ? 'Edit category' : 'New category'} variant="sheet">
      <form className="form" onSubmit={handleSubmit} noValidate>
        <FormAlert tone="error">{formError}</FormAlert>

        <Input
          label="Category name"
          name="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g. Pets"
          required
          data-autofocus
          autoComplete="off"
        />

        <fieldset className="fieldset">
          <legend className="field__label">Type</legend>
          <div className="segmented" role="radiogroup" aria-label="Category type">
            {TYPES.map((type) => (
              <label key={type.value} className={`segmented__option ${values.type === type.value ? 'is-active' : ''} ${isEdit ? 'is-disabled' : ''}`.trim()}>
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={values.type === type.value}
                  onChange={handleChange}
                  disabled={isEdit}
                />
                {type.label}
              </label>
            ))}
          </div>
          {errors.type && (
            <p className="field__error" role="alert">
              {errors.type}
            </p>
          )}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="field__label">Icon</legend>
          <div className="icon-picker" role="radiogroup" aria-label="Category icon">
            {CATEGORY_ICON_OPTIONS.map((icon) => (
              <label key={icon} className={`icon-picker__option ${values.icon === icon ? 'is-active' : ''}`.trim()}>
                <input type="radio" name="icon" value={icon} checked={values.icon === icon} onChange={() => setValue('icon', icon)} />
                <Icon name={icon} size={20} />
                <span className="sr-only">{icon.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form__actions">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEdit ? 'Save changes' : 'Add category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
