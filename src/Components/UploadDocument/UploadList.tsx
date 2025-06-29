import React from "react";

interface Upload {
  name: string;
  size: string;
  type: string;
  progress: number;
}

interface UploadListProps {
  uploads: Upload[];
  onRemove: (index: number) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  showLoader: boolean;
}

const UploadList: React.FC<UploadListProps> = ({
  uploads,
  onRemove,
  onFileChange,
  onNext,
  fileInputRef,
}) => {
  return (
    <>
      <div className="flex flex-col items-center w-full mt-6 sm:mt-8">
        <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-2xl bg-[var(--color-card)] rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
          {uploads.map((file, idx) => (
            <div key={idx} className="mb-4 sm:mb-6">
              <div className="flex items-center mb-1">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full mr-2 sm:mr-3 ${
                    file.type === "pdf" ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {file.type === "pdf" ? (
                    <span className="text-white font-bold text-xs">PDF</span>
                  ) : (
                    <span className="text-white font-bold text-xs">IMG</span>
                  )}
                </div>
                <span className="flex-1 truncate text-sm sm:text-base font-medium text-[var(--color-text)]">
                  {file.name}
                </span>
                <span className="mx-2 text-[var(--color-text)] text-xs sm:text-sm opacity-80">
                  {file.size}
                </span>
                <button
                  onClick={() => onRemove(idx)}
                  className="ml-2 text-[var(--color-text)] hover:text-red-500 text-lg sm:text-xl transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center mb-1">
                <span className="text-xs sm:text-sm text-[var(--color-text)] opacity-80 mr-2">
                  Uploading ({file.progress}%)
                </span>
                <div className="flex-1 h-1 bg-[#181f32] rounded-full overflow-hidden">
                  <div
                    className="h-1 bg-[var(--color-primary)]"
                    style={{ width: `${file.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-8 mt-4 sm:mt-6 md:mt-8 w-full max-w-sm sm:max-w-md md:max-w-2xl">
          <label className="flex-1 py-2.5 sm:py-3 rounded-lg bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold text-sm sm:text-base md:text-lg hover:bg-[var(--color-primary)] hover:text-white transition flex items-center justify-center cursor-pointer">
            Upload More Documents
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={onFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </label>
          <button
            className="flex-1 py-2.5 sm:py-3 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-sm sm:text-base md:text-lg hover:brightness-110 transition"
            onClick={onNext}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadList;
