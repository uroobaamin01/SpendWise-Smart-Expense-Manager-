import Icon from './Icon';

/** Inline form feedback (success | error) with a short entrance animation. */
export default function FormAlert({ tone = 'error', children }) {
  if (!children) return null;
  return (
    <p className={`form-alert form-alert--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon name={tone === 'error' ? 'alert-circle' : 'check-circle'} size={18} />
      <span>{children}</span>
    </p>
  );
}
