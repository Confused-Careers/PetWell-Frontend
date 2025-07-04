import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PetWellLogo from "../../../Assets/PetWell.png";
import { UploadIcon } from "lucide-react";
import autofillServices from "../../../Services/autofillServices";
import Loader from "../../../Components/ui/Loader";
import UploadList from "../../../Components/UploadDocument/UploadList";

const UploadOptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState<
    {
      name: string;
      size: string;
      type: string;
      progress: number;
      file: File;
    }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const uploadTimers = useRef<{ [key: number]: ReturnType<typeof setInterval> }>({});

  useEffect(() => {
    uploads.forEach((u, idx) => {
      if (u.progress < 100 && !uploadTimers.current[idx]) {
        uploadTimers.current[idx] = setInterval(() => {
          setUploads((currentUploads) => {
            return currentUploads.map((u2, j) => {
              if (j === idx && u2.progress < 100) {
                const next = Math.min(
                  u2.progress + Math.floor(Math.random() * 10 + 10),
                  100
                );
                return { ...u2, progress: next };
              }
              return u2;
            });
          });
        }, 200);
      }
    });
    // Cleanup timers when file reaches 100%
    uploads.forEach((u, idx) => {
      if (u.progress >= 100 && uploadTimers.current[idx]) {
        clearInterval(uploadTimers.current[idx]);
        delete uploadTimers.current[idx];
      }
    });
  }, [uploads]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(uploadTimers.current).forEach(clearInterval);
    };
  }, []);

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (file.size > maxSize) {
      return `File size must be less than 10MB. Current size: ${(
        file.size /
        (1024 * 1024)
      ).toFixed(1)}MB`;
    }
    if (!allowedTypes.includes(file.type)) {
      return `File type not supported. Please upload PDF, JPG, PNG, or DOC files.`;
    }
    return null;
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: typeof uploads = [];
    const errors: string[] = [];
    fileArray.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.name.split(".").pop()?.toUpperCase() || "OTHER",
          progress: 0,
          file: file,
        });
      }
    });
    if (errors.length > 0) {
      setUploadError(errors.join("\n"));
      setTimeout(() => setUploadError(null), 5000);
    }
    if (validFiles.length > 0) {
      setUploads((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    }
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files) {
      processFiles(files);
    }
  };

  const handleRemove = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadComplete = async () => {
    if (uploads.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "Authentication required. Please complete the OTP verification step first."
        );
      }
      // Create pet from documents
      const response = await autofillServices.createPetFromDocuments(
        uploads.map((u) => u.file)
      );
      const petId = response.pet?.id;
      if (!petId) {
        throw new Error(
          "Failed to create pet from documents - no pet ID returned"
        );
      }
      // Helper to poll for documents
      const pollForDocuments = async (
        petId: string,
        maxAttempts = 15,
        interval = 2000
      ) => {
        let attempts = 0;
        let docs: any[] = [];
        while (attempts < maxAttempts) {
          try {
            const docRes = await import("../../../Services/petServices");
            const result = await docRes.default.getPetDocuments(petId);
            docs = Array.isArray(result?.data) ? result.data : [];
            if (docs.length > 0) break;
          } catch (e) {}
          await new Promise((res) => setTimeout(res, interval));
          attempts++;
        }
        return docs;
      };
      let documents = response.documents;
      if (!documents || !Array.isArray(documents) || documents.length === 0) {
        documents = await pollForDocuments(petId);
      }
      const documentIds =
        documents
          ?.map((doc: any) => doc.document_id || doc.id)
          .filter(Boolean) || [];
      const vaccineIds =
        documents
          ?.filter((doc: any) => doc.type === "vaccine")
          .map((doc: any) => doc.document_id || doc.id)
          .filter(Boolean) || [];
      const queryParams = new URLSearchParams();
      if (documentIds.length > 0) {
        queryParams.append("documents", documentIds.join(","));
      }
      if (vaccineIds.length > 0) {
        queryParams.append("vaccines", vaccineIds.join(","));
      }
      const queryString = queryParams.toString();
      const verificationUrl = queryString
        ? `/petowner/pet/${petId}/verify?${queryString}`
        : `/petowner/pet/${petId}/verify`;
      navigate(verificationUrl);
    } catch (err: any) {
      let errorMessage =
        "Failed to create pet from documents. Please try again.";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage =
            "Authentication failed. Please go back and complete the OTP verification step.";
        } else if (err.response.status === 500) {
          errorMessage =
            "Server error occurred. Please try again or contact support.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setUploadError(errorMessage);
      setUploads((prev) =>
        prev.map((item) => ({ ...item, status: "error" as const }))
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center w-full relative px-2 pt-10 sm:p-4 md:p-8">
      {uploading && <Loader />}
      <div className="flex flex-col sm:flex-row w-full">
        <div className="flex justify-center sm:justify-start h-8 mb-8 md:mb-0">
          <img
            src={PetWellLogo}
            alt="PetWell Logo"
            className="object-contain h-full w-auto"
          />
        </div>
        <div className="flex flex-1 justify-center sm:pr-16"></div>
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6">
        <div className="text-center my-8 mt-10">
          <p className=" font-[Alike,serif] text-3xl sm:pr-16 text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
            Got a vaccine card or medical record handy?
          </p>
          <p className="text-lg text-[var(--color-label)] max-w-2xl">
            Just upload it — we'll use it to build your pet's profile for you.
            <br />
            You can edit or add more info later.
          </p>
        </div>
        {uploadError && (
          <div className="w-full max-w-md mb-4 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 rounded py-2 px-3 text-sm animate-fade-in">
            {uploadError}
          </div>
        )}
        {uploading && (
          <div className="w-full max-w-xl mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Creating pet from documents...</span>
              <span>{/* You can add a progress bar if needed */}</span>
            </div>
          </div>
        )}
        <div className="w-full max-w-xl">
          {uploads.length === 0 ? (
            <>
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full bg-[var(--color-card)] rounded-2xl shadow-xl p-12 flex flex-col items-center cursor-pointer transition-all duration-200 border ${
                  isDragOver
                    ? "border-text-[var(--color-text)] border-opacity-80"
                    : "border-text-[var(--color-text)] border-opacity-30 hover:border-opacity-60"
                }`}
                style={{ minHeight: 200 }}
              >
                <label
                  htmlFor="file-upload"
                  className="flex flex-row gap-3 items-center cursor-pointer"
                >
                  <UploadIcon
                    className={`w-7 h-7 mb-1 text-light transition-colors text-[var(--color-text)]`}
                  />
                  <span className="text-xl font-semibold text-[var(--color-text)] mb-2">
                    {isDragOver ? "Drop files here" : "Upload a document"}
                  </span>
                </label>
                <label className="mt-2 text-sm text-[var(--color-text)]">
                  Supported formats: PDF, JPG, PNG, DOC (Max 10MB each)
                </label>
              </div>
              <p className="text-lg text-[var(--color-label)] max-w-2xl mt-12 text-center">
                Prefer to enter details yourself?{" "}
                <span
                  className="text-[#FFB23E] font-bold cursor-pointer"
                  onClick={() => navigate("/add-pet-profile")}
                >
                  Enter Manually
                </span>
              </p>
            </>
          ) : (
            <UploadList
              uploads={uploads.map((upload) => ({
                name: upload.name,
                size: upload.size,
                type: upload.type,
                progress: upload.progress,
              }))}
              onRemove={handleRemove}
              onFileChange={handleFileChange}
              onNext={handleUploadComplete}
              fileInputRef={fileInputRef}
              showLoader={uploading}
            />
          )}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            ref={fileInputRef}
            disabled={uploading}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadOptionPage;
