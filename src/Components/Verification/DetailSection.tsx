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
    <div className="max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
        <div className="flex flex-col w-full h-full">
          <div className="text-2xl font-lighter flex items-center gap-3 font-serif mb-2">
            Your Pet's Details
          </div>
          <div className="bg-[var(--color-card-profile)] rounded-2xl shadow-md p-2 sm:p-4 md:p-6 flex flex-col relative min-w-[200px] w-full h-full">
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
              <span className="text-md sm:text-xl md:text-2xl font-semibold text-[var(--color-text)] break-words max-w-full">
                {petName}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-2 sm:gap-x-4 text-base">
              <div>
                <div className="text-[var(--color-text-faded-verify)] font-semibold opacity-70 text-xl sm:text-sm mb-1">
                  Age
                </div>
                <div className="text-[var(--color-text)] font-semibold text-lg">
                  {petAge}
                </div>
              </div>
              <div>
                <div className="text-[var(--color-text-faded-verify)] font-semibold opacity-70 text-xl sm:text-sm mb-1">
                  Weight
                </div>
                <div className="text-[var(--color-text)] font-semibold">
                  {petWeight}
                </div>
              </div>
              <div>
                <div className="text-[var(--color-text-faded-verify)] font-semibold opacity-70 text-xs sm:text-sm mb-1">
                  Breed
                </div>
                <div className="text-[var(--color-text)] font-semibold">
                  {breed}
                </div>
              </div>
              <div>
                <div className="text-[var(--color-text-faded-verify)] font-semibold opacity-70 text-xs sm:text-sm mb-1">
                  Colour
                </div>
                <div className="text-[var(--color-text)] font-semibold">
                  {petColor}
                </div>
              </div>
              <div>
                <div className="text-[var(--color-text-faded-verify)] font-semibold opacity-70 text-xs sm:text-sm mb-1">
                  Microchip Number
                </div>
                <div className="text-[var(--color-text)] font-semibold">
                  {petMicrochip}
                </div>
              </div>
              <div>
                <div className="text-[var(--color-text-faded-verify)] font-semibold opacity-70 text-xs sm:text-sm mb-1">
                  Birthdate
                </div>
                <div className="text-[var(--color-text)] font-semibold ">
                  {petBirthdate}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="text-2xl font-lighter flex items-center gap-3 font-serif mb-2">
            Your Details
          </div>
          <div className="bg-[var(--color-card-vaccine-green)] rounded-2xl shadow-md p-2 sm:p-4 md:p-6 flex flex-col relative min-w-[200px] w-full h-full">
            <button
              className="absolute top-2 sm:top-3 right-2 sm:right-3 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full p-1 sm:p-2"
              onClick={onEditUser}
              aria-label="Edit user details"
            >
              <Pencil size={14} sm:size-16 md:size-20 />
            </button>
            <div className="flex flex-col gap-2 sm:gap-3 text-lg font-bold">
              <div>
                <div className="text-[var(--color-text-faded-verify)] opacity-70 text-lg mb-1 font-bold">
                  Name
                </div>
                <div className="text-[var(--color-text)] mb-2 text-lg font-bold">
                  {userName}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-4">
                <div>
                  <div className="text-[var(--color-text-faded-verify)] opacity-70 text-lg mb-1 font-bold">
                    Phone number
                  </div>
                  <div className="text-[var(--color-text)] mb-2 text-lg font-bold">
                    {userPhone}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--color-text-faded-verify)] opacity-70 text-lg mb-1 font-bold">
                    Location
                  </div>
                  <div className="text-[var(--color-text)] mb-2 text-lg font-bold">
                    {userLocation}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[var(--color-text-faded-verify)] opacity-70 text-lg mb-1 font-bold">
                  Email
                </div>
                <div className="text-[var(--color-text)] text-lg font-bold">
                  {userEmail}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block" />
      </div>
    </div>
  );
};

export default DetailSection;
