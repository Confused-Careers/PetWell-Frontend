import React from "react";
import { FilePlus, X } from "lucide-react";

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
  showLoader,
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
                    file.type === "pdf"
                      ? "bg-[var(--color-danger)]"
                      : "bg-[var(--color-success)]"
                  }`}
                >
                  {file.type === "pdf" ? (
                    <span className="text-[var(--color-white)] font-bold text-xs">
                      <svg width="31" height="40" viewBox="0 0 31 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M5.74839 0H19.1217L30.456 11.8141V34.7926C30.456 37.6712 28.1272 40 25.2586 40H5.74839C2.86984 40 0.541016 37.6712 0.541016 34.7926V5.20738C0.540965 2.32883 2.86979 0 5.74839 0Z" fill="#E5252A"/>
<path opacity="0.302" fillRule="evenodd" clipRule="evenodd" d="M19.1118 0V11.7241H30.4562L19.1118 0Z" fill="white"/>
<path d="M6.32861 29.8454V22.5391H9.43707C10.2067 22.5391 10.8164 22.749 11.2762 23.1787C11.7359 23.5985 11.9658 24.1683 11.9658 24.8779C11.9658 25.5875 11.7359 26.1573 11.2762 26.577C10.8164 27.0068 10.2067 27.2167 9.43707 27.2167H8.19768V29.8454H6.32861ZM8.19768 25.6276H9.22718C9.50702 25.6276 9.72691 25.5676 9.87687 25.4277C10.0268 25.2977 10.1068 25.1178 10.1068 24.8779C10.1068 24.6381 10.0268 24.4582 9.87687 24.3282C9.72697 24.1883 9.50707 24.1283 9.22718 24.1283H8.19768V25.6276ZM12.7354 29.8454V22.5391H15.3241C15.8339 22.5391 16.3136 22.609 16.7634 22.759C17.2131 22.9089 17.623 23.1188 17.9828 23.4087C18.3426 23.6885 18.6324 24.0683 18.8423 24.5481C19.0422 25.0278 19.1522 25.5776 19.1522 26.1972C19.1522 26.807 19.0423 27.3567 18.8423 27.8364C18.6324 28.3162 18.3426 28.696 17.9828 28.9758C17.6229 29.2657 17.2131 29.4756 16.7634 29.6255C16.3136 29.7754 15.8339 29.8454 15.3241 29.8454H12.7354ZM14.5645 28.2562H15.1042C15.3941 28.2562 15.6639 28.2263 15.9138 28.1563C16.1537 28.0863 16.3836 27.9763 16.6035 27.8264C16.8134 27.6765 16.9833 27.4666 17.1032 27.1868C17.2231 26.9069 17.2831 26.577 17.2831 26.1972C17.2831 25.8074 17.2231 25.4776 17.1032 25.1978C16.9833 24.9179 16.8134 24.708 16.6035 24.5581C16.3836 24.4082 16.1537 24.2982 15.9138 24.2283C15.6639 24.1583 15.3941 24.1283 15.1042 24.1283H14.5645V28.2562ZM20.0917 29.8454V22.5391H25.2892V24.1283H21.9608V25.2977H24.6195V26.8769H21.9608V29.8454H20.0917Z" fill="white"/>
</svg>

                    </span>
                  ) : (
                    <span className="text-[var(--color-white)] font-bold text-xs">
                      <svg width="31" height="38" viewBox="0 0 31 38" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30.2405 12.3137V33.7241C30.2405 35.7178 28.6243 37.3341 26.6305 37.3341H4.36928C2.37553 37.3341 0.759277 35.7178 0.759277 33.7241V4.27699C0.759694 2.28324 2.37553 0.666992 4.36928 0.666992H19.2793L30.2405 12.3137Z" fill="#00C884"/>
<path d="M30.2405 12.3137H21.686C20.3568 12.3137 19.2793 11.2362 19.2793 9.90699V0.666992L30.2405 12.3137Z" fill="#83FFCC"/>
<path d="M7.43618 25.7631V28.2027H5.7041V21.0156H8.57119C9.12119 21.0156 9.60744 21.1169 10.0308 21.319C10.4537 21.521 10.7804 21.8102 11.0133 22.184C11.2437 22.5577 11.3612 22.9806 11.3612 23.4552C11.3612 24.1556 11.1095 24.7148 10.6066 25.1356C10.1062 25.554 9.41744 25.7631 8.54077 25.7631H7.43618ZM7.43618 24.4256H8.57119C8.90743 24.4256 9.16327 24.3435 9.33952 24.174C9.51577 24.0073 9.60285 23.7698 9.60285 23.4644C9.60285 23.1281 9.51119 22.8602 9.33035 22.6581C9.14952 22.4585 8.90244 22.3573 8.58994 22.3527H7.43618V24.4256Z" fill="white"/>
<path d="M18.2843 28.2023H16.5618L14.0143 23.7298V28.2023H12.2822V21.0156H14.0143L16.5572 25.4881V21.0156H18.2847L18.2843 28.2023Z" fill="white"/>
<path d="M25.2625 27.3136C24.997 27.6099 24.6066 27.847 24.092 28.0282C23.5795 28.209 23.0179 28.3007 22.4045 28.3007C21.4645 28.3007 20.7125 28.0116 20.1508 27.4357C19.5866 26.8599 19.2858 26.0586 19.2458 25.0336L19.2412 24.4107C19.2412 23.7032 19.3658 23.0853 19.617 22.5566C19.8662 22.0303 20.2233 21.6236 20.6912 21.339C21.1566 21.0549 21.6945 20.9111 22.3058 20.9111C23.2012 20.9111 23.897 21.1157 24.3929 21.527C24.8862 21.9357 25.1754 22.547 25.2579 23.3603H23.5891C23.5304 22.9582 23.4012 22.6716 23.2037 22.5003C23.0062 22.3286 22.7266 22.2441 22.3645 22.2441C21.932 22.2441 21.5962 22.4274 21.3587 22.7966C21.1212 23.1657 21.0016 23.692 20.9991 24.3757V24.8103C20.9991 25.527 21.1212 26.0678 21.3658 26.4274C21.6125 26.787 21.9979 26.9678 22.5245 26.9678C22.9733 26.9678 23.3095 26.8666 23.5304 26.667V25.5507H22.327V24.3616H25.2625V27.3136Z" fill="white"/>
</svg>

                    </span>
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
                  className="ml-2 text-[var(--color-text)] hover:text-[var(--color-danger)] text-lg sm:text-xl transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center mb-1">
                <span className="text-xs sm:text-sm text-[var(--color-text)] opacity-80 mr-2">
                  Uploading ({file.progress}%)
                </span>
                <div className="flex-1 h-1 bg-[var(--color-background)] rounded-full overflow-hidden">
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
          <label className="flex-1 cursor-pointer border border-[var(--color-card-button)] text-[var(--color-primary)] bg-transparent hover:opacity-90 hover:text-[var(--color-primary)] px-0 py-2 rounded-3xl font-semibold transition text-base flex items-center justify-center gap-2">
            <FilePlus className="w-5 h-5" />
            <span>Upload More Documents</span>
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
            className="flex-1 cursor-pointer text-[var(--color-text)] bg-[var(--color-card-button)] hover:opacity-90 px-0 py-2 rounded-3xl font-semibold transition text-base flex items-center justify-center gap-2"
            onClick={onNext}
            disabled={showLoader}
          >
            {showLoader ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-[var(--color-primary)]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadList;
