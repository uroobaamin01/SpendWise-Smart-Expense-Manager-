import { forwardRef, useId } from 'react';
import Field, { describedBy } from './Field';
import Icon from './Icon';

/** `options` can be plain strings or { value, label } objects. */
const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, id, required, className = '', ...rest },
  ref,
) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <Field id={selectId} label={label} error={error} hint={hint} required={required} className={className}>
      <div className="field__control">
        <select
          ref={ref}
          id={selectId}
          className="field__input field__select"
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy(selectId, { error, hint })}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => {
            const { value, label: optionLabel } = typeof option === 'string' ? { value: option, label: option } : option;
            return (
              <option key={value} value={value}>
                {optionLabel}
              </option>
            );
          })}
        </select>
        <Icon name="chevron-down" size={18} className="field__chevron" />
      </div>
    </Field>
  );
});

export default Select;
