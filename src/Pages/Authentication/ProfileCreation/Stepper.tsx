import React from "react";

interface StepperProps {
  currentStep: number;
  steps?: string[];
}

const defaultSteps = [
  "Basic Pet Info",
  "Health Basics", 
  "Safety & ID",
  "Human Info",
  "OTP Verification",
];

const Stepper: React.FC<StepperProps> = ({ currentStep, steps = defaultSteps }) => {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-2 mb-6 sm:mb-8 w-full max-w-2xl sm:max-w-3xl px-4">
      {steps.map((label, idx) => {
        const n = idx + 1;
        return (
          <React.Fragment key={n}>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-[#EBD5BD] flex items-center justify-center font-bold text-xs sm:text-sm ${
                  currentStep === n || currentStep > n
                    ? "text-[#1C232E] bg-[#EBD5BD]"
                    : "text-[#EBD5BD] bg-transparent"
                }`}
              >
                {n}
              </div>
              <span
                className={`mt-1 sm:mt-2 text-xs text-[#EBD5BD] text-center max-w-16 sm:max-w-20 ${
                  currentStep === n ? " font-semibold" : ""
                }`}
              >
                {label}
              </span>
            </div>
            {n < steps.length && (
              <div className="border-t border-dashed border-[#EBD5BD] flex-1 mt-3 sm:mt-4 hidden sm:block"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper; 