import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import SwitchProfileModal from "../../Components/Profile/SwitchProfileModal";
import petServices from "../../Services/petServices";
import humanOwnerServices from "../../Services/humanOwnerServices";
import { storeLastPetId } from "../../utils/petNavigation";
import { generatePetCode } from "../../utils/petCodeGenerator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../Components/ui/dialog";
import QRCode from "react-qr-code";
import { Pencil, RefreshCcw } from "lucide-react";
import { IoIosArrowDropleftCircle } from "react-icons/io";


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
  const handleEditProfile = () =>
    navigate(`/petowner/pet/${petId}/edit-profile`);
  const handleSwitchProfile = () => setShowSwitchModal(true);
  const handleModalSwitch = (selectedPetId: string) => {
    setShowSwitchModal(false);
    // Navigate to the selected pet's home page
    navigate(`/petowner/pet/${selectedPetId}/home`);
  };
  const handleAddNewPet = () => {
    setShowSwitchModal(false);
    navigate("/add-pet-profile");
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] px-0 sm:px-8 pb-10">
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
      <div className="pt-8 px-4 sm:px-0 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <button
              className="text-[var(--color-primary)] cursor-pointer text-base font-medium flex items-center gap-2 hover:underline mb-2 sm:mb-0"
              onClick={() => navigate(`/petowner/pet/${petId}/home`)}
            >
              <IoIosArrowDropleftCircle /> Go Back
            </button>
            <h1 className="text-3xl font-serif font-bold">Pet Profile</h1>
          </div>
          <div className="flex flex-row gap-4">
            <button
              className="border  border-[var(--color-primary)] cursor-pointer bg-[var(--color-card-button)] text-[var(--color-primary)] px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-[var(--color-background)] hover:text-[var(--color-primary)] transition text-base"
              onClick={handleSwitchProfile}
            >
              <RefreshCcw className="w-5 h-5" /> Switch to Another Pet
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Pet Card */}
          <div className="bg-[var(--color-card-profile)] border border-[var(--color-text)] rounded-2xl p-6 flex flex-col items-center w-full max-w-xs min-w-[260px]">
            <div className="w-48 h-48 rounded-xl overflow-hidden mb-4 bg-[var(--color-card)] flex items-center justify-center">
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
              <div className="font-[Cabin,sans-serif] text-[2rem] md:text-[2.2rem] font-bold mb-2 text-[var(--color-text)]">
                {currentPet?.pet_name || "Pet"}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mb-2">
                <div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/70 text-[1.1rem] md:text-[1.2rem] font-normal">Age</div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{currentPet?.age || "Unknown"} years old</div>
                </div>
                <div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/70 text-[1.1rem] md:text-[1.2rem] font-normal">Gender</div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{currentPet?.gender || "Unknown"}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mb-2">
                <div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/70 text-[1.1rem] md:text-[1.2rem] font-normal">Breed</div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{currentPet?.breed?.breed_name || "Mixed Breed"}</div>
                </div>
                <div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/70 text-[1.1rem] md:text-[1.2rem] font-normal">Colour</div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{currentPet?.color || "Unknown"}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mb-2">
                <div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/70 text-[1.1rem] md:text-[1.2rem] font-normal">Microchip Number</div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{currentPet?.microchip || "Unknown"}</div>
                </div>
                <div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/70 text-[1.1rem] md:text-[1.2rem] font-normal">Birthdate</div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{currentPet?.dob || "Unknown"}</div>
                </div>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="mt-4 px-4 py-2 cursor-pointer bg-[var(--color-card-button)] border border-[var(--color-text)] rounded-full text-[var(--color-black)] font-semibold hover:bg-[var(--color-primary)]/90 transition">
                  Show QR Code
                </button>
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center bg-[var(--color-card-profile)] rounded-2xl border border-[var(--color-primary)] p-8 shadow-2xl max-w-xs w-full">
                <DialogTitle className="text-xl font-bold text-[var(--color-primary)] mb-2">
                  Pet QR Code
                </DialogTitle>
                <div className="my-4 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-[var(--color-primary)]">
                    <QRCode
                      value={`${currentPet?.id || ""}|${generatePetCode(
                        currentPet?.id || ""
                      )}`}
                      size={180}
                    />
                  </div>
                  <button
                    className="mt-4 px-4 py-2 cursor-pointer bg-[var(--color-card-button)] border border-[var(--color-text)] rounded-full text-[var(--color-black)] font-semibold hover:bg-[var(--color-primary)]/90 transition"
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
                      link.download = `${currentPet?.pet_name || "pet"}-qr.svg`;
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
          {/* Right: Main Info */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Health Summary */}
            <div className="rounded-[16px] border border-[var(--color-text)] bg-[var(--color-card-health-card)] p-6 md:p-8 w-full max-w-full" style={{marginBottom: 24}}>
              <div className="font-[Cabin,sans-serif] text-[2rem] md:text-[2.2rem] font-bold mb-4 text-[var(--color-text)]">Health Summary</div>
              {/* 3-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 mb-4">
                <div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/70 text-[1.1rem] md:text-[1.2rem] font-normal">Spay/Neuter Status</div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{currentPet?.spay_neuter ? "Neutered" : "Not Neutered"}</div>
                </div>
                <div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/70 text-[1.1rem] md:text-[1.2rem] font-normal">Weight</div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{currentPet?.weight ? `${currentPet.weight}lbs` : "Unknown"}</div>
                </div>
                <div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/70 text-[1.1rem] md:text-[1.2rem] font-normal">Special Notes</div>
                  <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{currentPet?.notes || "-"}</div>
                </div>
              </div>
    

            </div>
            {/* Syd's Code & Your Details */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Syd's Code */}
              <div className="rounded-[16px] border border-[var(--color-text)] bg-[var(--color-card-document)] p-6 md:p-8 w-full max-w-full flex flex-col items-start" style={{marginBottom: 24}}>
                <div className="font-[Cabin,sans-serif] text-[1.5rem] md:text-[2rem] font-bold mb-4 text-[var(--color-text)]">
                  {currentPet?.pet_name || "Pet"}'s Code
                </div>
                <div className="flex flex-row gap-3 mb-4">
                  {generatePetCode(currentPet?.id || "")
                    .split("")
                    .map((char, index) => (
                      <span
                        key={index}
                        className="inline-flex w-12 h-12 md:w-14 md:h-14 bg-[var(--color-text)] text-[var(--color-background)] text-2xl md:text-3xl font-[Cabin,sans-serif] font-bold rounded-[10px] items-center justify-center select-all text-center"
                        style={{ boxShadow: "0 2px 8px 0 rgba(44,44,44,0.10)" }}
                      >
                        {char}
                      </span>
                    ))}
                </div>
                <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/60 text-base md:text-lg text-left">
                  Share with care providers to give access to the profile.
                </div>
              </div>
              {/* Your Details */}
              <div className="rounded-[16px] bg-[var(--color-card-yellow)] rounded-2xl p-6 flex-1 flex flex-col min-w-[260px]l" style={{marginBottom: 24}}>
                <div className="font-[Cabin,sans-serif] text-[2rem] md:text-[2.2rem] font-bold mb-4 text-[var(--color-text)]">Your Details</div>
                <div className="flex flex-col gap-2 text-base">
                  <div>
                    <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/60 text-[1.1rem] md:text-[1.2rem] font-normal">Name</div>
                    <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{humanProfile?.human_owner_name || "Unknown"}</div>
                  </div>
                  <div>
                    <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/60 text-[1.1rem] md:text-[1.2rem] font-normal">Location</div>
                    <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{humanProfile?.location || "Unknown"}</div>
                  </div>
                  <div>
                    <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/60 text-[1.1rem] md:text-[1.2rem] font-normal">Phone number</div>
                    <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{humanProfile?.phone || "Unknown"}</div>
                  </div>
                  <div>
                    <div className="font-[Cabin,sans-serif] text-[var(--color-text)]/60 text-[1.1rem] md:text-[1.2rem] font-normal">Email</div>
                    <div className="font-[Cabin,sans-serif] text-[var(--color-text)] text-[1.2rem] md:text-[1.3rem] font-bold">{humanProfile?.email || "Unknown"}</div>
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
