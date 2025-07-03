import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Components/ui/Loader";
import PetWellLogo from "../../../Assets/PetWell.png";
import Step4HumanInfoUpload from "./Step4HumanInfoUpload";
import Step5OTPVerificationUpload from "./Step5OTPVerificationUpload";
import type { FormData } from "./types";
import UploadList from "../../../Components/UploadDocument/UploadList";
import autofillServices from "../../../Services/autofillServices";
import { UploadIcon } from "lucide-react";

const PetParentSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const [currentStep, setCurrentStep] = useState<"step4" | "step5" | "upload">(
    "step4"
  );

  // Form state for Step 4 and Step 5
  const [form, setForm] = useState<FormData>({
    pet_name: "",
    pet_age: "",
    pet_species: "",
    pet_breed: "",
    pet_profile_picture: undefined,
    pet_weight: "",
    pet_spay_neuter: "",
    pet_color: "",
    pet_dob: "",
    pet_microchip: "",
    pet_notes: "",
    owner_name: "",
    owner_location: "",
    owner_phone: "",
    owner_email: "",
    owner_password: "",
    owner_username: "",
  });

  // Step 4 state
  const [step4Error, setStep4Error] = useState<string | null>(null);
  const [step4Loading, setStep4Loading] = useState(false);

  // Step 5 state
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resentMessage, setResentMessage] = useState<string | null>(null);

  // Upload state
  const [uploads, setUploads] = useState<
    {
      name: string;
      size: string;
      type: string;
      progress: number;
      status: "pending" | "uploading" | "success" | "error";
      file: File;
    }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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
          status: "pending",
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

  const simulateUploadProgress = (index: number) => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploads((prev) =>
            prev.map((item, i) =>
              i === index ? { ...item, progress: 100, status: "success" } : item
            )
          );
          resolve();
        } else {
          setUploads((prev) =>
            prev.map((item, i) =>
              i === index
                ? {
                    ...item,
                    progress: Math.floor(progress),
                    status: "uploading",
                  }
                : item
            )
          );
        }
      }, 200);
    });
  };

  const handleUploadComplete = async () => {
    if (uploads.length === 0) return;

    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Check if user is authenticated
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "Authentication required. Please complete the OTP verification step first."
        );
      }

      // Simulate individual file uploads with progress
      const totalFiles = uploads.length;
      let completedFiles = 0;

      for (let i = 0; i < uploads.length; i++) {
        await simulateUploadProgress(i);
        completedFiles++;
        setUploadProgress((completedFiles / totalFiles) * 100);
      }

      // Create pet from documents
      console.log("Creating pet from uploaded documents...");
      console.log(
        "Files to upload:",
        uploads.map((u) => ({ name: u.name, size: u.size, type: u.type }))
      );
      console.log("Authentication token:", token ? "Present" : "Missing");

      const response = await autofillServices.createPetFromDocuments(
        uploads.map((u) => u.file)
      );
      console.log("Pet created from documents:", response);

      // Get the pet ID from the response
      const petId = response.pet?.id;
      if (!petId) {
        console.error("No pet ID in response:", response);
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
        setShowLoader(true);
        let attempts = 0;
        let docs: any[] = [];
        while (attempts < maxAttempts) {
          try {
            const docRes = await import("../../../Services/petServices");
            const result = await docRes.default.getPetDocuments(petId);
            docs = Array.isArray(result?.data) ? result.data : [];
            if (docs.length > 0) break;
          } catch (e) {
            // ignore errors, just retry
          }
          await new Promise((res) => setTimeout(res, interval));
          attempts++;
        }
        setShowLoader(false);
        return docs;
      };

      // If documents are not immediately available, poll for them
      let documents = response.documents;
      if (!documents || !Array.isArray(documents) || documents.length === 0) {
        documents = await pollForDocuments(petId);
      }

      // Extract document and vaccine IDs from the response or polled docs
      const documentIds =
        documents
          ?.map((doc: any) => doc.document_id || doc.id)
          .filter(Boolean) || [];
      const vaccineIds =
        documents
          ?.filter((doc: any) => doc.type === "vaccine")
          .map((doc: any) => doc.document_id || doc.id)
          .filter(Boolean) || [];

      console.log("Document IDs:", documentIds);
      console.log("Vaccine IDs:", vaccineIds);
      console.log("Full documents response:", documents);

      // Navigate to the pet-specific verification page with document and vaccine IDs
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
      console.error("Error creating pet from documents:", err);

      // Provide more specific error messages
      let errorMessage =
        "Failed to create pet from documents. Please try again.";

      if (err.response) {
        // Server responded with error status
        console.error("Server error response:", err.response);
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
        // Network error
        console.error("Network error:", err.request);
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err.message) {
        // Other error
        errorMessage = err.message;
      }

      setUploadError(errorMessage);

      // Mark all files as error
      setUploads((prev) =>
        prev.map((item) => ({ ...item, status: "error" as const }))
      );
    } finally {
      setUploading(false);
    }
  };

  // Step 4 completion handler
  const handleStep4Complete = () => {
    setCurrentStep("step5");
  };

  // Step 5 completion handler
  const handleStep5Complete = () => {
    setCurrentStep("upload");
  };

  // Debug authentication status when upload step is reached
  React.useEffect(() => {
    if (currentStep === "upload") {
      const token = localStorage.getItem("token");
      console.log("Upload step reached - Authentication status:", {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : "None",
      });
    }
  }, [currentStep]);

  // Render based on current step
  if (currentStep === "step4") {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center w-full relative px-2 pt-10 sm:p-4 md:p-8">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="flex justify-center sm:justify-start h-8 mb-8 md:mb-0">
            <img
              src={PetWellLogo}
              alt="PetWell Logo"
              className="object-contain h-full w-auto"
            />
          </div>
          <div className="flex flex-1 justify-center sm:pr-16">
            <p className=" font-[Alike,serif] text-3xl sm:pr-16 text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
              Create Your Profile
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
          <Step4HumanInfoUpload
            form={form}
            setForm={setForm}
            error={step4Error}
            setError={setStep4Error}
            loading={step4Loading}
            setLoading={setStep4Loading}
            onNext={handleStep4Complete}
          />
        </div>
      </div>
    );
  }

  if (currentStep === "step5") {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center w-full relative px-2 pt-10 sm:p-4 md:p-8">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="flex justify-center sm:justify-start h-8 mb-8 md:mb-0">
            <img
              src={PetWellLogo}
              alt="PetWell Logo"
              className="object-contain h-full w-auto"
            />
          </div>
          <div className="flex flex-1 justify-center sm:pr-16">
            <p className=" font-[Alike,serif] text-3xl sm:pr-16 text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
              Create Your Profile
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
          <Step5OTPVerificationUpload
            form={form}
            otp={otp}
            setOtp={setOtp}
            otpLoading={otpLoading}
            setOtpLoading={setOtpLoading}
            otpError={otpError}
            setOtpError={setOtpError}
            resentMessage={resentMessage}
            setResentMessage={setResentMessage}
            onNext={handleStep5Complete}
          />
        </div>
      </div>
    );
  }

  // Document upload step
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center w-full relative px-2 pt-10 sm:p-4 md:p-8">
      {showLoader && <Loader />}
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
      {/* Logo */}
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
            {uploadError?.includes("Authentication") && (
              <button
                onClick={() => setCurrentStep("step5")}
                className="text-sm text-[#FFB23E] ml-2 hover:text-[#ffb733] underline"
              >
                ← Go back to OTP verification
              </button>
            )}
          </div>
        )}

        {/* Upload progress indicator */}
        {uploading && (
          <div className="w-full max-w-xl mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Creating pet from documents...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-[#23272f] rounded-full h-2">
              <div
                className="bg-[#FFB23E] h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload area */}
        <div className="w-full max-w-xl">
          {uploads.length === 0 ? (
            <>
              {" "}
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
                  Enter
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

export default PetParentSignupPage;
