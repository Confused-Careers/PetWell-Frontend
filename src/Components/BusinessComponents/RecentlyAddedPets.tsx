import React, { useEffect, useState } from "react";
import businessServices from "../../Services/businessServices";
import { toast } from "sonner";

interface Pet {
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
      setPets(Array.isArray(response.data) ? response.data : []);
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
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
      </div>
      {loading ? (
        <div className="text-center text-[var(--color-business-heading)]">Loading...</div>
      ) : pets.length === 0 ? (
        <div className="text-center text-[var(--color-business-heading)]">No pets found.</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {pets?.map((pet) => (
            <div
              key={pet.id}
              className="bg-[var(--color-business-green,#ABA75C)] rounded-2xl p-4 min-w-[260px] h-[120px] flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={pet.image || "https://randomuser.me/api/portraits/med/animals/1.jpg"}
                  alt={pet.pet_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-business-accent)]"
                />
                <div>
                  <div className="text-[var(--color-business-heading)] font-cabin font-bold text-lg">
                    {pet.pet_name}
                  </div>
                  <div className="text-xs text-[var(--color-business-heading)] font-cabin font-bold">
                    Owner <span className="font-bold">{pet.owner || "Unknown"}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-business-heading)] font-cabin">
                <span>
                  Added On <span className="font-bold">{pet.added_on}</span>
                </span>
                <span>
                  Last Visit <span className="font-bold">{pet.last_visit || "N/A"}</span>
                </span>
                <span>
                  Doctor <span className="font-bold">{pet.doctor || "N/A"}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyAddedPets;