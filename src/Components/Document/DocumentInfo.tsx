import React, { useState } from "react";
import RenameDocumentModal from "./RenameDocumentModal";
import DeleteDocumentModal from "./DeleteDocumentModal";
import {
  Pencil,
  X as LucideX,
  FileText,
  Image as LucideImage,
  Download,
} from "lucide-react";
import { Button } from "../ui/button";
import { BiSolidPencil } from "react-icons/bi";
import { MdDownload } from "react-icons/md";

interface DocumentBoxProps {
  name: string;
  type: "pdf" | "img";
  onEdit?: (newName: string) => void;
  onDelete?: () => void;
  onDownload?: () => void;
}

const DocumentBox: React.FC<DocumentBoxProps> = ({
  name,
  type,
  onEdit,
  onDelete,
  onDownload,
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
      <div
        className="flex items-center bg-[#f6e7c0] border border-[#e5d6a7] rounded-2xl px-5 py-3 gap-3 shadow-sm w-full max-w-lg"
        style={{ minHeight: 56 }}
      >
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-lg mr-3 font-bold text-xs shrink-0 bg-white border border-[#e5d6a7]`}
        >
          {type === "pdf" ? (
            <FileText className="w-6 h-6 text-[#FDBA3B]" />
          ) : (
            <LucideImage className="w-6 h-6 text-[#34c759]" />
          )}
        </div>
        <span
          className="truncate text-base font-semibold text-[#23272F] flex-1"
          style={{ maxWidth: "180px", display: "inline-block" }}
        >
          {docName}
        </span>
        <div className="flex items-center ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#23272F] hover:text-[#23272F] h-8 w-8 p-1"
            onClick={onDownload}
            aria-label="Download Document"
            tabIndex={0}
          >
            <MdDownload />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#23272F] hover:text-[#23272F] h-8 w-8 p-1"
            onClick={() => setShowRename(true)}
            aria-label="Edit Document"
            tabIndex={0}
          >
            <BiSolidPencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#23272F] hover:text-[#990d0d] h-8 w-8 p-1"
            onClick={() => setShowDelete(true)}
            aria-label="Delete Document"
            tabIndex={0}
          >
            <LucideX className="w-5 h-5" />
          </Button>
        </div>
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
