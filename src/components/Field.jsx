/** Shared label / hint / error wrapper used by Input, Select and Textarea. */
export default function Field({ id, label, error, hint, required, className = '', children }) {
  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className="field__label">
          {label}
          {required && (
            <span className="field__required" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const describedBy = (id, { error, hint }) =>
  [error && `${id}-error`, hint && !error && `${id}-hint`].filter(Boolean).join(' ') || undefined;
