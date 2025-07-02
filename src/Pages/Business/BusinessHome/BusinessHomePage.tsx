import React from "react";
import AddNewPet from "../../../Components/BusinessComponents/AddNewPet";
import RecentlyAddedPets from "../../../Components/BusinessComponents/RecentlyAddedPets";
import PetsUnderCare from "../../../Components/BusinessComponents/PetsUnderCare";
import BusinessNavbar from "../../../Components/BusinessComponents/BusinessNavbar";

const BusinessHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-business-section-bg)] flex flex-col">
      <BusinessNavbar />
      <main className="flex flex-col items-center w-full px-2 sm:px-4 md:px-8 py-4 md:py-8 max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-business-heading)] text-center mb-8 mt-4">
          Welcome!
        </h1>
        <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/3 w-full">
              <AddNewPet />
          </div>
          <div className="md:flex-1 w-full">            
              <RecentlyAddedPets />
          </div>
        </div>
        <div className="w-full">
            <PetsUnderCare />
        </div>
      </main>
    </div>
  );
};

export default BusinessHomePage;
