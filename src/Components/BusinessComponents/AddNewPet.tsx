import React, { useRef, useState } from "react";
import { toast } from "sonner";
import businessServices from "../../Services/businessServices";

const AddNewPet: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return; // Allow only alphanumeric

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      if (code.every((char) => char !== "")) {
        submitCode(code.join(""));
      } else {
        toast.error("Please Enter Valid Pet Code.");
      }
    }
  };

  const submitCode = async (enteredCode: string) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response: any = await businessServices.createPetMapping({
        qr_code_id: enteredCode,
      });

      toast.success("Pet added successfully. Say Hi! to " + response?.pet_name);
      setCode(["", "", "", ""]);
    } catch (error: any) {
      toast.error(error?.message || "Some error occured. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--color-business-blue,#6A8293)] rounded-2xl p-6 flex flex-col items-center w-full max-w-xs min-w-[300px] h-[180px] justify-center">
      <p className="text-white text-base font-cabin text-center mb-4">
        Enter the 5-character code shared by the pet parent to view their
        profile.
      </p>
      <div className="flex gap-3">
        {[...Array(5)].map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            disabled={isSubmitting == true}
            className="w-12 h-12 rounded-lg bg-white text-[var(--color-business-heading)] text-2xl font-cabin text-center focus:outline-none border border-[var(--color-business-blue,#6A8293)] shadow-sm"
            value={code[i]}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AddNewPet;
