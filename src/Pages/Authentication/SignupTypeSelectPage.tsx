import React from "react";
import { useNavigate } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";

const SignupTypeSelectPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#181F29] px-4 sm:px-6">
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
        {/* Logo - replace with your logo if needed */}
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#EBD5BD] mb-3 sm:mb-4 text-center">
          Let's get you started
        </h1>
        <p className="text-base sm:text-lg text-[#EBD5BD] opacity-80 mb-8 sm:mb-12 text-center px-4">
          Tell us who you are so we can tailor your experience.
        </p>
        <div className="flex flex-col gap-4 w-full">
          <button
            className="flex flex-col items-start gap-2 px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 rounded-xl bg-[#23272f] hover:bg-[#23272f]/80 transition border-none shadow-lg w-full text-left focus:outline-none"
            onClick={() => navigate("/signup/pet-parent")}
          >
            <span className="text-3xl sm:text-4xl mb-2">🐾</span>
            <span className="text-lg sm:text-xl font-bold text-[#EBD5BD]">
              I'm a Pet Parent
            </span>
            <span className="text-sm sm:text-base text-[#EBD5BD] opacity-80">
              Manage your pet's health, records, and care team – all in one place.
            </span>
          </button>
          <button
            className="flex flex-col items-start gap-2 px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 rounded-xl bg-[#23272f] hover:bg-[#23272f]/80 transition border-none shadow-lg w-full text-left focus:outline-none"
            onClick={() => navigate("/signup/business")}
          >
            <span className="text-3xl sm:text-4xl mb-2">💼</span>
            <span className="text-lg sm:text-xl font-bold text-[#EBD5BD]">
              I'm a Business
            </span>
            <span className="text-sm sm:text-base text-[#EBD5BD] opacity-80">
              Connect with pet parents, upload records, and manage your care team.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupTypeSelectPage;
