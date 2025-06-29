import React from 'react';

const pets = [
  {
    name: 'Syd',
    image: 'https://randomuser.me/api/portraits/med/animals/1.jpg',
    addedOn: '21/6/25',
    lastVisit: '20/6/25',
    doctor: 'Dr. Patel',
    owner: 'Monica Lee',
  },
  {
    name: 'Frank',
    image: 'https://randomuser.me/api/portraits/med/animals/2.jpg',
    addedOn: '21/6/25',
    lastVisit: '20/6/25',
    doctor: 'Dr. Patel',
    owner: 'Monica Lee',
  },
  {
    name: 'Cece',
    image: 'https://randomuser.me/api/portraits/med/animals/3.jpg',
    addedOn: '21/6/25',
    lastVisit: '20/6/25',
    doctor: 'Dr. Patel',
    owner: 'Monica Lee',
  },
];

const RecentlyAddedPets: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[#F6E7C0] text-lg font-cabin font-semibold">Recently Added Pets</span>
        <a href="#" className="text-[#FDBA3B] text-sm font-cabin hover:underline flex items-center gap-1">View All Pets <span className="text-lg">&rarr;</span></a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {pets.map((pet, i) => (
          <div key={i} className="bg-[#23272F] rounded-xl p-4 min-w-[220px] flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <img src={pet.image} alt={pet.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#F6E7C0]" />
              <div>
                <div className="text-[#F6E7C0] font-cabin font-semibold text-base">{pet.name}</div>
                <div className="text-xs text-[#EBD5BD] font-cabin">Owner<br /><span className="font-normal">{pet.owner}</span></div>
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex justify-between text-xs text-[#EBD5BD] font-cabin">
                <span>Added On</span>
                <span className="font-semibold text-[#F6E7C0]">{pet.addedOn}</span>
              </div>
              <div className="flex justify-between text-xs text-[#EBD5BD] font-cabin">
                <span>Last Visit</span>
                <span className="font-semibold text-[#F6E7C0]">{pet.lastVisit}</span>
              </div>
              <div className="flex justify-between text-xs text-[#EBD5BD] font-cabin">
                <span>Doctor</span>
                <span className="font-semibold text-[#F6E7C0]">{pet.doctor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAddedPets; 