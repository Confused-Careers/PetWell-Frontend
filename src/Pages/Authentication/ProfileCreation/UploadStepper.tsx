import React from "react";

interface UploadStepperProps {
  currentStep: 'step4' | 'step5' | 'upload';
}

const steps = [
  "Human Info",
  "Verification",
  "Upload Docs",
];

const getStepNumber = (step: 'step4' | 'step5' | 'upload') => {
  switch (step) {
    case 'step4': return 1;
    case 'step5': return 2;
    case 'upload': return 3;
    default: return 1;
  }
};

const UploadStepper: React.FC<UploadStepperProps> = ({ currentStep }) => {
  const currentStepNumber = getStepNumber(currentStep);
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-2 mb-6 sm:mb-8 w-full max-w-2xl sm:max-w-3xl px-4">
      {steps.map((label, idx) => {
        const n = idx + 1;
        return (
          <React.Fragment key={n}>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-[#EBD5BD] flex items-center justify-center font-bold text-xs sm:text-sm ${
                  currentStepNumber === n || currentStepNumber > n
                    ? "text-[#1C232E] bg-[#EBD5BD]"
                    : "text-[#EBD5BD] bg-transparent"
                }`}
              >
                {n}
              </div>
              <span
                className={`mt-1 sm:mt-2 text-xs text-[#EBD5BD] text-center max-w-16 sm:max-w-20 ${
                  currentStepNumber === n ? " font-semibold" : ""
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

export default UploadStepper; 