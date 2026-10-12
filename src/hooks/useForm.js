import { useCallback, useRef, useState } from 'react';

/**
 * Small form helper: values, validation on submit, API error mapping and a submitting flag.
 * `validate(values)` returns `{ field: message }`; `onSubmit(values)` may throw an ApiError
 * whose `errors` are mapped back onto the matching fields.
 */
export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const initialRef = useRef(initialValues);

  const setValue = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const { [name]: removed, ...rest } = current;
      return rest;
    });
  }, []);

  const handleChange = useCallback(
    (event) => {
      const { name, type, value, checked } = event.target;
      setValue(name, type === 'checkbox' ? checked : value);
    },
    [setValue],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const found = validate ? validate(values) : {};
    setErrors(found);
    setFormError('');
    const [firstInvalid] = Object.keys(found);
    if (firstInvalid) {
      event.currentTarget.elements?.[firstInvalid]?.focus?.();
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      setFormError(error.message || 'Something went wrong. Please try again.');
      if (error.errors && Object.keys(error.errors).length > 0) setErrors((current) => ({ ...current, ...error.errors }));
    } finally {
      setSubmitting(false);
    }
  };

  const reset = useCallback((nextValues) => {
    setValues(nextValues ?? initialRef.current);
    setErrors({});
    setFormError('');
  }, []);

  return { values, errors, formError, submitting, setValue, setValues, setErrors, setFormError, handleChange, handleSubmit, reset };
}
