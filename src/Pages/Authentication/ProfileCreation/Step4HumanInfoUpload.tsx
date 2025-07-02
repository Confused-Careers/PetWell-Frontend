import React from "react";
import PetWellLogo from "../../../Assets/PetWell.png";
import UploadStepper from "./UploadStepper";
import authServices from "../../../Services/authServices";
import type { FormData } from "./types";

interface Step4HumanInfoUploadProps {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onNext: () => void;
}

const Step4HumanInfoUpload: React.FC<Step4HumanInfoUploadProps> = ({
  form,
  setForm,
  error,
  setError,
  loading,
  setLoading,
  onNext,
}) => {
  const validateStep4 = () => {
    if (!form.owner_name.trim()) return "Owner name is required";
    if (!form.owner_location.trim()) return "Location is required";
    if (!/^\+?[1-9]\d{1,14}$/.test(form.owner_phone))
      return "Invalid phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.owner_email))
      return "Invalid email address";
    if (form.owner_password.length < 8)
      return "Password must be at least 8 characters";
    if (!form.owner_username.trim()) return "Username is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Validation
    const error = validateStep4();
    if (error) {
      setError(error);
      return;
    }
    
    setLoading(true);
    try {
      // Create human owner data for upload flow (no pet data)
      const humanOwnerData = {
        human_owner_name: form.owner_name.trim(),
        email: form.owner_email.trim(),
        location: form.owner_location.trim(),
        phone: form.owner_phone.trim(),
        password: form.owner_password,
        username: form.owner_username.trim(),
      };
      
      console.log("Sending human owner signup for upload flow...");
      const response = await authServices.signupHumanOwner(humanOwnerData);
      console.log("Signup response:", response);
      
      // Proceed to OTP verification step
      onNext();
    } catch (err: any) {
      console.error("Signup error:", err);
      
      // More detailed error handling
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.message) {
        errorMessage = err.message;
        
        // Provide helpful suggestions for common errors
        if (errorMessage.includes("Username already exists")) {
          errorMessage = "Username already exists. Please choose a different username or try adding numbers (e.g., " + form.owner_username + "123).";
        } else if (errorMessage.includes("Email already exists")) {
          errorMessage = "Email already exists. Please use a different email address or try logging in instead.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (<div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <UploadStepper currentStep="step4" />
    
        <p className="mb-6 text-xl font-[Cabin] items-center flex justify-center text-center px-2">
          Tell us about yourself before we upload your pet's records
                </p>
        <form
          className="w-full max-w-sm flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label               className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
>
              What's your name?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              value={form.owner_name}
              onChange={(e) => {
                setForm((f) => ({ ...f, owner_name: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label               className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
>
              Where are you located?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              value={form.owner_location}
              onChange={(e) => {
                setForm((f) => ({ ...f, owner_location: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label               className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
>
              What's your phone number?
            </label>
            <input
              type="tel"
              placeholder="Type here"
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              value={form.owner_phone}
              onChange={(e) => {
                setForm((f) => ({ ...f, owner_phone: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label               className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
>
              What's your email address?
            </label>
            <input
              type="email"
              placeholder="Type here"
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              value={form.owner_email}
              onChange={(e) => {
                setForm((f) => ({ ...f, owner_email: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label               className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
>
              Choose a username
            </label>
            <input
              type="text"
              placeholder="Username"
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              value={form.owner_username}
              onChange={(e) => {
                setForm((f) => ({ ...f, owner_username: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label               className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
>
              Set a password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              value={form.owner_password}
              onChange={(e) => {
                setForm((f) => ({ ...f, owner_password: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
          <button
            type="submit"
                                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E] mb-8 mt-2"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Continue to Verification"}
          </button>
        </form>
      </div>
  );
};

export default Step4HumanInfoUpload; 