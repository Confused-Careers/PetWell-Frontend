import React from "react";
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
    <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
      <Stepper currentStep={3} steps={steps} />
      <p className="mb-6 text-xl font-[Cabin] items-center flex justify-center text-center px-2">
        Next, a quick check for safety & ID
      </p>
      <form
        className="w-full max-w-sm flex flex-col gap-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
            What is your pet's microchip number?
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200"
            value={form.pet_microchip}
            onChange={(e) => {
              setForm((f) => ({ ...f, pet_microchip: e.target.value }));
              setError(null);
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium">
            Any quirks, meds, or special needs?
          </label>
          <textarea
            placeholder="Type here"
            rows={3}
            className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 transition-all duration-200 resize-none"
            value={form.pet_notes}
            onChange={(e) => {
              setForm((f) => ({ ...f, pet_notes: e.target.value }));
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
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Pet Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3SafetyAndID;
