import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";
import { ArrowLeft, Loader2, Mail, KeyRound } from "lucide-react";
import authServices from "../../Services/authServices";

type ResetStep = "request" | "reset";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ResetStep>("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Timer effect for resend OTP
  React.useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authServices.forgotPassword({ identifier: email });
      setCurrentStep("reset");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Directly reset password with OTP and new password
      await authServices.resetPassword({
        email,
        otp_code: otp,
        new_password: newPassword,
      });

      // Redirect to login with success message
      navigate("/login", { state: { message: "Password reset successful" } });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderRequestOTP = () => (
    <form onSubmit={handleRequestOTP} className="w-full space-y-4">
      <h2 className="text-2xl font-[Alike,serif] text-[var(--color-text)] text-center">
        Forgot Password
      </h2>
      <p className="text-sm text-[var(--color-text)] opacity-70 text-center">
        Enter your email address and we'll send you an OTP to reset your
        password.
      </p>

      <div className="space-y-2">
        <label
          className="block text-[var(--color-text)] text-sm font-medium"
          htmlFor="email"
        >
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--color-card)] border border-[var(--color-text)]/20 text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            placeholder="Enter your email"
            required
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text)] opacity-70" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-black)] font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending OTP...</span>
          </>
        ) : (
          "Send OTP"
        )}
      </button>
    </form>
  );

  const renderResetPassword = () => (
    <form onSubmit={handleResetPassword} className="w-full space-y-4">
      <h2 className="text-2xl font-[Alike,serif] text-[var(--color-text)] text-center">
        Reset Password
      </h2>
      <p className="text-sm text-[var(--color-text)] opacity-70 text-center">
        Enter the OTP sent to {email} and your new password
      </p>

      <div className="space-y-2">
        <label
          className="block text-[var(--color-text)] text-sm font-medium"
          htmlFor="otp"
        >
          OTP
        </label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-[var(--color-card)] border border-[var(--color-text)]/20 text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          placeholder="Enter OTP"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          className="block text-[var(--color-text)] text-sm font-medium"
          htmlFor="newPassword"
        >
          New Password
        </label>
        <div className="relative">
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md bg-[var(--color-card)] border border-[var(--color-text)]/20 text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            placeholder="Enter new password"
            required
          />
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text)] opacity-70" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md bg-[var(--color-primary)] text-[var(--color-black)] font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Resetting Password...</span>
          </>
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--color-background)] w-full px-2 pt-24 sm:p-4 md:p-8">
      <div className="flex justify-center sm:justify-start h-8 mb-8 md:mb-0">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="object-contain h-full w-auto"
        />
      </div>
      <div className="w-screen flex flex-col h-full justify-center items-center">
        <div className="bg-[var(--color-background)] rounded-2xl px-2 sm:px-5 md:px-7 py-4 sm:py-7 flex flex-col items-center w-full max-w-[700px] justify-center mx-auto">
          <p className="font-[Alike,serif] text-3xl text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
            {currentStep === "request" ? "Forgot Password" : "Reset Password"}
          </p>
          <p className="mb-3 text-lg font-[Cabin] items-center flex justify-center text-center px-2">
            {currentStep === "request"
              ? "Enter your email address and we'll send you an OTP to reset your password."
              : `Enter the OTP sent to ${email} and your new password`}
          </p>
        {error && (
            <div className="w-full max-w-md mb-4 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 rounded py-2 px-3 text-sm animate-fade-in">
            {error}
          </div>
        )}
          <form
            className="w-full flex flex-col gap-4 sm:gap-5 max-w-sm mt-4"
            onSubmit={currentStep === "request" ? handleRequestOTP : handleResetPassword}
            autoComplete="on"
          >
            {currentStep === "request" ? (
              <>
                <div className="w-full flex flex-col gap-2">
                  <label
                    className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                    placeholder="Type here"
                    required
                    autoFocus
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-full flex flex-col gap-2">
                  <label
                    className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
                    htmlFor="otp"
                  >
                    OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                    placeholder="Type here"
                    required
                  />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label
                    className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
                    placeholder="Type here"
                    required
                  />
                </div>
              </>
            )}
            <div className="w-full mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
              <button
                type="button"
            onClick={() => navigate("/login")}
                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-[#FFB23E]"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
                disabled={loading}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading
                  ? currentStep === "request"
                    ? "Sending OTP..."
                    : "Resetting Password..."
                  : currentStep === "request"
                  ? "Send OTP"
                  : "Reset Password"}
          </button>
            </div>
          </form>
          <div className="w-full mt-7 text-center">
            <p className="font-[400] font-[Cabin,sans-serif] text-[#1C232E] text-sm sm:text-base">
              Remember your password?
              <span
                onClick={() => navigate("/login")}
                className="font-[700] font-[Cabin,sans-serif] text-[#FFB23E] ml-2 cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
