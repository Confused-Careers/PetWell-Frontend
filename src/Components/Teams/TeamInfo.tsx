import React from "react";
import { X } from "lucide-react";

interface TeamBoxProps {
  team: any; // Accepts raw backend team object
  onDelete?: () => void;
}

const TeamBox: React.FC<TeamBoxProps> = ({ team, onDelete }) => {
  // Debug: log the team object to see what is being passed

  if (!team || !team.business) {
    return (
      <div className="bg-[var(--color-card)] rounded-2xl px-6 py-5 border border-[var(--color-border)] flex flex-col gap-2 relative min-w-0 max-w-full text-center text-red-400">
        No business info found for this team.
      </div>
    );
  }
  const business = team.business;
  const name = business.business_name || "N/A";
  const type = business.description || "Care Provider";
  const phone = business.phone || "";
  const email = business.email || "";
  const address = business.address || "";
  const avatar = business.profilePictureDocument.document_url;
  console.log(business)

  return (
    <div
      className="bg-[var(--color-card-team)] border border-[var(--color-border)] rounded-2xl px-3 py-5 flex flex-col gap-3 relative min-w-0 max-w-full w-full overflow-hidden"
      style={{ minHeight: 180 }}
    >
      {/* Delete button */}
      {onDelete && (
        <button
          className="absolute px-3 py-3 top-2 right-2 text-2xl text-[var(--color-text)] hover:text-[var(--color-warning)] bg-transparent border-none cursor-pointer"
          onClick={onDelete}
          aria-label="Remove Team"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {/* Header: Avatar + Name + Type */}
      <div className="flex items-center gap-4 mb-2 min-w-0 max-w-full">
        <img
          src={avatar}
          alt={name}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-[var(--color-logo)]"
        />
        <div className="flex flex-col flex-1 min-w-0 max-w-full">
          <span className="text-2xl font-semibold text-[var(--color-text)] font-[Cabin,sans-serif] pr-4">
            {name}
          </span>
          <span className="flex px-1 py-1 justify-start items-center bg-[#6A8293] text-white font-semibold mt-2 rounded w-fit text-xs sm:text-xs tracking-wide font-[Cabin,sans-serif]">
            {type}
          </span>
        </div>
      </div>
      {/* Details: Two-column for phone/email, address below */}
      <div className="flex flex-row gap-4 sm:gap-4 mb-2 min-w-0 max-w-full">
        <div className="flex flex-col min-w-0 max-w-full">
          <span className="text-[var(--color-text)]/70 text-xs sm:text-sm font-medium font-[Cabin,sans-serif] tracking-wide mb-1">
            Phone
          </span>
          <span className="text-[var(--color-text)] text-base sm:text-lg font-semibold font-[Cabin,sans-serif] max-w-full">
            {phone}
          </span>
        </div>
        <div className="flex flex-col min-w-0 max-w-full">
          <span className="text-[var(--color-text)]/70 text-xs sm:text-sm font-medium font-[Cabin,sans-serif] tracking-wide mb-1">
            Email
          </span>
          <span className="text-[var(--color-text)] text-sm sm:text-base font-semibold font-[Cabin,sans-serif] max-w-full break-words truncate whitespace-pre-line">
            {email}
          </span>
        </div>
      </div>
      <div className="flex flex-col mt-1 min-w-0 max-w-full">
        <span className="text-[var(--color-text)]/70 text-xs sm:text-sm font-medium font-[Cabin,sans-serif] tracking-wide mb-1">
          Address
        </span>
        <span className="text-[var(--color-text)] text-sm sm:text-base font-semibold font-[Cabin,sans-serif] max-w-full break-words truncate whitespace-pre-line">
          {address}
        </span>
      </div>
    </div>
  );
};

export default TeamBox;
