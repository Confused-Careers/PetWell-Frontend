import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Syringe } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
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
    <>
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col items-center w-full">
          <Syringe className="w-12 h-12 text-[var(--color-text)] mb-4" />
          <h1 className="text-3xl font-serif font-bold mb-2">Add Vaccine</h1>
          <p className="text-lg opacity-80 mb-8 text-center">
            Start by uploading a document or fill in the vaccine info manually.
          </p>
        </div>
        {/* Upload Card */}
        <Card className="w-full max-w-md bg-[var(--color-card)] rounded-2xl shadow-xl p-8 flex flex-col items-center mb-4">
          <label
            htmlFor="vaccine-upload"
            className={`flex flex-col items-center cursor-pointer w-full ${
              isManualFilled ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <svg
              className="w-8 h-8 mb-2 text-[var(--color-text)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
            <span className="text-lg text-[var(--color-text)] font-medium mb-1">
              Upload vaccine document
            </span>
            <span className="text-sm text-[var(--color-text)] opacity-70 mb-2">
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
        </Card>
        <div className="w-full flex items-center my-4">
          <div className="flex-1 h-px bg-[var(--color-card)]" />
          <span className="mx-4 text-[var(--color-text)] opacity-70">Or</span>
          <div className="flex-1 h-px bg-[var(--color-card)]" />
        </div>
        {/* Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[var(--color-text)] text-sm mb-1">
              Vaccine Name
            </label>
            <input
              className="w-full rounded-lg px-4 py-2 bg-[var(--color-background)] text-[var(--color-text)] border border-[var(--color-border)] mb-2"
              type="text"
              value={vaccine}
              onChange={(e) => setVaccine(e.target.value)}
              placeholder="Enter or select vaccine name"
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
              placeholder="Enter staff name"
              disabled={!!file}
            />
          </div>
          <div className="flex items-start gap-2 mt-2">
            <Checkbox
              id="verify-checkbox"
              checked={verified}
              onCheckedChange={(checked) => setVerified(checked === true)}
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
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition bg-transparent"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[var(--color-primary)] text-white font-semibold text-lg hover:brightness-110 transition"
            >
              Add Vaccine
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddVaccine;
