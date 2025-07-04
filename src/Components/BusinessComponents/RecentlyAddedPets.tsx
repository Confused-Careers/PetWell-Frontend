import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import businessServices from "../../Services/businessServices";
import { toast } from "sonner";

interface Pet {
  created_at: ReactNode;
  staff_name: string;
  human_owner_name: string;
  id: string;
  pet_name: string;
  image?: string;
  added_on: string;
  last_visit?: string;
  doctor?: string;
  owner?: string;
}

const RecentlyAddedPets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPets = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await businessServices.getPetMappings({ limit: 5, page: 1 });
      const petsData: Pet[] = Array.isArray(response) ? response as Pet[] : [];
      // TEMP: Add mock last_visit if missing for UI testing
      const mappedPets = petsData.map((pet, idx) => ({
        ...pet,
        last_visit: pet.last_visit || "2025-06-20", // DD/MM/YY for demo
        staff_name: pet.staff_name || "Dr. Patel",
      }));
      setPets(mappedPets);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch recently added pets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-center mb-2"></div>
      {loading ? (
        <div className="text-center text-[var(--color-business-heading)]">Loading...</div>
      ) : pets.length === 0 ? (
        <div className="text-center text-[var(--color-business-heading)]">No pets found.</div>
      ) : (
        <div className="overflow-x-auto hide-scrollbar" style={{ maxWidth: '885px' }}>
          <div className="flex gap-4" style={{ minWidth: '1020px' }}>
            {pets?.map((pet) => (
              <div key={pet.id} className="border rounded-2xl p-4 min-w-[340px] max-w-[340px] h-[170px] flex flex-col justify-between shadow-sm" style={{ backgroundColor: "#ABA75C80" }}>
                <div className="flex flex-row justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <img src={pet.image || "https://randomuser.me/api/portraits/med/animals/1.jpg"} alt={pet.pet_name} className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-business-accent)]" />
                    <span className="text-[var(--color-business-heading)] font-cabin font-bold text-lg ml-1">{pet.pet_name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[var(--color-business-heading)] font-cabin text-start items-start">Added On</span>
                    <span className="font-bold text-sm">{new Date(pet.created_at as string).toLocaleDateString("en-GB")}</span>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-end mt-2">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-[var(--color-business-heading)] font-cabin">Owner</span>
                    <span className="font-bold text-sm">{pet.human_owner_name || "Unknown"}</span>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-col items-end">
                      <div className="flex flex-row items-center gap-2 mt-0.5">
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-[var(--color-business-heading)] font-cabin mb-0.5 text-end">Last Visit</span>
                          <span className="font-bold text-sm">{new Date(pet.last_visit as string).toLocaleDateString("en-GB")}</span>
                        </div>
                        {/*<span className="mx-2 text-[var(--color-business-heading)] text-sm">|</span>
                        <span className="text-sm">{pet.staff_name || "N/A"}</span>*/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default RecentlyAddedPets;