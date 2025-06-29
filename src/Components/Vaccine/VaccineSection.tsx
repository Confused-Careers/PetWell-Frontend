import React from "react";
import VaccineInfo from "./VaccineInfo";

interface Vaccine {
  name: string;
  administered: string;
  expires: string;
  soon?: boolean;
  warning?: string;
}

interface VaccineBoxProps {
  vaccines: Vaccine[];
  onEditVaccine?: (idx: number) => void;
  onViewAll?: () => void;
}

const VaccineSection: React.FC<VaccineBoxProps> = ({
  vaccines,
  onEditVaccine,
  onViewAll,
}) => {
  return (
    <section className="mb-6 sm:mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-4">
        {vaccines.map((vaccine, idx) => (
          <div key={idx}>
            <VaccineInfo
              name={vaccine.name}
              administered={vaccine.administered}
              expires={vaccine.expires}
              soon={vaccine.soon}
              warning={vaccine.warning}
              showEdit={true}
              onEdit={onEditVaccine ? () => onEditVaccine(idx) : undefined}
            />
          </div>
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
          View All Vaccines &gt;
        </a>
      </div>
    </section>
  );
};

export default VaccineSection;
