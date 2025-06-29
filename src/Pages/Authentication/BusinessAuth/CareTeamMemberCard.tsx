import React from 'react';
import { Pencil, X, Share2 } from 'lucide-react';

interface CareTeamMemberCardProps {
  name: string;
  role: string;
  access: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

const CareTeamMemberCard: React.FC<CareTeamMemberCardProps> = ({
  name,
  role,
  access,
  onEdit,
  onDelete,
  onShare,
}) => {
  return (
    <div className="bg-[#2A2F36] rounded-xl p-6 w-full max-w-xl shadow flex flex-col gap-2 relative">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-cabin text-white font-semibold">{name}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-[#23272F] text-[#FDBA3B] text-xs px-2 py-1 rounded font-cabin">{role}</span>
            <span className="text-xs text-[#EBD5BD] font-cabin italic">{access}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-1 rounded hover:bg-[#23272F]">
            <Pencil className="w-4 h-4 text-[#FDBA3B]" />
          </button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-[#23272F]">
            <X className="w-4 h-4 text-[#A0A0A0]" />
          </button>
        </div>
      </div>
      <hr className="my-3 border-[#393E46]" />
      <button
        onClick={onShare}
        className="flex items-center gap-2 text-[#FDBA3B] font-cabin font-medium text-base hover:underline"
      >
        <Share2 className="w-5 h-5" /> Share Username & Password
      </button>
    </div>
  );
};

export default CareTeamMemberCard; 