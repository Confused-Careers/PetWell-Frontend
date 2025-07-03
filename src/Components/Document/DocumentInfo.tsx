import React, { useState } from "react";
import RenameDocumentModal from "./RenameDocumentModal";
import DeleteDocumentModal from "./DeleteDocumentModal";
import {
  X as LucideX,
} from "lucide-react";
import { Button } from "../ui/button";
import { BiSolidPencil } from "react-icons/bi";
import { MdDownload } from "react-icons/md";

interface DocumentBoxProps {
  idx: number;
  name: string;
  type: "pdf" | "img";
  onEdit?: (idx: number, newName: string) => void;
  onDelete?: () => void;
  onDownload?: () => void;
}

const DocumentBox: React.FC<DocumentBoxProps> = ({
  idx,
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
    if (onEdit) {
      onEdit(idx, newName);
    }
    setShowRename(false);
  };

  const handleDelete = () => {
    setShowDelete(false);
    if (onDelete) onDelete();
  };

  return (
    <>
      <div className="flex flex-row items-center bg-[#f6e7c0] border border-[var(--color-primary)] rounded-2xl px-3 py-2 gap-2 shadow-sm w-full flex-nowrap">
        <div
          className={`flex items-center justify-center rounded-lg font-bold text-xs shrink-0`}
        >
          {type === "pdf" ? (
            <svg
              className="size-6"
              viewBox="0 0 30 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.24839 0H18.6217L29.956 11.8141V34.7926C29.956 37.6712 27.6272 40 24.7586 40H5.24839C2.36984 40 0.0410156 37.6712 0.0410156 34.7926V5.20738C0.0409651 2.32883 2.36979 0 5.24839 0Z"
                fill="#E5252A"
              />
              <path
                opacity="0.302"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.6118 0V11.7241H29.9562L18.6118 0Z"
                fill="white"
              />
              <path
                d="M5.82861 29.8454V22.5391H8.93707C9.70669 22.5391 10.3164 22.749 10.7762 23.1787C11.2359 23.5985 11.4658 24.1683 11.4658 24.8779C11.4658 25.5875 11.2359 26.1573 10.7762 26.577C10.3164 27.0068 9.70669 27.2167 8.93707 27.2167H7.69768V29.8454H5.82861ZM7.69768 25.6276H8.72718C9.00702 25.6276 9.22691 25.5676 9.37687 25.4277C9.52677 25.2977 9.60677 25.1178 9.60677 24.8779C9.60677 24.6381 9.52682 24.4582 9.37687 24.3282C9.22697 24.1883 9.00707 24.1283 8.72718 24.1283H7.69768V25.6276ZM12.2354 29.8454V22.5391H14.8241C15.3339 22.5391 15.8136 22.609 16.2634 22.759C16.7131 22.9089 17.123 23.1188 17.4828 23.4087C17.8426 23.6885 18.1324 24.0683 18.3423 24.5481C18.5422 25.0278 18.6522 25.5776 18.6522 26.1972C18.6522 26.807 18.5423 27.3567 18.3423 27.8364C18.1324 28.3162 17.8426 28.696 17.4828 28.9758C17.1229 29.2657 16.7131 29.4756 16.2634 29.6255C15.8136 29.7754 15.3339 29.8454 14.8241 29.8454H12.2354ZM14.0645 28.2562H14.6042C14.8941 28.2562 15.1639 28.2263 15.4138 28.1563C15.6537 28.0863 15.8836 27.9763 16.1035 27.8264C16.3134 27.6765 16.4833 27.4666 16.6032 27.1868C16.7231 26.9069 16.7831 26.577 16.7831 26.1972C16.7831 25.8074 16.7231 25.4776 16.6032 25.1978C16.4833 24.9179 16.3134 24.708 16.1035 24.5581C15.8836 24.4082 15.6537 24.2982 15.4138 24.2283C15.1639 24.1583 14.8941 24.1283 14.6042 24.1283H14.0645V28.2562ZM19.5917 29.8454V22.5391H24.7892V24.1283H21.4608V25.2977H24.1195V26.8769H21.4608V29.8454H19.5917Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              className="size-6"
              viewBox="0 0 30 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.7405 12.3134V33.7238C29.7405 35.7175 28.1243 37.3338 26.1305 37.3338H3.86928C1.87553 37.3338 0.259277 35.7175 0.259277 33.7238V4.27669C0.259694 2.28294 1.87553 0.666687 3.86928 0.666687H18.7793L29.7405 12.3134Z"
                fill="#00C884"
              />
              <path
                d="M29.7405 12.3134H21.186C19.8568 12.3134 18.7793 11.2359 18.7793 9.90669V0.666687L29.7405 12.3134Z"
                fill="#83FFCC"
              />
              <path
                d="M6.93618 25.7625V28.2021H5.2041V21.015H8.07119C8.62119 21.015 9.10744 21.1163 9.53077 21.3183C9.95369 21.5204 10.2804 21.8096 10.5133 22.1833C10.7437 22.5571 10.8612 22.98 10.8612 23.4546C10.8612 24.155 10.6095 24.7142 10.1066 25.135C9.60618 25.5533 8.91744 25.7625 8.04077 25.7625H6.93618ZM6.93618 24.425H8.07119C8.40743 24.425 8.66327 24.3429 8.83952 24.1733C9.01577 24.0067 9.10285 23.7692 9.10285 23.4638C9.10285 23.1275 9.01119 22.8596 8.83035 22.6575C8.64952 22.4579 8.40244 22.3567 8.08994 22.3521H6.93618V24.425Z"
                fill="white"
              />
              <path
                d="M17.7843 28.2017H16.0618L13.5143 23.7292V28.2017H11.7822V21.015H13.5143L16.0572 25.4875V21.015H17.7847L17.7843 28.2017Z"
                fill="white"
              />
              <path
                d="M24.7625 27.3133C24.497 27.6096 24.1066 27.8467 23.592 28.0279C23.0795 28.2087 22.5179 28.3004 21.9045 28.3004C20.9645 28.3004 20.2125 28.0112 19.6508 27.4354C19.0866 26.8596 18.7858 26.0583 18.7458 25.0333L18.7412 24.4104C18.7412 23.7029 18.8658 23.085 19.117 22.5562C19.3662 22.03 19.7233 21.6233 20.1912 21.3387C20.6566 21.0546 21.1945 20.9108 21.8058 20.9108C22.7012 20.9108 23.397 21.1154 23.8929 21.5267C24.3862 21.9354 24.6754 22.5467 24.7579 23.36H23.0891C23.0304 22.9579 22.9012 22.6712 22.7037 22.5C22.5062 22.3283 22.2266 22.2437 21.8645 22.2437C21.432 22.2437 21.0962 22.4271 20.8587 22.7962C20.6212 23.1654 20.5016 23.6917 20.4991 24.3754V24.81C20.4991 25.5267 20.6212 26.0675 20.8658 26.4271C21.1125 26.7867 21.4979 26.9675 22.0245 26.9675C22.4733 26.9675 22.8095 26.8662 23.0304 26.6667V25.5504H21.827V24.3612H24.7625V27.3133Z"
                fill="white"
              />
            </svg>
          )}
        </div>
        <span
          className="truncate text-sm font-semibold text-[#23272F] flex-1 min-w-0"
          style={{ maxWidth: "180px", display: "inline-block" }}
        >
          {docName}
        </span>
        <div className="flex items-center ml-auto gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#23272F] cursor-pointer hover:text-[#23272F]"
            onClick={onDownload}
            aria-label="Download Document"
            tabIndex={0}
          >
            <MdDownload className="size-5" />
          </Button>
        <Button
          variant="ghost"
          size="icon"
            className="text-[#23272F] cursor-pointer hover:text-[#23272F]"
          onClick={() => setShowRename(true)}
          aria-label="Edit Document"
            tabIndex={0}
        >
            <BiSolidPencil className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
            className="text-[#23272F] cursor-pointer hover:text-[#990d0d]"
          onClick={() => setShowDelete(true)}
          aria-label="Delete Document"
            tabIndex={0}
        >
            <LucideX className="size-5" />
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
