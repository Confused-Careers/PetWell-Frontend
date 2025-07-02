import React from "react";
import { Pencil, X, Share2 } from "lucide-react";

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
    <div className="bg-[#EDCC79] rounded-xl p-4 w-full max-w-xl shadow flex flex-col gap-2 relative min-h-[160px] justify-between py-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[24px] font-semibold text-[#1C232E]">
            {name}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-[#1C232E] font-normal">
              {role}
            </span>
            <span className="text-[10px] text-[#1C232E] italic">
               {access} Access
            </span>
          </div>
        </div>
        <div className="flex">
          <div className="flex items-center">
            <button
             title="Share Username & Password"
              onClick={onEdit}
              className="rounded hover:bg-[var(--color-border)]"
            >
              <Pencil className="h-4 text-[#1C232E]" />
            </button>
            <button
              title="Delete Care Team Member"
              onClick={onDelete}
              className="rounded hover:bg-[var(--color-border)]"
            >
              <X className="h-4 text-[#1C232E] opacity-60" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Share2 className="w-4 h-4 text-[#1C232E]" />
        <span className="text-sm text-[#1C232E] font-medium">
          Share Username & Password
        </span>
      </div>
    </div>
  );
};

export default CareTeamMemberCard;
