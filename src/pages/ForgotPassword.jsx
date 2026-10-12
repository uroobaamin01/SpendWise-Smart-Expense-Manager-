import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import FormAlert from '../components/FormAlert';
import Icon from '../components/Icon';
import Input from '../components/Input';
import { useForm } from '../hooks/useForm';
import { authService } from '../services/authService';
import { validateForgotPassword } from '../utils/validators';

export default function ForgotPassword() {
  const [sentTo, setSentTo] = useState(null);

  const { values, errors, formError, submitting, handleChange, handleSubmit } = useForm({
    initialValues: { email: '' },
    validate: validateForgotPassword,
    onSubmit: async ({ email }) => {
      await authService.forgotPassword(email.trim());
      setSentTo(email.trim());
    },
  });

  if (sentTo) {
    return (
      <div className="auth__card">
        <span className="empty-state__icon" style={{ marginBottom: 20 }}>
          <Icon name="mail" size={30} />
        </span>
        <h1 className="auth__title">Check your inbox</h1>
        <p className="auth__subtitle">
          If an account exists for <strong>{sentTo}</strong>, we&apos;ve sent a link to reset your password.
        </p>
        <Button to="/login" variant="secondary" block icon="arrow-left">
          Back to log in
        </Button>
      </div>
    );
  }

  return (
    <div className="auth__card">
      <h1 className="auth__title">Forgot your password?</h1>
      <p className="auth__subtitle">Enter your email and we&apos;ll send you a link to reset it.</p>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <FormAlert tone="error">{formError}</FormAlert>
        <Input
          label="Email"
          name="email"
          type="email"
          icon="mail"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          required
          data-autofocus
        />
        <Button type="submit" size="lg" block loading={submitting}>
          Send reset link
        </Button>
      </form>

      <p className="auth__footer">
        Remembered it? <Link to="/login">Back to log in</Link>
      </p>
    </div>
  );
}
