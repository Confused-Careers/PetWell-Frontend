import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Layout/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import petServices from "../../Services/petServices";
import { getLastOrFirstPetId, storeLastPetId } from "../../utils/petNavigation";

interface PetProfileType {
  id: string;
  name: string;
  age: string;
  breed: string;
  avatar: string;
}

const SwitchProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pets, setPets] = useState<PetProfileType[]>([]);
  const [loading, setLoading] = useState(true);

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
              : "https://place.dog/300/200",
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
    storeLastPetId(petId);
    const destination = getIntendedDestination();
    navigate(`/petowner/pet/${petId}/${destination}`);
  };

  const handleAddNew = () => {
    navigate("/upload-option");
  };

  const handleGoBack = async () => {
    const petId = await getLastOrFirstPetId();
    navigate(`/petowner/pet/${petId}/home`);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)]">
      <Navbar />
      
      {/* Go Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-[var(--color-text)] hover:opacity-70 transition mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-base font-medium">Go Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-light mb-4 text-[var(--color-text)]">
            Switch profile?
          </h1>
          <p className="text-lg text-[var(--color-text)] opacity-80">
            Choose a pet to view or manage their profile.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[var(--color-card-yellow)] text-lg">Loading pets...</div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => handleSwitch(pet.id)}
                className="bg-[var(--color-card-profile)] rounded-2xl p-6 cursor-pointer hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl w-full max-w-[280px] flex flex-col items-center"
              >
                <div className="w-24 h-24 mb-4 relative">
                  <img
                    src={pet.avatar}
                    alt={pet.name}
                    className="w-full h-full rounded-2xl object-cover border-3 border-[var(--color-border)]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80";
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {pet.name}
                </h3>
                <p className="text-sm text-white/80 text-center">
                  {pet.age} | {pet.breed}
                </p>
              </div>
            ))}

            {/* Add New Pet Profile Card */}
            <div
              onClick={handleAddNew}
              className="bg-[var(--color-background)] border-2 border-dashed border-[var(--color-border)]/30 rounded-2xl p-6 cursor-pointer hover:opacity-80 transition-all duration-200 w-full max-w-[280px] flex flex-col items-center justify-center min-h-[200px]"
            >
              <div className="w-16 h-16 bg-[var(--color-card-button)] rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-[var(--color-text)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-[var(--color-text)] text-center">
                Add New Pet Profile
              </p>
            </div>
          </div>
        )}

        {!loading && pets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[var(--color-text)] mb-4 text-lg">No pets found</div>
            <div className="text-sm text-[var(--color-card-yellow)]/70 mb-6">
              Add your first pet to get started
            </div>
            <button
              onClick={handleAddNew}
              className="bg-[var(--color-card-button)] text-[var(--color-text)] px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Add Your First Pet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwitchProfilePage;