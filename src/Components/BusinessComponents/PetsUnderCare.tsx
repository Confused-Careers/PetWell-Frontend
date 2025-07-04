import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import businessServices from "../../Services/businessServices";
import { toast } from "sonner";
import { IoIosArrowDroprightCircle, IoIosArrowForward } from "react-icons/io";

interface Pet {
  document_url: string;
  doctor_name: string;
  record_note: string;
  pet_id: any;
  breed_name: string;
  human_owner_phone: string;
  note: string;
  staff_name: string;
  created_at: ReactNode;
  human_owner_name: string;
  id: string;
  pet_name: string;
  image?: string;
  breed?: string;
  owner?: string;
  phone?: string;
  added_on: string;
  last_visit?: string;
  doctor?: string;
  notes?: string;
  is_under_care?: boolean;
}

const PetsUnderCare: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPets = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await businessServices.getPetMappings({ limit: 10, page: 1 });
      const petsData = response as unknown as Pet[];
      setPets(petsData);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch pets under care.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="overflow-x-auto bg-[#EDCC79]/50 rounded-2xl py-3 px-6 w-full mb-12 border border-black font-[cabin, serif]">
      <table className="min-w-full text-left font-cabin mb-4 ">
        <thead>
          <tr className="text-[#1C232E] text-base font-bold">
            <th className="py-3 px-4 font-bold text-center">Pet Name</th>
            <th className="py-3 px-4 font-bold text-center">Breed</th>
            <th className="py-3 px-4 font-bold text-center">Owner Name</th>
            <th className="py-3 px-4 font-bold text-center">Phone</th>
            <th className="py-3 px-4 font-bold text-center">Added On</th>
            <th className="py-3 px-4 font-bold text-center">Last Visit</th>
            <th className="py-3 px-4 font-bold text-center">Doctor Visited</th>
            <th className="py-3 px-4 font-bold text-center">Notes</th>
            <th className="text-center"></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="py-3 px-4 text-center text-[#1C232E]">
                Loading...
              </td>
            </tr>
          ) : pets.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-3 px-4 text-center text-[#1C232E]">
                No pets under care.
              </td>
            </tr>
          ) : (
            pets.map((pet) => (
              <tr
                key={pet.id}
                className="last:border-b-0 hover:bg-[#EDCC79] transition cursor-pointer"
                onClick={() => window.location.href = `/business/pet/${pet.pet_id}/home`}
              >
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={pet.document_url || "https://randomuser.me/api/portraits/med/animals/1.jpg"}
                    alt={pet.pet_name}
                    className="w-8 h-8 rounded-full object-cover border border-[var(--color-business-accent)]"
                  />
                  <span className="text-[var(--color-business-heading)] font-cabin font-bold">
                    {pet.pet_name}
                  </span>
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.breed_name || "N/A"}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.human_owner_name || "Unknown"}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.human_owner_phone || "N/A"}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {new Date(pet.created_at as string).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.last_visit
                    ? new Date(pet.last_visit as string).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.doctor_name || "N/A"}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.record_note || "N/A"}
                </td>
                <td className="py-3 px-4 text-[#1C232E] cursor-pointer text-xl">
                  <a
                    href={`/business/pet/${pet.pet_id}/home`}
                    className="text-[var(--color-business-heading)] hover:text-[var(--color-business-accent)]"
                    title="View Pet Details"
                  ><IoIosArrowForward /></a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* View All Pets row */}
      <div className="flex items-center justify-between cursor-pointer py-2 px-2 font-cabin font-bold text-base " onClick={() => window.location.href = '/business/pets/all'}>
      <a
            href="/business/pets"
            className="text-[var(--color-primary)] text-sm sm:text-base font-medium flex items-center gap-2 cursor-pointer"
          >
            View All Pets <IoIosArrowDroprightCircle />
          </a>
      </div>
    </div>
  );
};

export default PetsUnderCare;