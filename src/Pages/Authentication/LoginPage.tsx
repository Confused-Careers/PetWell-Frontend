import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import authServices from "../../Services/authServices";
import { getLastOrFirstPetId } from "../../utils/petNavigation";

interface LocationState {
  message?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check for success message in location state (e.g., from password reset)
    const state = location.state as LocationState;
    if (state?.message) {
      setSuccessMessage(state.message);
      // Clear the message from location state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authServices.login({ email, password, username: "" });
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
      }
      setLoading(false);
      // Defensive: check for entity_type in both root and user object
      let entityType = undefined;
      if ("entity_type" in res) {
        entityType = (res as any).entity_type;
      } else if (res.user && "entity_type" in res.user) {
        entityType = (res.user as any).entity_type;
      } else if (res.user && "role" in res.user) {
        // fallback: treat role as entity_type if present
        entityType = (res.user as any).role;
      }
      if (entityType && typeof entityType === "string") {
        if (
          entityType.toLowerCase().includes("staff") ||
          entityType.toLowerCase().includes("business")
        ) {
          navigate("/business-home");
        } else if (entityType.toLowerCase().includes("human")) {
          // Get last used petId and redirect to that pet's home page
          const petId = await getLastOrFirstPetId();
          navigate(`/petowner/pet/${petId}/home`, { replace: true });
        } else {
          setError("Unknown user type. Please contact support.");
        }
      } else {
        setError("Unknown user type. Please contact support.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Login failed");
    }
  };

  const handleSignUp = () => {
    navigate("/signup-type");
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
    <div className=" w-screen flex flex-col  h-full justify-center items-center">
        <div className="bg-[var(--color-background)] rounded-2xl px-2 sm:px-5 md:px-7 py-4 sm:py-7 flex flex-col items-center w-full max-w-[700px] justify-center mx-auto">
          <p className=" font-[Alike,serif] text-3xl text-[#1C232E] sm:mb-2 mb-2 text-center leading-tight">
            Log In to Your Account
          </p>
          <p className="mb-3 text-lg font-[Cabin] items-center flex justify-center text-center px-2">
            Access pet profiles, health records, and more.
          </p>
          {successMessage && (
            <div className="w-full max-w-md mb-4 text-center text-[var(--color-success)] bg-[var(--color-success)]/10 rounded py-2 px-3 text-sm animate-fade-in">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="w-full max-w-md mb-4 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 rounded py-2 px-3 text-sm animate-fade-in">
              {error}
            </div>
          )}
          <form
            className="w-full flex flex-col gap-4 sm:gap-5 max-w-sm mt-4"
            onSubmit={handleSubmit}
            autoComplete="on"
          >
            <div className="w-full  flex flex-col gap-2">
              <label
                className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
                htmlFor="email"
              >
                Username / Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
                placeholder="Type here"
                required
                autoFocus
              />
            </div>
            <div className="relative w-full">
              <label
                className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
                  placeholder="Type here"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 text-[var(--color-text)]/70 hover:text-[var(--color-text)] transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="w-full mt-2">
                <button
                  type="button"
                  className="text-[#1C232E] text-[18px] sm:text-[24px] md:text-base font-[Cabin,sans-serif] font-[400] hover:underline cursor-pointer"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forget password?
                </button>
              </div>
              <div className="w-full mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
                <button
                  type="button"
                  onClick={() => navigate("/")}
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
                  {loading ? "Signing in..." : "Log In"}
                </button>
              </div>
              <div className="w-full mt-7 text-center">
                <p className="font-[400] font-[Cabin,sans-serif] text-[#1C232E] text-sm sm:text-base">
                  Don't have an account?
                  <span
                    onClick={() => handleSignUp()}
                    className="font-[700] font-[Cabin,sans-serif] text-[#FFB23E] ml-2 cursor-pointer"
                  >
                    Sign Up
                  </span>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
