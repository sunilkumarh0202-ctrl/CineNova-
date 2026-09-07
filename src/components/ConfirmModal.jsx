import React from 'react';

export default function ConfirmModal({ isOpen, title = "Confirm Action", message = "Are you sure you want to delete this content?", onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <h3 id="modal-title" className="modal-title">{title}</h3>
        <p className="modal-body">{message}</p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Delete Content
          </button>
        </div>
      </div>
    </div>
  );
}
