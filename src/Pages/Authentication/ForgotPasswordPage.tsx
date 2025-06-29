import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Card } from "../../Components/ui/card";
import authServices from "../../Services/authServices";

type ResetStep = "request" | "verify" | "reset";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ResetStep>("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      setCurrentStep("verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setLoading(true);
    try {
      await authServices.resendOTP({
        email,
        otp_type: "ForgotPassword",
      });
      setError("OTP resent successfully");
      setResendTimer(10); // 60 seconds timer
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authServices.verifyOTP({
        identifier: email,
        otp_code: otp,
      });

      console.log("OTP verification response:", response);
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

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
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
    <form onSubmit={handleRequestOTP} className="space-y-4">
      <h2 className="text-2xl font-[Alike,serif] text-[#EBD5BD] text-center">
        Forgot Password
      </h2>
      <p className="text-sm text-[#EBD5BD]/60 text-center">
        Enter your email address and we'll send you an OTP to reset your
        password.
      </p>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button
        type="submit"
        className="w-full bg-[#FFB23E] hover:bg-[#ffb733] text-black"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send OTP"}
      </Button>
    </form>
  );

  const renderVerifyOTP = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <h2 className="text-2xl font-[Alike,serif] text-[#EBD5BD] text-center">
        Enter OTP
      </h2>
      <p className="text-sm text-[#EBD5BD]/60 text-center">
        Enter the OTP sent to {email}
      </p>
      <Input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <Button
        type="submit"
        className="w-full bg-[#FFB23E] hover:bg-[#ffb733] text-black"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={handleResendOTP}
        disabled={loading || resendTimer > 0}
      >
        {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
      </Button>
    </form>
  );

  const renderResetPassword = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <h2 className="text-2xl font-[Alike,serif] text-[#EBD5BD] text-center">
        Reset Password
      </h2>
      <p className="text-sm text-[#EBD5BD]/60 text-center">
        Enter the OTP and your new password
      </p>
      <Input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button
        type="submit"
        className="w-full bg-[#FFB23E] hover:bg-[#ffb733] text-black"
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#1C232E] flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Logo */}
      <div className="absolute left-4 sm:left-8 top-4 sm:top-8">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="w-12 h-12 sm:w-16 sm:h-16"
        />
      </div>

      {/* Main Content */}
      <Card className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 bg-[#23272f] border-[#3a4152]">
        {error && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              error === "OTP resent successfully"
                ? "bg-green-500/10 border border-green-500/50 text-green-500"
                : "bg-red-500/10 border border-red-500/50 text-red-500"
            }`}
          >
            {error}
          </div>
        )}

        {currentStep === "request" && renderRequestOTP()}
        {currentStep === "verify" && renderVerifyOTP()}
        {currentStep === "reset" && renderResetPassword()}

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-[#EBD5BD]/60">
          Remember your password?{" "}
          <Button
            variant="link"
            className="text-[#FFB23E] hover:text-[#ffb733] text-xs sm:text-sm"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
