import React from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessNavbar from '../../../Components/BusinessComponents/BusinessNavbar';
import CareTeamMemberForm from '../../../Components/BusinessComponents/CareTeamMemberForm';

const AddTeamMemberPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF8E5]">
      <BusinessNavbar />
      <div className="w-screen flex flex-col  h-full justify-center items-center mt-8">
        <h2 className="font-[Alike,serif] text-3xl text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">Add New Team Member</h2>
        <CareTeamMemberForm
          onSuccess={() => navigate('/business/team-management')}
          onCancel={() => navigate('/business/team-management')}
        />
      </div>
    </div>
  );
};

export default AddTeamMemberPage; 