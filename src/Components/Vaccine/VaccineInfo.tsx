import React from "react";
import { BiSolidPencil } from "react-icons/bi";
import { AlertCircle, LucideAlertCircle } from "lucide-react";
import { MdError } from "react-icons/md";

interface VaccineInfoProps {
  name: string;
  administered: string;
  expires: string;
  soon?: boolean;
  warning?: string;
  showEdit?: boolean;
  onEdit?: () => void;
}

const VaccineInfo: React.FC<VaccineInfoProps> = ({
  name,
  administered,
  expires,
  soon,
  warning,
  showEdit,
  onEdit,
}) => (
  <div
    className={`relative flex flex-col min-h-[220px] w-full transition-colors p-5 rounded-2xl ${
      soon
        ? "bg-[var(--color-card-vaccine-red)]"
        : "bg-[var(--color-card-vaccine-green)]"
    } border border-[var(--color-text)]`}
    style={{ minHeight: 220 }}
  >
    {/* Edit icon */}
    {showEdit && (
      <button
        className="cursor-pointer absolute top-4 right-4 text-[var(--color-text)] p-1.5 rounded-full transition hover:bg-[var(--color-card)]"
        aria-label="Edit Vaccine"
        tabIndex={0}
        onClick={onEdit}
      >
        <BiSolidPencil size={20} />
      </button>
    )}
    <div className="text-2xl font-semibold text-[var(--color-text)] mb-2 pr-8">
      {name}
    </div>
    <div className="flex flex-row gap-8 mb-2">
      <div>
        <div className="text-[#70655f] text-normal font-normal">
          Administered
        </div>
        <div className="text-[var(--color-text)] font-semibold text-lg sm:text-xl">
          {administered}
        </div>
      </div>
      <div>
        <div className="text-[#70655f] text-normal font-normal">Expires</div>
        <div className="flex items-center text-lg sm:text-xl font-semibold">
          {soon ? (
            <span className="text-[var(--color-warning)] flex items-center font-semibold">
              {expires}
              <MdError className="mr-2 w-5 h-5 min-w-[20px] min-h-[20px] text-[var(--color-warning)]" />
            </span>
          ) : (
            <span className="text-[var(--color-text)]">{expires}</span>
          )}
        </div>
      </div>
    </div>
    <hr className="my-2 border-[#cbb292]" />
    <div className="flex items-center min-h-[28px] text-normal mt-1">
      {soon && warning ? (
        <>
          <MdError className="mr-2 w-5 h-5 min-w-[20px] min-h-[20px] text-[var(--color-warning)]" />
          <span className="text-[var(--color-warning)]">{warning}</span>
        </>
      ) : null}
    </div>
  </div>
);

export default VaccineInfo;
