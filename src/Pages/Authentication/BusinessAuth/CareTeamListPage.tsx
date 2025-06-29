import React from 'react';
import Logo from '../../../Assets/PetWell.png';
import CareTeamMemberCard from './CareTeamMemberCard';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CareTeamListPage: React.FC = () => {
  const navigate = useNavigate();
  // Example member data
  const member = {
    name: 'Dr. Hemant Patel',
    role: 'Vet',
    access: 'Full Access',
  };

  return (
    <div className="min-h-screen bg-[#1C232E] flex flex-col items-center justify-center px-4 py-8">
      <div className="absolute left-8 top-8">
        <img src={Logo} alt="PetWell Logo" className="h-12 w-12" />
      </div>
      <div className="w-full max-w-xl flex flex-col items-center">
        <h1 className="text-[2rem] font-normal text-[#F6E7C0] font-alike text-center">Add your care team</h1>
        <p className="text-[#F6E7C0] text-base font-cabin text-center mt-1 mb-6">Let your staff log in, upload records, and support pet parents directly.</p>
        <h2 className="text-xl font-cabin text-[#F6E7C0] font-normal text-center mb-6 mt-2">Your Team</h2>
        <div className="flex flex-col items-center w-full mb-8">
          <CareTeamMemberCard {...member} />
        </div>
        <div className="flex gap-4 w-full justify-center mt-2">
          <button type="button" className="flex items-center justify-center gap-2 w-1/2 py-3 rounded-md border border-[#FDBA3B] text-[#FDBA3B] text-lg font-semibold font-cabin hover:bg-[#FDBA3B] hover:text-black transition-colors bg-transparent">
            <Plus className="w-5 h-5" /> Add Member
          </button>
          <button type="button" className="w-1/2 py-3 rounded-md bg-[#FDBA3B] text-black text-lg font-semibold font-cabin hover:bg-[#ffb733] transition-colors" onClick={() => navigate('/business/home')}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default CareTeamListPage; 