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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] px-4 py-8">
      {/* Logo Section */}
      <div className="absolute left-4 sm:left-8 top-4 sm:top-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--color-text)] opacity-70 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="flex flex-col items-center mb-8">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="w-16 h-16 object-contain mb-4 drop-shadow-lg"
        />
      </div>

      <div className="w-full max-w-md bg-[var(--color-card)] rounded-2xl shadow-xl p-6 sm:p-8">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-[var(--color-warning)]/10 border border-[var(--color-warning)] text-[var(--color-warning)] text-sm">
            {error}
          </div>
        )}

        {currentStep === "request" ? renderRequestOTP() : renderResetPassword()}

        <div className="mt-6 text-center text-sm text-[var(--color-text)] opacity-70">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[var(--color-primary)] hover:opacity-90 transition-opacity"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
