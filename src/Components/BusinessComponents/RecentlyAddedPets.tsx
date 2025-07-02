import React, { useEffect, useState } from "react";
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
      console.log("Recently Added Pets Response:", response);
      setPets(Array.isArray(response) ? response : []);
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
        <div className="flex gap-4 overflow-x-auto">
          {pets?.map((pet) => (
            <div key={pet.id} className="bg-[var(--color-business-green,#ABA75C)] rounded-2xl p-4 min-w-[360px] h-[170px] flex flex-col justify-between shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <img src={pet.image || "https://randomuser.me/api/portraits/med/animals/1.jpg"} alt={pet.pet_name} className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-business-accent)]" />
                <div>
                  <div className="text-[var(--color-business-heading)] font-cabin font-bold text-lg">{pet.pet_name}</div>
                </div>
              </div>
              <div className="flex flex-row flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-business-heading)] font-cabin">
                <div className="flex gap-x-6 items-center justify-center">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-[var(--color-business-heading)] font-cabin">Owner</span>
                    <span className="font-bold text-sm">{pet.human_owner_name || "Unknown"}</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-[var(--color-business-heading)] font-cabin">Added On</span>
                    <span className="font-bold text-sm">{new Date(pet.created_at as string).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-[var(--color-business-heading)] font-cabin">Doctor</span>
                    <span className="font-bold text-sm">{pet.staff_name || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyAddedPets;