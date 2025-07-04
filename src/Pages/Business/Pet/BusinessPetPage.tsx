import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../Components/BusinessComponents/BusinessNavbar";
import RenameDocumentModal from "../../../Components/Document/RenameDocumentModal";
import EditVaccineModal from "../../../Components/Vaccine/EditVaccineModal";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import petServices from "../../../Services/petServices";
import { FaCircleExclamation } from "react-icons/fa6";

// Define TypeScript interface for Pet
interface Pet {
  human_owner: any;
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
  const [] = useState<string | null>(null);
  const [] = useState<string>("My Pet");
  const [editDocIdx, setEditDocIdx] = useState<number | null>(null);
  const [editDocName] = useState<string>("");
  const [editVaccineIdx, setEditVaccineIdx] = useState<number | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [, ] = useState<'profile' | 'vaccines' | 'documents'>('profile');

  // Handle saving document name
  const handleSaveDocumentName = (newName: string) => {
    console.log("Saving document name:", newName);
    setEditDocIdx(null);
  };

  // Handle saving vaccine

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        if (!petId) {
          setLoading(false);
          return;
        }

        const petRes = await petServices.getPetById(petId);
        console.log("[HomePage] Fetched pet data:", petRes);
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
    <div className="min-h-screen w-full max-w-8xl bg-[#FFF8E5] text-[var(--color-text)] flex flex-col justify-center items-center">
      <Navbar />
      <div className="max-w-6xl pb-10 flex justify-center flex-col">
        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-[#1C232E] hover:text-[#FFB23E] transition-colors"
        >
          <span className="text-lg"><IoIosArrowDropleftCircle className="h-5 w-5" /></span>
          <span className="font-medium">Go Back</span>
        </button>

        <div className="flex flex-row gap-6">
          <div className="space-y-6 max-w-[32%]">
            <div className="bg-[#6A8293] rounded-[24px] p-6 text-white border border-black">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-full h-full rounded-[20px] overflow-hidden mb-2 bg-black">
                  <img
                    src={pet.profile_picture || "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80"}
                    alt={pet.pet_name || "Pet"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h1 className="text-4xl font-[cabin, sans-serif] text-[#FFF8E5] font-[400] mb-4">{pet.pet_name || "Pet"}</h1>
              <div className="flex flex-row gap-8 text-sm">
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[20px]">Age</span>
                    <div className="font-[500] text-[#FFF8E5] text-[24px]">{pet.age || "13"} years old</div>
                  </div>
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[20px]">Breed</span>
                    <div className="font-[500] text-[#FFF8E5] text-[24px]">{pet.breed?.breed_name || "Chihuahua Mix"}</div>
                  </div>
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[20px]">Microchip Number</span>
                    <div className="font-[500] text-[#FFF8E5] text-[24px]">{pet.microchip || "0192837465"}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[20px]">Gender</span>
                    <div className="font-[500] text-[#FFF8E5] text-[24px]">{pet.gender || "Male"}</div>
                  </div>
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[20px]">Colour</span>
                    <div className="font-[500] text-[#FFF8E5] text-[24px]">{pet.color || "Brown Tan"}</div>
                  </div>
                  <div>
                    <span className="text-[#FFF8E599]/60 font-[400] text-[20px]">Birthdate</span>
                    <div className="font-[500] text-[#FFF8E5] text-[24px]">
                      {pet.dob ? (() => {
                        const date = new Date(pet.dob);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = String(date.getFullYear()).slice(-2);
                        return `${day}/${month}/${year}`;
                      })() : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
              <div className="bg-[#EDCC79] rounded-3xl p-4 border border-black flex flex-col">
                <h2 className="text-[36px] font-[cabin, sans-serif] font-[500] mb-2 text-[#1C232E]">Health Summary</h2>
                <div className="flex flex-col gap-4 text-sm mb-2">
                  <div className="flex flex-row gap-8 items-start">
                    <div>
                      <span className="text-[#1C232E] opacity-60 text-[16px]">Spay/Neuter Status</span>
                      <div className="font-[500] text-[#1C232E] text-[20px]">{pet.spay_neuter === true ? "Neutered" : "Not Neutered"}</div>
                    </div>
                    <div>
                      <span className="text-[#1C232E] opacity-60 text-[16px]">Weight</span>
                      <div className="font-[500] text-[#1C232E] text-[20px]">{pet.weight ? `${pet.weight}lbs` : "12lbs"}</div>
                    </div>
                    <div>
                      <span className="text-[#1C232E] opacity-60 text-[16px]">Special Notes</span>
                      <div className="font-[500] text-[#1C232E] text-[20px]">{pet.notes}</div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#1C232E]/60">Last Vet Visit</span>
                  </div>
                  <div className="text-[#1C232E] font-[400] flex flex-row text-[20px]"><p className="font-[600] text-[20px]">3/4/24 &nbsp; </p> | &nbsp; Dr. Hemant Patel, Vet Office of New York &nbsp; | <p className="font-[600] text-[20px] flex flex-row">&nbsp; View Document <IoIosArrowDroprightCircle className="mt-1.5 ml-1"/></p></div>
                </div>
                <div className="pt-4 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#1C232E]/60">Next Vaccine Due</span>
                  </div>
                  <div className="text-red-500 font-[400] flex flex-row text-[20px]"><p className="font-[600] text-[20px] text-[#1C232E]">K9 DA2PPV 3 Year (VANGUARD) &nbsp;| </p>  &nbsp; In 3 days <FaCircleExclamation className="mt-1.5 ml-1"/>&nbsp; <p className="font-[600] text-[20px] flex flex-row text-[#1C232E]">| &nbsp; View Document <IoIosArrowDroprightCircle className="mt-1.5 ml-1"/></p></div>
                </div>
              </div>
            <div className="flex flex-row gap-6 justify-center">
              <div className="bg-[#ABA75C]/50 rounded-3xl p-4 border border-black min-w-[55%]">
                <h2 className="text-[24px] font-[cabin, sans-serif] font-[500] mb-4 text-[#1C232E]">Parent Details</h2>
                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex flex-row gap-8 items-start">
                    <div>
                      <span className="text-[#1C232E] opacity-60 text-[16px]">Name</span>
                      <div className="font-[500] text-[#1C232E] text-[20px]">{pet.human_owner.human_owner_name}</div>
                    </div>
                    <div>
                      <span className="text-[#1C232E] opacity-60 text-[16px]">Location</span>
                      <div className="font-[500] text-[#1C232E] text-[20px]">{pet.human_owner.location}</div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-8 items-start">
                    <div>
                      <span className="text-[#1C232E] opacity-60 text-[16px]">Phone number</span>
                      <div className="font-[500] text-[#1C232E] text-[20px]">{pet.human_owner.phone}</div>
                    </div>
                    <div>
                      <span className="text-[#1C232E] opacity-60 text-[16px]">Email</span>
                      <div className="font-[500] text-[#1C232E] text-[20px]">{pet.human_owner.email}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#3C2A17] rounded-3xl p-4 text-[#FFF8E5]">
                <h4 className="sm:text-[24px] font-serif font-[400] mb-6 text-center">Vaccines and Documents</h4>
                <div className="space-y-4">
                  <button className="w-full bg-[#FFB23E] text-black py-3 px-6 rounded-full font-medium hover:bg-[#e6a036] transition-colors cursor-pointer" onClick={()=> navigate(`/business/pet/${petId}/documents`)}>
                    View All Documents
                  </button>
                  <button className="w-full bg-transparent border-2 border-[#FFB23E] text-[#FFB23E] py-3 px-6 rounded-full font-medium hover:bg-[#FFB23E] hover:text-black transition-colors cursor-pointer" onClick={()=> navigate(`/business/pet/${petId}/vaccine`)}>
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
          open={true}
          initialName={editDocName}
          onClose={() => setEditDocIdx(null)}
          onSave={handleSaveDocumentName}
        />
      )}
      {editVaccineIdx !== null && (
        <EditVaccineModal
          open={true}
          vaccine={{}} // Dummy data for vaccine modal
          onClose={() => setEditVaccineIdx(null)}
          onSuccess={() => setEditVaccineIdx(null)}
        />
      )}
    </div>
  );
};

export default PetBusinessHomePage;