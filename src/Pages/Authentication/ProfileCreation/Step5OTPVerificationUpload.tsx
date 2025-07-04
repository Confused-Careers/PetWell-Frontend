import React from "react";
import UploadStepper from "./UploadStepper";
import authServices from "../../../Services/authServices";
import type { FormData } from "./types";

interface Step5OTPVerificationUploadProps {
  form: FormData;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  otpLoading: boolean;
  setOtpLoading: React.Dispatch<React.SetStateAction<boolean>>;
  otpError: string | null;
  setOtpError: React.Dispatch<React.SetStateAction<string | null>>;
  resentMessage: string | null;
  setResentMessage: React.Dispatch<React.SetStateAction<string | null>>;
  onNext: () => void;
}

const Step5OTPVerificationUpload: React.FC<Step5OTPVerificationUploadProps> = ({
  form,
  otp,
  setOtp,
  otpLoading,
  setOtpLoading,
  otpError,
  setOtpError,
  resentMessage,
  setResentMessage,
  onNext,
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
      const response = await authServices.verifyOTP({
        identifier: form.owner_email,
        otp_code: otp,
      });

      // Store the authentication token
      const token = response.access_token || response.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Authentication token stored successfully");
      } else {
        console.warn("No token received from OTP verification");
      }

      // For document upload flow, proceed directly to upload step
      onNext();
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
   <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <UploadStepper currentStep="step5" />
    
         <p className="mb-6 text-xl font-[Cabin] items-center flex justify-center text-center px-2">
          Verify your email to continue
                </p>
        <div className="rounded-xl p-4 sm:p-8 w-full max-w-md flex flex-col items-center">
          <p className="text-[#1C232E] mb-4 text-center">
            Enter the OTP sent to{" "}
            <span className="font-semibold">{form.owner_email}</span>
            <br />
            <span className="text-sm opacity-80">After verification, you'll be able to upload your pet's documents</span>
          </p>
           {otpError && (
          <div className="w-full max-w-md mb-4 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 rounded py-2 px-3 text-sm animate-fade-in">
            {otpError}
          </div>
        )}{resentMessage && (
          <div className="w-full max-w-md mb-4 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 rounded py-2 px-3 text-sm animate-fade-in">
            {resentMessage}
          </div>
        )}
          <form
            className="w-full flex flex-col gap-4 mt-2"
            onSubmit={handleOTPSubmit}
          >
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
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
           
            <button
              type="submit"
                                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E] mt-4"
              disabled={otpLoading}
            >
              {otpLoading ? "Verifying..." : "Verify & Continue to Upload"}
            </button>
          </form>
          <button
            className="mt-4 cursor-pointer text-[#FFB23E] hover:underline text-sm"
            onClick={handleResendOTP}
            disabled={otpLoading}
          >
            Resend OTP
          </button>
        </div>
      </div>
  );
};

export default Step5OTPVerificationUpload; 