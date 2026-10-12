import Modal from './Modal';
import Spinner from './Spinner';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmClassName = 'btn-danger',
  loading = false,
}) {
  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="btn-ghost"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={loading}
        className={`${confirmClassName} flex items-center gap-2`}
      >
        {loading && <Spinner size="sm" className="p-0" />}
        {confirmText}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      maxWidth="max-w-md"
    >
      <p className="text-charcoal-600 text-sm leading-relaxed">{message}</p>
    </Modal>
  );
}
