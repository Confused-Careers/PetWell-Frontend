import React, { useState } from "react";
import { Syringe } from "lucide-react";
import vaccineServices from "../../Services/vaccineServices";

interface EditVaccineModalProps {
  open: boolean;
  onClose: () => void;
  vaccine: any;
  onSuccess?: () => void;
}

const EditVaccineModal: React.FC<EditVaccineModalProps> = ({
  open,
  onClose,
  vaccine,
  onSuccess,
}) => {
  const [vaccineName, setVaccineName] = useState(
    vaccine?.vaccine_name || vaccine?.name || ""
  );
  const [dateAdministered, setDateAdministered] = useState(
    vaccine?.date_administered || vaccine?.administered || ""
  );
  const [dateDue, setDateDue] = useState(
    vaccine?.date_due || vaccine?.expires || ""
  );
  const [administeredBy, setAdministeredBy] = useState(
    vaccine?.administered_by || "Dr. John Doe"
  );
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!vaccineName || !dateAdministered || !dateDue || !administeredBy) {
        setError("Please fill in all required fields");
        return;
      }

      // Validate verification checkbox
      if (!verified) {
        setError(
          "Please check the verification box to confirm the information is correct"
        );
        return;
      }

      const updateData = {
        vaccine_name: vaccineName,
        date_administered: dateAdministered,
        date_due: dateDue,
        administered_by: administeredBy,
        staff_id: vaccine?.staff_id || "",
      };

      await vaccineServices.updateVaccine(vaccine.id, updateData);
      setSuccess("Vaccine updated successfully!");

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update vaccine");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this vaccine?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await vaccineServices.deleteVaccine(vaccine.id);
      setSuccess("Vaccine deleted successfully!");

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete vaccine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[#232b3e] rounded-2xl shadow-2xl px-10 py-8 w-full max-w-md flex flex-col items-center">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-2xl text-[#EBD5BD] hover:text-[#FFA500]"
          onClick={onClose}
          disabled={loading}
        >
          &times;
        </button>

        {/* Syringe Icon */}
        <Syringe className="w-12 h-12 mb-4 text-[#EBD5BD]" />
        <h2 className="text-2xl font-serif font-semibold text-[#EBD5BD] mb-6">
          Edit Vaccine
        </h2>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="w-full bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#EBD5BD] text-sm mb-1">
              Vaccine Name *
            </label>
            <input
              className="w-full rounded-lg px-4 py-2 bg-[#181f32] text-[#EBD5BD] font-semibold text-base border border-[#232b41] mb-2"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-[#EBD5BD] text-sm mb-1">
              Date Administered *
            </label>
            <input
              className="w-full rounded-lg px-4 py-2 bg-[#181f32] text-[#EBD5BD] border border-[#232b41] mb-2"
              type="date"
              value={dateAdministered}
              onChange={(e) => setDateAdministered(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-[#EBD5BD] text-sm mb-1">
              Expiry Date *
            </label>
            <input
              className="w-full rounded-lg px-4 py-2 bg-[#181f32] text-[#EBD5BD] border border-[#232b41] mb-2"
              type="date"
              value={dateDue}
              onChange={(e) => setDateDue(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-[#EBD5BD] text-sm mb-1">
              Administered By *
            </label>
            <input
              className="w-full rounded-lg px-4 py-2 bg-[#181f32] text-[#EBD5BD] border border-[#232b41] mb-2"
              type="text"
              value={administeredBy}
              onChange={(e) => setAdministeredBy(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              className="mt-1 accent-[#FFA500]"
              id="verify-checkbox"
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="verify-checkbox" className="text-[#EBD5BD] text-xs">
              By selecting this box, I verify that the information here is
              correct and verifiable by a third party if needed.
            </label>
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              className="flex-1 py-3 rounded-lg bg-transparent border border-red-600 text-red-600 font-semibold text-lg hover:bg-red-600 hover:text-white transition disabled:opacity-50"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Vaccine"}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-[#FFA500] text-white font-semibold text-lg hover:brightness-110 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVaccineModal;
