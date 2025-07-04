import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import petServices from "../../Services/petServices";
import { storeLastPetId } from "../../utils/petNavigation";

interface PetProfileType {
  id: string;
  name: string;
  age: string;
  breed: string;
  avatar: string;
}

interface SwitchProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: (petId: string) => void;
  onAddNew: () => void;
  pets: PetProfileType[];
  loading?: boolean;
  destination?: string;
}

const SwitchProfileModal: React.FC<SwitchProfileModalProps> = ({
  isOpen,
  onClose,
  onSwitch,
  onAddNew,
  pets,
  loading = false,
  destination = "profile",
}) => {
  const { petId } = useParams();
  const [, setPet] = useState<PetProfileType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!petId) return;
    petServices
      .getPetById(petId)
      .then((res) => {
        if (res.data && !Array.isArray(res.data)) {
          const petData = res.data;
          console.log("Pet data:", petData);
          // Map the pet data to match PetProfileType interface
          const mappedPet: PetProfileType = {
            id: petData.id,
            name: petData.pet_name,
            age: `${petData.age} years`,
            breed: "Mixed Breed", // Default value since breed info might not be available
            avatar:
              (typeof petData.profile_picture === "string"
                ? petData.profile_picture
                : null) ||
              "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80",
          };
          setPet(mappedPet);
        } else {
          setPet(null);
        }
      })
      .catch(() => setPet(null));
  }, [petId]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    navigate(`/petowner/pet/${petId}/${destination}`);
  };

  const handleSwitch = (selectedPetId: string) => {
    // Store the selected pet ID as the last used pet ID
    storeLastPetId(selectedPetId);
    onSwitch(selectedPetId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-text)]/40">
      <div className="relative bg-[var(--color-background)] rounded-2xl shadow-2xl w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <button
          className="absolute cursor-pointer top-6 right-6 text-[var(--color-text)] hover:text-[var(--color-card-button)] text-2xl font-light focus:outline-none"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-light mb-4 text-[var(--color-text)]">
            Switch profile?
          </h2>
          <p className="text-base text-[var(--color-text)]/80">
            Choose a pet to view or manage their profile.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-[var(--color-card-yellow)]">Loading pets...</div>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-[var(--color-text)] mb-4">No pets found</div>
            <div className="text-sm text-[var(--color-card-yellow)]/70 mb-6">
              Add your first pet to get started
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {pets.map((pet) => (
              <button
                key={pet.id}
                className="bg-[var(--color-card-profile)] rounded-2xl p-6 cursor-pointer hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col items-center"
                onClick={() => handleSwitch(pet.id)}
              >
                <div className="w-20 h-20 mb-4">
                  <img
                    src={pet.avatar}
                    alt={pet.name}
                    className="w-full h-full rounded-2xl object-cover border-2 border-[var(--color-border)]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80";
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {pet.name}
                </h3>
                <p className="text-sm text-white/80 text-center">
                  {pet.age} | {pet.breed}
                </p>
              </button>
            ))}
            
            {/* Add New Pet Profile Card */}
            <button
              className="bg-[var(--color-background)] border-2 border-dashed border-[var(--color-border)]/30 rounded-2xl p-6 cursor-pointer hover:opacity-80 transition-all duration-200 flex flex-col items-center justify-center min-h-[160px]"
              onClick={onAddNew}
            >
              <div className="w-12 h-12 bg-[var(--color-card-button)] rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-[var(--color-text)]"
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
              <p className="text-base font-semibold text-[var(--color-text)] text-center">
                Add New Pet Profile
              </p>
            </button>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            className="px-8 py-3 cursor-pointer border border-[var(--color-card-button)] text-[var(--color-text)] bg-transparent hover:opacity-90 rounded-full font-semibold transition text-base"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwitchProfileModal;