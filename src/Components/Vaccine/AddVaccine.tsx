import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import {  UploadIcon } from "lucide-react";
import vaccineServices from "../../Services/vaccineServices";

interface AddVaccineProps {
  onCancel?: () => void;
  onSubmit?: (data: any) => void;
  petId: string;
}

const AddVaccine: React.FC<AddVaccineProps> = ({
  onCancel,
  onSubmit,
  petId,
}) => {
  const [vaccine, setVaccine] = useState("");
  const [administered, setAdministered] = useState("");
  const [expiry, setExpiry] = useState("");
  const [staffName, setStaffName] = useState("");
  const [verified, setVerified] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [manualError, setManualError] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  // Helper: check if any manual field is filled
  const isManualFilled = Boolean(
    vaccine || administered || expiry || staffName
  );

  // When a file is uploaded, fetch vaccine details and auto-fill
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileLoading(true);
      setManualError(null);
      try {
        const details = await vaccineServices.getVaccinesDetails(
          selectedFile,
          petId
        );
        setVaccine(details.vaccine_name || "");
        setAdministered(details.date_administered || "");
        setExpiry(details.expiry_date || "");
        setWarning(details.warning || null)

        // Optionally set staff name if details.administered_by is available
        if (details.administered_by) {
          setStaffName(details.administered_by);
        }
      } catch (err: any) {
        setManualError(
          "Could not extract vaccine details from file. Please enter manually."
        );
        setVaccine("");
        setAdministered("");
        setExpiry("");
        setStaffName("");
        setFile(null);
      } finally {
        setFileLoading(false);
      }
    } else {
      setFile(null);
    }
  };

  // If any manual field is filled, clear file
  useEffect(() => {
    if (isManualFilled && file) {
      setFile(null);
    }
    // eslint-disable-next-line
  }, [vaccine, administered, expiry, staffName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);
    if (onSubmit) {
      // If no file, require all manual fields and show caution for missing fields
      if (!file) {
        if (!vaccine || !administered || !expiry || !staffName) {
          setManualError(
            "Please fill all manual fields: Vaccine Name, Date Administered, Expiry Date, and Staff Name."
          );
          return;
        }
      }

      // Validate verification checkbox
      if (!verified) {
        setManualError(
          "Please check the verification box to confirm the information is correct"
        );
        return;
      }

      onSubmit({
        vaccine,
        administered,
        expiry,
        staffName,
        verified,
        file: file || undefined, // Ensure file is undefined if not provided
      });
    }
  };

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-full mb-6">
        <svg className="size-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="60" fill="#3C2A17" />
          <path d="M60.6838 38.5917C61.416 37.8594 62.603 37.8594 63.3352 38.5917L81.4104 56.6659C82.1426 57.3981 82.1426 58.586 81.4104 59.3182C80.6782 60.0504 79.491 60.05 78.759 59.3182L76.0676 56.6268L70.1574 62.537C69.0368 62.2737 67.8681 62.1337 66.6672 62.1337C58.2727 62.1339 51.468 68.9393 51.468 77.3339C51.468 78.5122 51.601 79.6594 51.8547 80.7606C50.8355 81.5368 49.598 81.9589 48.2951 81.9589H40.6945L31.2014 91.451C30.4691 92.1833 29.2821 92.1833 28.55 91.451C27.818 90.7188 27.8179 89.5318 28.55 88.7997L38.0432 79.3075V71.7059C38.0432 70.1323 38.656 68.6526 39.7688 67.5399L42.2873 65.0214L45.299 68.0341C46.0312 68.7663 47.2191 68.7663 47.9514 68.0341C48.6835 67.3019 48.6833 66.115 47.9514 65.3827L44.9387 62.37L49.3166 57.9921L52.3283 61.0048C53.0606 61.737 54.2485 61.737 54.9807 61.0048C55.7126 60.2726 55.7126 59.0856 54.9807 58.3534L51.968 55.3407L56.3459 50.9628L59.3576 53.9755C60.0899 54.7077 61.2778 54.7077 62.01 53.9755C62.7419 53.2433 62.7419 52.0563 62.01 51.3241L58.9973 48.3114L63.3742 43.9335L60.6838 41.243C59.9516 40.5108 59.9516 39.3239 60.6838 38.5917Z" fill="#EBD5BD" />
          <path d="M66.8449 64.8C64.3309 64.8 61.8733 65.5455 59.783 66.9423C57.6926 68.339 56.0634 70.3242 55.1014 72.6468C54.1393 74.9694 53.8876 77.5252 54.378 79.9909C54.8685 82.4566 56.0791 84.7215 57.8568 86.4992C59.6345 88.2769 61.8994 89.4875 64.3651 89.9779C66.8308 90.4684 69.3865 90.2167 71.7092 89.2546C74.0318 88.2925 76.017 86.6633 77.4137 84.573C78.8104 82.4827 79.5559 80.0251 79.5559 77.5111C79.552 74.1412 78.2115 70.9104 75.8286 68.5274C73.4456 66.1445 70.2148 64.804 66.8449 64.8ZM72.6226 78.6667H68.0004V83.2889C68.0004 83.5953 67.8787 83.8893 67.662 84.106C67.4453 84.3227 67.1513 84.4444 66.8449 84.4444C66.5384 84.4444 66.2445 84.3227 66.0278 84.106C65.8111 83.8893 65.6893 83.5953 65.6893 83.2889V78.6667H61.0671C60.7606 78.6667 60.4667 78.5449 60.25 78.3282C60.0333 78.1115 59.9116 77.8176 59.9116 77.5111C59.9116 77.2046 60.0333 76.9107 60.25 76.694C60.4667 76.4773 60.7606 76.3556 61.0671 76.3556H65.6893V71.7334C65.6893 71.4269 65.8111 71.133 66.0278 70.9163C66.2445 70.6996 66.5384 70.5778 66.8449 70.5778C67.1513 70.5778 67.4453 70.6996 67.662 70.9163C67.8787 71.133 68.0004 71.4269 68.0004 71.7334V76.3556H72.6226C72.9291 76.3556 73.223 76.4773 73.4397 76.694C73.6564 76.9107 73.7782 77.2046 73.7782 77.5111C73.7782 77.8176 73.6564 78.1115 73.4397 78.3282C73.223 78.5449 72.9291 78.6667 72.6226 78.6667Z" fill="#EBD5BD" />
          <path d="M91.4507 41.3306L78.6697 28.5497C77.9375 27.8174 76.7503 27.8174 76.018 28.5497C75.2858 29.2819 75.2858 30.4691 76.018 31.2013L81.0827 36.2659L73.6973 43.6513L76.3489 46.303L83.7343 38.9176L88.7991 43.9823C89.5311 44.7145 90.7184 44.7147 91.4507 43.9823C92.1828 43.25 92.1828 42.0628 91.4507 41.3306Z" fill="#EBD5BD" />
        </svg>

        <p className="text-2xl mt-6 font-lighter flex items-center gap-3 font-serif">
          Add Vaccine
        </p>
        <p className=" text-[var(--color-text)] font-normal mb-6 text-center max-w-xl">
          Start by uploading a document or fill in the vaccine info manually.
        </p>
      </div>
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Upload Card */}
        <div className="w-full border bg-[var(--color-card)] rounded-xl shadow-lg p-6 flex flex-col items-center mb-4">
          <label
            htmlFor="vaccine-upload"
            className={`flex flex-col items-center cursor-pointer w-full ${isManualFilled ? "opacity-50 pointer-events-none" : ""
              }`}
          >
            <label
            onClick={()=>document.getElementById('vaccine-upload-id')?.click()}
              htmlFor="file-upload"
              className="flex flex-row gap-3 items-center cursor-pointer"
            >            <UploadIcon
                className={`w-7 h-7 mb-1 text-light transition-colors text-[var(--color-text)]`}
              />
              <span className="text-xl font-semibold text-[var(--color-text)] mb-2">
                Upload vaccine document
              </span>

            </label>
            <label className="mt-2 text-sm text-[var(--color-text)]">
              Supported formats: PDF, JPG, PNG, DOC (Max 10MB each)
            </label>
            <Input
              id="vaccine-upload-id"
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              disabled={isManualFilled}
            />
            {fileLoading && (
              <span className="text-xs text-[var(--color-primary)] mt-2">
                Extracting details...
              </span>
            )}
          </label>
        </div>
        {/* Divider with Or */}
        <div className="w-full flex items-center my-4">
          <hr className="flex-1 h-[1px] opacity-50 bg-[var(--color-card)]" />
          <span className="mx-4 text-[var(--color-text)]">Or</span>
          <hr className="flex-1 h-[1px] opacity-50 bg-[var(--color-card)]" />
        </div>
        {/* Form */}
         {manualError && (
          <div className="w-full max-w-md mb-4 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 rounded py-2 px-3 text-sm animate-fade-in">
            {manualError}
          </div>
        )}
        {warning && (
          <div className="w-full rounded-lg max-w-md mb-4 text-center text-[var(--color-warning)] bg-[var(--color-warning)]/10 py-2 px-3 text-sm animate-fade-in font-bold">
            ! {warning}
          </div>
        )}
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
            >
              Vaccine Name
            </label>
            <Input
