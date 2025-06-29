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

  return (
    <div className="min-h-screen bg-[#1C232E] flex flex-col items-center justify-center w-full relative">
      <img
        src={PetWellLogo}
        alt="PetWell Logo"
        className="w-16 h-16 object-contain absolute left-20 top-10"
        style={{ left: 80, top: 40 }}
      />
      <div className="flex justify-center w-full max-w-5xl mt-12 mb-6">
        <h1 className="text-[40px] font-[Alike,serif] text-[#EBD5BD] font-normal text-center">
          Let's get to know you first
        </h1>
      </div>
      <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <UploadStepper currentStep="step4" />
        <h2 className="text-2xl font-[Cabin,sans-serif] text-[#EBD5BD] font-normal mb-8 mt-2">
          Tell us about yourself before we upload your pet's records
        </h2>
        <form
          className="w-full max-w-2xl flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              What's your name?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.owner_name}
              onChange={(e) => {
                setForm((f) => ({ ...f, owner_name: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              Where are you located?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.owner_location}
              onChange={(e) => {
                setForm((f) => ({ ...f, owner_location: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              What's your phone number?
            </label>
            <input
              type="tel"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.owner_phone}
              onChange={(e) => {
                setForm((f) => ({ ...f, owner_phone: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              What's your email address?
            </label>
            <input
              type="email"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.owner_email}
              onChange={(e) => {
                setForm((f) => ({ ...f, owner_email: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              Choose a username
            </label>
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.owner_username}
              onChange={(e) => {
                setForm((f) => ({ ...f, owner_username: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              Set a password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
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
            className="w-full mt-4 py-3 rounded-md bg-[#FFB23E] text-black text-lg font-semibold font-[Cabin,sans-serif] hover:bg-[#ffb733] transition-colors"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Continue to Verification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Step4HumanInfoUpload; 