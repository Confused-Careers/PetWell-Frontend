import React from 'react';

const pets = [
  {
    name: 'Syd',
    image: 'https://randomuser.me/api/portraits/med/animals/1.jpg',
    breed: 'Chihuahua Mix',
    owner: 'Monica Lee',
    phone: '565-555-5562',
    addedOn: '20/6/25',
    lastVisit: '21/6/25',
    doctor: 'Dr. Patel',
    notes: 'Prefers calls in the morning',
  },
  {
    name: 'Frank',
    image: 'https://randomuser.me/api/portraits/med/animals/2.jpg',
    breed: 'Abyssinian',
    owner: 'Monica Lee',
    phone: '565-555-5562',
    addedOn: '20/6/25',
    lastVisit: '21/6/25',
    doctor: 'Dr. Patel',
    notes: 'Skittish around strangers',
  },
  {
    name: 'Cece',
    image: 'https://randomuser.me/api/portraits/med/animals/3.jpg',
    breed: 'Dog Breed',
    owner: 'Monica Lee',
    phone: '565-555-5562',
    addedOn: '20/6/25',
    lastVisit: '21/6/25',
    doctor: 'Dr. Smith',
    notes: 'Prefers calls in the morning',
  },
  {
    name: 'Norman',
    image: 'https://randomuser.me/api/portraits/med/animals/4.jpg',
    breed: 'Dog Breed',
    owner: 'Monica Lee',
    phone: '565-555-5562',
    addedOn: '20/6/25',
    lastVisit: '21/6/25',
    doctor: 'Dr. Smith',
    notes: 'On insulin for diabetes',
  },
];

const PetsUnderCare: React.FC = () => {
  return (
    <div className="bg-[#23272F] rounded-xl p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[var(--color-text,#ebd5bd)] text-lg font-cabin font-semibold">Pets Under Your Care</span>
        <a href="#" className="text-[#FDBA3B] text-sm font-cabin hover:underline flex items-center gap-1">View All Pets <span className="text-lg">&rarr;</span></a>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left font-cabin">
          <thead>
            <tr className="text-[var(--color-text,#ebd5bd)] text-sm">
              <th className="py-2 px-3 font-normal">Pet Name</th>
              <th className="py-2 px-3 font-normal">Breed</th>
              <th className="py-2 px-3 font-normal">Owner Name</th>
              <th className="py-2 px-3 font-normal">Phone</th>
              <th className="py-2 px-3 font-normal">Added On</th>
              <th className="py-2 px-3 font-normal">Last Visit</th>
              <th className="py-2 px-3 font-normal">Doctor Visited</th>
              <th className="py-2 px-3 font-normal">Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet, i) => (
              <tr key={i} className="border-b border-[#393E46] last:border-b-0 hover:bg-[#262B33] transition">
                <td className="py-2 px-3 flex items-center gap-2">
                  <img src={pet.image} alt={pet.name} className="w-8 h-8 rounded-full object-cover border border-[#F6E7C0]" />
                  <span className="text-[var(--color-text,#ebd5bd)] font-cabin">{pet.name}</span>
                </td>
                <td className="py-2 px-3 text-[var(--color-text,#ebd5bd)]">{pet.breed}</td>
                <td className="py-2 px-3 text-[var(--color-text,#ebd5bd)]">{pet.owner}</td>
                <td className="py-2 px-3 text-[var(--color-text,#ebd5bd)]">{pet.phone}</td>
                <td className="py-2 px-3 text-[var(--color-text,#ebd5bd)]">{pet.addedOn}</td>
                <td className="py-2 px-3 text-[var(--color-text,#ebd5bd)]">{pet.lastVisit}</td>
                <td className="py-2 px-3 text-[var(--color-text,#ebd5bd)]">{pet.doctor}</td>
                <td className="py-2 px-3 text-[var(--color-text,#ebd5bd)]">{pet.notes}</td>
                <td className="py-2 px-3 text-[#FDBA3B] cursor-pointer text-xl">&rarr;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2">
        <a href="#" className="text-[#FDBA3B] text-sm font-cabin hover:underline flex items-center gap-1">View All Pets <span className="text-lg">&rarr;</span></a>
      </div>
    </div>
  );
};

export default PetsUnderCare; 