className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              type="text"
              value={vaccine}
              onChange={(e) => setVaccine(e.target.value)}
              placeholder="Enter vaccine name"
              disabled={!!file}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
            >
              Date Administered
            </label>
            <Input
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              type="date"
              value={administered}
              onChange={(e) => setAdministered(e.target.value)}
              placeholder="Select Date"
              disabled={!!file}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
            >
              Expiry Date
            </label>
            <Input
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="Select Date"
              disabled={!!file}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"
            >
              Administered By
            </label>
            <Input
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2 focus:ring-none transition-all duration-200"
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="Enter doctor's name"
              disabled={!!file}
            />
          </div>
          <div className="flex items-start gap-2 mt-2">
            <input
              id="verify-checkbox"
              type="checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              className="accent-[var(--color-card-button)] w-2 h-2 cursor-pointer"
            />
            <label
              htmlFor="verify-checkbox"
              className="text-[#1C232E] text-sm font-[Cabin,sans-serif] font-medium"

            >
              By selecting this box, I verify that the information here is
              correct and verifiable by a third party if needed.
            </label>
          </div>
          <div className="w-full mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
              <button 
                type="button"
                onClick={onCancel} 
                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-[#FFB23E]"
              >
                Cancel
              </button>
              <button
                type="submit"
                                className="w-full font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"

              >
                Add Vaccine
              </button>
            </div>
          
        </form>
      </div>
    </div >
  );
};

export default AddVaccine;
