import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PetWellLogo from "../../../Assets/PetWell.png";
import VaccineSection from "../../../Components/Vaccine/VaccineSection";
import DocumentSection from "../../../Components/Document/DocumentSection";
import EditVaccineModal from "../../../Components/Vaccine/EditVaccineModal";
import petServices from "../../../Services/petServices";
import humanOwnerServices from "../../../Services/humanOwnerServices";
import DetailSection from "../../../Components/Verification/DetailSection";

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
  const petName = pet?.pet_name || pet?.name || "";

  // Robust property access for user

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
    <div className="min-h-screen w-full font-sans flex flex-col items-center bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Logo and Header */}
      <div className="absolute left-4 top-4 md:left-10 md:top-8">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="w-10 h-10 md:w-12 md:h-12 object-contain"
        />
      </div>
      <div className="flex flex-col items-center w-full max-w-6xl pt-20 md:pt-0 mb-4 mt-4 px-4 sm:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-card-heading)] mb-2 text-center">
          Here's what we know. Check it out!
        </h1>
        <p className="text-[var(--color-card-heading)] opacity-80 mb-6 sm:mb-8 text-base sm:text-lg text-center">
          You can review, edit, or add notes before saving it to {petName}'s
          profile.
        </p>
      </div>
      <div className="w-full max-w-6xl px-2 sm:px-4 md:px-8">
        <DetailSection pet={pet} user={human} />
        {/* Vaccines Section */}
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 mt-8 sm:mt-10">
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
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 mt-8 sm:mt-10">
          Upload Documents
        </h2>
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
        <div className="flex justify-end gap-4 sm:gap-8 mt-6 sm:mt-8 w-full">
          <button
            className="px-6 sm:px-8 py-2 sm:py-3 mb-4 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-base sm:text-lg hover:brightness-110 transition"
            onClick={() => navigate(`/petowner/pet/${petId}/home`)}
          >
            Next
          </button>
        </div>
      </div>
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
