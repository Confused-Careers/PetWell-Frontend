import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PetWellLogo from "../../../Assets/PetWell.png";
import VaccineSection from "../../../Components/Vaccine/VaccineSection";
import DocumentSection from "../../../Components/Document/DocumentSection";
import EditVaccineModal from "../../../Components/Vaccine/EditVaccineModal";
import petServices from "../../../Services/petServices";
import humanOwnerServices from "../../../Services/humanOwnerServices";
import DetailSection from "../../../Components/Verification/DetailSection";
import { PlusCircle, UploadIcon, Syringe, FileText } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../Components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../Components/ui/dropdown-menu";
import { toast } from "sonner";

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

  const [,] = useState(false);

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
      toast.error("Error: Could not find vaccine ID. Please try again.");
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
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center w-full relative px-2  sm:p-4 md:p-8">
      {/* Logo and header */}
      <div className="flex flex-col sm:flex-row w-full">
        <div className="flex justify-center sm:justify-start h-8 mb-8 md:mb-0">
          <img
            src={PetWellLogo}
            alt="PetWell Logo"
            className="object-contain h-full w-auto"
          />
        </div>
        <div className="flex-1 flex flex-col items-center mb-6">
          <p className="font-[Alike,serif] text-3xl text-[#1C232E] mb-0 text-center leading-tight">
            Here's what we know. Check it out!
          </p>
          <span className="font-[Alike,serif] text-[#1C232E] text-base sm:text-lg opacity-70 mt-1 text-center">
            You can review, edit, or add notes before saving it to {petName}'s
            profile.
          </span>
        </div>
        <div className="flex justify-center sm:justify-end h-8 mb-8 md:mb-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-[var(--color-card)] transition">
                <Avatar className="w-9 h-auto">
                  <AvatarImage
                    src={
                      (pet?.profile_picture &&
                        typeof pet?.profile_picture === "string" &&
                        pet?.profile_picture) ||
                      pet?.profilePictureDocument?.document_url ||
                      pet?.profile_picture?.profilePictureDocument
                        ?.document_url ||
                      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80"
                    }
                    alt={petName}
                  />
                  <AvatarFallback>{petName?.[0] || "P"}</AvatarFallback>
                </Avatar>
                <span className="font-[Cabin,sans-serif] text-base text-[var(--color-logo)] font-semibold">
                  {petName || "Pet"}
                </span>
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="#3c2a17"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[200px] bg-[var(--color-card-profile)] border border-[var(--color-logo)] rounded-xl shadow-lg p-0 mt-2"
            >
              <DropdownMenuItem
                className="px-4 py-3 text-[var(--color-text)] font-[Cabin,sans-serif] text-base hover:bg-[var(--color-card)] rounded-t-xl border-b border-[var(--color-logo)]/20 cursor-pointer"
                onClick={() => navigate(`/petowner/pet/${petId}/profile`)}
              >
                Go to Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="px-4 py-3 text-[var(--color-text)] font-[Cabin,sans-serif] text-base hover:bg-[var(--color-card)] rounded-b-xl cursor-pointer"
                onClick={() =>
                  navigate(`/petowner/pet/${petId}/switch-profile`)
                }
              >
                Not {petName}? Switch Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="max-w-7xl mx-auto w-full sm:px-4">
        <DetailSection pet={pet} user={human} />
        {/* Vaccines Section */}
        <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4 mt-8 sm:mt-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-logo)]">
              <Syringe className="w-5 h-5 text-[var(--color-white)]" />
            </span>
            <h2 className="text-xl font-serif font-normal text-[var(--color-text)]">
              Vaccines
            </h2>
          </div>
          <button
            onClick={() => navigate(`/petowner/pet/${petId}/add-vaccine`)}
            className="px-8 py-2 cursor-pointer rounded-full bg-[var(--color-card-button)] text-[var(--color-black)] font-semibold font-[Cabin,sans-serif] flex items-center gap-2 shadow-sm hover:brightness-105 transition-all text-base"
          >
            <PlusCircle className="w-5 h-5" /> Add New Vaccine
          </button>
        </div>
        {Array.isArray(vaccines) && vaccines.length > 0 ? (
          <VaccineSection
            vaccines={vaccines}
            onEditVaccine={handleEditVaccine}
          />
        ) : (
          <p className="text-gray-400">No vaccines found</p>
        )}
        {/* Uploaded Documents Section */}
        <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4 mt-8 sm:mt-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-logo)]">
              <FileText className="w-5 h-5 text-[var(--color-white)]" />
            </span>
            <h2 className="text-xl font-serif font-normal text-[var(--color-text)]">
              Documents
            </h2>
          </div>
          <button
            onClick={() => navigate(`/petowner/pet/${petId}/upload`)}
            className="px-8 py-2 cursor-pointer rounded-full bg-[var(--color-card-button)] text-[var(--color-black)] font-semibold font-[Cabin,sans-serif] flex items-center gap-2 shadow-sm hover:brightness-105 transition-all text-base"
          >
            <UploadIcon className="w-5 h-5" /> Upload New Document
          </button>
        </div>
        {Array.isArray(documents) && documents.length > 0 ? (
          <DocumentSection
            documents={documents}
            onEditDocument={(index) => {
              console.log("Edit document at index:", index);
            }}
          />
        ) : (
          <p className="text-gray-400">No documents found</p>
        )}
        <div className="flex justify-end gap-4 sm:gap-8  sm:mt-8 w-full">
          <button
            className="w-[300px] font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E] mb-8 mt-2"
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
