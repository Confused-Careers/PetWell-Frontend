import React, { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import UploadList from "./UploadList";

interface UploadDocumentProps {
  onNext?: () => void;
  onUpload?: (
    file: File,
    meta: { name: string; type: string }
  ) => Promise<void>;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({
  onNext,
  onUpload,
}) => {
  const [uploads, setUploads] = useState<
    { name: string; size: string; type: string; progress: number }[]
  >([]);
  const [showLoader, setShowLoader] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(
    null
  ) as React.RefObject<HTMLInputElement>;

  const handleRemove = (index: number) => {
    setUploads(uploads.filter((_, i) => i !== index));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    let fileType: string = ext ? ext.toUpperCase() : "OTHER";
    const newUpload = {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: fileType,
      progress: 0,
    };
    setUploads((prev) => [...prev, newUpload]);
    const uploadIndex = uploads.length;
    console.debug("[Upload] File selected:", file);
    if (onUpload) {
      try {
        console.debug("[Upload] Starting API call for:", file.name);
        await onUpload(file, { name: file.name, type: fileType });
        setUploads((prev) =>
          prev.map((item, idx) =>
            idx === uploadIndex ? { ...item, progress: 100 } : item
          )
        );
        console.debug("[Upload] API call success for:", file.name);
      } catch (err) {
        setUploads((prev) =>
          prev.map((item, idx) =>
            idx === uploadIndex ? { ...item, progress: 0 } : item
          )
        );
        console.error("[Upload] API call error for:", file.name, err);
      }
    } else {
      // fallback: simulate progress
      let prog = 0;
      const interval = setInterval(() => {
        prog += 10;
        setUploads((prev) =>
          prev.map((item, idx) =>
            idx === uploadIndex
              ? { ...item, progress: Math.min(prog, 100) }
              : item
          )
        );
        if (prog >= 100) clearInterval(interval);
      }, 200);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleNext = () => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      if (onNext) onNext();
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col items-center mt-8">
      {/* Upload Card */}
      {uploads.length === 0 && (
        <div className="flex flex-col items-center w-full mt-12">
          <div className="mx-auto w-full max-w-xl bg-[var(--color-card)] rounded-2xl shadow-xl p-10 flex flex-col items-center">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <UploadCloud className="w-10 h-10 mb-2 text-[var(--color-primary)]" />
              <span className="text-xl font-medium text-[var(--color-text)]">
                Upload a document
              </span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                ref={fileInputRef}
              />
            </label>
            <span className="mt-3 text-sm text-[var(--color-text)] opacity-70">
              Supported formats: PDF, JPG, PNG, DOC.
            </span>
          </div>
        </div>
      )}
      {/* Upload List */}
      {uploads.length > 0 && (
        <UploadList
          uploads={uploads}
          onRemove={handleRemove}
          onFileChange={handleFileChange}
          onNext={handleNext}
          fileInputRef={fileInputRef}
          showLoader={showLoader}
        />
      )}
    </div>
  );
};

export default UploadDocument;
