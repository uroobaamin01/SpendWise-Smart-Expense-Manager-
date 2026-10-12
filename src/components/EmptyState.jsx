import Button from './Button';
import Icon from './Icon';

export default function EmptyState({ icon = 'inbox', title, message, action, secondaryAction, compact = false }) {
  return (
    <div className={`empty-state ${compact ? 'empty-state--compact' : ''}`.trim()}>
      <span className="empty-state__icon">
        <Icon name={icon} size={compact ? 24 : 30} />
      </span>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {(action || secondaryAction) && (
        <div className="empty-state__actions">
          {action && (
            <Button to={action.to} onClick={action.onClick} icon={action.icon}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" to={secondaryAction.to} onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
