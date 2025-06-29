import React from "react";
import { Pencil, Syringe } from "lucide-react";

interface VaccineInfoProps {
  name: string;
  administered: string;
  expires: string;
  soon?: boolean;
  warning?: string;
  // If true, show select checkbox (for selection page)
  showSelect?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  // If true, show edit button (for home/other pages)
  showEdit?: boolean;
  onEdit?: () => void;
}

const VaccineInfo: React.FC<VaccineInfoProps> = ({
  name,
  administered,
  expires,
  soon,
  warning,
  showSelect = false,
  selected = false,
  onSelect,
  showEdit = false,
  onEdit,
}) => (
  <div
    className="bg-[var(--color-card)] rounded-xl shadow-lg p-3 sm:p-4 flex flex-col min-h-[100px] sm:min-h-[120px] relative h-full min-w-0 transition-colors"
    style={{ minHeight: 160, height: "100%" }}
  >
    <div className="flex items-center mb-2">
      <span role="img" aria-label="edit">
        <Syringe size={18} className="sm:w-5 sm:h-5" />
      </span>{" "}
      {showSelect && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="absolute right-2 sm:right-3 md:right-4 accent-[var(--color-primary)] w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 cursor-pointer"
          aria-label="Select Vaccine"
        />
      )}
      {showEdit && (
        <button
          className="absolute right-2 sm:right-3 md:right-4 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] rounded-full p-1.5 sm:p-2 transition"
          onClick={onEdit}
          aria-label="Edit Vaccine"
        >
          <span role="img" aria-label="edit">
            <Pencil size={16} className="sm:w-5 sm:h-5" />
          </span>
        </button>
      )}
    </div>
    <div>
      <span className="font-bold text-base sm:text-lg flex-1 text-[var(--color-text)]">
        {name}
      </span>
    </div>
    <div className="flex flex-col justify-between text-xs sm:text-sm text-[var(--color-secondary-foreground)] mt-2 gap-2">
      <div>
        <div className="font-semibold">Administered</div>
        <div>{administered}</div>
      </div>
      <div>
        <div className="font-semibold">Expires</div>
        <div className="flex items-center">
          {expires}
          {soon && (
            <span
              className="ml-1 text-[var(--color-warning)]"
              title="Expiring soon"
            >
              ❗
            </span>
          )}
        </div>
      </div>
    </div>
    {soon && warning && (
      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-[var(--color-warning)] flex items-center min-h-[20px] sm:min-h-[24px]">
        <span className="mr-1 sm:mr-2">❗</span>
        <span>{warning}</span>
      </div>
    )}
  </div>
);

export default VaccineInfo;
