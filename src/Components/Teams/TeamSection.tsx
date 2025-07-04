import React from "react";
import TeamBox from "./TeamInfo";
import { IoIosArrowDroprightCircle } from "react-icons/io";

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

  onDeleteTeam,
  onViewAll,
}) => {
  return (
    <section className="mb-6 sm:mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
        {teams.map((team, idx) => (
          <TeamBox
            key={team.id}
            team={team}
            onDelete={onDeleteTeam ? () => onDeleteTeam(idx) : undefined}
          />
        ))}
                        {teams.length==0 && <div>No Teams Added</div>}

      </div>
      {teams.length!=0 && <div className="mt-2">
        <a
          href="#"
          className="text-[var(--color-primary)] font-medium  text-sm sm:text-base flex items-center gap-1"
          onClick={(e) => {
            e.preventDefault();
            onViewAll && onViewAll();
          }}
        >
          View All Teams <IoIosArrowDroprightCircle />
        </a>
      </div>}
    </section>
  );
};

export default TeamSection;
