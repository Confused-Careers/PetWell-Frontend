import React from "react";
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
    <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
      <Stepper currentStep={2} steps={steps} />
      <p className="mb-6 text-xl font-[Cabin] items-center flex justify-center text-center px-2">
      Now a few quick health details...
      </p>
      <form
        className="w-full max-w-sm flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
            What's your pet's weight?
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="Weight in kg"
            className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
            value={form.pet_weight}
            onChange={(e) => {
              setForm((f) => ({ ...f, pet_weight: e.target.value }));
              setError(null);
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
            What's your pet's spay/neuter status?
          </label>
          <select
            className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
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
        <div className="flex flex-col gap-2">
          <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
            What's your pet's colour?
          </label>
          <input
            type="text"
            placeholder="Type colour"
            className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
            value={form.pet_color}
            onChange={(e) => {
              setForm((f) => ({ ...f, pet_color: e.target.value }));
              setError(null);
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
            What's your pet's date of birth?
          </label>
          <input
            type="date"
            className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
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
            className="w-1/2 font-semibold cursor-pointer py-2 rounded-3xl text-[#FFB23E] border border-[#FFB23E] bg-white font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2"
            onClick={onNext}
          >
            Skip For Now
          </button>
          <button
            type="submit"
            className="w-1/2 font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2HealthBasics;
