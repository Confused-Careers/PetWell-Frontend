import React, { useRef, useState } from "react";
import { toast } from "sonner";
import businessServices from "../../Services/businessServices";

const AddNewPet: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.toUpperCase();
    setCode(newCode);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter" && code.every((char) => char !== "")) {
      submitCode();
    }
  };

  const submitCode = async () => {
    if (isSubmitting) return;

    const enteredCode = code.join("");
    if (enteredCode.length !== 5) {
      toast.error("Please enter a valid 5-character pet code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await businessServices.createPetMapping({ qr_code_id: enteredCode });
      toast.success(`Pet added successfully. Say Hi! to ${response.pet_name}`);
      setCode(["", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error.message || "Failed to add pet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#6A8293] rounded-2xl p-6 flex flex-col items-center w-full max-w-md min-w-[430px] h-[230px] justify-center">
      <p className="text-[#1C232E] text-[20px] font-cabin font-[400] text-center mb-4">
        Enter the 5-character code shared by the pet parent to view their profile.
      </p>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            disabled={isSubmitting}
            className="w-14 h-16 rounded-xl bg-[#FFF8E5] text-[var(--color-business-heading)] text-2xl font-cabin text-center focus:outline-none border border-[var(--color-business-blue,#6A8293)] shadow-sm"
            value={code[i]}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            ref={(el) => (inputRefs.current[i] = el)}
          />
        ))}
      </div>
    </div>
  );
};

export default AddNewPet;