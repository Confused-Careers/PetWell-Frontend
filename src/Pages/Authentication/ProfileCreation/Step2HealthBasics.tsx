import React from "react";
import PetWellLogo from "../../../Assets/PetWell.png";
import Stepper from "./Stepper";
import type { FormData } from "./types";

interface Step2HealthBasicsProps {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onNext: () => void;
  steps?: string[];
}

const Step2HealthBasics: React.FC<Step2HealthBasicsProps> = ({
  form,
  setForm,
  error,
  setError,
  onNext,
  steps,
}) => {
  const validateStep2 = () => {
    if (
      !form.pet_weight ||
      isNaN(Number(form.pet_weight)) ||
      Number(form.pet_weight) <= 0
    )
      return "Pet weight must be a positive number";
    if (!form.pet_spay_neuter) return "Spay/neuter status is required";
    if (!form.pet_color.trim()) return "Pet color is required";
    // Date of birth is optional since there's a "Skip For Now" button
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const error = validateStep2();
    if (error) {
      setError(error);
      return;
    }
    onNext();
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
          Welcome to your pet's new digital home.
        </h1>
      </div>
      <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <Stepper currentStep={2} steps={steps} />
        <h2 className="text-2xl font-[Cabin,sans-serif] text-[#EBD5BD] font-normal mb-8 mt-2">
          Now a few quick health details...
        </h2>
        <form
          className="w-full max-w-2xl flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              What's your pet's weight?
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Weight in kg"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.pet_weight}
              onChange={(e) => {
                setForm((f) => ({ ...f, pet_weight: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              What's your pet's spay/neuter status?
            </label>
            <select
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.pet_spay_neuter}
              onChange={(e) => {
                setForm((f) => ({ ...f, pet_spay_neuter: e.target.value }));
                setError(null);
              }}
              required
            >
              <option value="">Select status</option>
              <option value="true">Spayed/Neutered</option>
              <option value="false">Intact</option>
            </select>
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              What's your pet's colour?
            </label>
            <input
              type="text"
              placeholder="Type colour"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.pet_color}
              onChange={(e) => {
                setForm((f) => ({ ...f, pet_color: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              What's your pet's date of birth?
            </label>
            <input
              type="date"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.pet_dob}
              onChange={(e) => {
                setForm((f) => ({ ...f, pet_dob: e.target.value }));
                setError(null);
              }}
            />
          </div>
          {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              className="w-1/2 py-3 rounded-md border border-[#FFB23E] text-[#FFB23E] text-lg font-semibold font-[Cabin,sans-serif] hover:bg-[#FFB23E] hover:text-black transition-colors bg-transparent"
              onClick={onNext}
            >
              Skip For Now
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 rounded-md bg-[#FFB23E] text-black text-lg font-semibold font-[Cabin,sans-serif] hover:bg-[#ffb733] transition-colors"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2HealthBasics; 