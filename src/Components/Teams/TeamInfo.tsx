import React from "react";
import { X} from "lucide-react";

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
  const avatar = business.profile_picture_document_id
    ? `/api/v1/documents/${business.profile_picture_document_id}`
    : `https://randomuser.me/api/portraits/men/${
        Math.floor(Math.random() * 100) + 1
      }.jpg`;

  return (
    <div
      className="bg-[var(--color-card-team)] border border-[var(--color-border)] rounded-2xl px-6 py-5 flex flex-col gap-3 relative min-w-0 max-w-full w-full overflow-hidden"
      style={{ minHeight: 180 }}
    >
      {/* Delete button */}
      {onDelete && (
        <button
          className="absolute top-4 right-4 text-2xl text-[var(--color-text)] hover:text-[var(--color-warning)] bg-transparent border-none cursor-pointer p-0 m-0"
          onClick={onDelete}
          aria-label="Remove Team"
        >
          <X className="w-7 h-7" />
        </button>
      )}
      {/* Header: Avatar + Name + Type */}
      <div className="flex items-center gap-4 mb-2 min-w-0 max-w-full">
        <img
          src={avatar}
          alt={name}
          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex flex-col flex-1 min-w-0 max-w-full">
          <span className="font-bold text-2xl text-[var(--color-text)] leading-tight whitespace-nowrap w-fit">
            {name}
          </span>
          <span className="flex px-2 py-1 justify-start items-center gap-2 bg-[#6A8293] text-white font-semibold mt-2 rounded w-fit text-sm">
            {type}
          </span>
        </div>
      </div>
      {/* Details: Two-column for phone/email, address below */}
      <div className="flex flex-row gap-8 mb-2 min-w-0 max-w-full">
        <div className="flex flex-col min-w-0 max-w-full">
          <span className="text-[var(--color-text)]/70 text-base font-normal">
            Phone
          </span>
          <span className="text-[var(--color-text)] text-xl font-bold max-w-full">
            {phone}
          </span>
        </div>
        <div className="flex flex-col min-w-0 max-w-full">
          <span className="text-[var(--color-text)]/70 text-base font-normal">
            Email
          </span>
          <span className="text-[var(--color-text)] text-base font-bold max-w-full">
            {email}
          </span>
        </div>
      </div>
      <div className="flex flex-col mt-1 min-w-0 max-w-full">
        <span className="text-[var(--color-text)]/70 text-base font-normal">
          Address
        </span>
        <span className="text-[var(--color-text)] text-base font-bold max-w-full">
          {address}
        </span>
      </div>
    </div>
  );
};

export default TeamBox;
