import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PetWellLogo from "../../Assets/PetWell.png";
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
        if (entityType.toLowerCase().includes("staff")) {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1C232E] via-[#23272f] to-[#23272f] w-full px-4 sm:px-6">
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2 drop-shadow-lg"
        />
        <h1 className="text-3xl sm:text-4xl font-[Alike,serif] text-[#EBD5BD] font-bold tracking-tight">
          PetWell
        </h1>
        <p className="text-[#EBD5BD] text-opacity-70 text-sm sm:text-base mt-1 font-[Cabin,sans-serif]">
          We love you for loving your pets
        </p>
      </div>
      <div className="bg-[#23272f] rounded-2xl shadow-2xl px-6 sm:px-8 md:px-10 py-8 sm:py-10 flex flex-col items-center w-full max-w-sm sm:max-w-md border border-[#2d3648]">
        <h2 className="text-xl sm:text-2xl font-[Alike,serif] text-[#EBD5BD] mb-4 sm:mb-6 text-center font-semibold">
          Sign in to your account
        </h2>
        {successMessage && (
          <div className="w-full mb-4 text-center text-green-400 bg-green-900/30 rounded py-2 px-3 text-sm animate-fade-in">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="w-full mb-4 text-center text-red-400 bg-red-900/30 rounded py-2 px-3 text-sm animate-fade-in">
            {error}
          </div>
        )}
        <form
          className="w-full flex flex-col gap-4 sm:gap-5"
          onSubmit={handleSubmit}
          autoComplete="on"
        >
          <div>
            <label
              className="block text-[#EBD5BD] text-sm sm:text-base mb-2 font-medium"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[#23272f] border border-[#3a4152] text-[#EBD5BD] placeholder-[#EBD5BD]/60 focus:outline-none focus:ring-2 focus:ring-[#FFB23E] transition"
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>
          <div className="relative">
            <label
              className="block text-[#EBD5BD] text-sm sm:text-base mb-2 font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[#23272f] border border-[#3a4152] text-[#EBD5BD] placeholder-[#EBD5BD]/60 focus:outline-none focus:ring-2 focus:ring-[#FFB23E] transition"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-2 sm:py-3 rounded-md bg-[#FFB23E] text-black text-base sm:text-lg font-semibold font-[Cabin,sans-serif] hover:bg-[#ffb733] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin mr-2 sm:w-5 sm:h-5"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#23272f"
                  strokeWidth="4"
                  opacity="0.2"
                />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="#FFB23E"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 mt-4 sm:mt-6 text-xs sm:text-sm text-[#EBD5BD] text-opacity-70">
          <button
            className="hover:text-[#FFB23E] transition-colors text-center"
            type="button"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
          <button
            className="hover:text-[#FFB23E] transition-colors text-center"
            type="button"
            onClick={() => navigate("/signup-type")}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
