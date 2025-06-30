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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] w-full px-4 sm:px-6">
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <img
          src={PetWellLogo}
          alt="PetWell Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-2 drop-shadow-lg"
        />
        <h1 className="text-3xl sm:text-4xl font-[Alike,serif] text-[var(--color-text)] font-bold tracking-tight">
          PetWell
        </h1>
        <p className="text-[var(--color-text)] opacity-70 text-sm sm:text-base mt-1 font-[Cabin,sans-serif]">
          We love you for loving your pets
        </p>
      </div>
      <div className="bg-[var(--color-card)] rounded-2xl shadow-2xl px-6 sm:px-8 md:px-10 py-8 sm:py-10 flex flex-col items-center w-full max-w-sm sm:max-w-md border border-[var(--color-text)]/20">
        <h2 className="text-xl sm:text-2xl font-[Alike,serif] text-[var(--color-text)] mb-4 sm:mb-6 text-center font-semibold">
          Sign in to your account
        </h2>
        {successMessage && (
          <div className="w-full mb-4 text-center text-[var(--color-success)] bg-[var(--color-success)]/10 rounded py-2 px-3 text-sm animate-fade-in">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="w-full mb-4 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 rounded py-2 px-3 text-sm animate-fade-in">
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
              className="block text-[var(--color-text)] text-sm sm:text-base mb-2 font-medium"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[var(--color-card)] border border-[var(--color-text)]/20 text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>
          <div className="relative">
            <label
              className="block text-[var(--color-text)] text-sm sm:text-base mb-2 font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[var(--color-card)] border border-[var(--color-text)]/20 text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/70 hover:text-[var(--color-text)] transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-2 py-2 sm:py-3 rounded-md bg-[var(--color-primary)] text-[var(--color-black)] text-base sm:text-lg font-semibold font-[Cabin,sans-serif] hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 mt-4 sm:mt-6 text-xs sm:text-sm text-[var(--color-text)] opacity-70">
          <button
            className="hover:text-[var(--color-primary)] transition-colors text-center"
            type="button"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
          <button
            className="hover:text-[var(--color-primary)] transition-colors text-center"
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
