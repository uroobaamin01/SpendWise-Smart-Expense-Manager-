import { forwardRef, useId } from 'react';
import Field, { describedBy } from './Field';

const Textarea = forwardRef(function Textarea({ label, error, hint, id, required, className = '', rows = 3, ...rest }, ref) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <Field id={textareaId} label={label} error={error} hint={hint} required={required} className={className}>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className="field__input field__textarea"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(textareaId, { error, hint })}
        {...rest}
      />
    </Field>
  );
});

export default Textarea;
