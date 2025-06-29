import React from 'react';

const AddNewPet: React.FC = () => {
  return (
    <div className="bg-[#23272F] rounded-xl p-6 flex flex-col items-center w-full max-w-xs min-w-[300px]">
      <p className="text-[var(--color-text,#ebd5bd)] text-base font-cabin text-center mb-4">Enter the 5-character code shared by the pet parent to view their profile.</p>
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            className="w-12 h-12 rounded-md bg-[#F6E7C0] text-[#23272F] text-2xl font-cabin text-center focus:outline-none border-none"
          />
        ))}
      </div>
    </div>
  );
};

export default AddNewPet; 