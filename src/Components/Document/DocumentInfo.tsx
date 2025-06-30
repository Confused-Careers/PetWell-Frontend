import React, { useState } from "react";
import RenameDocumentModal from "./RenameDocumentModal";
import DeleteDocumentModal from "./DeleteDocumentModal";
import {
  Pencil,
  X as LucideX,
  FileText,
  Image as LucideImage,
} from "lucide-react";
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
      <div className="flex items-center bg-[var(--color-card)] rounded-2xl px-5 py-4 shadow-md gap-3">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-xl mr-4 font-bold text-xs shrink-0 ${
            type === "pdf"
              ? "bg-[var(--color-danger)]"
              : "bg-[var(--color-success)]"
          }`}
        >
          {type === "pdf" ? (
            <FileText className="w-5 h-5 text-[var(--color-white)]" />
          ) : (
            <LucideImage className="w-5 h-5 text-[var(--color-white)]" />
          )}
        </div>
        <span
          className="truncate text-base font-semibold text-[var(--color-text)]"
          style={{ maxWidth: "180px", display: "inline-block" }}
        >
          {docName}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 text-[var(--color-primary)] hover:text-[var(--color-accent-hover)] h-8 w-8 md:h-10 md:w-10 p-1"
          onClick={() => setShowRename(true)}
          aria-label="Edit Document"
        >
          <Pencil size={16} className="md:w-[18px] md:h-[18px]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 text-gray-400 hover:text-[var(--color-danger)] h-8 w-8 md:h-10 md:w-10 p-1"
          onClick={() => setShowDelete(true)}
          aria-label="Delete Document"
        >
          <LucideX size={16} className="md:w-5 md:h-5" />
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
