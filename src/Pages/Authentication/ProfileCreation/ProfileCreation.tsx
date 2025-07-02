import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormData } from "./types";
import Step1BasicPetInfo from "./Step1BasicPetInfo";
import Step2HealthBasics from "./Step2HealthBasics";
import Step3SafetyAndID from "./Step3SafetyAndID";
import Step4HumanInfo from "./Step4HumanInfo";
import Step5OTPVerification from "./Step5OTPVerification";
import PetWellLogo from "../../../Assets/PetWell.png";

const ProfileCreation: React.FC = () => {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resentMessage, setResentMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    pet_name: "",
    pet_age: "",
    pet_species: "",
    pet_breed: "",
    pet_profile_picture: undefined,
    pet_weight: "",
    pet_spay_neuter: "",
    pet_color: "",
    pet_dob: "",
    pet_microchip: "",
    pet_notes: "",
    owner_name: "",
    owner_location: "",
    owner_phone: "",
    owner_email: "",
    owner_password: "",
    owner_username: "",
  });

  const goToStep = (newStep: number) => {
    setError(null);
    setOtpError(null);
    setResentMessage(null);
    setStep(newStep);
  };

  const resetForm = () => {
    setForm({
      pet_name: "",
      pet_age: "",
      pet_species: "",
      pet_breed: "",
      pet_profile_picture: undefined,
      pet_weight: "",
      pet_spay_neuter: "",
      pet_color: "",
      pet_dob: "",
      pet_microchip: "",
      pet_notes: "",
      owner_name: "",
      owner_location: "",
      owner_phone: "",
      owner_email: "",
      owner_password: "",
      owner_username: "",
    });
    setOtp("");
    setStep(1);
  };

  const handleNavigateHome = () => {
    navigate("/home");
  };

  const handleNavigateUpload = () => {
    navigate("/upload");
  };

  // Render the appropriate step component
  switch (step) {
    case 1:
      return (
        <div className="min-h-screen bg-[#1C232E] flex flex-col items-center justify-center w-full relative px-4 sm:px-6 md:px-8">
          <img
            src={PetWellLogo}
            alt="PetWell Logo"
            className="w-16 h-16 object-contain absolute left-4 top-4 sm:left-10 sm:top-10 md:left-20 md:top-10"
          />
          <div className="flex justify-center w-full max-w-5xl mt-12 mb-6 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-[Alike,serif] text-[#EBD5BD] font-normal text-center">
              Create Your Profile
            </h1>
          </div>
          <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <Step1BasicPetInfo
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
          onNext={() => goToStep(2)}
        />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="min-h-screen bg-[#1C232E] flex flex-col items-center justify-center w-full relative px-4 sm:px-6 md:px-8">
          <img
            src={PetWellLogo}
            alt="PetWell Logo"
            className="w-16 h-16 object-contain absolute left-4 top-4 sm:left-10 sm:top-10 md:left-20 md:top-10"
          />
          <div className="flex justify-center w-full max-w-5xl mt-12 mb-6 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-[Alike,serif] text-[#EBD5BD] font-normal text-center">
              Create Your Profile
            </h1>
          </div>
          <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <Step2HealthBasics
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
          onNext={() => goToStep(3)}
        />
          </div>
        </div>
      );
    case 3:
      return (
        <div className="min-h-screen bg-[#1C232E] flex flex-col items-center justify-center w-full relative px-4 sm:px-6 md:px-8">
          <img
            src={PetWellLogo}
            alt="PetWell Logo"
            className="w-16 h-16 object-contain absolute left-4 top-4 sm:left-10 sm:top-10 md:left-20 md:top-10"
          />
          <div className="flex justify-center w-full max-w-5xl mt-12 mb-6 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-[Alike,serif] text-[#EBD5BD] font-normal text-center">
              Create Your Profile
            </h1>
          </div>
          <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <Step3SafetyAndID
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
          onNext={() => goToStep(4)}
        />
          </div>
        </div>
      );
    case 4:
      return (
        <div className="min-h-screen bg-[#1C232E] flex flex-col items-center justify-center w-full relative px-4 sm:px-6 md:px-8">
          <img
            src={PetWellLogo}
            alt="PetWell Logo"
            className="w-16 h-16 object-contain absolute left-4 top-4 sm:left-10 sm:top-10 md:left-20 md:top-10"
          />
          <div className="flex justify-center w-full max-w-5xl mt-12 mb-6 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-[Alike,serif] text-[#EBD5BD] font-normal text-center">
              Create Your Profile
            </h1>
          </div>
          <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <Step4HumanInfo
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
          loading={loading}
          setLoading={setLoading}
          onNext={() => goToStep(5)}
        />
          </div>
        </div>
      );
    case 5:
      return (
        <div className="min-h-screen bg-[#1C232E] flex flex-col items-center justify-center w-full relative px-4 sm:px-6 md:px-8">
          <img
            src={PetWellLogo}
            alt="PetWell Logo"
            className="w-16 h-16 object-contain absolute left-4 top-4 sm:left-10 sm:top-10 md:left-20 md:top-10"
          />
          <div className="flex justify-center w-full max-w-5xl mt-12 mb-6 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-[Alike,serif] text-[#EBD5BD] font-normal text-center">
              Create Your Profile
            </h1>
          </div>
          <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <Step5OTPVerification
          form={form}
          otp={otp}
          setOtp={setOtp}
          otpLoading={otpLoading}
          setOtpLoading={setOtpLoading}
          otpError={otpError}
          setOtpError={setOtpError}
          resentMessage={resentMessage}
          setResentMessage={setResentMessage}
          showSuccess={showSuccess}
          setShowSuccess={setShowSuccess}
          onResetForm={resetForm}
          onNavigateHome={handleNavigateHome}
          onNavigateUpload={handleNavigateUpload}
        />
          </div>
        </div>
      );
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#1C232E] text-red-400 text-lg">
          Something went wrong. Please refresh the page or start again.
        </div>
      );
  }
};

export default ProfileCreation;
