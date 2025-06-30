import { useNavigate } from "react-router-dom";
import PetWellLogo from "../../../Assets/PetWell.png";
import { FileUp, PencilLine } from "lucide-react";

const PetParentOnboardingChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-text)] px-4">
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
          className="flex-1 flex flex-col items-center gap-4 bg-[var(--color-card)] hover:bg-[var(--color-card)]/80 border-2 border-[var(--color-primary)] rounded-2xl px-8 py-10 shadow-lg transition group"
          onClick={() => navigate("/signup/pet-parent")}
        >
          <FileUp
            size={48}
            className="text-[var(--color-primary)] group-hover:scale-110 transition-transform"
          />
          <span className="text-xl font-semibold text-[var(--color-primary)]">
            Upload Documents
          </span>
          <span className="text-base text-[var(--color-text)] opacity-80 text-center mt-2">
            Instantly create a profile by uploading your pet's records. We'll
            extract the info for you!
          </span>
        </button>
        <button
          className="flex-1 flex flex-col items-center gap-4 bg-[var(--color-card)] hover:bg-[var(--color-card)]/80 border-2 border-[var(--color-primary)] rounded-2xl px-8 py-10 shadow-lg transition group"
          onClick={() => navigate("/profile-creation")}
        >
          <PencilLine
            size={48}
            className="text-[var(--color-primary)] group-hover:scale-110 transition-transform"
          />
          <span className="text-xl font-semibold text-[var(--color-primary)]">
            Enter Manually
          </span>
          <span className="text-base text-[var(--color-text)] opacity-80 text-center mt-2">
            Prefer to type? Enter your pet's details step by step in our guided
            form.
          </span>
        </button>
      </div>
    </div>
  );
};

export default PetParentOnboardingChoice;
