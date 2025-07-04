import React, { useRef, useState } from "react";
import { toast } from "sonner";
import businessServices from "../../Services/businessServices";
import { RiQrScan2Line } from "react-icons/ri";
import { Scanner } from '@yudiel/react-qr-scanner';
import { MdCancel } from "react-icons/md";

const AddNewPet: React.FC = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
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

  const handleScan = (result: any) => {
    if (result && result[0]?.rawValue) {
      const scannedCode = result[0].rawValue;
      // Validate that the scanned code is exactly 5 digits
      if (/^[a-zA-Z0-9]{5}$/.test(scannedCode)) {
        const newCode = scannedCode.toUpperCase().split("");
        setCode(newCode);
        setIsScannerOpen(false);
        toast.success("QR code scanned successfully!");
        inputRefs.current[0]?.focus();
      } else {
        toast.error("Invalid QR code. Please scan a 5-character code.");
      }
    }
  };

  const handleScanError = (err: any) => {
    console.error(err);
    toast.error("Error accessing camera. Please ensure permissions are granted.");
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
      <div className="flex flex-row items-center mb-4 w-full">
        <p className="text-[#FFF8E5] text-[20px] font-cabin font-[400] text-start ml-4.5 flex-1">
          Enter the code shared by the pet parent.
        </p>
        <button
          className="w-[30%] bg-[#FFB23E] text-black flex items-center justify-center ml-4 text-[16px] font-[500] px-2 rounded-[80px]"
          onClick={() => setIsScannerOpen(true)}
        >
          <RiQrScan2Line className="mr-2" /> Scan QR
        </button>
      </div>
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
            ref={(el) => { inputRefs.current[i] = el; }}
          />
        ))}
      </div>

      {isScannerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-[#FFF8E5] rounded-lg p-4 w-[90%] max-w-[400px] relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-black text-xl font-bold h-5 w-5 z-10"
              onClick={() => setIsScannerOpen(false)}
              tabIndex={0}
              aria-label="Close scanner"
            >
              <MdCancel />
            </button>
            <div className="w-full h-[300px] relative p-6">
              <Scanner
                onScan={handleScan}
                onError={handleScanError}
                constraints={{ facingMode: "environment" }}
                formats={["qr_code"]}
                styles={{
                  container: { width: "100%", height: "100%" },
                  video: { width: "100%", height: "100%", objectFit: "cover" },
                }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  border: "2px solid #FFB23E",
                  width: "200px",
                  height: "200px",
                  margin: "auto",
                }}
              />
            </div>
            <p className="text-center text-black mt-2">
              Center the QR code within the square
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewPet;