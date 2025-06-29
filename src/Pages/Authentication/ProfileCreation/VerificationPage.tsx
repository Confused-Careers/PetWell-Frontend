import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PetWellLogo from "../../../Assets/PetWell.png";
import VaccineSection from "../../../Components/Vaccine/VaccineSection";
import DocumentSection from "../../../Components/Document/DocumentSection";
import EditVaccineModal from "../../../Components/Vaccine/EditVaccineModal";
import petServices from "../../../Services/petServices";
import humanOwnerServices from "../../../Services/humanOwnerServices";

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();

  const [pet, setPet] = useState<any>(null);
  const [human, setHuman] = useState<any>(null);
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [editVaccineModal, setEditVaccineModal] = useState<{
    open: boolean;
    vaccine: any;
  }>({ open: false, vaccine: null });

  useEffect(() => {
    if (!petId) return;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        // Fetch pet data
        const petRes = await petServices.getPetById(petId);
        console.log("Pet data:", petRes);
        setPet(petRes);

        // Fetch human data
        try {
          const humanRes = await humanOwnerServices.getProfile();
          console.log("Human data:", humanRes);
          setHuman(humanRes || null);
        } catch (humanError) {
          console.error("Human data fetch failed:", humanError);
          setHuman(null);
        }

        // Fetch documents data
        try {
          const docRes = await petServices.getPetDocuments(petId);
          console.log("Documents data:", docRes);

          // Transform documents data to match expected format
          const transformedDocuments = Array.isArray(docRes)
            ? docRes.map((doc: any) => ({
                name: String(doc.document_name || doc.name || ""),
                type: (doc.file_type || doc.type || "")
                  .toLowerCase()
                  .includes("pdf")
                  ? "pdf"
                  : "img",
                size: doc.size || "",
              }))
            : [];
          setDocuments(transformedDocuments);
        } catch (docError) {
          console.error("Documents data fetch failed:", docError);
          setDocuments([]);
        }

        // Fetch vaccines data
        try {
          const vaccineModule = await import(
            "../../../Services/vaccineServices"
          );
          const vaccineRes = await vaccineModule.default.getAllPetVaccines(
            petId
          );
          console.log("Vaccines data:", vaccineRes);

          // Transform vaccines data to match expected format
          const transformedVaccines = Array.isArray(vaccineRes)
            ? vaccineRes.map((vaccine: any) => {
                console.log("Individual vaccine:", vaccine);
                console.log("Vaccine ID field:", vaccine?.id);
                console.log("Vaccine _id:", vaccine?._id);
                console.log("Vaccine vaccine_id:", vaccine?.vaccine_id);
                console.log("All vaccine keys:", Object.keys(vaccine || {}));
                return {
                  name: String(vaccine.vaccine_name || ""),
                  administered: String(vaccine.date_administered || ""),
                  expires: String(vaccine.date_due || ""),
                  soon: false, // You can add logic to determine if expiring soon
                  warning: "", // You can add warning logic
                  // Preserve original data for editing
                  ...vaccine,
                };
              })
            : [];
          setVaccines(transformedVaccines);
        } catch (vaccineError) {
          console.error("Vaccines data fetch failed:", vaccineError);
          setVaccines([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch verification data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [petId]);

  // Robust property access for pet
  const breed =
    (typeof pet?.breed_name === "string" ? pet.breed_name : "") ||
    (typeof pet?.breed === "string" ? pet.breed : "") ||
    (typeof pet?.breed_obj?.breed_name === "string"
      ? pet.breed_obj.breed_name
      : "") ||
    (typeof pet?.breed === "object" && pet?.breed?.breed_name
      ? String(pet.breed.breed_name)
      : "") ||
    "";
  const species =
    (typeof pet?.breed_species?.species_name === "string"
      ? pet.breed_species.species_name
      : "") ||
    (typeof pet?.breed_species_name === "string"
      ? pet.breed_species_name
      : "") ||
    (typeof pet?.breed_species === "string" ? pet.breed_species : "") ||
    "";
  const petName = pet?.pet_name || pet?.name || "";
  const petImage = pet?.profile_picture_url || pet?.image || null;
  const petAge = pet?.age || "";
  const petWeight = pet?.weight || "";
  const petColor = pet?.color || "";
  const petMicrochip = pet?.microchip || "";
  const petBirthdate = pet?.dob || pet?.birthdate || "";

  // Robust property access for user
  const userName = human?.human_owner_name || human?.name || "";
  const userLocation = human?.location || "";
  const userPhone = human?.phone || "";
  const userEmail = human?.email || "";

  // Handlers for editing
  const handleEditVaccine = (index: number) => {
    const vaccine = vaccines[index];
    console.log("Editing vaccine:", vaccine);
    console.log("Vaccine ID:", vaccine?.id);
    console.log("Vaccine _id:", vaccine?._id);
    console.log("Vaccine vaccine_id:", vaccine?.vaccine_id);
    console.log("All vaccine keys:", Object.keys(vaccine || {}));

    // Try to find the ID field with fallbacks
    const vaccineId = vaccine?.id || vaccine?._id || vaccine?.vaccine_id;
    if (!vaccineId) {
      console.error("No vaccine ID found in vaccine data:", vaccine);
      alert("Error: Could not find vaccine ID. Please try again.");
      return;
    }

    setEditVaccineModal({ open: true, vaccine: { ...vaccine, id: vaccineId } });
  };

  const handleVaccineEditSuccess = () => {
    // Refresh vaccines data
    if (petId) {
      import("../../../Services/vaccineServices")
        .then((mod) => mod.default.getAllPetVaccines(petId))
        .then((vaccineRes) => {
          const transformedVaccines = Array.isArray(vaccineRes)
            ? vaccineRes.map((vaccine: any) => {
                console.log("Individual vaccine:", vaccine);
                console.log("Vaccine ID field:", vaccine?.id);
                console.log("All vaccine keys:", Object.keys(vaccine || {}));
                return {
                  name: String(vaccine.vaccine_name || ""),
                  administered: String(vaccine.date_administered || ""),
                  expires: String(vaccine.date_due || ""),
                  soon: false,
                  warning: "",
                  // Preserve original data for editing
                  ...vaccine,
                };
              })
            : [];
          setVaccines(transformedVaccines);
        })
        .catch((err) => console.error("Failed to refresh vaccines:", err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-amber-100 text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen font-sans flex flex-col items-center bg-[#101624] text-[#EBD5BD]">
      {/* Logo and Header */}
      <div className="absolute left-10 top-8">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="w-12 h-12 object-contain"
        />
      </div>
      <div className="flex flex-col items-center w-full max-w-6xl mt-10 mb-4 px-8">
        <h1 className="text-4xl font-bold text-[#EBD5BD] mb-2">
          Here's what we know. Check it out!
        </h1>
        <p className="text-[#EBD5BD] opacity-80 mb-8 text-lg text-center">
          You can review, edit, or add notes before saving it to {petName}'s
          profile.
        </p>
      </div>
      <div className="w-full max-w-6xl px-8">
        {/* Pet and User Details Section (inline) */}
        <div className="flex flex-col md:flex-row gap-8 justify-start mt-8 w-full max-w-6xl mx-auto">
          {/* Pet's Details Column */}
          <div className="flex flex-col flex-1 min-w-[280px] max-w-md">
            <span className="text-2xl font-serif font-semibold text-[var(--color-modal-foreground)] mb-2 block">
              Your Pet's Details
            </span>
            <div className="bg-[var(--color-card)] rounded-2xl shadow-lg p-6 sm:p-8 flex-1 relative">
              <div className="flex items-center gap-4 mb-6">
                {petImage ? (
                  <img
                    src={petImage}
                    alt={petName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[var(--color-primary)]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-600 border-2 border-[var(--color-primary)] flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {petName?.charAt(0)?.toUpperCase() || "P"}
                    </span>
                  </div>
                )}
                <span className="text-xl font-bold text-[var(--color-text)]">
                  {petName}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-6 gap-x- text-base">
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    Age
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]">
                    {petAge}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    Weight
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]">
                    {petWeight}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    Breed
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]">
                    {breed}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    Species
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]">
                    {species}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    Colour
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]">
                    {petColor}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    Microchip Number
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]">
                    {petMicrochip}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    Birthdate
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]">
                    {petBirthdate}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* User Details Column */}
          <div className="flex flex-col flex-1 min-w-[280px] max-w-md">
            <span className="text-2xl font-serif font-semibold text-[var(--color-modal-foreground)] mb-2 block">
              Your Details
            </span>
            <div className="bg-[var(--color-card)] rounded-2xl shadow-lg p-8 flex-1 relative">
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-base">
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    Name
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]">
                    {userName}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    {/* Empty for layout */}
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]"></div>
                </div>
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    Location
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]">
                    {userLocation}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    Phone number
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]">
                    {userPhone}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                    Email
                  </div>
                  <div className="font-bold text-lg text-[var(--color-text)]">
                    {userEmail}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Vaccines Section */}
        <h2 className="text-xl font-semibold mb-4 mt-10">
          {String(petName || "")}'s Vaccines
        </h2>
        {Array.isArray(vaccines) && vaccines.length > 0 ? (
          <VaccineSection
            vaccines={vaccines}
            onEditVaccine={handleEditVaccine}
          />
        ) : (
          <p className="text-gray-400">No vaccines found</p>
        )}
        {/* Uploaded Documents Section */}
        <h2 className="text-xl font-semibold mb-4 mt-10">Upload Documents</h2>
        {Array.isArray(documents) && documents.length > 0 ? (
          <DocumentSection
            documents={documents}
            onEditDocument={(index) => {
              // This will be handled by DocumentBox's internal modal
              console.log("Edit document at index:", index);
            }}
          />
        ) : (
          <p className="text-gray-400">No documents found</p>
        )}
        <div className="flex justify-end gap-8 mt-8 w-full">
          <button
            className="px-8 py-3 mb-4 rounded-lg bg-[#FFA500] text-white font-semibold text-lg hover:brightness-110 transition"
            onClick={() => navigate(`/petowner/pet/${petId}/home`)}
          >
            Next
          </button>
        </div>
      </div>
      {/* ProfileDropdown, if needed */}

      {/* Edit Vaccine Modal */}
      <EditVaccineModal
        open={editVaccineModal.open}
        onClose={() => setEditVaccineModal({ open: false, vaccine: null })}
        vaccine={editVaccineModal.vaccine}
        onSuccess={handleVaccineEditSuccess}
      />
    </div>
  );
};

export default VerificationPage;
