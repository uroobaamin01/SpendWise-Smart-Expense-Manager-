import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormAlert from '../components/FormAlert';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import { useToast } from '../hooks/useToast';
import { validateRegister } from '../utils/validators';

const INITIAL_VALUES = { name: '', email: '', password: '', confirmPassword: '' };

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const { values, errors, formError, submitting, handleChange, handleSubmit } = useForm({
    initialValues: INITIAL_VALUES,
    validate: validateRegister,
    onSubmit: async ({ name, email, password, confirmPassword }) => {
      const user = await register({ name, email, password, confirmPassword });
      toast.success(`Welcome to Finora, ${user.name.split(' ')[0]}!`);
      navigate('/app', { replace: true });
    },
  });

  return (
    <div className="auth__card">
      <h1 className="auth__title">Create your account</h1>
      <p className="auth__subtitle">Start tracking your money in under a minute.</p>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <FormAlert tone="error">{formError}</FormAlert>

        <Input
          label="Full name"
          name="name"
          icon="user"
          autoComplete="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Alex Morgan"
          required
        />
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
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          hint="At least 8 characters, with a letter and a number."
          required
        />
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          icon="lock"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <Button type="submit" size="lg" block loading={submitting}>
          Create account
        </Button>
      </form>

      <p className="auth__footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
