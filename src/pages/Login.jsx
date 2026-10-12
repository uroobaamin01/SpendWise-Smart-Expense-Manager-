import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormAlert from '../components/FormAlert';
import Icon from '../components/Icon';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { useToast } from '../hooks/useToast';
import { isMockApi } from '../services/api';
import { DEMO_ACCOUNT as DEMO_USER, STORAGE_KEYS } from '../utils/constants';
import { validateLogin } from '../utils/validators';

const readRememberedEmail = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.rememberedEmail) || '';
  } catch {
    return '';
  }
};

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/app';

  const initialValues = useMemo(() => {
    const email = readRememberedEmail();
    return { email, password: '', remember: Boolean(email) };
  }, []);

  const { values, errors, formError, submitting, setValues, handleChange, handleSubmit } = useForm({
    initialValues,
    validate: validateLogin,
    onSubmit: async ({ email, password, remember }) => {
      const user = await login({ email, password, remember });
      toast.success(`Welcome back, ${user.name.split(' ')[0]}.`);
      navigate(redirectTo, { replace: true });
    },
  });

  return (
    <div className="auth__card">
      <h1 className="auth__title">Welcome back</h1>
      <p className="auth__subtitle">Log in to pick up where you left off.</p>

      {isMockApi && (
        <div className="auth__demo">
          <Icon name="info" size={16} />
          <p>
            Demo mode: use <strong>{DEMO_USER.email}</strong> / <strong>{DEMO_USER.password}</strong>.{' '}
            <button type="button" onClick={() => setValues((prev) => ({ ...prev, email: DEMO_USER.email, password: DEMO_USER.password }))}>
              Fill it in
            </button>
          </p>
        </div>
      )}

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
        />
        <Input
          label="Password"
          name="password"
          type="password"
          icon="lock"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Your password"
          required
        />

        <div className="auth__row">
          <label className="checkbox">
            <input type="checkbox" name="remember" checked={values.remember} onChange={handleChange} />
            Remember me
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <Button type="submit" size="lg" block loading={submitting}>
          Log in
        </Button>
      </form>

      <p className="auth__footer">
        New to Finora? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
