import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Components/ui/Loader";
import PetWellLogo from "../../../Assets/PetWell.png";
import Step4HumanInfoUpload from "./Step4HumanInfoUpload";
import Step5OTPVerificationUpload from "./Step5OTPVerificationUpload";
import type { FormData } from "./types";
import UploadStepper from "./UploadStepper";
import autofillServices from "../../../Services/autofillServices";
import { UploadCloud, FileText, Image, AlertCircle, CheckCircle, X } from "lucide-react";

const PetParentSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const [currentStep, setCurrentStep] = useState<'step4' | 'step5' | 'upload'>('step4');
  
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
    { file: File; name: string; size: string; type: string; progress: number; status: 'pending' | 'uploading' | 'success' | 'error' }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (file.size > maxSize) {
      return `File size must be less than 10MB. Current size: ${(file.size / (1024 * 1024)).toFixed(1)}MB`;
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
          file,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.name.split(".").pop()?.toUpperCase() || "OTHER",
          progress: 0,
          status: 'pending'
        });
      }
    });

    if (errors.length > 0) {
      setUploadError(errors.join('\n'));
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
          setUploads(prev => prev.map((item, i) => 
            i === index ? { ...item, progress: 100, status: 'success' } : item
          ));
          resolve();
        } else {
          setUploads(prev => prev.map((item, i) => 
            i === index ? { ...item, progress: Math.floor(progress), status: 'uploading' } : item
          ));
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
        throw new Error("Authentication required. Please complete the OTP verification step first.");
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
      console.log("Files to upload:", uploads.map(u => ({ name: u.name, size: u.size, type: u.type })));
      console.log("Authentication token:", token ? "Present" : "Missing");
      
      const response = await autofillServices.createPetFromDocuments(
        uploads.map((u) => u.file)
      );
      console.log("Pet created from documents:", response);
      
      // Get the pet ID from the response
      const petId = response.pet?.id || response.pet?._id;
      if (!petId) {
        console.error("No pet ID in response:", response);
        throw new Error("Failed to create pet from documents - no pet ID returned");
      }
      
      // Navigate to the pet-specific verification page
      navigate(`/petowner/pet/${petId}/verify`);
    } catch (err: any) {
      console.error("Error creating pet from documents:", err);
      
      // Provide more specific error messages
      let errorMessage = "Failed to create pet from documents. Please try again.";
      
      if (err.response) {
        // Server responded with error status
        console.error("Server error response:", err.response);
        if (err.response.status === 401) {
          errorMessage = "Authentication failed. Please go back and complete the OTP verification step.";
        } else if (err.response.status === 500) {
          errorMessage = "Server error occurred. Please try again or contact support.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // Network error
        console.error("Network error:", err.request);
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (err.message) {
        // Other error
        errorMessage = err.message;
      }
      
      setUploadError(errorMessage);
      
      // Mark all files as error
      setUploads(prev => prev.map(item => ({ ...item, status: 'error' as const })));
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    const fileType = type.toLowerCase();
    if (fileType === 'pdf') return <FileText className="w-6 h-6 text-red-500" />;
    if (['jpg', 'jpeg', 'png'].includes(fileType)) return <Image className="w-6 h-6 text-green-500" />;
    return <FileText className="w-6 h-6 text-blue-500" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'uploading':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  // Step 4 completion handler
  const handleStep4Complete = () => {
    setCurrentStep('step5');
  };

  // Step 5 completion handler
  const handleStep5Complete = () => {
    setCurrentStep('upload');
  };

  // Debug authentication status when upload step is reached
  React.useEffect(() => {
    if (currentStep === 'upload') {
      const token = localStorage.getItem("token");
      console.log("Upload step reached - Authentication status:", {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'None'
      });
    }
  }, [currentStep]);

  // Render based on current step
  if (currentStep === 'step4') {
    return (
      <Step4HumanInfoUpload
        form={form}
        setForm={setForm}
        error={step4Error}
        setError={setStep4Error}
        loading={step4Loading}
        setLoading={setStep4Loading}
        onNext={handleStep4Complete}
      />
    );
  }

  if (currentStep === 'step5') {
    return (
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
    );
  }

  // Document upload step
  return (
    <div className="min-h-screen w-full bg-[#181f27] text-[var(--color-text)] font-sans flex flex-col items-center justify-center relative">
      {showLoader && <Loader />}
      {/* Logo */}
      <div className="absolute left-10 top-8">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="w-16 h-16 object-contain"
        />
      </div>
      
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6">
        <UploadStepper currentStep="upload" />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-heading)] mb-4">
          Got a vaccine card or medical record handy?
        </h1>
          <p className="text-lg text-[var(--color-label)] max-w-2xl">
            Just upload it — we'll use it to build your pet's profile for you.
          <br />
          You can edit or add more info later.
        </p>
        </div>

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
        <div className="w-full max-w-2xl">
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
          
          {uploads.length === 0 ? (
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full bg-[var(--color-card)] rounded-2xl shadow-xl p-12 flex flex-col items-center cursor-pointer transition-all duration-200 border-2 border-dashed ${
                isDragOver 
                  ? 'border-[#FFB23E] border-opacity-80 bg-[#2d3340]' 
                  : 'border-[#FFB23E] border-opacity-30 hover:border-opacity-60 hover:bg-[#2d3340]'
              }`}
              style={{ minHeight: 200 }}
            >
              <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
                <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${
                  isDragOver ? 'text-[#FFB23E]' : 'text-[#FFB23E]'
                }`} />
                <span className="text-xl font-semibold text-[var(--color-text)] mb-2">
                  {isDragOver ? 'Drop files here' : 'Upload documents'}
                </span>
                <span className="text-sm text-[var(--color-text)] opacity-70 text-center">
                  {isDragOver ? 'Release to upload' : 'Drag and drop files here, or click to browse'}
                </span>
                <span className="mt-2 text-xs text-[var(--color-text)] opacity-50">
                  Supported: PDF, JPG, PNG, DOC (Max 10MB each)
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File list */}
              <div className="bg-[var(--color-card)] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Selected Files ({uploads.length})</h3>
                  {uploads.length > 0 && (
                    <button
                      onClick={() => setUploads([])}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Clear All
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {uploads.map((upload, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#1C232E] rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon(upload.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{upload.name}</span>
                            {getStatusIcon(upload.status)}
                          </div>
                          <span className="text-xs text-[var(--color-text)] opacity-60">{upload.size}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {upload.status === 'pending' && (
                          <button
                            onClick={() => handleRemove(index)}
                            className="text-red-400 hover:text-red-300 text-lg p-1 hover:bg-red-400 hover:bg-opacity-10 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {upload.status === 'uploading' && (
                          <span className="text-xs text-blue-400">{upload.progress}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <label className="flex-1 py-3 px-4 rounded-lg bg-[var(--color-card)] border border-[#FFB23E] text-[#FFB23E] font-semibold hover:bg-[#FFB23E] hover:text-black transition-colors flex items-center justify-center cursor-pointer">
                  <UploadCloud className="w-4 h-4 mr-2" />
                  Add More Files
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    disabled={uploading}
                  />
                </label>
                <button
                  className="flex-1 py-3 px-6 rounded-lg bg-[#FFB23E] text-black font-semibold hover:bg-[#ffb733] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleUploadComplete}
                  disabled={uploading || uploads.length === 0}
                >
                  {uploading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Pet...
                    </div>
                  ) : (
                    `Create Pet from ${uploads.length} File${uploads.length !== 1 ? 's' : ''}`
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {uploadError && (
            <div className="mt-4 p-4 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{uploadError}</span>
                </div>
                {uploadError.includes("Authentication") && (
                  <button
                    onClick={() => setCurrentStep('step5')}
                    className="text-sm text-[#FFB23E] hover:text-[#ffb733] underline"
                  >
                    ← Go back to OTP verification
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Manual entry option */}
          <div className="mt-8 text-center">
            <span className="text-[var(--color-label)] text-lg">
              Prefer to enter details yourself?{" "}
            </span>
            <button
              className="text-[var(--color-primary)] font-semibold hover:underline text-lg bg-transparent border-none p-0 m-0 align-baseline"
              onClick={() => navigate("/profile-creation")}
            >
              Enter Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetParentSignupPage;
