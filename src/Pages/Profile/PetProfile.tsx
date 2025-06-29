import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import SwitchProfileModal from "../../Components/Profile/SwitchProfileModal";
import petServices from "../../Services/petServices";
import humanOwnerServices from "../../Services/humanOwnerServices";
import { storeLastPetId } from "../../utils/petNavigation";
import { generatePetCode } from "../../utils/petCodeGenerator";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../../Components/ui/dialog";
import QRCode from "react-qr-code";

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
          breed: "Mixed Breed", // You might want to fetch breed info separately
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
    <div className="min-h-screen w-full bg-[#181e29] text-[#EBD5BD] px-0 sm:px-8 pb-10">
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
              className="text-[#FFB23E] text-base font-medium flex items-center gap-2 hover:underline mb-2 sm:mb-0"
              onClick={() => navigate(`/petowner/pet/${petId}/home`)}
            >
              <span className="text-xl">&lt;</span> Go Back
            </button>
            <h1 className="text-3xl font-serif font-bold">Pet Profile</h1>
          </div>
          <div className="flex flex-row gap-4">
            <button
              className="border border-[#FFB23E] text-[#FFB23E] px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#FFB23E] hover:text-black transition text-base"
              onClick={handleEditProfile}
            >
              ✏️ Edit Profile
            </button>
            <button
              className="border border-[#FFB23E] text-[#FFB23E] px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#FFB23E] hover:text-black transition text-base"
              onClick={handleSwitchProfile}
            >
              Switch to Another Pet
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Pet Card */}
          <div className="bg-[#23272f] rounded-2xl p-6 flex flex-col items-center w-full max-w-xs min-w-[260px]">
            <div className="w-48 h-48 rounded-xl overflow-hidden mb-4 bg-[#23272f] flex items-center justify-center">
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
              <div className="text-2xl font-bold mb-2">
                {currentPet?.pet_name || "Pet"}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm mb-2">
                <div>
                  <span className="text-[#EBD5BD] opacity-70">Age</span>
                  <div className="font-bold">
                    {currentPet?.age || "Unknown"} years old
                  </div>
                </div>
                <div>
                  <span className="text-[#EBD5BD] opacity-70">Gender</span>
                  <div className="font-bold">
                    {currentPet?.gender || "Unknown"}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm mb-2">
                <div>
                  <span className="text-[#EBD5BD] opacity-70">Breed</span>
                  <div className="font-bold">
                    {currentPet?.breed_name || "Mixed Breed"}
                  </div>
                </div>
                <div>
                  <span className="text-[#EBD5BD] opacity-70">Colour</span>
                  <div className="font-bold">
                    {currentPet?.color || "Unknown"}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm mb-2">
                <div>
                  <span className="text-[#EBD5BD] opacity-70">
                    Microchip Number
                  </span>
                  <div className="font-bold">
                    {currentPet?.microchip || "Unknown"}
                  </div>
                </div>
                <div>
                  <span className="text-[#EBD5BD] opacity-70">Birthdate</span>
                  <div className="font-bold">
                    {currentPet?.dob || "Unknown"}
                  </div>
                </div>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="mt-4 px-4 py-2 bg-[#FFB23E] text-black rounded-lg font-semibold hover:bg-[#e6a832] transition">
                  Show QR Code
                </button>
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center bg-[#23272f] rounded-2xl border border-[#FFB23E] p-8 shadow-2xl max-w-xs w-full">
                <DialogTitle className="text-xl font-bold text-[#FFB23E] mb-2">Pet QR Code</DialogTitle>
                <div className="my-4 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-[#EBD5BD]">
                    <QRCode value={`${currentPet?.id || ""}|${generatePetCode(currentPet?.id || "")}`} size={180} />
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-[#FFB23E] text-black rounded-lg font-semibold hover:bg-[#e6a832] transition"
                    onClick={() => {
                      const svg = document.querySelector("[data-slot='dialog-content'] svg");
                      if (!svg) return;
                      const serializer = new XMLSerializer();
                      const source = serializer.serializeToString(svg);
                      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${currentPet?.pet_name || 'pet'}-qr.svg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download QR
                  </button>
                </div>
                <div className="text-center text-sm text-[var(--color-text)] mt-2">Scan this QR code to add this pet to a business</div>
              </DialogContent>
            </Dialog>
          </div>
          {/* Right: Main Info */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Buttons Row - move above the main card */}

            {/* Health Summary */}
            <div className="bg-[#23272f] rounded-2xl p-6 flex flex-col gap-2">
              <div className="text-xl font-bold mb-2">Health Summary</div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-base mb-2">
                <div>
                  <span className="opacity-70">Spay/Neuter Status</span>
                  <span className="font-bold ml-2">
                    {currentPet?.spay_neuter
                      ? "Spayed/Neutered"
                      : "Not Spayed/Neutered"}
                  </span>
                </div>
                <div>
                  <span className="opacity-70">Weight</span>
                  <span className="font-bold ml-2">
                    {currentPet?.weight
                      ? `${currentPet.weight} lbs`
                      : "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="opacity-70">Special Notes</span>
                  <span className="font-bold ml-2">
                    {currentPet?.notes || "No special notes"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-base mb-2">
                <div>
                  <span className="opacity-70">Location</span>
                  <span className="font-bold ml-2">
                    {currentPet?.location || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            {/* Syd's Code & Your Details */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Syd's Code */}
              <div className="bg-[#23272f] rounded-2xl p-6 flex-1 flex flex-col items-center min-w-[260px]">
                <div className="text-xl font-bold mb-3 w-full">
                  {currentPet?.pet_name || "Pet"}'s Code
                </div>
                <div className="flex gap-2 mb-2 justify-center items-center">
                  {generatePetCode(currentPet?.id || "").split('').map((char, index) => (
                    <span
                      key={index}
                      className="inline-flex w-10 h-10 bg-[#fff] bg-opacity-80 text-[#23272f] text-xl font-extrabold rounded-lg items-center justify-center border-2 border-[#EBD5BD] shadow-sm tracking-widest select-all text-center"
                      style={{ boxShadow: "0 2px 8px 0 rgba(44, 44, 44, 0.10)" }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-[#EBD5BD] text-opacity-70 text-center">
                  Share with care providers to give access to the profile.
                </div>
              </div>
              {/* Your Details */}
              <div className="bg-[#23272f] rounded-2xl p-6 flex-1 flex flex-col min-w-[260px]">
                <div className="text-xl font-bold mb-3 w-full">
                  Your Details
                </div>
                <div className="flex flex-col gap-2 text-base">
                  <div>
                    <span className="opacity-70">Name</span>
                    <span className="font-bold ml-2">
                      {humanProfile?.human_owner_name || "Unknown"}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-70">Location</span>
                    <span className="font-bold ml-2">
                      {humanProfile?.location || "Unknown"}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-70">Phone number</span>
                    <span className="font-bold ml-2">
                      {humanProfile?.phone || "Unknown"}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-70">Email</span>
                    <span className="font-bold ml-2">
                      {humanProfile?.email || "Unknown"}
                    </span>
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
