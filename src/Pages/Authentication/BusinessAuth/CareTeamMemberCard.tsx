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
    <div className="bg-[var(--color-card-team),#F6E7C0] rounded-xl p-4 w-full max-w-xl shadow flex flex-col gap-2 relative">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-base font-semibold text-[var(--color-logo)]">
            {name}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[var(--color-logo)] font-normal">
              {role}
            </span>
            <span className="text-xs text-[var(--color-logo)] font-normal">
              · {access}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-[var(--color-border)]"
          >
            <Pencil className="w-4 h-4 text-[var(--color-logo)]" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-[var(--color-border)]"
          >
            <X className="w-4 h-4 text-[var(--color-logo)] opacity-60" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Share2 className="w-4 h-4 text-[var(--color-logo)]" />
        <span className="text-sm text-[var(--color-logo)] font-medium">
          Share Username & Password
        </span>
      </div>
    </div>
  );
};

export default CareTeamMemberCard;
