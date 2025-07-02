import React from "react";

const pets = [
  {
    name: "Syd",
    image: "https://randomuser.me/api/portraits/med/animals/1.jpg",
    breed: "Chihuahua Mix",
    owner: "Monica Lee",
    phone: "565-555-5562",
    addedOn: "20/6/25",
    lastVisit: "21/6/25",
    doctor: "Dr. Patel",
    notes: "Prefers calls in the morning",
  },
  {
    name: "Frank",
    image: "https://randomuser.me/api/portraits/med/animals/2.jpg",
    breed: "Abyssinian",
    owner: "Monica Lee",
    phone: "565-555-5562",
    addedOn: "20/6/25",
    lastVisit: "21/6/25",
    doctor: "Dr. Patel",
    notes: "Skittish around strangers",
  },
  {
    name: "Cece",
    image: "https://randomuser.me/api/portraits/med/animals/3.jpg",
    breed: "Dog Breed",
    owner: "Monica Lee",
    phone: "565-555-5562",
    addedOn: "20/6/25",
    lastVisit: "21/6/25",
    doctor: "Dr. Smith",
    notes: "Prefers calls in the morning",
  },
  {
    name: "Norman",
    image: "https://randomuser.me/api/portraits/med/animals/4.jpg",
    breed: "Dog Breed",
    owner: "Monica Lee",
    phone: "565-555-5562",
    addedOn: "20/6/25",
    lastVisit: "21/6/25",
    doctor: "Dr. Smith",
    notes: "On insulin for diabetes",
  },
];

const PetsUnderCare: React.FC = () => {
  return (
    <div className="bg-[var(--color-business-card-bg)] rounded-2xl p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[var(--color-business-heading)] text-xl font-cabin font-bold">
          Pets Under Your Care
        </span>
        <a
          href="#"
          className="text-[var(--color-business-accent)] text-base font-cabin hover:underline flex items-center gap-1 font-bold"
        >
          View All Pets <span className="text-lg">&rarr;</span>
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left font-cabin">
          <thead>
            <tr className="text-[var(--color-business-heading)] text-base font-bold">
              <th className="py-3 px-4 font-bold">Pet Name</th>
              <th className="py-3 px-4 font-bold">Breed</th>
              <th className="py-3 px-4 font-bold">Owner Name</th>
              <th className="py-3 px-4 font-bold">Phone</th>
              <th className="py-3 px-4 font-bold">Added On</th>
              <th className="py-3 px-4 font-bold">Last Visit</th>
              <th className="py-3 px-4 font-bold">Doctor Visited</th>
              <th className="py-3 px-4 font-bold">Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet, i) => (
              <tr
                key={i}
                className="last:border-b-0 hover:bg-[var(--color-business-card-bg)] transition"
              >
                <td className="py-3 px-4 flex items-center gap-2">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-8 h-8 rounded-full object-cover border border-[var(--color-business-accent)]"
                  />
                  <span className="text-[var(--color-business-heading)] font-cabin font-bold">
                    {pet.name}
                  </span>
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.breed}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.owner}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.phone}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.addedOn}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.lastVisit}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.doctor}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-heading)]">
                  {pet.notes}
                </td>
                <td className="py-3 px-4 text-[var(--color-business-accent)] cursor-pointer text-xl">
                  &rarr;
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2">
        <a
          href="#"
          className="text-[var(--color-business-accent)] text-base font-cabin hover:underline flex items-center gap-1 font-bold"
        >
          View All Pets <span className="text-lg">&rarr;</span>
        </a>
      </div>
    </div>
  );
};

export default PetsUnderCare;
