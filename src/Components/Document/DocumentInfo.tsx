import React, { useState } from "react";
import RenameDocumentModal from "./RenameDocumentModal";
import DeleteDocumentModal from "./DeleteDocumentModal";
import { Pencil, X as LucideX } from "lucide-react";
import { Button } from "../ui/button";

interface DocumentBoxProps {
  name: string;
  type: "pdf" | "img";
  onEdit?: (newName: string) => void;
  onDelete?: () => void;
}

const DocumentBox: React.FC<DocumentBoxProps> = ({
  name,
  type,
  onEdit,
  onDelete,
}) => {
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [docName, setDocName] = useState(name);

  const handleSave = (newName: string) => {
    setDocName(newName);
    setShowRename(false);
    if (onEdit) onEdit(newName);
  };

  const handleDelete = () => {
    setShowDelete(false);
    if (onDelete) onDelete();
  };

  return (
    <>
      <div className="flex items-center bg-[var(--color-card)] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow">
        <div
          className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full mr-2 sm:mr-3 font-bold text-xs ${
            type === "pdf"
              ? "bg-[var(--color-danger)]"
              : "bg-[var(--color-success)]"
          }`}
        >
          {type === "pdf" ? (
            <span className="text-[var(--color-white)] text-xs">PDF</span>
          ) : (
            <span className="text-[var(--color-white)] text-xs">IMG</span>
          )}
        </div>
        <span className="flex-1 truncate text-sm sm:text-base font-medium text-[var(--color-white)]">
          {docName}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 sm:ml-2 text-[var(--color-primary)] hover:text-[var(--color-accent-hover)] h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 p-1"
          onClick={() => setShowRename(true)}
          aria-label="Edit Document"
        >
          <Pencil size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 sm:ml-2 text-gray-400 hover:text-[var(--color-danger)] h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 p-1"
          onClick={() => setShowDelete(true)}
          aria-label="Delete Document"
        >
          <LucideX size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
        </Button>
      </div>
      <RenameDocumentModal
        open={showRename}
        initialName={docName}
        onClose={() => setShowRename(false)}
        onSave={handleSave}
      />
      <DeleteDocumentModal
        open={showDelete}
        documentName={docName}
        onClose={() => setShowDelete(false)}
        onDelete={handleDelete}
      />
    </>
  );
};

export default DocumentBox;
