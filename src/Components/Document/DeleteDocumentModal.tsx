import React from "react";
import { X } from "lucide-react";

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
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-background)] rounded-2xl px-6 sm:px-8 md:px-10 py-6 sm:py-8 min-w-lg shadow-2xl relative flex flex-col items-start border border-[var(--color-modal-border)]">
        <button
          className="absolute cursor-pointer right-4 sm:right-6 md:right-8 top-4 sm:top-6 md:top-8 text-2xl sm:text-3xl md:text-4xl text-[var(--color-modal-foreground)] hover:text-[var(--color-danger)] font-bold flex items-center justify-center"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
            <p className="text-3xl font-lighter flex items-center gap-3 font-serif">
          Remove document?
        </p>
        <div className="w-full text-left mb-6 sm:mb-8 mt-6">
          <p className="block text-[var(--color-modal-foreground)] mb-2 font-medium text-sm sm:text-base">
            Are you sure you want to delete
          </p>
          <p className="font-semibold text-left text-[var(--color-modal-foreground)]">
            {documentName}
          </p>
          ?
        </div>
         <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
                      <button 
                        type="button"
            onClick={onClose}
                        className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-[#FFB23E]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
            onClick={onDelete}

                                        className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
        
                      >
                      Yes, remove
                      </button>
                    </div>
       
      </div>
    </div>
  );
};

export default DeleteDocumentModal;
