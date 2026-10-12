import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import FormAlert from '../../components/FormAlert';
import Input from '../../components/Input';
import PageHeader from '../../components/PageHeader';
import Select from '../../components/Select';
import { useAuth } from '../../hooks/useAuth';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { CURRENCIES } from '../../utils/constants';
import { getCurrencySymbol } from '../../utils/formatters';
import { resizeImageToDataUrl } from '../../utils/imageUtils';
import { validatePasswordChange, validateProfile } from '../../utils/validators';

const CURRENCY_OPTIONS = CURRENCIES.map(({ code, label }) => ({ value: code, label: `${code} – ${label}` }));

function ProfileForm() {
  const { user, preferences, updateProfile } = useAuth();
  const toast = useToast();
  const fileInput = useRef(null);
  const [photoError, setPhotoError] = useState('');

  const initialValues = useMemo(
    () => ({
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      currency: preferences.currency,
      monthlyIncomeTarget: String(preferences.monthlyIncomeTarget),
      savingsGoal: String(preferences.savingsGoal),
      alertThreshold: String(preferences.alertThreshold),
    }),
    [user, preferences],
  );

  const { values, errors, formError, submitting, setValue, handleChange, handleSubmit } = useForm({
    initialValues,
    validate: validateProfile,
    onSubmit: async (form) => {
      await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        avatar: form.avatar || null,
        preferences: {
          currency: form.currency,
          monthlyIncomeTarget: Number(form.monthlyIncomeTarget),
          savingsGoal: Number(form.savingsGoal),
          alertThreshold: Number(form.alertThreshold),
        },
      });
      toast.success('Profile saved.');
    },
  });

  const choosePhoto = async (event) => {
    const [file] = event.target.files;
    event.target.value = '';
    if (!file) return;
    try {
      setPhotoError('');
      setValue('avatar', await resizeImageToDataUrl(file));
    } catch (error) {
      setPhotoError(error.message);
    }
  };

  return (
    <form className="card form profile-card" onSubmit={handleSubmit} noValidate>
      <h2 className="panel__title">Your details</h2>
      <FormAlert tone="error">{formError}</FormAlert>

      <div className="avatar-picker">
        <Avatar name={values.name} src={values.avatar} size={72} />
        <div className="avatar-picker__actions">
          <input ref={fileInput} type="file" accept="image/*" className="sr-only" onChange={choosePhoto} aria-label="Upload profile photo" tabIndex={-1} />
          <Button variant="secondary" size="sm" icon="camera" onClick={() => fileInput.current.click()}>
            {values.avatar ? 'Change photo' : 'Upload photo'}
          </Button>
          {values.avatar && (
            <Button variant="ghost" size="sm" onClick={() => setValue('avatar', '')}>
              Remove
            </Button>
          )}
          {photoError && <p className="field__error" role="alert">{photoError}</p>}
        </div>
      </div>

      <div className="form__row">
        <Input label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} autoComplete="name" required />
        <Input label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" required />
      </div>

      <h2 className="panel__title profile-card__subhead">Financial preferences</h2>
      <Select label="Currency" name="currency" value={values.currency} onChange={handleChange} options={CURRENCY_OPTIONS} hint="Used for every amount in Finora." />
      <div className="form__row">
        <Input
          label="Monthly income target"
          name="monthlyIncomeTarget"
          type="number"
          min="0"
          inputMode="decimal"
          prefix={getCurrencySymbol(values.currency)}
          value={values.monthlyIncomeTarget}
          onChange={handleChange}
          error={errors.monthlyIncomeTarget}
        />
        <Input label="Savings goal" name="savingsGoal" type="number" min="0" max="100" prefix="%" value={values.savingsGoal} onChange={handleChange} error={errors.savingsGoal} hint="Share of income you want to keep." />
      </div>
      <Input
        label="Budget alert threshold"
        name="alertThreshold"
        type="number"
        min="50"
        max="100"
        prefix="%"
        value={values.alertThreshold}
        onChange={handleChange}
        error={errors.alertThreshold}
        hint="Budgets show a warning once spending reaches this share."
      />

      <div className="form__actions">
        <Button type="submit" loading={submitting}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

function PasswordForm() {
  const { changePassword } = useAuth();
  const toast = useToast();
  const initialValues = { currentPassword: '', newPassword: '', confirmPassword: '' };

  const { values, errors, formError, submitting, handleChange, handleSubmit, reset } = useForm({
    initialValues,
    validate: validatePasswordChange,
    onSubmit: async ({ currentPassword, newPassword }) => {
      await changePassword({ currentPassword, newPassword });
      toast.success('Password updated.');
      reset(initialValues);
    },
  });

  return (
    <form className="card form profile-card" onSubmit={handleSubmit} noValidate>
      <h2 className="panel__title">Change password</h2>
      <FormAlert tone="error">{formError}</FormAlert>
      <Input label="Current password" name="currentPassword" type="password" autoComplete="current-password" value={values.currentPassword} onChange={handleChange} error={errors.currentPassword} />
      <div className="form__row">
        <Input label="New password" name="newPassword" type="password" autoComplete="new-password" value={values.newPassword} onChange={handleChange} error={errors.newPassword} hint="At least 8 characters, with a letter and a number." />
        <Input label="Confirm new password" name="confirmPassword" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
      </div>
      <div className="form__actions">
        <Button type="submit" variant="secondary" loading={submitting}>
          Update password
        </Button>
      </div>
    </form>
  );
}

export default function Profile() {
  useDocumentTitle('Profile');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Manage your account and how Finora shows your money." />
      <div className="profile-layout">
        <ProfileForm />
        <div className="stack">
          <PasswordForm />
          <section className="card panel profile-logout">
            <h2 className="panel__title">Sign out</h2>
            <p className="panel__empty">You will need to log in again to see your finances.</p>
            <Button variant="secondary" icon="log-out" onClick={handleLogout}>
              Log out
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
