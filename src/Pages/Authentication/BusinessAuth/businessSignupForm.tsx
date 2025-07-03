import React, { useState } from "react";
import PetWellLogo from "../../../Assets/PetWell.png";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const BusinessSignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, ] = useState(false);

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
          Create your account
        </p>
        <p className="mb-3 text-lg font-[Cabin] items-center flex justify-center text-center px-2">
          Access pet profiles, health records, and more.
        </p>
         {error && (
          <div className="w-full max-w-md mb-2 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 rounded py-2 px-3 text-sm animate-fade-in">
            {error}
          </div>
        )}
        <form           className="w-full flex flex-col gap-4 sm:gap-5 max-w-sm mt-4"
 onSubmit={handleSubmit}>
          <div className="w-full  flex flex-col gap-2">
            <label               className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
>
              Business Email
            </label>
            <input
              type="email"
              placeholder="Type here"
                            className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"

              value={email}
              onChange={(e) => {setEmail(e.target.value);setError('');}}
              required
            />
          </div>
          <div className="w-full  flex flex-col gap-2">
            <label               className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
>
              Password
            </label>
            <input
              type="password"
              placeholder="Type here"
                            className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"

              value={password}
              onChange={(e) => {setPassword(e.target.value);setError('');}}
              required
            />
          </div>
          <div className="w-full  flex flex-col gap-2">
            <label               className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Type here"
                            className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"

              value={confirmPassword}
              onChange={(e) => {setConfirmPassword(e.target.value);setError('');}}
              required
            />
          </div>
          <div className="w-full mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
              <button 
                type="button"
                              onClick={() => navigate(-1)}

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
              {loading ? "Registering..." : "Continue"}
              </button>
            </div>
          <div className="text-center mt-4 text-[var(--color-text)]">
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
