import Button from './Button';
import Icon from './Icon';
import Modal from './Modal';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading = false,
  error,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onCancel}
      size="sm"
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone} onClick={onConfirm} loading={loading} data-autofocus>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="confirm">
        <span className={`confirm__icon confirm__icon--${tone}`}>
          <Icon name="alert-triangle" size={22} />
        </span>
        <p className="confirm__message">{message}</p>
      </div>
      {error && (
        <p className="form-alert form-alert--error" role="alert">
          <Icon name="alert-circle" size={18} />
          {error}
        </p>
      )}
    </Modal>
  );
}
