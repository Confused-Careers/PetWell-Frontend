import React from "react";
import { Pencil, X, Share2, PencilIcon, PencilOffIcon, LucidePencil, Edit, Edit2, Edit2Icon } from "lucide-react";

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

}) => {
  return (
    <div className="bg-[#faebc5] border rounded-xl p-4 w-full max-w-xl shadow flex flex-col gap-2 relative min-h-[160px] justify-between">
      <div className="flex items-start gap-3 justify-between">
        <div className="flex-1">
          <div className="text-[24px] font-semibold text-[#1C232E]">
            {name}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[#1C232E] bg-[#EDCC79] p-0.5 px-1 rounded-sm font-normal">
              {role}
            </span>
            <span className="text-xs text-[#1C232E] italic">
               {access} Access
            </span>
          </div>
        </div>
        <div>
          <div className="flex gap-3 justify-center items-center">
            <div
             title="Share Username & Password"
              onClick={onEdit}
              className="rounded hover:bg-[var(--color-border)] cursor-pointer"
            >
              <Edit2Icon className="size-4 opacity-60" fill="text-[#1C232E]" />
            </div>
            <div
              title="Delete Care Team Member"
              onClick={onDelete}
              className="rounded hover:bg-[var(--color-border)] cursor-pointer"
            >
              <X className="size-4 text-[#1C232E] opacity-60" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Share2 className="size-4" fill="text-[#1C232E]"/>
        <span className="text-sm text-[#1C232E] font-medium">
          Share Username & Password
        </span>
      </div>
    </div>
  );
};

export default CareTeamMemberCard;
