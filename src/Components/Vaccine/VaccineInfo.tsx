import React from "react";
import { BiSolidPencil } from "react-icons/bi";
import { AlertCircle } from "lucide-react";

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
  showEdit = false,
  onEdit,
}) => (
  <div
    className={`border border-[#23272F] rounded-2xl p-4 sm:p-5 flex flex-col min-h-[180px] relative w-full transition-colors ${
      soon ? "bg-[#eed1b2]" : "bg-[#d6d6a1]"
    }`}
    style={{ minHeight: 180 }}
  >
    {showEdit && (
      <button
        className="absolute top-3 right-3 text-[#23272F] p-1.5 rounded-full transition"
        onClick={onEdit}
        aria-label="Edit Vaccine"
      >
        <BiSolidPencil size={20} />
      </button>
    )}
    <div className="text-[1.25rem] sm:text-[1.35rem] md:text-[1.5rem] font-bold text-[#23272F] mb-2 pr-8">
      {name}
    </div>
    <div className="flex flex-row gap-8 mb-2">
      <div>
        <div className="text-[#8a8a8a] text-base sm:text-lg font-normal">
          Administered
        </div>
        <div className="text-[#23272F] font-bold text-lg sm:text-xl">
          {administered}
        </div>
      </div>
      <div>
        <div className="text-[#8a8a8a] text-base sm:text-lg font-normal">
          Expires
        </div>
        <div className="flex items-center text-lg sm:text-xl font-bold">
          {soon ? (
            <span className="text-[#990d0d] flex items-center font-bold">
              {expires}
              <AlertCircle className="ml-1 w-5 h-5 text-[#990d0d]" />
            </span>
          ) : (
            <span className="text-[#23272F]">{expires}</span>
          )}
        </div>
      </div>
    </div>
    <hr className="my-2 border-[#cbb292]" />
    <div className="flex items-center min-h-[28px] text-base sm:text-lg mt-1">
      {soon && warning ? (
        <>
          <AlertCircle className="mr-2 w-5 h-5 text-[#990d0d]" />
          <span className="text-[#990d0d]">{warning}</span>
        </>
      ) : null}
    </div>
  </div>
);

export default VaccineInfo;
