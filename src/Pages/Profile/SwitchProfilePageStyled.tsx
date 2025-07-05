import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Layout/Navbar";
import { useNavigate } from "react-router-dom";
import petServices from "../../Services/petServices";
import { storeLastPetId } from "../../utils/petNavigation";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import PetAvatar from "../../Assets/PetAvatar.svg";

interface PetProfileType {
  id: string;
  name: string;
  age: string;
  breed: string;
  avatar: string;
}

const SwitchProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<PetProfileType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsRes = await petServices.getPetsByOwner();
        let petsArr = Array.isArray(petsRes) ? petsRes : petsRes.data;
        if (!petsArr) petsArr = [];
        if (!Array.isArray(petsArr)) petsArr = [petsArr];
        const formattedPets: PetProfileType[] = petsArr.map((pet) => ({
          id: pet.id,
          name: pet.pet_name,
          age: pet.age ? `${pet.age} years` : "Unknown age",
          breed: pet.breed?.breed_name || pet.breed || "Unknown breed",
          avatar:
            (pet.profile_picture &&
              typeof pet.profile_picture === "string" &&
              pet.profile_picture) ||
            pet.profilePictureDocument?.document_url ||
            pet.profile_picture?.profilePictureDocument?.document_url ||
            PetAvatar,
        }));
        setPets(formattedPets);
      } catch (error) {
        setPets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const handleSwitch = (petId: string) => {
    storeLastPetId(petId);
    navigate(`/petowner/pet/${petId}/home`);
  };

  const handleAddNew = () => {
    navigate("/upload-option");
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)]">
      <Navbar />

      {/* Go Back Button */}
      <div className="container mx-auto px-4 pt-3">
        <button
          className="text-[var(--color-primary)] cursor-pointer font-bold text-base flex items-center gap-1 mb-2 sm:mb-0"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowDropleftCircle /> Go Back
        </button>{" "}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-4">
        <div className="text-center mb-6">
          <p className="text-3xl font-serif font-light mb-2 text-[var(--color-text)]">
            Switch profile?
          </p>
          <p className="text-lg text-[var(--color-text)] opacity-80">
            Choose a pet to view or manage their profile.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[var(--color-card-yellow)] text-lg">
              Loading pets...
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap max-sm:justify-center gap-8 max-w-7xl mx-auto">
            {pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => handleSwitch(pet.id)}
                className="bg-[var(--color-card-profile)] rounded-2xl p-0 cursor-pointer hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl w-full max-w-[320px] flex flex-col items-center overflow-hidden border border-[var(--color-border)] min-h-[370px]"
              >
                {/* Pet Image with border radius and blue border */}
                <div className="w-[80%] mt-4 aspect-square rounded-[18px] flex items-center justify-center overflow-hidden bg-[var(--color-card)]">
                  <img
                    src={pet.avatar}
                    alt={pet.name}
                    className="w-full h-full object-cover rounded-[14px]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PetAvatar;
                    }}
                  />
                </div>
                {/* Pet Info */}
                <div className="w-full px-6 py-3 flex flex-col items-start">
                  <h3 className="text-2xl font-semibold text-[var(--color-background)] mb-1 mt-1">
                    {pet.name}
                  </h3>
                  <p className="text-sm text-[var(--color-background)]/80 flex gap-2">
                    {pet.age} <span className="mx-1">|</span> {pet.breed}
                  </p>
                </div>
              </div>
            ))}

            {/* Add New Pet Profile Card */}
            <div
              onClick={handleAddNew}
              className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl cursor-pointer hover:opacity-80 transition-all duration-200 w-full max-w-[320px] min-h-[400px] flex flex-col items-center justify-center shadow-lg"
            >
              <div className="w-12 h-12 bg-[var(--color-card-button)] rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-[var(--color-background)]"
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
              <p className="text-lg font-semibold text-[var(--color-text)] text-center px-4">
                Add New Pet Profile
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && pets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[var(--color-text)] mb-4 text-lg">
              No pets found
            </div>
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
