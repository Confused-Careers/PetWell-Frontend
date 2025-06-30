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
  // Safely get breed and species
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
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-start mt-6 sm:mt-8 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-0">
      {/* Pet's Details Column */}
      <div className="flex flex-col flex-1 min-w-0 max-w-full md:max-w-md">
        <span className="text-2xl font-serif font-semibold text-[var(--color-modal-foreground)] mb-2 block">
          Your Pet's Details
        </span>
        <div className="bg-[var(--color-card)] rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex-1 relative w-full">
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full p-2"
            onClick={onEditPet}
          >
            <Pencil size={20} />
          </button>
          <div className="flex items-center gap-4 mb-6">
            <img
              src={petImage}
              alt={petName}
              className="w-14 h-14 rounded-full object-cover border-2 border-[var(--color-primary)]"
            />
            <span className="text-xl font-bold text-[var(--color-text)] break-words max-w-full">
              {petName}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-base w-full">
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Age
              </div>
              <div className="font-bold text-lg text-[var(--color-text)] break-words max-w-full">
                {petAge}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Weight
              </div>
              <div className="font-bold text-lg text-[var(--color-text)] break-words max-w-full">
                {petWeight}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Breed
              </div>
              <div className="font-bold text-lg text-[var(--color-text)] break-words max-w-full">
                {breed}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Species
              </div>
              <div className="font-bold text-lg text-[var(--color-text)] break-words max-w-full">
                {species}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Colour
              </div>
              <div className="font-bold text-lg text-[var(--color-text)] break-words max-w-full">
                {petColor}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Microchip Number
              </div>
              <div className="font-bold text-lg text-[var(--color-text)] break-words max-w-full">
                {petMicrochip}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Birthdate
              </div>
              <div className="font-bold text-lg text-[var(--color-text)] break-words max-w-full">
                {petBirthdate}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* User Details Column */}
      <div className="flex flex-col flex-1 min-w-0 max-w-full md:max-w-md mt-8 md:mt-0">
        <span className="text-2xl font-serif font-semibold text-[var(--color-modal-foreground)] mb-2 block">
          Your Details
        </span>
        <div className="bg-[var(--color-card)] rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex-1 relative w-full">
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full p-2"
            onClick={onEditUser}
            aria-label="Edit user details"
          >
            <Pencil size={20} />
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-base w-full">
            <div className="col-span-4">
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Name
              </div>
              <div className="font-bold text-lg text-[var(--color-text)] break-words max-w-full">
                {userName}
              </div>
            </div>
            <div className="col-span-2">
                <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                  Phone number
                </div>
                <div className="font-bold text-lg text-[var(--color-text)] break-words max-w-full">
                  {userPhone}
                </div>
            </div>
            <div className="col-span-2">
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Location
              </div>
              <div className="font-bold text-lg text-[var(--color-text)] break-words max-w-full">
                {userLocation}
              </div>
            </div>
            <div className="col-span-4">
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Email
              </div>
              <div className="font-bold text-lg text-[var(--color-text)] break-words max-w-full">
                {userEmail}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSection;
