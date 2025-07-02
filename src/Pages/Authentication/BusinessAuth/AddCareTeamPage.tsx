import React from "react";
import Logo from "../../../Assets/PetWell.png";
import { useNavigate } from "react-router-dom";
import CareTeamMemberForm from "../../../Components/BusinessComponents/CareTeamMemberForm";

const AddCareTeamPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/business/signup/care-team-list");
  };

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-[var(--color-background)] flex flex-col items-center justify-center px-2 py-2 relative">
      <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
        <img
          src={Logo}
          alt="PetWell Logo"
          className="h-6 sm:h-8 md:h-12 w-auto max-w-[120px] object-contain transition-all mb-2 sm:mb-0"
        />
      </div>
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-logo)] text-center mb-1 mt-12 break-words">
          Add your care team
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-logo)] opacity-80 text-center mb-4">
          Let your staff log in, upload records, and support pet parents
          directly.
        </p>
        <CareTeamMemberForm />
      </div>
    </div>
  );
};

export default AddCareTeamPage;
