import React from "react";
import VaccineInfo from "./VaccineInfo";
import { IoIosArrowDroprightCircle } from "react-icons/io";

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
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {vaccines.map((vaccine, idx) => (
          <div key={idx} className="w-full flex">
            <VaccineInfo
              name={vaccine.name}
              administered={vaccine.administered}
              expires={vaccine.expires}
              soon={vaccine.soon}
              warning={vaccine.warning}
              showEdit={!!onEditVaccine}
              onEdit={onEditVaccine ? () => onEditVaccine(idx) : undefined}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-start">
        <a
          href="#"
          className="text-[var(--color-primary)] font-medium text-base flex items-center gap-1 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            onViewAll && onViewAll();
          }}
        >
          View All Vaccines <IoIosArrowDroprightCircle />
        </a>
      </div>
    </section>
  );
};

export default VaccineSection;
