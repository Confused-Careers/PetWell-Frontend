import React from "react";

interface DeleteDocumentModalProps {
  open: boolean;
  documentName: string;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteDocumentModal: React.FC<DeleteDocumentModalProps> = ({
  open,
  documentName,
  onClose,
  onDelete,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-modal)]/30 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-modal)] rounded-2xl px-6 sm:px-8 md:px-10 py-6 sm:py-8 min-w-[280px] sm:min-w-[340px] max-w-[90vw] shadow-2xl relative flex flex-col items-start border border-[var(--color-modal-border)]">
        <button
          className="absolute right-4 sm:right-6 md:right-8 top-4 sm:top-6 md:top-8 text-2xl sm:text-3xl md:text-4xl text-[var(--color-modal-foreground)] hover:text-[var(--color-danger)] font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl sm:text-2xl font-serif font-bold mb-6 sm:mb-8 text-[var(--color-modal-foreground)] text-center w-full">
          Remove document?
        </h2>
        <div className="w-full text-center mb-6 sm:mb-8">
          <p className="text-sm sm:text-base text-[var(--color-modal-foreground)] mb-1">
            Are you sure you want to delete
          </p>
          <span className="font-semibold text-[var(--color-modal-foreground)]">
            {documentName}
          </span>
          ?
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end w-full mt-2">
          <button
            className="flex-1 sm:flex-none border border-[var(--color-primary)] text-[var(--color-primary)] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition text-sm sm:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 sm:flex-none bg-[var(--color-primary)] text-[var(--color-background)] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[var(--color-primary-foreground)] hover:text-[var(--color-primary)] transition text-sm sm:text-base"
            onClick={onDelete}
          >
            Yes, remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDocumentModal;
