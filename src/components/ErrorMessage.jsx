import Button from './Button';
import Icon from './Icon';

export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <span className="error-message__icon">
        <Icon name="alert-triangle" size={26} />
      </span>
      <h3 className="error-message__title">{title}</h3>
      <p className="error-message__text">{message || 'We could not load this right now. Please try again.'}</p>
      {onRetry && (
        <Button variant="secondary" icon="refresh" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
