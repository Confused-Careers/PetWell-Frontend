import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Layout/Navbar";
import SwitchProfileModal from "../../Components/Profile/SwitchProfileModal";
// import type { PetProfileType } from "../../Components/Profile/SwitchProfileModal";
import { useNavigate, useLocation } from "react-router-dom";
import petServices from "../../Services/petServices";
import { getLastOrFirstPetId } from "../../utils/petNavigation";

const SwitchProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(true);
  const [pets, setPets] = useState<PetProfileType[]>([]);
  const [loading, setLoading] = useState(true);

  interface PetProfileType {
    id: string;
    name: string;
    age: string;
    breed: string;
    avatar: string;
  }
  // Get the intended destination from the location state or default to home
  const getIntendedDestination = () => {
    const pathname = location.pathname;
    if (pathname === "/petowner/pet/:petId/vaccine") return "vaccine";
    if (pathname === "/petowner/pet/:petId/documents") return "documents";
    if (pathname === "/petowner/pet/:petId/team") return "team";
    if (pathname === "/petowner/pet/:petId/add-vaccine") return "add-vaccine";
    if (pathname === "/petowner/pet/:petId/upload") return "upload";
    if (pathname === "/petowner/pet/:petId/add-team") return "add-team";
    if (pathname === "/petowner/pet/:petId/pet-profile") return "profile";
    if (pathname === "/petowner/pet/:petId/download-select")
      return "download-select";
    return "home"; // default
  };

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

  const handleSwitch = (petId: string) => {
    setShowModal(false);
    const destination = getIntendedDestination();
    // Navigate to the selected pet's specific page or home page
    navigate(`/petowner/pet/${petId}/${destination}`);
  };

  const handleAddNew = () => {
    setShowModal(false);
    navigate("/add-pet-profile");
  };

  const handleClose = async () => {
    setShowModal(false);
    // Redirect to the last used pet's home page
    const petId = await getLastOrFirstPetId();
    navigate(`/petowner/pet/${petId}/home`);
  };

  return (
    <div className="min-h-screen w-full bg-[#181e29] text-[#EBD5BD]">
      <Navbar />
      <SwitchProfileModal
        isOpen={showModal}
        onClose={handleClose}
        onSwitch={handleSwitch}
        onAddNew={handleAddNew}
        pets={pets}
        loading={loading}
        destination={getIntendedDestination()}
      />
    </div>
  );
};

export default SwitchProfilePage;
