import { forwardRef, useId, useState } from 'react';
import Field, { describedBy } from './Field';
import Icon from './Icon';

/** Text-like input. `type="password"` automatically gets a show / hide toggle. */
const Input = forwardRef(function Input(
  { label, error, hint, icon, prefix, type = 'text', id, required, className = '', ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';

  return (
    <Field id={inputId} label={label} error={error} hint={hint} required={required} className={className}>
      <div className="field__control">
        {icon && <Icon name={icon} size={18} className="field__icon" />}
        {prefix && <span className="field__prefix">{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          type={isPassword && revealed ? 'text' : type}
          className={`field__input ${icon ? 'has-icon' : ''} ${prefix ? 'has-prefix' : ''} ${isPassword ? 'has-toggle' : ''}`.trim()}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy(inputId, { error, hint })}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
          >
            <Icon name={revealed ? 'eye-off' : 'eye'} size={18} />
          </button>
        )}
      </div>
    </Field>
  );
});

export default Input;
