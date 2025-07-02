import React, { useState } from "react";
import Logo from "../../../Assets/PetWell.png";
import { useNavigate, useLocation } from "react-router-dom";
import authServices from "../../../Services/authServices";

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
      await authServices.verifyOTP({ identifier: email, otp_code: otp });
      navigate("/business/signup/add-care-team");
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
        <img
          src={Logo}
          alt="PetWell Logo"
          className="h-6 sm:h-8 md:h-12 w-auto max-w-[120px] object-contain transition-all mb-4 sm:mb-0"
        />
      </div>
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-logo)] text-center mb-2 mt-6 break-words">
          Verify your email
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-logo)] opacity-80 text-center mb-8">
          Enter the OTP sent to your email to verify your account.
        </p>
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none opacity-80"
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full rounded-md px-4 py-2 text-lg text-center tracking-widest bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none"
              placeholder="Enter OTP"
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[var(--color-card-button)] text-[var(--color-text)] font-semibold rounded-full py-2 hover:bg-[var(--color-background)] hover:text-[var(--color-card-button)] border hover:border-[var(--color-card-button)] transition"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessOTPVerificationPage;
