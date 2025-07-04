import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FormData } from "./types";
import Step1BasicPetInfo from "./Step1BasicPetInfo";
import Step2HealthBasics from "./Step2HealthBasics";
import Step3SafetyAndID from "./Step3SafetyAndID";
import petServices from "../../../Services/petServices";
import ProfileCreationSuccessModal from "./ProfileCreationSuccessModal";
import PetWellLogo from "../../../Assets/PetWell.png";

const AddPetProfile: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUploadUI, ] = useState(false);
  const [newPetId, setNewPetId] = useState<string | null>(null);
  const [, setNewPet] = useState<any>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    pet_id: "",
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
        location: "Default Location",
        latitude: 0,
        longitude: 0,
        spay_neuter: form.pet_spay_neuter === "true",
        color: form.pet_color.trim() || "",
        microchip: form.pet_microchip.trim() || "",
        notes: form.pet_notes.trim() || "",
      };

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

      const responseData = response as any;
      if (responseData) {
        if (Array.isArray(responseData)) {
          petId = responseData[0]?.id;
        } else if (responseData.data) {
          petId = Array.isArray(responseData.data)
            ? responseData.data[0]?.id
            : responseData.data.id;
        } else {
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
          if (form.pet_profile_picture.size > 5 * 1024 * 1024) {
            throw new Error("Profile picture must be less than 5MB");
          }

          if (!form.pet_profile_picture.type.startsWith("image/")) {
            throw new Error("Profile picture must be an image file");
          }

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
        }
      }
      setShowSuccess(true);
      setNewPetId(petId);
      console.log(
        "[handleCreatePet] setShowSuccess(true), setNewPetId:",
        petId
      );
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


  const petSteps = ["Basic Pet Info", "Health Basics", "Safety & ID"];

  // Render the appropriate step component
  switch (step) {
    case 1:
      return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center w-full relative px-2 pt-10 sm:p-4 md:p-8">
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
            <Step1BasicPetInfo
              form={form}
              setForm={setForm}
              error={error}
              setError={setError}
              onNext={() => goToStep(2)}
              steps={petSteps}
            />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center w-full relative sm:p-4 md:p-8">
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
            <Step2HealthBasics
              form={form}
              setForm={setForm}
              error={error}
              setError={setError}
              onNext={() => goToStep(3)}
              steps={petSteps}
            />
          </div>
        </div>
      );
    case 3:
      return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center w-full relative px-2 pt-10 sm:p-4 md:p-8">
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
            <Step3SafetyAndID
              form={form}
              setForm={setForm}
              error={error}
              setError={setError}
              onNext={handleCreatePet}
              steps={petSteps}
              loading={loading}
            />
            {showSuccess && (
              <ProfileCreationSuccessModal
                petId={newPetId || ""}
                onClose={() => setShowSuccess(false)}
                onGoHome={() => {
                  if (newPetId) navigate(`/petowner/pet/${newPetId}/home`);
                }}
                onUploadRecords={() => {
                  setShowSuccess(false);
                  navigate(`/petowner/pet/${newPetId}/upload-documents`);
                }}
              />
            )}
          </div>
        </div>
      );
    default:
      return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center w-full relative px-2 pt-10 sm:p-4 md:p-8">
          <div className="flex flex-col sm:flex-row w-full">
            <div className="flex justify-center sm:justify-start h-8 mb-8 md:mb-0">
              <img
                src={PetWellLogo}
                alt="PetWell Logo"
                className="object-contain h-full w-auto"
              />
            </div>
            <div className="flex flex-1 justify-center sm:pr-16">
              <p className="font-[Alike,serif] text-3xl text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
                Error
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
            <div className="text-red-400 text-lg text-center">
              Something went wrong. Please refresh the page or start again.
            </div>
          </div>
        </div>
      );
  }
};

export default AddPetProfile;
