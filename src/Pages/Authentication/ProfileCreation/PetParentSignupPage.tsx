import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetWellLogo from "../../../Assets/PetWell.png";
import Step4HumanInfoUpload from "./Step4HumanInfoUpload";
import Step5OTPVerificationUpload from "./Step5OTPVerificationUpload";
import type { FormData } from "./types";

const PetParentSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [, ] = useState(false);
  const [currentStep, setCurrentStep] = useState<"step4" | "step5" | "upload">(
    "step4"
  );

  // Form state for Step 4 and Step 5
  const [form, setForm] = useState<FormData>({
    pet_id: "", // Add this line to satisfy FormData type
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

  // Step 4 state
  const [step4Error, setStep4Error] = useState<string | null>(null);
  const [step4Loading, setStep4Loading] = useState(false);

  // Step 5 state
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resentMessage, setResentMessage] = useState<string | null>(null);

  // Upload state
  const [, ] = useState<
    {
      name: string;
      size: string;
      type: string;
      progress: number;
      status: "pending" | "uploading" | "success" | "error";
      file: File;
    }[]
  >([]);
  const [, ] = useState(0);
  // const [isDragOver, setIsDragOver] = useState(false);
  const [, ] = useState<string | null>(null);




  // Step 4 completion handler
  const handleStep4Complete = () => {
    setCurrentStep("step5");
  };

  // Step 5 completion handler
  const handleStep5Complete = () => {
    navigate("/upload-option");
  };

  // Debug authentication status when upload step is reached
  React.useEffect(() => {
    if (currentStep === "upload") {
      const token = localStorage.getItem("token");
      console.log("Upload step reached - Authentication status:", {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : "None",
      });
    }
  }, [currentStep]);

  // Render based on current step
  if (currentStep === "step4") {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center w-full relative px-2 pt-10 sm:p-4 md:p-8">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="flex justify-center sm:justify-start h-8 mb-8 md:mb-0">
            <img
              src={PetWellLogo}
              alt="PetWell Logo"
              className="object-contain h-full w-auto"
            />
          </div>
          <div className="flex flex-1 justify-center sm:pr-16">
            <p className=" font-[Alike,serif] text-3xl sm:pr-16 text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
              Create Your Profile
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
          <Step4HumanInfoUpload
            form={form}
            setForm={setForm}
            error={step4Error}
            setError={setStep4Error}
            loading={step4Loading}
            setLoading={setStep4Loading}
            onNext={handleStep4Complete}
          />
        </div>
      </div>
    );
  }

  if (currentStep === "step5") {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center w-full relative px-2 pt-10 sm:p-4 md:p-8">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="flex justify-center sm:justify-start h-8 mb-8 md:mb-0">
            <img
              src={PetWellLogo}
              alt="PetWell Logo"
              className="object-contain h-full w-auto"
            />
          </div>
          <div className="flex flex-1 justify-center sm:pr-16">
            <p className=" font-[Alike,serif] text-3xl sm:pr-16 text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
              Create Your Profile
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
          <Step5OTPVerificationUpload
            form={form}
            otp={otp}
            setOtp={setOtp}
            otpLoading={otpLoading}
            setOtpLoading={setOtpLoading}
            otpError={otpError}
            setOtpError={setOtpError}
            resentMessage={resentMessage}
            setResentMessage={setResentMessage}
            onNext={handleStep5Complete}
          />
        </div>
      </div>
    );
  }
};

export default PetParentSignupPage;
