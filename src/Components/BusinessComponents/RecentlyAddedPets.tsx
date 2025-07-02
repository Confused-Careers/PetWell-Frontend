import React, { useEffect, useState } from "react";
import businessServices from "../../Services/businessServices";
import { toast } from "sonner";

const pets = [
  {
    name: "Syd",
    image: "https://randomuser.me/api/portraits/med/animals/1.jpg",
    addedOn: "21/6/25",
    lastVisit: "20/6/25",
    doctor: "Dr. Patel",
    owner: "Monica Lee",
  },
  {
    name: "Frank",
    image: "https://randomuser.me/api/portraits/med/animals/2.jpg",
    addedOn: "21/6/25",
    lastVisit: "20/6/25",
    doctor: "Dr. Patel",
    owner: "Monica Lee",
  },
  {
    name: "Cece",
    image: "https://randomuser.me/api/portraits/med/animals/3.jpg",
    addedOn: "21/6/25",
    lastVisit: "20/6/25",
    doctor: "Dr. Patel",
    owner: "Monica Lee",
  },
];

const RecentlyAddedPets: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const getRecentlyAddedPet = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response: any = await businessServices.getPetMappings({
        limit: 5,
        page: 1,
      });
      console.log(response);
    } catch (error: any) {
      toast.error(error?.message || "Some error occured. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getRecentlyAddedPet();
  }, []);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[var(--color-business-heading)] text-lg font-cabin font-semibold">
          Recently Added Pets
        </span>
        <a
          href="#"
          className="text-[var(--color-business-accent)] text-sm font-cabin hover:underline flex items-center gap-1"
        >
          View All Pets <span className="text-lg">&rarr;</span>
        </a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {pets.map((pet, i) => (
          <div
            key={i}
            className="bg-[var(--color-business-green,#ABA75C)] rounded-2xl p-4 min-w-[260px] h-[120px] flex flex-col justify-between shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-business-accent)]"
              />
              <div>
                <div className="text-[var(--color-business-heading)] font-cabin font-bold text-lg">
                  {pet.name}
                </div>
                <div className="text-xs text-[var(--color-business-heading)] font-cabin font-bold">
                  Owner <span className="font-bold">{pet.owner}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-business-heading)] font-cabin">
              <span>
                Added On <span className="font-bold">{pet.addedOn}</span>
              </span>
              <span>
                Last Visit <span className="font-bold">{pet.lastVisit}</span>
              </span>
              <span>
                Doctor <span className="font-bold">{pet.doctor}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAddedPets;
