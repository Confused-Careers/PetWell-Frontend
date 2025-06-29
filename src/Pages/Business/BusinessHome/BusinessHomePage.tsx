import React from 'react';
import AddNewPet from '../../../Components/BusinessComponents/AddNewPet';
import RecentlyAddedPets from '../../../Components/BusinessComponents/RecentlyAddedPets';
import PetsUnderCare from '../../../Components/BusinessComponents/PetsUnderCare';
import BusinessNavbar from '../../../Components/BusinessComponents/BusinessNavbar';

const BusinessHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background,#181F29)] px-8 py-6">
      <BusinessNavbar />
      <h1 className="text-3xl font-alike text-[var(--color-text,#ebd5bd)] font-normal mb-6 mt-4">Welcome!</h1>
      <div className="flex flex-col gap-8">
        <div className="flex flex-row gap-6">
          <div className="w-1/3">
            <AddNewPet />
          </div>
          <div className="flex-1">
            <RecentlyAddedPets />
          </div>
        </div>
        <div>
          <PetsUnderCare />
        </div>
      </div>
    </div>
  );
};

export default BusinessHomePage; 