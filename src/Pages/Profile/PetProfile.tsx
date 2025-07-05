import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import SwitchProfileModal from "../../Components/Profile/SwitchProfileModal";
import petServices from "../../Services/petServices";
import humanOwnerServices from "../../Services/humanOwnerServices";
import { storeLastPetId } from "../../utils/petNavigation";
import PetAvatar from "../../Assets/PetAvatar.svg";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../Components/ui/dialog";
import QRCode from "react-qr-code";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { FaCircleExclamation } from "react-icons/fa6";
import { RefreshCcw } from "lucide-react";

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
              ? pet.profilePictureDocument?.document_url
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
    navigate(`/petowner/pet/${petId}/switch-profile`);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-4">
          <div>
            <button
              className="text-[var(--color-primary)] cursor-pointer text-base font-medium flex items-center gap-2 mb-2 sm:mb-0"
              onClick={() => navigate(`/petowner/pet/${petId}/home`)}
            >
              <IoIosArrowDropleftCircle /> Go Back
            </button>
            <p className="text-3xl font-lighter flex items-center gap-3 font-serif">
              Pet Profile
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <button
              onClick={() => navigate(`/petowner/pet/${petId}/switch-profile`)}
              className="w-full sm:w-auto px-4 sm:px-10 font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-1 border border-[#FFB23E] bg-[#FFB23E] text-center"
            >
              <span className="flex items-center">
                <RefreshCcw className="w-5 h-5 mr-1" />
                Switch to Another Pet
              </span>
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-stretch w-full max-w-full md:max-w-none">
          {/* Pet Card (business style, responsive, health summary text) */}
          <div className="bg-[#6A8293] rounded-[24px] p-3 text-white border border-black flex flex-col items-center w-full md:max-w-[350px] min-w-0 md:flex-shrink-0 md:basis-1/3">
            <div className="flex flex-col items-center text-center mb-2 w-full">
              <div className="w-full h-full rounded-[20px] overflow-hidden mb-2 bg-black">
                <img
                  src={
                    (currentPet?.profile_picture &&
                      typeof currentPet?.profile_picture === "string" &&
                      currentPet?.profile_picture) ||
                    currentPet?.profilePictureDocument?.document_url ||
                    (currentPet?.profile_picture &&
                      typeof currentPet?.profile_picture === "object" &&
                      currentPet?.profile_picture.profilePictureDocument
                        ?.document_url) ||
                    PetAvatar
                  }
                  alt={currentPet?.pet_name || "Pet"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-2xl font-[cabin, sans-serif] text-[#FFF8E5] font-[400] mb-4">
              {currentPet?.pet_name || "Pet"}
            </h1>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm w-full">
              <div className="flex flex-col gap-3 flex-1 w-full">
                <div>
                  <span className="text-[#FFF8E5]/60 text-sm font-[Cabin,sans-serif]">
                    Age
                  </span>
                  <div className="font-medium text-[#FFF8E5] text-base font-[Cabin,sans-serif] break-words">
                    {currentPet?.age || "Unknown"} years old
                  </div>
                </div>
                <div>
                  <span className="text-[#FFF8E5]/60 text-sm font-[Cabin,sans-serif]">
                    Breed
                  </span>
                  <div className="font-medium text-[#FFF8E5] text-base font-[Cabin,sans-serif] break-words">
                    {currentPet?.breed?.breed_name || "Unknown"}
                  </div>
                </div>
                <div>
                  <span className="text-[#FFF8E5]/60 text-sm font-[Cabin,sans-serif]">
                    Microchip Number
                  </span>
                  <div className="font-medium text-[#FFF8E5] text-base font-[Cabin,sans-serif] break-words">
                    {currentPet?.microchip || "Unknown"}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1 w-full">
                <div>
                  <span className="text-[#FFF8E5]/60 text-sm font-[Cabin,sans-serif]">
                    Gender
                  </span>
                  <div className="font-medium text-[#FFF8E5] text-base font-[Cabin,sans-serif] break-words">
                    {currentPet?.gender || "Unknown"}
                  </div>
                </div>
                <div>
                  <span className="text-[#FFF8E5]/60 text-sm font-[Cabin,sans-serif]">
                    Colour
                  </span>
                  <div className="font-medium text-[#FFF8E5] text-base font-[Cabin,sans-serif] break-words">
                    {currentPet?.color || "Unknown"}
                  </div>
                </div>
                <div>
                  <span className="text-[#FFF8E5]/60 text-sm font-[Cabin,sans-serif]">
                    Birthdate
                  </span>
                  <div className="font-medium text-[#FFF8E5] text-base font-[Cabin,sans-serif] break-words">
                    {currentPet?.dob || "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Health Summary (top), then bottom row (Syd's Code + Your Details) */}
          <div className="flex flex-col flex-1 gap-6 h-full min-w-0 md:basis-2/3">
            {/* Health Summary */}
            <div className="bg-[#EDCC79] rounded-[12px] p-responsive border border-black flex flex-col min-w-0">
              <h2 className="text-2xl font-medium font-[Cabin,sans-serif] mb-4 text-[#1C232E]">
                Health Summary
              </h2>
              <div className="flex flex-col md:flex-row gap-4 md:gap-12 mb-4">
                <div>
                  <div className="text-[#1C232E]/60 text-sm font-[Cabin,sans-serif]">
                    Spay/Neuter Status
                  </div>
                  <div className="font-medium text-[#1C232E] text-base font-[Cabin,sans-serif]">
                    {currentPet?.spay_neuter === true
                      ? "Neutered"
                      : "Not Neutered"}
                  </div>
                </div>
                <div>
                  <div className="text-[#1C232E]/60 text-sm font-[Cabin,sans-serif]">
                    Weight
                  </div>
                  <div className="font-medium text-[#1C232E] text-base font-[Cabin,sans-serif]">
                    {currentPet?.weight ? `${currentPet.weight}lbs` : "12lbs"}
                  </div>
                </div>
                <div>
                  <div className="text-[#1C232E]/60 text-sm font-[Cabin,sans-serif]">
                    Special Notes
                  </div>
                  <div className="font-medium text-[#1C232E] text-base font-[Cabin,sans-serif]">
                    {currentPet?.notes || (
                      <span className="font-medium text-[#1C232E] text-base font-[Cabin,sans-serif]">
                        Unknown{" "}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Last Vet Visit */}
              <div className="mb-2">
                <div className="text-[#1C232E]/60 mb-1 text-sm font-[Cabin,sans-serif]">
                  Last Vet Visit
                </div>
                <div className="flex flex-wrap items-center gap-2 text-base text-[#1C232E] font-[Cabin,sans-serif]">
                  <span className="font-bold">
                    {!currentPet?.last_visit ||
                    Object.keys(currentPet?.last_visit || {}).length === 0
                      ? "--"
                      : new Date(
                          currentPet.last_visit.created_at
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "2-digit",
                        })}
                  </span>
                  {currentPet?.last_visit &&
                    Object.keys(currentPet?.last_visit || {}).length > 0 && (
                      <>
                        <span className="mx-2 text-[#1C232E]/40 text-lg font-bold">
                          |
                        </span>
                        <span className="font-medium">
                          {`${
                            currentPet.last_visit.staff?.staff_name || "--"
                          }, ${
                            currentPet.last_visit.business?.business_name ||
                            "--"
                          }`}
                        </span>
                        <span className="mx-2 text-[#1C232E]/40 text-lg font-bold">
                          |
                        </span>
                        <button
                          className="cursor-pointer font-semibold text-base text-[#1C232E] flex items-center gap-1 font-[Cabin,sans-serif] "
                          onClick={() =>
                            navigate(`/petowner/pet/${petId}/documents`)
                          }
                        >
                          View Document{" "}
                          <IoIosArrowDroprightCircle className="text-lg" />
                        </button>
                      </>
                    )}
                </div>
              </div>
              {/* Next Vaccine Due */}
              <div>
                <div className="text-[#1C232E]/60 mb-1 text-sm font-[Cabin,sans-serif]">
                  Next Vaccine Due
                </div>
                <div className="flex flex-wrap items-center gap-2 text-base font-[Cabin,sans-serif]">
                  <span className="font-bold text-[#1C232E]">
                    {!currentPet?.next_due_vaccine ||
                    Object.keys(currentPet?.next_due_vaccine || {}).length === 0
                      ? "--"
                      : currentPet.next_due_vaccine.vaccine_name}
                  </span>
                  {currentPet?.next_due_vaccine &&
                    Object.keys(currentPet?.next_due_vaccine || {}).length >
                      0 && (
                      <>
                        <span className="mx-2 text-[#1C232E]/40 text-lg font-bold">
                          |
                        </span>
                        {currentPet?.next_due_vaccine?.date_due ? (
                          (() => {
                            const daysLeft = Math.max(
                              0,
                              Math.ceil(
                                (new Date(
                                  currentPet.next_due_vaccine.date_due
                                ).getTime() -
                                  new Date().setHours(0, 0, 0, 0)) /
                                  (1000 * 60 * 60 * 24)
                              )
                            );
                            return (
                              <span className="font-semibold flex items-center gap-1 text-[#1C232E]">
                                In {daysLeft} days
                                {daysLeft <= 6 && (
                                  <FaCircleExclamation className="text-[#B91C1C] text-base" />
                                )}
                              </span>
                            );
                          })()
                        ) : (
                          <span className="text-[#B91C1C] font-semibold">
                            --
                          </span>
                        )}
                        <span className="mx-2 text-[#1C232E]/40 text-lg font-bold">
                          |
                        </span>
                        <button
                          className="cursor-pointer font-semibold text-base text-[#1C232E] flex items-center gap-1 font-[Cabin,sans-serif] "
                          onClick={() =>
                            navigate(`/petowner/pet/${petId}/vaccine`)
                          }
                        >
                          View Document{" "}
                          <IoIosArrowDroprightCircle className="text-lg" />
                        </button>
                      </>
                    )}
                </div>
              </div>
            </div>
            {/* Bottom row: Syd's Code & Your Details */}
            <div className="flex flex-responsive-row gap-6 flex-1 h-0 min-h-0 w-full items-stretch">
              {/* Syd's Code - Responsive and consistent text */}
              <div
                className="bg-[#DC9A6B80] border border-black rounded-3xl basis-40 flex flex-col justify-between p-4 min-w-0 w-full"
                style={{ boxShadow: "none" }}
              >
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 w-full gap-2">
                  <div className="font-[cabin, sans-serif] text-3xl font-[500] text-[#23272f] mb-2 md:mb-0">
                    {currentPet?.pet_name || "Pet"}'s Code
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="flex cursor-pointer items-center gap-2 bg-[var(--color-card-button)] text-[#23272f] px-2 py-1 rounded-full font-semibold text-sm hover:opacity-90"
                        title="Show QR Code"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-6"
                          viewBox="0 0 24 25"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_1021_7408)">
                            <path
                              d="M12 3.3125V5.1875H10.125V3.3125H12ZM10.125 14.3281V17H12V14.3281H10.125ZM15.75 24.5V22.625H13.875V20.75H12V24.5H15.75ZM19.5 10.5781H13.875V12.4531H19.5V10.5781ZM19.5 14.3281H22.125V12.4531H19.5V14.3281ZM19.5 17V18.875H24V14.3281H22.125V17H19.5ZM13.875 0.5H12V3.3125H13.875V0.5ZM12 8.9375H13.875V5.1875H12V7.0625H10.125V12.4531H12V8.9375ZM0 10.5781V14.3281H1.875V12.4531H4.6875V10.5781H0ZM13.875 14.3281V12.4531H12V14.3281H13.875ZM17.625 16.2031H19.5V14.3281H17.625V16.2031ZM22.125 12.4531H24V10.5781H22.125V12.4531ZM15.75 14.3281H13.875V17H12V18.875H15.75V14.3281ZM10.125 20.75H12V18.875H10.125V20.75ZM15.75 18.875V20.75H19.5V18.875H15.75ZM21.375 22.625V20.75H19.5V22.625H21.375ZM24 24.5V22.625H21.375V24.5H24ZM17.625 24.5H19.5V22.625H17.625V24.5ZM8.4375 12.4531V10.5781H6.5625V12.4531H4.6875V14.3281H10.125V12.4531H8.4375ZM8.4375 8.9375H0V0.5H8.4375V8.9375ZM6.5625 2.375H1.875V7.0625H6.5625V2.375ZM5.15625 3.78125H3.28125V5.65625H5.15625V3.78125ZM24 0.5V8.9375H15.5625V0.5H24ZM22.125 2.375H17.4375V7.0625H22.125V2.375ZM20.7188 3.78125H18.8438V5.65625H20.7188V3.78125ZM0 16.0625H8.4375V24.5H0V16.0625ZM1.875 22.625H6.5625V17.9375H1.875V22.625ZM3.28125 21.2188H5.15625V19.3438H3.28125V21.2188Z"
                              fill="black"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1021_7408">
                              <rect
                                width="24"
                                height="24"
                                fill="white"
                                transform="translate(0 0.5)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <span className="hidden sm:inline">View QR</span>
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
                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                  {(currentPet?.qr_code_id || "")
                    .split("")
                    .map((char: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex w-8 h-10 bg-[var(--color-text-bright)] bg-opacity-80 text-[#23272f] text-[20px] font-[cabin, sans-serif] font-[500] rounded-lg items-center justify-center select-all transition-all duration-150 hover:scale-105 text-center"
                      >
                        {char}
                      </span>
                    ))}
                </div>
                <div className="font-[cabin, sans-serif] text-[#23272f]/60 text-[16px] text-left">
                  Share with care providers to give access to the profile.
                </div>
              </div>
              {/* Your Details */}
              <div className="bg-[#ABA75C]/50 rounded-3xl p-4 border border-black min-w-0 basis-60 flex flex-col">
                <h2 className="text-3xl font-[cabin, sans-serif] font-[500] mb-4 text-[#1C232E]">
                  Your Details
                </h2>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex flex-row gap-4 items-start min-w-0">
                    <div>
                      <span className="text-[#23272f] opacity-60 text-[16px]">
                        Name
                      </span>
                      <div className="font-[500] text-[#23272f] text-[20px]">
                        {humanProfile?.human_owner_name || "Unknown"}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#23272f] opacity-60 text-[16px]">
                        Location
                      </span>
                      <div className="font-[500] text-[#23272f] text-[20px]">
                        {humanProfile?.location || "Unknown"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 items-start min-w-0">
                    <div>
                      <span className="text-[#23272f] opacity-60 text-[16px]">
                        Phone number
                      </span>
                      <div
                        className="font-[500] text-[#23272f] text-[20px] truncate max-w-[180px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[400px] min-w-0"
                        title={humanProfile?.phone || "Unknown"}
                      >
                        {humanProfile?.phone || "Unknown"}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#23272f] opacity-60 text-[16px]">
                        Email
                      </span>
                      <div
                        className="font-[500] text-[#23272f] text-[20px] break-words max-w-full min-w-0"
                        title={humanProfile?.email || "Unknown"}
                      >
                        {humanProfile?.email || "Unknown"}
                      </div>
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
