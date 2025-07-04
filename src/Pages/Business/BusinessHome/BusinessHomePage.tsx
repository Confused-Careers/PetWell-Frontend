import React from "react";
import AddNewPet from "../../../Components/BusinessComponents/AddNewPet";
import RecentlyAddedPets from "../../../Components/BusinessComponents/RecentlyAddedPets";
import PetsUnderCare from "../../../Components/BusinessComponents/PetsUnderCare";
import BusinessNavbar from "../../../Components/BusinessComponents/BusinessNavbar";
import { IoIosArrowDroprightCircle } from "react-icons/io";

const BusinessHomePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[var(--color-card)] text-[var(--color-text)] font-sans">
      <BusinessNavbar />
      <main className="flex flex-col items-center w-full px-2 pt-6 sm:px-4 md:px-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="w-full flex flex-col items-start mt-3 mb-3">
          <p className="text-3xl sm:text-4xl font-lighter flex items-center gap-3 font-serif mb-2">
            Welcome!
          </p>
        </div>
        {/* Add New Pet & Recently Added Pets */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
          <div className="w-full flex flex-col items-start">
            <p className="text-xl sm:text-2xl font-lighter flex items-center gap-3 font-serif mb-3">
              Add New Pet
            </p>
            <AddNewPet />
          </div>
          <div className="w-full flex flex-col items-start">
            <div className="w-full flex items-center justify-between mb-2">
              <p className="text-xl sm:text-2xl font-lighter flex items-center gap-3 font-serif ">
                Recently Added Pets
              </p>
              <a
                href="/business/pet-records"
                className="text-[var(--color-primary)] text-sm sm:text-base font-medium flex items-center gap-2 cursor-pointer"
                style={{ alignSelf: "flex-start" }}
              >
                View All Pets <IoIosArrowDroprightCircle />
              </a>
            </div>
            <RecentlyAddedPets />
          </div>
        </div>
        {/* Pets Under Your Care */}
        <div className="w-full flex flex-col items-start">
          <div className="w-full flex items-center justify-between mb-2">
            <p className="text-xl sm:text-2xl font-lighter flex items-center gap-3 font-serif">
              Pets Under Your Care
            </p>
            <a
              href="/business/pet-records"
              className="text-[var(--color-primary)] text-sm sm:text-base font-medium flex items-center gap-2 cursor-pointer"
            >
              View All Pets <IoIosArrowDroprightCircle />
            </a>
          </div>
          <PetsUnderCare />
        </div>
      </main>
    </div>
  );
};

export default BusinessHomePage;