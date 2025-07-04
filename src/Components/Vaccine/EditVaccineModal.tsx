import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
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

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!vaccineName || !dateAdministered || !dateDue || !administeredBy) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Validate verification checkbox
      if (!verified) {
        toast.error(
          "Please check the verification box to confirm the information is correct"
        );
        setLoading(false);
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
      toast.success("Vaccine updated successfully!");

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update vaccine");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    toast.warning("Are you sure you want to delete this vaccine?", {
      action: {
        label: "Delete",
        onClick: async () => {
          setLoading(true);
          try {
            await vaccineServices.deleteVaccine(vaccine.id);
            toast.success("Vaccine deleted successfully!");
            if (onSuccess) {
              setTimeout(() => {
                onSuccess();
                onClose();
              }, 1500);
            }
          } catch (err: any) {
            toast.error(err.message || "Failed to delete vaccine");
          } finally {
            setLoading(false);
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      duration: 8000,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-modal)]/60 backdrop-blur-sm px-2 sm:px-0">
      <div className="relative bg-[var(--color-background)] rounded-2xl shadow-2xl px-4 sm:px-10 py-3 sm:py-4 w-full max-w-xs sm:max-w-md flex flex-col items-center border border-[var(--color-border)]">
          {/* Close button */}
          <button
            className="absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer text-xl sm:text-2xl text-[var(--color-text)] hover:text-[var(--color-primary)]"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Syringe Icon */}
          <svg
            className="size-10 sm:size-12 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 120"
            fill="none"
          >
            <g clip-path="url(#clip0_801_15457)">
              <path
                d="M24.8296 95.1704C26.2025 96.5433 26.2025 98.7692 24.8296 100.142L6.00152 118.97C4.62879 120.343 2.4027 120.343 1.02973 118.97C-0.343242 117.597 -0.343242 115.371 1.02973 113.998L19.8578 95.1704C21.2307 93.7971 23.4571 93.7976 24.8296 95.1704Z"
                fill="#8CAEE1"
              />
              <path
                d="M80.7104 39.2889C79.3374 37.9159 79.3374 35.6901 80.7104 34.3171L99.53 15.4975C100.903 14.1245 103.129 14.1245 104.502 15.4975C105.875 16.8705 105.875 19.0963 104.502 20.4693L85.6822 39.2889C84.309 40.6621 82.0829 40.6616 80.7104 39.2889Z"
                fill="#608DD0"
              />
              <path
                d="M38.0523 101.172H22.3438C20.4022 101.172 18.8281 99.5978 18.8281 97.6562V81.9477C18.8281 78.9971 19.9773 76.2228 22.0637 74.1364L66.3252 29.8749C67.6979 28.502 69.924 28.502 71.297 29.8749L90.125 48.703C91.498 50.076 91.498 52.3018 90.125 53.6748L45.8638 97.936C43.7771 100.023 41.003 101.172 38.0523 101.172Z"
                fill="#DEE8FF"
              />
              <path
                d="M22.3434 101.172H38.052C41.0025 101.172 43.7768 100.023 45.8634 97.9365L90.1247 53.675C91.4977 52.302 91.4977 50.0762 90.1247 48.7032L80.7105 39.2891L19.8574 100.142C20.4937 100.778 21.3727 101.172 22.3434 101.172Z"
                fill="#B1C7ED"
              />
              <path
                d="M95.1694 58.7203L61.2787 24.8296C59.9058 23.4567 59.9058 21.2308 61.2787 19.8579C62.6515 18.4849 64.8776 18.4849 66.2505 19.8579L100.141 53.7485C101.514 55.1214 101.514 57.3473 100.141 58.7203C98.7682 60.0935 96.5419 60.093 95.1694 58.7203Z"
                fill="#B1C7ED"
              />
              <path
                d="M113.998 29.9657L90.0336 6.00152C88.6607 4.62855 88.6607 2.4027 90.0336 1.02973C91.4064 -0.343242 93.6325 -0.343242 95.0054 1.02973L118.97 24.9941C120.343 26.3671 120.343 28.5929 118.97 29.9659C117.597 31.3389 115.371 31.3384 113.998 29.9657Z"
                fill="#B1C7ED"
              />
              <path
                d="M58.1163 38.0828L63.7648 43.7312C65.1377 45.1042 65.1377 47.33 63.7648 48.703C62.392 50.076 60.1659 50.076 58.793 48.703L53.1445 43.0546L58.1163 38.0828Z"
                fill="#B1C7ED"
              />
              <path
                d="M44.9376 51.2625L50.5861 56.9109C51.959 58.2839 51.959 60.5097 50.5861 61.8827C49.2133 63.2557 46.9872 63.2557 45.6143 61.8827L39.9658 56.2342L44.9376 51.2625Z"
                fill="#B1C7ED"
              />
              <path
                d="M31.757 64.4421L37.4054 70.0906C38.7784 71.4635 38.7784 73.6894 37.4054 75.0624C36.0324 76.4353 33.8063 76.4353 32.4336 75.0624L26.7852 69.4139L31.757 64.4421Z"
                fill="#B1C7ED"
              />
              <path
                d="M100.142 58.7203C101.515 57.3474 101.515 55.1215 100.142 53.7485L83.1964 36.8032L78.2246 41.775L95.1699 58.7203C96.5424 60.0931 98.7687 60.0935 100.142 58.7203Z"
                fill="#8CAEE1"
              />
              <path
                d="M118.971 29.9657C120.344 28.5927 120.344 26.3669 118.971 24.9939L106.988 13.0117L102.017 17.9835L113.999 29.9657C115.371 31.3384 117.597 31.3389 118.971 29.9657Z"
                fill="#8CAEE1"
              />
            </g>
            <defs>
              <clipPath id="clip0_801_15457">
                <rect width="120" height="120" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <h2 className="font-[Alike,serif] text-2xl sm:text-3xl text-[#1C232E] sm:mb-2 mt-2 mb-2 text-center leading-tight">
            Edit Vaccine
          </h2>

          <form
            className="w-full flex flex-col gap-3 sm:gap-4"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-[var(--color-text)] text-xs sm:text-sm mb-1">
                Vaccine Name *
              </label>
              <input
                className="w-full rounded-lg px-3 sm:px-4 py-2 bg-white text-[var(--color-text)] font-semibold text-sm sm:text-base border border-[var(--color-border)] mb-2"
                value={vaccineName}
                onChange={(e) => setVaccineName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-[var(--color-text)] text-xs sm:text-sm mb-1">
                Date Administered *
              </label>
              <input
                className="w-full rounded-lg px-3 sm:px-4 py-2 bg-white text-[var(--color-text)] border border-[var(--color-border)] mb-2 text-sm sm:text-base"
                type="date"
                value={dateAdministered}
                onChange={(e) => setDateAdministered(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-[var(--color-text)] text-xs sm:text-sm mb-1">
                Expiry Date *
              </label>
              <input
                className="w-full rounded-lg px-3 sm:px-4 py-2 bg-white text-[var(--color-text)] border border-[var(--color-border)] mb-2 text-sm sm:text-base"
                type="date"
                value={dateDue}
                onChange={(e) => setDateDue(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-[var(--color-text)] text-xs sm:text-sm mb-1">
                Administered By *
              </label>
              <input
                className="w-full rounded-lg px-3 sm:px-4 py-2 bg-white text-[var(--color-text)] border border-[var(--color-border)] mb-2 text-sm sm:text-base"
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
                className="accent-[var(--color-card-button)] w-3 h-3 sm:w-4 sm:h-4 cursor-pointer"
                id="verify-checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                disabled={loading}
              />
              <label
                htmlFor="verify-checkbox"
                className="text-[var(--color-text)] text-xs sm:text-sm"
              >
                By selecting this box, I verify that the information here is
                correct and verifiable by a third party if needed.
              </label>
            </div>

            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
              <button
                type="button"
                className="w-1/2 cursor-pointer py-2 px-3 sm:px-6 bg-transparent rounded-full border border-[var(--color-warning)] text-[var(--color-warning)] font-semibold text-base sm:text-lg hover:bg-[var(--color-warning)] hover:text-[var(--color-background)] transition disabled:opacity-50"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Vaccine"}
              </button>
              <button
                type="submit"
                className="w-1/2 cursor-pointer text-[var(--color-text)] bg-[var(--color-card-button)] hover:opacity-90 px-0 py-2 rounded-3xl font-semibold transition text-base"
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
