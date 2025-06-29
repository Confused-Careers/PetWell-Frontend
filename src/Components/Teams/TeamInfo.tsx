import React from "react";

interface TeamBoxProps {
  team: any; // Accepts raw backend team object
  onDelete?: () => void;
}

const TeamBox: React.FC<TeamBoxProps> = ({ team, onDelete }) => {
  // Debug: log the team object to see what is being passed
  console.log('TeamInfo received team:', team);

  if (!team || !team.business) {
    return (
      <div className="bg-[var(--color-card)] rounded-2xl px-4 sm:px-6 md:px-7 py-4 sm:py-5 border border-[var(--color-border)] flex flex-col gap-2 relative min-w-0 max-w-full text-center text-red-400">
        No business info found for this team.
      </div>
    );
  }
  const business = team.business;
  const name = business.business_name || 'N/A';
  const type = business.description || 'Care Provider';
  const phone = business.phone || '';
  const email = business.email || '';
  const address = business.address || '';
  const avatar = business.profile_picture_document_id
    ? `/api/v1/documents/${business.profile_picture_document_id}`
    : `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100) + 1}.jpg`;

  return (
    <div className="bg-[var(--color-card)] rounded-2xl px-4 sm:px-6 md:px-7 py-4 sm:py-5 border border-[var(--color-border)] flex flex-col gap-2 relative min-w-0 max-w-full" style={{minHeight: 180}}>
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <img src={avatar} alt={name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-semibold text-base sm:text-lg text-[var(--color-text)] leading-tight truncate">{name}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] mt-1 w-fit" style={{marginLeft: 2}}>{type}</span>
        </div>
        {onDelete && (
          <button className="text-gray-400 hover:text-[var(--color-danger)] text-2xl sm:text-3xl absolute right-3 sm:right-4 top-3 sm:top-4 p-0 m-0 bg-transparent border-none cursor-pointer" onClick={onDelete} aria-label="Remove Team">×</button>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="text-xs sm:text-sm mb-1 flex flex-col">
          <span className="font-semibold" style={{ color: 'rgba(235, 213, 189, 0.6)' }}>Phone</span>
          <span className="text-[var(--color-text)] font-bold mt-0.5 truncate">{phone}</span>
        </div>
        <div className="text-xs sm:text-sm mb-1 flex flex-col">
          <span className="font-semibold" style={{ color: 'rgba(235, 213, 189, 0.6)' }}>Email</span>
          <span className="text-[var(--color-text)] font-bold mt-0.5 truncate">{email}</span>
        </div>
        <div className="text-xs sm:text-sm mt-1 flex flex-col">
          <span className="font-semibold" style={{ color: 'rgba(235, 213, 189, 0.6)' }}>Address</span>
          <span className="text-[var(--color-text)] font-bold mt-0.5 line-clamp-2">{address}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamBox;
