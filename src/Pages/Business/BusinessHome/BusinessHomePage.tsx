import React from "react";
import AddNewPet from "../../../Components/BusinessComponents/AddNewPet";
import RecentlyAddedPets from "../../../Components/BusinessComponents/RecentlyAddedPets";
import PetsUnderCare from "../../../Components/BusinessComponents/PetsUnderCare";
import BusinessNavbar from "../../../Components/BusinessComponents/BusinessNavbar";

const BusinessHomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <BusinessNavbar />
      <main className="flex flex-col items-center w-full px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="w-full flex flex-col items-start mb-3">
          <h1 className="text-[32px] sm:text-[38px] font-serif font-[400] text-[#1C232E] px-4 py-1 rounded-t-md w-fit">
            Welcome!
          </h1>
        </div>
        {/* Add New Pet & Recently Added Pets */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 mb-8 px-4">
          <div className="w-full flex flex-col items-start">
            <span className="text-[32px] font-cabin font-[400] text-[#1C232E] mb-3 ml-1">
              Add New Pet
            </span>
            <AddNewPet />
          </div>
          <div className="w-full flex flex-col items-start">
            <span className="text-[32px] font-cabin font-[400] text-[#1C232E] mb-3 ml-1">
              Recently Added Pets
            </span>
            <RecentlyAddedPets />
          </div>
        </div>
        {/* Pets Under Your Care */}
        <div className="w-full flex flex-col items-start px-4">
          <span className="text-[32px] font-cabin font-[400] text-[#1C232E] mb-3 ml-1">
            Pets Under Your Care
          </span>
          <PetsUnderCare />
        </div>
      </main>
    </div>
  );
};

export default BusinessHomePage;