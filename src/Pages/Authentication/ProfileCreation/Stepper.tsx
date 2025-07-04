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

const Stepper: React.FC<StepperProps> = ({
  currentStep,
  steps = defaultSteps,
}) => {
  return (
    <div className="flex items-center justify-center mt-2 mb-6 sm:mb-8 mt-4 w-full max-w-2xl sm:max-w-3xl">
      {steps.map((label, idx) => {
        const n = idx + 1;
        return (
          <React.Fragment key={n}>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-[#1C232E] flex items-center justify-center font-bold text-xs sm:text-sm ${
                  currentStep === n || currentStep > n
                    ? "text-[var(--color-background)] bg-[#1C232E]"
                    : "text-[#1C232E] bg-transparent"
                }`}
              >
                {n}
              </div>
              <span
                className={`mt-1 sm:mt-2 text-xs text-[#1C232E] text-center max-w-16 sm:max-w-20 ${
                  currentStep === n ? " font-semibold" : ""
                }`}
              >
                {label}
              </span>
            </div>
            {n < steps.length && (
              <div className="border-t border-2 border-dashed border-[#1C232E] flex-1 mt-[-12px] sm:mt-[-24px]"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
