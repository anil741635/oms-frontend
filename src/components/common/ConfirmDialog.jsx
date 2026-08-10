import Modal from "./Modal";

function ConfirmDialog({
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  danger = true,
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}

export default ConfirmDialog;
