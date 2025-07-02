import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Syringe, UploadCloud } from "lucide-react";
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
        <Syringe className="w-16 h-16 text-[var(--color-primary)] mb-4" />
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2 text-[var(--color-text)]">
          Add Vaccine
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text)] opacity-80 mb-6 text-center max-w-xl">
          Start by uploading a document or fill in the vaccine info manually.
        </p>
      </div>
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Upload Card */}
        <div className="w-full bg-[var(--color-card)] rounded-xl shadow-lg p-6 flex flex-col items-center mb-4">
          <label
            htmlFor="vaccine-upload"
            className={`flex flex-col items-center cursor-pointer w-full ${
              isManualFilled ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <UploadCloud className="w-8 h-8 mb-2 text-[var(--color-primary)]" />
            <span className="text-base text-[var(--color-text)] font-medium mb-1">
              Upload vaccine document
            </span>
            <span className="text-xs text-[var(--color-text)] opacity-70 mb-2">
              Supported formats: PDF, JPG, PNG, DOC.
            </span>
            <Input
              id="vaccine-upload"
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
          <div className="flex-1 h-px bg-[var(--color-card)]" />
          <span className="mx-4 text-[var(--color-text)] opacity-70">Or</span>
          <div className="flex-1 h-px bg-[var(--color-card)]" />
        </div>
        {/* Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>

          {warning && (
            <div className="bg-white border border-right-300 text-red-600 px-4 py-2 rounded mb-4">
              ! {warning}
            </div>
          )}
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1">
              Vaccine Name
            </label>
            <Input
              className="w-full rounded-lg px-4 py-2 bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] mb-2"
              type="text"
              value={vaccine}
              onChange={(e) => setVaccine(e.target.value)}
              placeholder="Enter vaccine name"
              disabled={!!file}
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1">
              Date Administered
            </label>
            <Input
              className="w-full rounded-lg px-4 py-2 bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] mb-2"
              type="date"
              value={administered}
              onChange={(e) => setAdministered(e.target.value)}
              placeholder="Select Date"
              disabled={!!file}
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1">
              Expiry Date
            </label>
            <Input
              className="w-full rounded-lg px-4 py-2 bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] mb-2"
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="Select Date"
              disabled={!!file}
            />
          </div>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1">
              Administered By
            </label>
            <Input
              className="w-full rounded-lg px-4 py-2 bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] mb-2"
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
              className="mt-1 accent-[var(--color-primary)]"
            />
            <label
              htmlFor="verify-checkbox"
              className="text-[var(--color-text)] text-xs"
            >
              By selecting this box, I verify that the information here is
              correct and verifiable by a third party if needed.
            </label>
          </div>
          {manualError && (
            <div className="text-xs text-red-500 mb-2">{manualError}</div>
          )}
          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              className="flex-1 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg py-2 font-semibold hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition bg-transparent"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[var(--color-primary)] text-[var(--color-background)] font-semibold rounded-lg py-2 hover:brightness-110 transition"
            >
              Add Vaccine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVaccine;
