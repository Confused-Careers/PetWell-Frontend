import React from "react";
import Logo from "../../../Assets/PetWell.png";
import CareTeamMemberCard from "./CareTeamMemberCard";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CareTeamListPage: React.FC = () => {
  const navigate = useNavigate();
  // Example member data
  const member = {
    name: "Dr. Hemant Patel",
    role: "Vet",
    access: "Full Access",
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center px-4 py-0 relative">
      <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
        <img
          src={Logo}
          alt="PetWell Logo"
          className="h-6 sm:h-8 md:h-12 w-auto max-w-[120px] object-contain transition-all mb-4 sm:mb-0"
        />
      </div>
      <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-logo)] text-center mb-1 mt-12 break-words">
          Add your care team
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-logo)] opacity-80 text-center mb-4">
          Let your staff log in, upload records, and support pet parents
          directly.
        </p>
        <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-logo)] text-center mb-4 mt-2">
          Your Team
        </h2>
        <div className="flex flex-col items-center w-full mb-6">
          <CareTeamMemberCard {...member} />
        </div>
        <div className="flex gap-4 w-full justify-center mt-2">
          <button
            type="button"
            className="flex-1 border border-[var(--color-card-button)] text-[var(--color-card-button)] rounded-full py-2 font-semibold hover:bg-[var(--color-card-button)] hover:text-[var(--color-background)] transition bg-transparent flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Member
          </button>
          <button
            type="button"
            className="flex-1 bg-[var(--color-card-button)] text-[var(--color-text)] font-semibold rounded-full py-2 hover:bg-[var(--color-background)] hover:text-[var(--color-card-button)] border hover:border-[var(--color-card-button)] transition"
            onClick={() => navigate("/business/home")}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareTeamListPage;
