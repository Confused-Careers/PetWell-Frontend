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
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center px-4 py-8">
      <div className="absolute left-8 top-8">
        <img src={Logo} alt="PetWell Logo" className="h-12 w-12" />
      </div>
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--color-card-heading)] text-center mb-2 mt-4">
          Create your account
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-card-heading)] opacity-80 text-center mb-6">
          Access pet profiles, health records, and more.
        </p>
        <form
          className="w-full border-2 border-[var(--color-primary)] rounded-md px-4 py-6 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1">
              Business Email
            </label>
            <input
              type="email"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-2 text-base bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              className="flex-1 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-md py-2 font-semibold hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition bg-transparent"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Go Back
            </button>
            <button
              type="submit"
              className="flex-1 bg-[var(--color-primary)] text-[var(--color-background)] font-semibold rounded-md py-2 hover:brightness-110 transition"
              disabled={loading}
            >
              {loading ? "Registering..." : "Continue"}
            </button>
          </div>
          <div className="text-center mt-2 text-[var(--color-text)] text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[var(--color-primary)] font-semibold hover:underline"
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
