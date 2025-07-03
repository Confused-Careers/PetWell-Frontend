import React, { useState } from "react";
import { X } from "lucide-react";

interface RenameDocumentModalProps {
  open: boolean;
  initialName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
}

const RenameDocumentModal: React.FC<RenameDocumentModalProps> = ({
  open,
  initialName,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(initialName);

  React.useEffect(() => {
    setName(initialName);
  }, [initialName, open]);

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
          Rename Document
        </p>
        <div className="w-full mt-6">
          <label className="block text-[var(--color-modal-foreground)] mb-2 font-medium text-sm sm:text-base">
            Document Name
          </label>
          <input
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="w-full mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
                      <button 
                        type="button"
            onClick={onClose}
                        className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-[#FFB23E]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                                    onClick={() => onSave(name)}

                                        className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
        
                      >
                      Save
                      </button>
                    </div>
        
      </div>
    </div>
  );
};

export default RenameDocumentModal;
