import React from "react";
import PetWellLogo from "../../../Assets/PetWell.png";
import Stepper from "./Stepper";
import type { FormData } from "./types";

interface Step3SafetyAndIDProps {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onNext: () => void;
  steps?: string[];
  loading?: boolean;
}

const Step3SafetyAndID: React.FC<Step3SafetyAndIDProps> = ({
  form,
  setForm,
  error,
  setError,
  onNext,
  steps,
  loading = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
        <Stepper currentStep={3} steps={steps} />
        <h2 className="text-2xl font-[Cabin,sans-serif] text-[#EBD5BD] font-normal mb-8 mt-2">
          Next, a quick check for safety & ID
        </h2>
        <form
          className="w-full max-w-2xl flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              What is your pet's microchip number?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.pet_microchip}
              onChange={(e) => {
                setForm((f) => ({ ...f, pet_microchip: e.target.value }));
                setError(null);
              }}
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              Any quirks, meds, or special needs?
            </label>
            <textarea
              placeholder="Type here"
              rows={3}
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none resize-none"
              value={form.pet_notes}
              onChange={(e) => {
                setForm((f) => ({ ...f, pet_notes: e.target.value }));
                setError(null);
              }}
            />
          </div>
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
              className="w-1/2 py-3 rounded-md bg-[#FFB23E] text-black text-lg font-semibold font-[Cabin,sans-serif] hover:bg-[#ffb733] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Pet Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step3SafetyAndID; 