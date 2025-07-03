import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import petServices from "../../Services/petServices";
import UploadList from "../../Components/UploadDocument/UploadList";
import PetWellLogo from "../../Assets/PetWell.png";
import Loader from "../../Components/ui/Loader";
import { IoIosArrowDropleftCircle } from "react-icons/io";

const UploadingDocAfterEnterPage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<
    { file: File; name: string; size: string; type: string; progress: number }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTimers = useRef<{ [key: number]: NodeJS.Timeout }>({});

  useEffect(() => {
    if (petId) {
      petServices
        .getPetById(petId)
        .then((res) => setPet(res))
        .catch(() => setPet(null))
        .finally(() => setLoading(false));
    }
  }, [petId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newUploads = files.map((file) => ({
      file,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.name.split(".").pop()?.toUpperCase() || "OTHER",
      progress: 0,
    }));
    // Add new uploads and start progress simulation
    setUploads((prev) => {
      const startIdx = prev.length;
      const updated = [...prev, ...newUploads];
      // Start progress simulation for each new file
      newUploads.forEach((_, i) => {
        const idx = startIdx + i;
        if (!uploadTimers.current[idx]) {
          uploadTimers.current[idx] = setInterval(() => {
            setUploads((currentUploads) => {
              return currentUploads.map((u, j) => {
                if (j === idx && u.progress < 100) {
                  // Simulate progress increment (randomized for realism)
                  const next = Math.min(
                    u.progress + Math.floor(Math.random() * 10 + 10),
                    100
                  );
                  return { ...u, progress: next };
                }
                return u;
              });
            });
          }, 200);
        }
      });
      return updated;
    });
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!petId || uploads.length === 0) return;
    setUploading(true);
    setShowLoader(true);
    setError(null);
    try {
      await petServices.uploadMultipleDocuments(
        petId,
        uploads.map((u) => u.file)
      );
      // Poll for documents after upload
      setUploading(false);
      setLoading(true);
      let attempts = 0;
      let docs: any[] = [];
      while (attempts < 15) {
        try {
          const result = await petServices.getPetDocuments(petId);
          console.log("Polling result:", result);
          // Accept both { data: [...] } and [...] directly
          docs = Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [];
          if (docs.length > 0) break;
        } catch (e) {
          // ignore errors, just retry
        }
        await new Promise((res) => setTimeout(res, 2000));
        attempts++;
      }
      setLoading(false);
      if (docs.length > 0) {
        setShowLoader(false);
        navigate(`/petowner/pet/${petId}/verify`);
      } else {
        setShowLoader(false);
        setError(
          "Documents could not be loaded for verification. Please try again or contact support."
        );
      }
    } catch (err) {
      setError("Failed to upload documents. Please try again.");
      setUploading(false);
      setShowLoader(false);
    }
  };

  // Stop timers when file reaches 100% progress
  useEffect(() => {
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

  if (loading) {
    return (
      <div className="min-h-screen w-screen font-sans flex flex-col items-center bg-[var(--color-background)] text-[var(--color-text)]">
        Loading...
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen w-screen font-sans flex flex-col items-center bg-[var(--color-background)] text-red-400 text-lg">
        Pet not found. {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      {/* Logo and header */}
      <div className="flex flex-col sm:flex-row w-full items-start justify-between px-4 pt-6 pb-2">
        <div className="flex flex-col items-start gap-2">
          <img
            src={PetWellLogo}
            alt="PetWell Logo"
            className="object-contain h-8 w-auto"
          />
          <button
            className="text-[var(--color-primary)] cursor-pointer font-medium text-base flex items-center gap-1 hover:underline mt-2"
            onClick={() => navigate(-1)}
          >
            <IoIosArrowDropleftCircle className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center">
        {/* Title and description */}
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6">
          <div className="mb-8 mt-10 text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <img
                src={pet.profile_picture_url || "/default-avatar.png"}
                alt="Pet Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-[var(--color-text)] mb-4"
              />
            </div>
            <p className="font-[Alike,serif] text-3xl text-[#1C232E] mb-2 text-center leading-tight">
              Upload documents for {pet.pet_name}
            </p>
            <p className="text-lg text-[var(--color-label)] max-w-2xl mx-auto text-center">
              Keep your pet's records safe and accessible — from vaccine
              certificates to vet bills.
            </p>
          </div>
        </div>

        {/* Upload area */}
        <div className="w-full max-w-xl">
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            ref={fileInputRef}
          />
          {uploads.length === 0 ? (
            <label
              htmlFor="file-upload"
              className="w-full bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-xl p-10 flex flex-col items-center cursor-pointer transition ]"
              style={{ minHeight: 180 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 mb-2 text-[var(--color-primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
              <span className="text-xl font-medium text-[var(--color-text)]">
                Upload a document
              </span>
              <span className="mt-3 text-sm text-[var(--color-text)] opacity-70">
                Supported formats: PDF, JPG, PNG, DOC.
              </span>
            </label>
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
              onNext={handleUpload}
              fileInputRef={fileInputRef}
              showLoader={uploading}
            />
          )}
          {error && (
            <div className="mt-4 text-red-400 text-sm text-center">{error}</div>
          )}
        </div>
      </div>
      {showLoader && <Loader />}
    </div>
  );
};

export default UploadingDocAfterEnterPage;
