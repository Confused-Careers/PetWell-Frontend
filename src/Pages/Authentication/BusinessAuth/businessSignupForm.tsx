import React, { useState } from "react";
import Logo from "../../../Assets/PetWell.png";
import { useNavigate } from "react-router-dom";

const BusinessSignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Only pass credentials to next page, do not register here
    console.log("[BusinessSignupForm] Passing credentials to next page:", {
      email,
      password,
    });
    navigate("/business/signup", { state: { email, password } });
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
          Create your account
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-logo)] opacity-80 text-center mb-8">
          Access pet profiles, health records, and more.
        </p>
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              Business Email
            </label>
            <input
              type="email"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="flex flex-row gap-4 mt-2 w-full">
            <button
              type="button"
              className="flex-1 border border-[var(--color-card-button)] text-[var(--color-card-button)] rounded-full py-2 font-semibold hover:bg-[var(--color-card-button)] hover:text-[var(--color-background)] transition bg-transparent"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Go Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-[var(--color-card-button)] text-[var(--color-text)] font-semibold rounded-full py-2 hover:bg-[var(--color-background)] hover:text-[var(--color-card-button)]  border hover:border-[var(--color-card-button)] transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Continue"}
            </button>
          </div>
          <div className="text-center mt-6 text-[var(--color-text)] text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[var(--color-card-button)] font-semibold hover:underline"
            >
              Log In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessSignupForm;
