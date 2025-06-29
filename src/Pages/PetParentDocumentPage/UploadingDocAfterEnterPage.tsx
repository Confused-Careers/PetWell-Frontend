import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import petServices from "../../Services/petServices";
import UploadList from "../../Components/UploadDocument/UploadList";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setUploads((prev) => [...prev, ...newUploads]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!petId || uploads.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      await petServices.uploadMultipleDocuments(
        petId,
        uploads.map((u) => u.file)
      );
      // Navigate to verification page for this pet
      navigate(`/petowner/pet/${petId}/verify`);
    } catch (err) {
      setError("Failed to upload documents. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-amber-100 text-lg">
        Loading...
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400 text-lg">
        Pet not found. {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with logo and go back */}
      <div className="flex items-center justify-between p-6">
        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">R</span>
          </div>
        </div>
        <button
          className="text-amber-400 text-sm font-medium flex items-center gap-2 hover:text-amber-300 transition-colors"
          onClick={() => navigate(-1)}
        >
          {/* Use your icon here if needed */}
          &lt; Go Back
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center px-6 py-8">
        {/* Pet avatar */}
        <div className="mb-8">
          <img
            src={pet.profile_picture_url || "/default-avatar.png"}
            alt="Pet Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-amber-400"
          />
        </div>

        {/* Title and description */}
        <div className="text-center mb-12 max-w-md">
          <h1 className="text-2xl font-light text-amber-100 mb-4">
            Upload documents for {pet.pet_name}
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Keep your pet's records safe and accessible — from vaccine
            certificates to vet bills.
          </p>
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
              className="w-full bg-[#2C313A] rounded-2xl shadow-xl p-10 flex flex-col items-center cursor-pointer transition hover:bg-[#353A43]"
              style={{ minHeight: 180 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 mb-2 text-[#EBD5BD]"
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
              <span className="text-xl font-medium text-[#EBD5BD]">
                Upload a document
              </span>
              <span className="mt-3 text-sm text-[#EBD5BD] opacity-70">
                Supported formats: PDF, JPG, PNG, DOC.
              </span>
            </label>
          ) : (
            <UploadList
              uploads={uploads}
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
    </div>
  );
};

export default UploadingDocAfterEnterPage;
