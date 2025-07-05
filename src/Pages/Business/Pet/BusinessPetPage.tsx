import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../Components/BusinessComponents/BusinessNavbar";
import RenameDocumentModal from "../../../Components/Document/RenameDocumentModal";
import EditVaccineModal from "../../../Components/Vaccine/EditVaccineModal";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import petServices from "../../../Services/petServices";
import { FaCircleExclamation } from "react-icons/fa6";
import PetAvatar from "../../../Assets/PetAvatar.svg";

// Define TypeScript interfaces for nested objects
interface ProfilePictureDocument {
  document_url?: string;
}

interface HumanOwner {
  human_owner_name?: string;
  location?: string;
  phone?: string;
  email?: string;
}

interface LastVisit {
  created_at?: string;
  staff?: { staff_name?: string };
  business?: { business_name?: string };
}

interface Vaccine {
  vaccine_name?: string;
  date_due?: string;
}

// Define TypeScript interface for Pet
interface Pet {
  last_visit: LastVisit;
  next_due_vaccine: Vaccine;
  profilePictureDocument: ProfilePictureDocument;
  human_owner: HumanOwner;
  notes: ReactNode;
  spay_neuter: boolean;
  id: string;
  pet_name: string;
  profile_picture?: string;
  age?: number;
  breed?: { breed_name: string };
  microchip?: string;
  gender?: string;
  color?: string;
  dob?: string;
  weight?: number;
}

const PetBusinessHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [loading, setLoading] = useState(true);
  const [editDocIdx, setEditDocIdx] = useState<number | null>(null);
  const [editDocName, setEditDocName] = useState<string>("");
  const [editVaccineIdx, setEditVaccineIdx] = useState<number | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);

  // Handle saving document name
  const handleSaveDocumentName = (newName: string) => {
    console.log("Saving document name:", newName);
    setEditDocName(newName);
    setEditDocIdx(null);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        if (!petId) {
          setLoading(false);
          return;
        }

        const petRes = await petServices.getPetById(petId);
        console.log("[HomePage] Fetched pet response:", petRes);
        let petData: any = petRes;
        // If petRes is a PetResponse, extract .data
        if (petRes && petRes.data) petData = petRes.data;
        // If still an array, use first element
        if (Array.isArray(petData)) petData = petData[0];
        // If still not a valid pet object, error
        if (
          !petData ||
          typeof petData !== "object" ||
          !("id" in petData) ||
          !("pet_name" in petData)
        ) {
          console.error("[HomePage] No valid pet found. petData:", petData);
          setPet(null);
          setLoading(false);
          return;
        }
        setPet(petData);
      } catch (err: any) {
        console.error("[HomePage] Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [petId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
        <Navbar />
        <div className="container mx-auto max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
        <Navbar />
        <div className="container mx-auto max-w-7xl pt-8 pb-12 px-8">
          <div className="text-center">Pet not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-8xl bg-[#FFF8E5] text-[var(--color-text)] font-sans flex flex-col">
      <Navbar />
      <div className="min-h-screen w-full max-w-8xl bg-[#FFF8E5] text-[var(--color-text)] font-sans flex flex-col items-center">
        <div className="w-full max-w-7xl pb-6 flex flex-col px-4 sm:px-6 md:px-8 justify-center">
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-3 text-[#1C232E] hover:text-[#FFB23E] transition-colors"
          >
            <span className="text-lg">
              <IoIosArrowDropleftCircle className="h-5 w-5" />
            </span>
            <span className="font-medium">Go Back</span>
          </button>

          {/* Main flex row: Pet Card | Right Section */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch w-full max-w-full md:max-w-none">
            {/* Pet Card (left) */}
            <div className="bg-[#6A8293] rounded-[24px] p-2 sm:p-4 text-white border border-black flex flex-col items-center w-full md:max-w-[350px] min-w-0 md:flex-shrink-0 md:basis-1/3">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-full aspect-square rounded-[20px] overflow-hidden mb-2 bg-black">
                  <img
                    src={pet.profilePictureDocument?.document_url || PetAvatar}
                    alt={pet.pet_name || "Pet"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h1 className="text-2xl font-[cabin, sans-serif] text-[#FFF8E5] font-[400] mb-4">
                {pet.pet_name || "Pet"}
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[14px] sm:text-[16px]">
                      Age
                    </span>
                    <div className="font-[500] text-[#FFF8E5] text-[16px] sm:text-[20px]">
                      {pet.age || "13"} years old
                    </div>
                  </div>
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[14px] sm:text-[16px]">
                      Breed
                    </span>
                    <div className="font-[500] text-[#FFF8E5] text-[16px] sm:text-[20px]">
                      {pet.breed?.breed_name || "Chihuahua Mix"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[14px] sm:text-[16px]">
                      Microchip Number
                    </span>
                    <div className="font-[500] text-[#FFF8E5] text-[16px] sm:text-[20px] break-all">
                      {pet.microchip || "0192837465"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[14px] sm:text-[16px]">
                      Gender
                    </span>
                    <div className="font-[500] text-[#FFF8E5] text-[16px] sm:text-[20px]">
                      {pet.gender || "Male"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[14px] sm:text-[16px]">
                      Colour
                    </span>
                    <div className="font-[500] text-[#FFF8E5] text-[16px] sm:text-[20px]">
                      {pet.color || "Brown Tan"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[14px] sm:text-[16px]">
                      Birthdate
                    </span>
                    <div className="font-[500] text-[#FFF8E5] text-[16px] sm:text-[20px] items-center">
                      {pet.dob
                        ? (() => {
                            const date = new Date(pet.dob);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const year = String(date.getFullYear()).slice(-2);
                            return `${day}/${month}/${year}`;
                          })()
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Health Summary (top), then bottom row (Parent Details & Vaccines and Documents) */}
            <div className="flex flex-col flex-1 gap-6 h-full min-w-0 md:basis-2/3">
              {/* Health Summary */}
              <div className="bg-[#EDCC79] rounded-3xl p-4 sm:p-6 border border-black flex flex-col min-w-0">
                <h2 className="text-3xl font-[cabin, sans-serif] font-[500] mb-4 text-[#1C232E]">
                  Health Summary
                </h2>
                <div className="flex flex-col gap-4 text-sm mb-2">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
                    <div>
                      <span className="text-[#1C232E] opacity-60 text-[14px] sm:text-[16px]">
                        Spay/Neuter Status
                      </span>
                      <div className="font-[500] text-[#1C232E] text-[16px] sm:text-[20px]">
                        {pet.spay_neuter === true ? "Neutered" : "Not Neutered"}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#1C232E] opacity-60 text-[14px] sm:text-[16px]">
                        Weight
                      </span>
                      <div className="font-[500] text-[#1C232E] text-[16px] sm:text-[20px]">
                        {pet.weight ? `${pet.weight}lbs` : "12lbs"}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#1C232E] opacity-60 text-[14px] sm:text-[16px]">
                        Special Notes
                      </span>
                      <div className="font-[500] text-[#1C232E] text-[16px] sm:text-[20px]">
                        {pet.notes || "None"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#1C232E]/60">Last Vet Visit</span>
                  </div>
                  <div className="text-[#1C232E] font-[400] flex flex-col sm:flex-row text-[16px] sm:text-[20px] gap-2 sm:gap-4">
                    <p className="font-[600] text-[16px] sm:text-[20px]">
                      {!pet.last_visit ||
                      Object.keys(pet.last_visit).length === 0
                        ? "Not Visited Yet"
                        : pet.last_visit.created_at
                        ? new Date(
                            pet.last_visit.created_at
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "numeric",
                            year: "2-digit",
                          })
                        : ""}
                    </p>
                    <span className="hidden sm:inline"> | </span>
                    <span className="block sm:inline">
                      {!pet.last_visit ||
                      Object.keys(pet.last_visit).length === 0
                        ? "Not Visited Yet"
                        : `${pet.last_visit.staff?.staff_name || ""}, ${
                            pet.last_visit.business?.business_name || "--"
                          }`}
                    </span>
                    <span className="hidden sm:inline"> | </span>
                    <button
                      className="font-[600] text-[16px] sm:text-[20px] flex flex-row cursor-pointer"
                      onClick={() =>
                        navigate(`/business/pet/${petId}/documents`)
                      }
                    >
                      View Document
                      <IoIosArrowDroprightCircle className="mt-1.5 ml-1" />
                    </button>
                  </div>
                </div>
                <div className="pt-4 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#1C232E]/60">Next Vaccine Due</span>
                  </div>
                  <div className="text-red-500 font-[400] flex flex-col sm:flex-row text-[16px] sm:text-[20px] gap-2 sm:gap-4">
                    <p className="font-[600] text-[16px] sm:text-[20px] text-[#1C232E]">
                      {!pet.next_due_vaccine ||
                      Object.keys(pet.next_due_vaccine).length === 0
                        ? "No vaccine due"
                        : pet.next_due_vaccine.vaccine_name}
                    </p>
                    <span className="font-[400] text-[#1C232E]"> | </span>
                    <span className="text-red-500">
                      In{" "}
                      {pet.next_due_vaccine?.date_due
                        ? Math.max(
                            0,
                            Math.ceil(
                              (new Date(
                                pet.next_due_vaccine.date_due
                              ).getTime() -
                                new Date().setHours(0, 0, 0, 0)) /
                                (1000 * 60 * 60 * 24)
                            )
                          )
                        : "--"}{" "}
                      days
                    </span>
                    <FaCircleExclamation className="mt-1.5 ml-1 text-red-500" />
                    <p className="font-[600] text-[16px] sm:text-[20px] flex flex-row text-[#1C232E]">
                      <span className="font-[400]"> | &nbsp;</span>
                      <button
                        className="font-[600] text-[16px] sm:text-[20px] flex flex-row cursor-pointer"
                        onClick={() =>
                          navigate(`/business/pet/${petId}/documents`)
                        }
                      >
                        View Document
                        <IoIosArrowDroprightCircle className="mt-1.5 ml-1" />
                      </button>
                    </p>
                  </div>
                </div>
              </div>
              {/* Bottom row: Parent Details & Vaccines and Documents */}
              <div className="flex flex-responsive-row gap-6 flex-1 h-0 min-h-0 w-full items-stretch">
                {/* Parent Details */}
                <div className="bg-[#ABA75C]/50 rounded-3xl p-4 border border-black min-w-0 basis-60 flex flex-col">
                  <h2 className="text-3xl font-[cabin, sans-serif] font-[500] mb-4 text-[#1C232E]">
                    Parent Details
                  </h2>
                  <div className="flex flex-col gap-4 text-sm">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
                      <div>
                        <span className="text-[#1C232E] opacity-60 text-[14px] sm:text-[16px]">
                          Name
                        </span>
                        <div className="font-[500] text-[#1C232E] text-[16px] sm:text-[20px]">
                          {pet.human_owner?.human_owner_name || "Unknown"}
                        </div>
                      </div>
                      <div>
                        <span className="text-[#1C232E] opacity-60 text-[14px] sm:text-[16px]">
                          Location
                        </span>
                        <div className="font-[500] text-[#1C232E] text-[16px] sm:text-[20px]">
                          {pet.human_owner?.location || "Unknown"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
                      <div>
                        <span className="text-[#1C232E] opacity-60 text-[14px] sm:text-[16px]">
                          Phone number
                        </span>
                        <div className="font-[500] text-[#1C232E] text-[16px] sm:text-[20px]">
                          {pet.human_owner?.phone || "Unknown"}
                        </div>
                      </div>
                      <div>
                        <span className="text-[#1C232E] opacity-60 text-[14px] sm:text-[16px]">
                          Email
                        </span>
                        <div
                          className="font-[500] text-[#1C232E] text-[16px] sm:text-[20px] break-words truncate max-w-full"
                          title={pet.human_owner?.email || "Unknown"}
                        >
                          {pet.human_owner?.email || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Vaccines and Documents */}
                <div className="bg-[#3C2A17] rounded-3xl p-4 text-[#FFF8E5] min-w-0 basis-40 flex flex-col">
                  <h2 className="text-2xl font-[cabin, sans-serif] font-[500] mb-4 ">
                    Vaccines and Documents
                  </h2>
                  <div className="space-y-4">
                    <button
                      className="w-full bg-[#FFB23E] text-black py-2 px-3 rounded-full font-medium hover:bg-[#e6a036] transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(`/business/pet/${petId}/documents`)
                      }
                    >
                      View All Documents
                    </button>
                    <button
                      className="w-full bg-transparent border-2 border-[#FFB23E] text-[#FFB23E] py-2 px-3 rounded-full font-medium hover:bg-[#FFB23E] hover:text-black transition-colors cursor-pointer"
                      onClick={() => navigate(`/business/pet/${petId}/vaccine`)}
                    >
                      View All Vaccine Records
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {editDocIdx !== null && (
          <RenameDocumentModal
            open={editDocIdx !== null}
            initialName={editDocName}
            onClose={() => setEditDocIdx(null)}
            onSave={handleSaveDocumentName}
          />
        )}
        {editVaccineIdx !== null && (
          <EditVaccineModal
            open={editVaccineIdx !== null}
            vaccine={{ id: "", name: "", date: "" }}
            onClose={() => setEditVaccineIdx(null)}
            onSuccess={() => setEditVaccineIdx(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PetBusinessHomePage;
