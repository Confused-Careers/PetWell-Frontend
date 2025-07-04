import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import SwitchProfileModal from "../../Components/Profile/SwitchProfileModal";
import petServices from "../../Services/petServices";
import humanOwnerServices from "../../Services/humanOwnerServices";
import { storeLastPetId } from "../../utils/petNavigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../Components/ui/dialog";
import QRCode from "react-qr-code";

import {
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { FaCircleExclamation } from "react-icons/fa6";

const PetProfile: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [pets, setPets] = useState<PetProfileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPet, setCurrentPet] = useState<any>(null);
  const [humanProfile, setHumanProfile] = useState<any>(null);

  interface PetProfileType {
    id: string;
    name: string;
    age: string;
    breed: string;
    avatar: string;
  }

  // Fetch all pets for switch modal
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsRes = await petServices.getPetsByOwner();
        let petsArr = Array.isArray(petsRes) ? petsRes : petsRes.data;
        console.log("petArr:", petsArr);
        if (!petsArr) petsArr = [];
        if (!Array.isArray(petsArr)) petsArr = [petsArr];

        const formattedPets: PetProfileType[] = petsArr.map((pet) => ({
          id: pet.id,
          name: pet.pet_name,
          age: `${pet.age} years`,
          breed: pet.breed?.breed_name || "Mixed Breed",
          avatar:
            pet.profile_picture && typeof pet.profile_picture === "string"
              ? pet.profile_picture
              : "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80",
        }));

        setPets(formattedPets);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Fetch current pet data
  useEffect(() => {
    const fetchCurrentPet = async () => {
      if (!petId) return;

      try {
        const petRes = await petServices.getPetById(petId);
        let petData: any = petRes;

        // Handle different response structures
        if (petRes && petRes.data) petData = petRes.data;
        if (Array.isArray(petData)) petData = petData[0];

        console.log("Current pet data:", petData);
        setCurrentPet(petData);

        // Store this pet ID as the last used pet ID
        if (petData && petData.id) {
          storeLastPetId(petData.id);
        }
      } catch (error) {
        console.error("Failed to fetch current pet:", error);
        setCurrentPet(null);
      }
    };

    fetchCurrentPet();
  }, [petId]);

  // Fetch human profile data
  useEffect(() => {
    const fetchHumanProfile = async () => {
      try {
        const humanRes = await humanOwnerServices.getProfile();
        let humanData: any = humanRes;

        // Handle different response structures
        if (humanRes && humanRes.data) humanData = humanRes.data;
        if (Array.isArray(humanData)) humanData = humanData[0];

        console.log("Human profile data:", humanData);
        setHumanProfile(humanData);
      } catch (error) {
        console.error("Failed to fetch human profile:", error);
        setHumanProfile(null);
      }
    };

    fetchHumanProfile();
  }, []);

  // Navigation handlers
  const handleSwitchProfile = () => {
    navigate("/petowner/pet/switch-profile");
  };
  const handleModalSwitch = (selectedPetId: string) => {
    setShowSwitchModal(false);
    // Navigate to the selected pet's home page
    navigate(`/petowner/pet/${selectedPetId}/home`);
  };
  const handleAddNewPet = () => {
    setShowSwitchModal(false);
    navigate("/upload-option");
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF8E5] text-[var(--color-text)] px-0 sm:px-8 pb-10">
      <Navbar onSwitchProfile={handleSwitchProfile} />
      <SwitchProfileModal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        onSwitch={handleModalSwitch}
        onAddNew={handleAddNewPet}
        pets={pets}
        loading={loading}
        destination="profile"
      />
      <div className="pt-8 px-2 sm:px-4 max-w-7xl mx-auto w-full">
        <div
          className="flex flex-responsive-row gap-6 items-stretch w-full"
          style={{ alignItems: "stretch" }}
        >
          {/* Left: Pet Card (should stretch full height) */}
          <div
            className="flex-shrink-0 w-full md:w-auto"
            style={{ minWidth: 0, maxWidth: 350 }}
          >
            <div
              className="bg-[#6A8293] rounded-[16px] p-responsive text-white border border-black h-full flex flex-col items-center justify-start w-full min-w-0"
              style={{ minHeight: 0, height: "100%" }}
            >
              <div className="w-48 h-48 rounded-xl overflow-hidden mb-4 bg-black flex items-center justify-center">
                <img
                  src={
                    currentPet?.profile_picture ||
                    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80"
                  }
                  alt={currentPet?.pet_name || "Pet"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full">
                <div className="font-[Cabin,sans-serif] text-responsive-3xl font-bold mb-4 text-white">
                  {currentPet?.pet_name || "Pet"}
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base">
                  <div>
                    <div className="text-white/70 font-normal">Age</div>
                    <div className="font-bold text-white text-lg">
                      {currentPet?.age || "13"} years old
                    </div>
                  </div>
                  <div>
                    <div className="text-white/70 font-normal">Gender</div>
                    <div className="font-bold text-white text-lg">
                      {currentPet?.gender || "Male"}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/70 font-normal">Breed</div>
                    <div className="font-bold text-white text-lg">
                      {currentPet?.breed?.breed_name || "Chihuahua Mix"}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/70 font-normal">Colour</div>
                    <div className="font-bold text-white text-lg">
                      {currentPet?.color || "Brown Tan"}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/70 font-normal">
                      Microchip Number
                    </div>
                    <div className="font-bold text-white text-lg">
                      {currentPet?.microchip || "0192837465"}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/70 font-normal">Birthdate</div>
                    <div className="font-bold text-white text-lg">
                      {currentPet?.dob || "21/8/13"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Health Summary (top), then bottom row (Syd's Code + Your Details) */}
          <div className="flex flex-col flex-1 gap-6 h-full min-w-0">
            {/* Health Summary */}
            <div className="bg-[#EDCC79] rounded-[12px] p-responsive border border-black flex flex-col min-w-0">
              <h2 className="text-responsive-2xl font-[Cabin,sans-serif] font-bold mb-4 text-[#1C232E]">
                Health Summary
              </h2>
              <div className="flex flex-col md:flex-row gap-4 md:gap-12 mb-4">
                <div>
                  <div className="text-[#1C232E] opacity-60 text-base">
                    Spay/Neuter Status
                  </div>
                  <div className="font-bold text-[#1C232E] text-lg">
                    {currentPet?.spay_neuter === true
                      ? "Neutered"
                      : "Not Neutered"}
                  </div>
                </div>
                <div>
                  <div className="text-[#1C232E] opacity-60 text-base">
                    Weight
                  </div>
                  <div className="font-bold text-[#1C232E] text-lg">
                    {currentPet?.weight ? `${currentPet.weight}lbs` : "12lbs"}
                  </div>
                </div>
                <div>
                  <div className="text-[#1C232E] opacity-60 text-base">
                    Special Notes
                  </div>
                  <div className="font-bold text-[#1C232E] text-lg">
                    {currentPet?.notes || (
                      <span className="opacity-60 font-normal">
                        Allergic to chicken. Anxious during grooming.
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <div className="text-[#1C232E]/60 text-base mb-1">
                  Last Vet Visit
                </div>
                <div className="text-[#1C232E] font-normal flex flex-row flex-wrap items-center text-lg gap-2">
                  <span className="font-bold">
                    {!currentPet?.last_visit ||
                    Object.keys(currentPet.last_visit).length === 0
                      ? "3/4/24"
                      : new Date(
                          currentPet.last_visit.created_at
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "numeric",
                          year: "2-digit",
                        })}
                  </span>
                  <span className="mx-2">|</span>
                  <span>
                    {!currentPet?.last_visit ||
                    Object.keys(currentPet.last_visit).length === 0
                      ? "Dr. Hemant Patel, Vet Office of New York"
                      : (currentPet.last_visit.staff?.staff_name || "") +
                          `, ` +
                          (currentPet.last_visit.business?.business_name ||
                            "") || "--"}
                  </span>
                  <span className="mx-2">|</span>
                  <button className="font-bold flex flex-row items-center text-[#1C232E] hover:underline">
                    View Document <IoIosArrowDroprightCircle className="ml-1" />
                  </button>
                </div>
              </div>
              <div>
                <div className="text-[#1C232E]/60 text-base mb-1">
                  Next Vaccine Due
                </div>
                <div className="flex flex-row flex-wrap items-center text-lg gap-2">
                  <span className="font-bold text-[#1C232E]">
                    {!currentPet?.next_due_vaccine ||
                    Object.keys(currentPet.next_due_vaccine).length === 0
                      ? "K9 DA2PPV 3 Year (VANGUARD)"
                      : currentPet.next_due_vaccine.vaccine_name}
                  </span>
                  <span className="mx-2 text-[#1C232E]">|</span>
                  <span className="text-[#B91C1C] font-bold flex items-center">
                    In 3 days <FaCircleExclamation className="ml-1" />
                  </span>
                  <span className="mx-2 text-[#1C232E]">|</span>
                  <button className="font-bold flex flex-row items-center text-[#1C232E] hover:underline">
                    View Document <IoIosArrowDroprightCircle className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
            {/* Bottom row: Syd's Code & Your Details */}
            <div className="flex flex-responsive-row gap-6 flex-1 h-0 min-h-0 w-full">
              {/* Syd's Code */}
              <div className="bg-[#F6E3D0] rounded-[12px] border border-black p-responsive flex-1 flex flex-col items-start justify-between min-w-0 w-full mb-4 md:mb-0">
                <div className="flex items-center w-full mb-4 justify-between">
                  <div className="font-[Cabin,sans-serif] text-responsive-xl font-bold text-[#23272f]">
                    {currentPet?.pet_name || "Pet"}'s Code
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="flex items-center gap-2 bg-[#EDCC79] text-[#23272f] px-3 py-1 rounded-xl font-semibold text-sm hover:opacity-90 border border-black"
                        title="Show QR Code"
                        type="button"
                      >
                        <span className="hidden sm:inline">View QR</span>
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <rect width="20" height="20" fill="#23272f" rx="4" />
                          <text
                            x="10"
                            y="15"
                            fill="#EDCC79"
                            font-size="10"
                            font-family="Arial"
                            text-anchor="middle"
                          >
                            QR
                          </text>
                        </svg>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center bg-[var(--color-card-profile)] rounded-2xl border border-[var(--color-primary)] p-8 shadow-2xl max-w-xs w-full">
                      <DialogTitle className="text-xl font-bold text-[var(--color-primary)] mb-2">
                        Pet QR Code
                      </DialogTitle>
                      <div className="my-4 flex flex-col items-center">
                        <div className="bg-white p-4 rounded-xl shadow-md border border-[var(--color-primary)]">
                          <QRCode
                            value={currentPet?.qr_code_id || ""}
                            size={180}
                          />
                        </div>
                        <button
                          className="mt-4 px-3 flex-1 cursor-pointer text-[var(--color-text)] bg-[var(--color-card-button)] hover:opacity-90 py-2 rounded-3xl font-semibold transition text-base"
                          onClick={() => {
                            const svg = document.querySelector(
                              "[data-slot='dialog-content'] svg"
                            );
                            if (!svg) return;
                            const serializer = new XMLSerializer();
                            const source = serializer.serializeToString(svg);
                            const url =
                              "data:image/svg+xml;charset=utf-8," +
                              encodeURIComponent(source);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = `${
                              currentPet?.pet_name || "pet"
                            }-qr.svg`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          Download QR
                        </button>
                      </div>
                      <div className="text-center text-sm text-[var(--color-text)] mt-2">
                        Scan this QR code to add this pet to a business
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-row gap-3 mb-4">
                  {(currentPet?.qr_code_id || "X8TV4")
                    .split("")
                    .map((char: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex w-10 h-12 bg-[#23272f] text-[#EDCC79] text-3xl rounded-lg items-center justify-center select-all transition-all duration-150 hover:scale-105 text-center font-[Alike] shadow"
                      >
                        {char}
                      </span>
                    ))}
                </div>
                <div className="font-[Cabin,sans-serif] text-[#23272f]/60 text-base text-left">
                  Share with care providers to give access to the profile.
                </div>
              </div>
              {/* Your Details */}
              <div className="bg-[#E6E7C0] rounded-[12px] p-responsive flex-1 min-w-0 border border-black flex flex-col justify-between w-full">
                <div className="font-[Cabin,sans-serif] text-responsive-xl font-bold mb-4 text-[#23272f]">
                  Your Details
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-base">
                  <div>
                    <div className="font-[Cabin,sans-serif] text-[#23272f]/60 font-normal">
                      Name
                    </div>
                    <div className="font-[Cabin,sans-serif] text-[#23272f] font-bold">
                      {humanProfile?.human_owner_name || "Monica Lee"}
                    </div>
                  </div>
                  <div>
                    <div className="font-[Cabin,sans-serif] text-[#23272f]/60 font-normal">
                      Location
                    </div>
                    <div className="font-[Cabin,sans-serif] text-[#23272f] font-bold">
                      {humanProfile?.location || "Dallas, Texas"}
                    </div>
                  </div>
                  <div>
                    <div className="font-[Cabin,sans-serif] text-[#23272f]/60 font-normal">
                      Phone number
                    </div>
                    <div className="font-[Cabin,sans-serif] text-[#23272f] font-bold">
                      {humanProfile?.phone || "565-555-5562"}
                    </div>
                  </div>
                  <div>
                    <div className="font-[Cabin,sans-serif] text-[#23272f]/60 font-normal">
                      Email
                    </div>
                    <div className="font-[Cabin,sans-serif] text-[#23272f] font-bold">
                      {humanProfile?.email || "email@website.com"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfile;
