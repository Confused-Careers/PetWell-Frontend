import React from "react";
import PetWellLogo from "../../../Assets/PetWell.png";
import Stepper from "./Stepper";
import authServices from "../../../Services/authServices";
import ProfileCreationSuccessModal from "./ProfileCreationSuccessModal";
import type { FormData } from "./types";

interface Step5OTPVerificationProps {
  form: FormData;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  otpLoading: boolean;
  setOtpLoading: React.Dispatch<React.SetStateAction<boolean>>;
  otpError: string | null;
  setOtpError: React.Dispatch<React.SetStateAction<string | null>>;
  resentMessage: string | null;
  setResentMessage: React.Dispatch<React.SetStateAction<string | null>>;
  showSuccess: boolean;
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  onResetForm: () => void;
  onNavigateHome: () => void;
  onNavigateUpload: () => void;
}

const Step5OTPVerification: React.FC<Step5OTPVerificationProps> = ({
  form,
  otp,
  setOtp,
  otpLoading,
  setOtpLoading,
  otpError,
  setOtpError,
  resentMessage,
  setResentMessage,
  showSuccess,
  setShowSuccess,
  onResetForm,
  onNavigateHome,
  onNavigateUpload,
}) => {
  const validateOTP = () => {
    if (!/^\d{6}$/.test(otp)) return "OTP must be a 6-digit number";
    return null;
  };

  const handleOTPSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setOtpError(null);

    const error = validateOTP();
    if (error) {
      setOtpError(error);
      return;
    }

    setOtpLoading(true);
    try {
      console.log("Submitting OTP:", {
        identifier: form.owner_email,
        otp_code: otp,
      });
      await authServices.verifyOTP({
        identifier: form.owner_email,
        otp_code: otp,
      });

      setShowSuccess(true);
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setOtpError(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpError(null);
    setResentMessage(null);
    setOtpLoading(true);

    try {
      console.log("Resending OTP for:", { email: form.owner_email });
      await authServices.resendOTP({
        email: form.owner_email,
        otp_type: "Registration",
      });
      setResentMessage("New OTP sent successfully!");
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setOtpError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1C232E] flex flex-col items-center justify-center w-full relative">
      <img
        src={PetWellLogo}
        alt="PetWell Logo"
        className="w-16 h-16 object-contain absolute left-20 top-10"
        style={{ left: 80, top: 40 }}
      />
      <div className="flex justify-center w-full max-w-5xl mt-12 mb-6">
        <h1 className="text-[40px] font-[Alike,serif] text-[#EBD5BD] font-normal text-center">
          Welcome to your pet's new digital home.
        </h1>
      </div>
      <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <Stepper currentStep={5} />
        <h2 className="text-2xl font-[Cabin,sans-serif] text-[#EBD5BD] font-normal mb-2 mt-2">
          Verify your email
        </h2>
        <div className="bg-[#23272f] rounded-xl p-8 w-full max-w-md flex flex-col items-center mt-4">
          <p className="text-[#EBD5BD] mb-4 text-center">
            Enter the OTP sent to{" "}
            <span className="font-semibold">{form.owner_email}</span>
          </p>
          <form
            className="w-full flex flex-col gap-4"
            onSubmit={handleOTPSubmit}
          >
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none text-center tracking-widest"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Only digits
                setOtp(value);
                setOtpError(null);
              }}
              required
              maxLength={6}
              disabled={otpLoading}
            />
            {otpError && (
              <div className="text-red-400 text-sm mb-2 text-center">
                {otpError}
              </div>
            )}
            {resentMessage && (
              <div className="text-green-400 text-sm mb-2 text-center">
                {resentMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-md bg-[#FFB23E] text-black text-lg font-semibold font-[Cabin,sans-serif] hover:bg-[#ffb733] transition-colors"
              disabled={otpLoading}
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
          <button
            className="mt-4 text-[#FFB23E] hover:underline text-sm"
            onClick={handleResendOTP}
            disabled={otpLoading}
          >
            Resend OTP
          </button>
        </div>
      </div>
      {showSuccess && (
        <ProfileCreationSuccessModal
          onClose={() => {
            setShowSuccess(false);
            onResetForm();
            onNavigateHome();
          }}
          onGoHome={() => {
            onResetForm();
            onNavigateHome();
          }}
          onUploadRecords={() => {
            onResetForm();
            onNavigateUpload();
          }}
        />
      )}
    </div>
  );
};

export default Step5OTPVerification; 