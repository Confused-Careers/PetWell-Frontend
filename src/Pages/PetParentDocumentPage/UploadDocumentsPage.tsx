import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UploadDocument from "../../Components/UploadDocument/UploadDocuments";
import Loader from "../../Components/ui/Loader";
import Navbar from "../../Components/Layout/Navbar";
import petServices from "../../Services/petServices";

const UploadDocuments: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [showLoader, setShowLoader] = React.useState(false);
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualPetId, setActualPetId] = useState<string | null>(null);

  // Fetch pet details
  useEffect(() => {
    const fetchPet = async () => {
      try {
        if (!petId) {
          setError("No pet ID provided");
          setLoading(false);
          return;
        }

        let currentPetId = petId;

        // If petId is "default", fetch the first available pet
        if (petId === "default") {
          const petsRes = await petServices.getPetsByOwner();
          let petsArr = Array.isArray(petsRes) ? petsRes : petsRes.data;
          if (!petsArr) petsArr = [];
          if (!Array.isArray(petsArr)) petsArr = [petsArr];

          if (petsArr.length === 0) {
            setError("No pets found. Please create a pet profile first.");
            setLoading(false);
            return;
          }

          // Use the first pet's ID (since "default" means single pet)
          currentPetId = petsArr[0].id;
          setActualPetId(currentPetId);
        } else {
          setActualPetId(currentPetId);
        }

        // Fetch pet details
        const petRes = await petServices.getPetById(currentPetId);
        let petData = null;

        // Handle different response structures
        if (petRes) {
          if (petRes.data) {
            petData = petRes.data;
          } else if (Array.isArray(petRes)) {
            petData = petRes[0];
          } else if (typeof petRes === "object" && "id" in petRes) {
            petData = petRes;
          }
        }

        setPet(petData);
        if (!petData) {
          setError("Pet not found");
        }
      } catch (error) {
        console.error("Failed to fetch pet:", error);
        setError("Failed to fetch pet details");
        setPet(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

  // Handler to upload a document
  const handleUpload = async (
    file: File,
    meta: { name: string; type: string }
  ) => {
    if (!actualPetId) {
      console.warn("[Upload] No petId available, skipping upload.");
      return;
    }
    const payload = {
      document_name: meta.name,
      document_type: "Medical",
      file_type: meta.type.toUpperCase(),
      description: "Pet medical record",
      file,
    };
    try {
      console.debug("[Upload] Calling createDocument API", {
        actualPetId,
        payload,
      });
      await petServices.createDocument(actualPetId, payload);
      console.debug("[Upload] Document uploaded successfully", meta.name);
    } catch (err) {
      console.error("[Upload] Error uploading document", err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen font-sans flex flex-col items-center bg-[#101624] text-[#EBD5BD]">
        <Navbar />
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen w-screen font-sans flex flex-col items-center bg-[#101624] text-[#EBD5BD]">
        <Navbar />
        <div className="text-center">{error || "Pet not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      <Navbar />
      {/* Profile Image and Back Button */}
      <div className="mt-16 flex flex-col items-center w-full relative px-4 sm:px-6 md:px-8">
        <button
          className="absolute left-4 sm:left-6 md:left-8 top-0 flex items-center gap-1 text-[#EBD5BD] hover:text-[#FFA500] text-sm sm:text-base font-semibold px-2 py-1 rounded transition border border-transparent hover:border-[#FFA500] z-10"
          onClick={() =>
            navigate(`/petowner/pet/${actualPetId || petId}/documents`)
          }
          aria-label="Back"
        >
          <span className="text-lg sm:text-xl">&#8592;</span> Back
        </button>
        <img
          src={
            pet.profile_picture && typeof pet.profile_picture === "string"
              ? pet.profile_picture
              : "https://randomuser.me/api/portraits/men/32.jpg"
          }
          alt="Profile"
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-[#EBD5BD] shadow-lg mt-4"
        />
        <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl font-bold text-[#EBD5BD] text-center">
          Upload documents for {pet.pet_name}
        </h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-[#EBD5BD] opacity-80 max-w-sm sm:max-w-md md:max-w-xl text-center px-4">
          Keep your pet's records safe and accessible — from vaccine
          certificates to vet bills.
        </p>
      </div>
      {/* UploadDocument component handles upload logic and UI */}
      {showLoader && <Loader />}
      <UploadDocument
        onUpload={handleUpload}
        onNext={() => {
          setShowLoader(true);
          setTimeout(() => {
            setShowLoader(false);
            navigate(`/petowner/pet/${actualPetId || petId}/documents`);
          }, 2000);
        }}
      />
    </div>
  );
};

export default UploadDocuments;
