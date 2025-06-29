import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FormData } from "./types";
import Step1BasicPetInfo from "./Step1BasicPetInfo";
import Step2HealthBasics from "./Step2HealthBasics";
import Step3SafetyAndID from "./Step3SafetyAndID";
import petServices from "../../../Services/petServices";
import ProfileCreationSuccessModal from "./ProfileCreationSuccessModal";
import UploadDocument from "../../../Components/UploadDocument/UploadDocuments";

const AddPetProfile: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUploadUI, setShowUploadUI] = useState(false);
  const [newPetId, setNewPetId] = useState<string | null>(null);
  const [newPet, setNewPet] = useState<any>(null);
  const navigate = useNavigate();
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

  console.log("[AddPetProfile] Render", { showSuccess, newPetId });

  // Fetch new pet details when needed
  useEffect(() => {
    if (showUploadUI && newPetId) {
      petServices
        .getPetById(newPetId)
        .then((res) => setNewPet(res.data))
        .catch(() => setNewPet(null));
    }
  }, [showUploadUI, newPetId]);

  const goToStep = (newStep: number) => {
    setError(null);
    setStep(newStep);
  };

  const handleCreatePet = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("=== CREATING PET PROFILE ===");
      console.log("Form data:", form);

      // Validate required fields
      const requiredFields = [
        "pet_name",
        "pet_age",
        "pet_species",
        "pet_breed",
      ];

      const missingFields = requiredFields.filter(
        (field) => !form[field as keyof typeof form]
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Prepare pet data for createPet API
      const petData: any = {
        pet_name: form.pet_name.trim(),
        age: parseInt(form.pet_age),
        weight: form.pet_weight ? parseFloat(form.pet_weight) : 0,
        breed_species_id: form.pet_species.trim(),
        breed_id: form.pet_breed.trim(),
        location: "Default Location", // This might need to be provided or fetched
        latitude: 0, // Default values - might need to be provided
        longitude: 0, // Default values - might need to be provided
        spay_neuter: form.pet_spay_neuter === "true",
        color: form.pet_color.trim() || "",
        microchip: form.pet_microchip.trim() || "",
        notes: form.pet_notes.trim() || "",
      };

      // Only include dob if it has a valid value
      if (form.pet_dob && form.pet_dob.trim()) {
        petData.dob = form.pet_dob;
      }

      console.log("Pet data for creation:", petData);

      // Create pet using petServices
      const response = await petServices.createPet(petData);
      console.log("Pet creation response:", response);
      console.log("Response keys:", Object.keys(response as any));
      console.log("Full response object:", JSON.stringify(response, null, 2));

      // Check if we got a valid response with pet ID
      let petId: string | undefined;

      // The backend returns the pet data directly, not wrapped in a data property
      const responseData = response as any;
      if (responseData) {
        if (Array.isArray(responseData)) {
          // If it's an array, take the first pet's ID
          petId = responseData[0]?.id;
        } else if (responseData.data) {
          // If it's wrapped in a data property
          petId = Array.isArray(responseData.data)
            ? responseData.data[0]?.id
            : responseData.data.id;
        } else {
          // If it's a single pet object returned directly
          petId = responseData.id;
        }
      }

      console.log("Extracted petId:", petId);

      if (!petId) {
        console.error("Invalid response structure:", response);
        throw new Error(
          "Failed to create pet profile: No pet ID returned from server."
        );
      }

      // If pet was created successfully and we have a profile picture, upload it
      if (
        form.pet_profile_picture &&
        form.pet_profile_picture instanceof File
      ) {
        try {
          // Validate file
          if (form.pet_profile_picture.size > 5 * 1024 * 1024) {
            throw new Error("Profile picture must be less than 5MB");
          }

          if (!form.pet_profile_picture.type.startsWith("image/")) {
            throw new Error("Profile picture must be an image file");
          }

          // Upload profile picture as document
          const documentData = {
            document_name: `${form.pet_name.trim()} Profile Picture`,
            document_type: "Profile Picture",
            file_type:
              form.pet_profile_picture.name.split(".").pop()?.toUpperCase() ||
              "JPG",
            description: "Pet profile picture",
            file: form.pet_profile_picture,
          };

          console.log("Uploading profile picture for pet:", petId);
          await petServices.createDocument(petId, documentData);
        } catch (uploadError: any) {
          console.error("Profile picture upload failed:", uploadError);
          // Don't fail the entire process if profile picture upload fails
          // The pet was created successfully
        }
      }
      setShowSuccess(true);
      setNewPetId(petId);
      console.log(
        "[handleCreatePet] setShowSuccess(true), setNewPetId:",
        petId
      );
      // Remove auto-navigate to home
    } catch (err: any) {
      console.error("Pet creation error:", err);

      let errorMessage = "Failed to create pet profile. Please try again.";

      if (err.message) {
        errorMessage = err.message;
      }

      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handler for Upload Records button in modal
  const handleShowUploadUI = () => {
    setShowSuccess(false);
    if (newPetId) {
      navigate(`/petowner/pet/${newPetId}/upload-documents`);
    }
  };

  // Handler for document upload
  const handleDocumentUpload = async (
    file: File,
    meta: { name: string; type: string }
  ) => {
    if (!newPetId) return;
    await petServices.createDocument(newPetId, {
      document_name: meta.name,
      document_type: "Other",
      file_type: meta.type,
      description: "Uploaded via profile creation flow",
      file,
    });
    navigate(`/petowner/pet/${newPetId}/verify`);
  };

  // UI for post-profile-creation upload
  if (showUploadUI && newPet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#101624] px-4 py-10">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-full flex items-center justify-start mb-4">
            <button
              className="text-[#FFB23E] text-base font-semibold flex items-center gap-2 hover:underline"
              onClick={() => setShowUploadUI(false)}
            >
              <span style={{ fontSize: 20 }}>&lt;</span> Go Back
            </button>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center mb-6">
              <img
                src={newPet.profile_picture_url || "/default-avatar.png"}
                alt="Pet Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-[#FFB23E] mb-4"
              />
              <h2 className="text-3xl font-[Alike,serif] text-[#F6E7D8] mb-2 text-center">
                Upload documents for {newPet.pet_name}
              </h2>
              <p className="text-base text-[#F6E7D8] text-center mb-6 max-w-xl">
                Keep your pet's records safe and accessible — from vaccine
                certificates to vet bills.
              </p>
            </div>
            <div className="w-full flex justify-center">
              <div className="bg-[#23272f] rounded-xl shadow-2xl px-8 py-10 flex flex-col items-center w-full max-w-lg">
                <UploadDocument onUpload={handleDocumentUpload} />
                <div className="mt-4 text-[#EBD5BD] text-sm text-center">
                  Supported formats: PDF, JPG, PNG, DOC.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const petSteps = ["Basic Pet Info", "Health Basics", "Safety & ID"];

  // Render the appropriate step component
  switch (step) {
    case 1:
      return (
        <Step1BasicPetInfo
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
          onNext={() => goToStep(2)}
          steps={petSteps}
        />
      );
    case 2:
      return (
        <Step2HealthBasics
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
          onNext={() => goToStep(3)}
          steps={petSteps}
        />
      );
    case 3:
      return (
        <>
          <Step3SafetyAndID
            form={form}
            setForm={setForm}
            error={error}
            setError={setError}
            onNext={handleCreatePet}
            steps={petSteps}
            loading={loading}
          />
          {/* Success Modal */}
          {showSuccess &&
            (() => {
              console.log("[Modal Render] newPetId:", newPetId);
              return null;
            })()}
          {showSuccess && (
            <ProfileCreationSuccessModal
              petId={newPetId || ""}
              onClose={() => setShowSuccess(false)}
              onGoHome={() => {
                if (newPetId) navigate(`/petowner/pet/${newPetId}/home`);
              }}
              onUploadRecords={(id) => {
                console.log("[Modal onUploadRecords] id:", id);
                setShowSuccess(false);
                navigate(`/petowner/pet/${newPetId}/upload-documents`);
              }}
            />
          )}
        </>
      );
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#1C232E] text-red-400 text-lg">
          Something went wrong. Please refresh the page or start again.
        </div>
      );
  }
};

export default AddPetProfile;
