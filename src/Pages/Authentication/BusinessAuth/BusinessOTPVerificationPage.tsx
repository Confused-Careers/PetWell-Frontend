import React, { useState } from "react";
import PetWellLogo from "../../../Assets/PetWell.png";
import { useNavigate, useLocation } from "react-router-dom";
import authServices from "../../../Services/authServices";
import { Loader2 } from "lucide-react";

const BusinessOTPVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = "" } = (location.state as any) || {};
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !otp) {
      setError("Please enter your email and OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await authServices.verifyOTP({ identifier: email, otp_code: otp });
      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
      }
      navigate("/business/signup/add-care-team");
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="h-screen w-screen flex flex-col bg-[var(--color-background)] w-full px-2 pt-24 sm:p-4 md:p-8">
        <div className="flex justify-center sm:justify-start h-8 mb-8 md:mb-0">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="object-contain h-full w-auto"
        />
      </div>
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
        <p className=" font-[Alike,serif] text-3xl text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
          Verify your email
        </p>
        <p className="mb-3 text-lg font-[Cabin] items-center flex justify-center text-center px-2">
          Enter the OTP sent to your email to verify your account.
        </p>
        {error && (
          <div className="w-full max-w-md mb-2 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 rounded py-2 px-3 text-sm animate-fade-in">
            {error}
          </div>
        )}
        <form className="w-full flex flex-col gap-4 sm:gap-5 max-w-sm mt-4" onSubmit={handleSubmit}>
                    <div className="w-full  flex flex-col gap-2">

            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
            />
          </div>
          <div className="w-full  flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              placeholder="Enter OTP"
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          </div>
          <button
                type="submit"
                                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"

                disabled={loading}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Verifying..." : "Verify"}
              </button>
         
        </form>
      </div>
    </div>
  );
};

export default BusinessOTPVerificationPage;
