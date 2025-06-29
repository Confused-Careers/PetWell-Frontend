import { useNavigate } from "react-router-dom";
import PetWellLogo from "../../../Assets/PetWell.png";
import { FileUp, PencilLine } from "lucide-react";

const PetParentOnboardingChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181e29] text-[#EBD5BD] px-4">
      <div className="w-full flex justify-center mt-8 mb-6">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg"
        />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center font-serif">
        How would you like to get started?
      </h1>
      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl justify-center">
        <button
          className="flex-1 flex flex-col items-center gap-4 bg-[#23272f] hover:bg-[#2d3340] border-2 border-[#FFB23E] rounded-2xl px-8 py-10 shadow-lg transition group"
          onClick={() => navigate("/signup/pet-parent")}
        >
          <FileUp size={48} className="text-[#FFB23E] group-hover:scale-110 transition-transform" />
          <span className="text-xl font-semibold text-[#FFB23E]">Upload Documents</span>
          <span className="text-base text-[#EBD5BD] opacity-80 text-center mt-2">
            Instantly create a profile by uploading your pet's records. We'll extract the info for you!
          </span>
        </button>
        <button
          className="flex-1 flex flex-col items-center gap-4 bg-[#23272f] hover:bg-[#2d3340] border-2 border-[#FFB23E] rounded-2xl px-8 py-10 shadow-lg transition group"
          onClick={() => navigate("/profile-creation")}
        >
          <PencilLine size={48} className="text-[#FFB23E] group-hover:scale-110 transition-transform" />
          <span className="text-xl font-semibold text-[#FFB23E]">Enter Manually</span>
          <span className="text-base text-[#EBD5BD] opacity-80 text-center mt-2">
            Prefer to type? Enter your pet's details step by step in our guided form.
          </span>
        </button>
      </div>
    </div>
  );
};

export default PetParentOnboardingChoice; 