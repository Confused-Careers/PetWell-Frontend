import React from "react";
import { Pencil } from "lucide-react";

interface PetDetails {
  name?: string;
  pet_name?: string;
  age?: string | number;
  weight?: string | number;
  breed?: string;
  breed_name?: string;
  breed_species?: { species_name?: string };
  breed_species_name?: string;
  breed_obj?: { breed_name?: string };
  breed_obj_name?: string;
  color?: string;
  microchip?: string;
  birthdate?: string;
  dob?: string;
  image?: string;
  profile_picture_url?: string;
}

interface UserDetails {
  name?: string;
  human_owner_name?: string;
  phone?: string;
  location?: string;
  email?: string;
}

interface DetailSectionProps {
  pet: PetDetails;
  user: UserDetails;
  onEditPet?: () => void;
  onEditUser?: () => void;
}

const DetailSection: React.FC<DetailSectionProps> = ({
  pet,
  user,
  onEditPet,
  onEditUser,
}) => {
  const breed =
    pet.breed_name ||
    (typeof pet.breed === "string"
      ? pet.breed
      : pet.breed && typeof pet.breed === "object"
      ? (pet.breed as { breed_name?: string }).breed_name
      : undefined) ||
    pet.breed_obj?.breed_name;
  const species = pet.breed_species?.species_name || pet.breed_species_name;
  const petName = pet.pet_name || pet.name;
  const petImage = pet.profile_picture_url || pet.image;
  const petAge = pet.age || "";
  const petWeight = pet.weight || "";
  const petColor = pet.color || "";
  const petMicrochip = pet.microchip || "";
  const petBirthdate = pet.dob || pet.birthdate || "";

  const userName = user.human_owner_name || user.name || "";
  const userLocation = user.location || "";
  const userPhone = user.phone || "";
  const userEmail = user.email || "";

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Pet's Details Card */}
      <div className="bg-[var(--color-card-profile)] rounded-2xl shadow-md p-2 sm:p-4 md:p-6 flex flex-col relative min-w-[200px]">
        <button
          className="absolute top-2 sm:top-3 right-2 sm:right-3 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full p-1 sm:p-2"
          onClick={onEditPet}
          aria-label="Edit pet details"
        >
          <Pencil size={14} sm:size-16 md:size-20 />
        </button>
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
          <img
            src={petImage}
            alt={petName}
            className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 rounded-full object-cover border-2 border-[var(--color-primary)]"
          />
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-text)] break-words max-w-full">
            {petName}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-2 sm:gap-x-4 text-sm sm:text-base md:text-lg">
          <div>
            <div className="text-[var(--color-modal-foreground)] text-xs sm:text-sm mb-1">
              Age
            </div>
            <div className="font-bold text-base sm:text-lg md:text-xl text-[var(--color-text)]">
              {petAge}
            </div>
          </div>
          <div>
            <div className="text-[var(--color-modal-foreground)] text-xs sm:text-sm mb-1">
              Weight
            </div>
            <div className="font-bold text-base sm:text-lg md:text-xl text-[var(--color-text)]">
              {petWeight}
            </div>
          </div>
          <div>
            <div className="text-[var(--color-modal-foreground)] text-xs sm:text-sm mb-1">
              Breed
            </div>
            <div className="font-bold text-base sm:text-lg md:text-xl text-[var(--color-text)]">
              {breed}
            </div>
          </div>
          <div>
            <div className="text-[var(--color-modal-foreground)] text-xs sm:text-sm mb-1">
              Colour
            </div>
            <div className="font-bold text-base sm:text-lg md:text-xl text-[var(--color-text)]">
              {petColor}
            </div>
          </div>
          <div>
            <div className="text-[var(--color-modal-foreground)] text-xs sm:text-sm mb-1">
              Microchip Number
            </div>
            <div className="font-bold text-base sm:text-lg md:text-xl text-[var(--color-text)]">
              {petMicrochip}
            </div>
          </div>
          <div>
            <div className="text-[var(--color-modal-foreground)] text-xs sm:text-sm mb-1">
              Birthdate
            </div>
            <div className="font-bold text-base sm:text-lg md:text-xl text-[var(--color-text)]">
              {petBirthdate}
            </div>
          </div>
        </div>
      </div>
      {/* User Details Card */}
      <div className="bg-[var(--color-card-vaccine-green)] rounded-2xl shadow-md p-2 sm:p-4 md:p-6 flex flex-col relative min-w-[200px]">
        <button
          className="absolute top-2 sm:top-3 right-2 sm:right-3 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full p-1 sm:p-2"
          onClick={onEditUser}
          aria-label="Edit user details"
        >
          <Pencil size={14} sm:size-16 md:size-20 />
        </button>
        <div className="flex flex-col gap-2 sm:gap-3">
          <div>
            <div className="text-[var(--color-modal-foreground)] text-xs sm:text-sm mb-1">
              Name
            </div>
            <div className="font-bold text-xl sm:text-2xl md:text-3xl text-[var(--color-text)] mb-2">
              {userName}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-4">
            <div>
              <div className="text-[var(--color-modal-foreground)] text-xs sm:text-sm mb-1">
                Phone number
              </div>
              <div className="font-bold text-base sm:text-lg md:text-xl text-[var(--color-text)] mb-2">
                {userPhone}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-xs sm:text-sm mb-1">
                Location
              </div>
              <div className="font-bold text-base sm:text-lg md:text-xl text-[var(--color-text)] mb-2">
                {userLocation}
              </div>
            </div>
          </div>
          <div>
            <div className="text-[var(--color-modal-foreground)] text-xs sm:text-sm mb-1">
              Email
            </div>
            <div className="font-bold text-base sm:text-lg md:text-xl text-[var(--color-text)]">
              {userEmail}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSection;
