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
    pet.breed ||
    pet.breed_obj?.breed_name ||
    (typeof pet.breed === "object" ? pet.breed?.breed_name : undefined);
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
    <div className="flex flex-col md:flex-row gap-8 justify-start mt-8 w-full max-w-6xl mx-auto">
      {/* Pet's Details Column */}
      <div className="flex flex-col flex-1 min-w-[280px] max-w-md">
        <span className="text-2xl font-serif font-semibold text-[var(--color-modal-foreground)] mb-2 block">
          Your Pet's Details
        </span>
        <div className="bg-[var(--color-card)] rounded-2xl shadow-lg p-6 sm:p-8 flex-1 relative">
          <button
            className="absolute top-6 right-6 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full p-2"
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
            <span className="text-xl font-bold text-[var(--color-text)]">
              {petName}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-y-6 gap-x- text-base">
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Age
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]">
                {petAge}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Weight
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]">
                {petWeight}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Breed
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]">
                {breed}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Species
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]">
                {species}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Colour
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]">
                {petColor}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Microchip Number
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]">
                {petMicrochip}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Birthdate
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]">
                {petBirthdate}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* User Details Column */}
      <div className="flex flex-col flex-1 min-w-[280px] max-w-md">
        <span className="text-2xl font-serif font-semibold text-[var(--color-modal-foreground)] mb-2 block">
          Your Details
        </span>
        <div className="bg-[var(--color-card)] rounded-2xl shadow-lg p-8 flex-1 relative">
          <button
            className="absolute top-6 right-6 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full p-2"
            onClick={onEditUser}
          >
            <Pencil size={20} />
          </button>
          <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-base">
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Name
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]">
                {userName}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                {/* Empty for layout */}
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]"></div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Location
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]">
                {userLocation}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Phone number
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]">
                {userPhone}
              </div>
            </div>
            <div>
              <div className="text-[var(--color-modal-foreground)] text-sm mb-1">
                Email
              </div>
              <div className="font-bold text-lg text-[var(--color-text)]">
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
