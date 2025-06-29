import React from "react";
import TeamBox from "./TeamInfo";

interface Team {
  id: string;
  business: {
    business_name: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    profile_picture_document_id?: string;
  };
  pet: {
    id: string;
    pet_name: string;
  };
}

interface TeamSectionProps {
  teams: Team[];
  onAddTeam?: () => void;
  onDeleteTeam?: (index: number) => void;
  onViewAll?: () => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  teams,
  onAddTeam,
  onDeleteTeam,
  onViewAll,
}) => {
  return (
    <section className="mb-6 sm:mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-4">
        {teams.map((team, idx) => (
          <TeamBox
            key={team.id}
            team={team}
            onDelete={onDeleteTeam ? () => onDeleteTeam(idx) : undefined}
          />
        ))}
      </div>
      <div className="mt-2">
        <a
          href="#"
          className="text-[var(--color-primary)] font-medium hover:underline text-sm sm:text-base"
          onClick={(e) => {
            e.preventDefault();
            onViewAll && onViewAll();
          }}
        >
          View All Teams &gt;
        </a>
      </div>
    </section>
  );
};

export default TeamSection;
