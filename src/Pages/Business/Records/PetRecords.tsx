import React, { useEffect, useState } from "react";
import businessServices from "../../../Services/businessServices";
import { toast } from "sonner";
import BusinessNavbar from "../../../Components/BusinessComponents/BusinessNavbar";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { CiSearch } from "react-icons/ci";

interface Pet {
  pet_image: string;
  owner_name: string;
  owner_phone: string;
  last_visited: string;
  doctor_visited: string;
  doctor_name: string;
  record_note: string;
  pet_id: string;
  breed_name: string;
  human_owner_phone: string;
  note: string;
  staff_name: string;
  created_at: string;
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

interface Vet {
  id: string;
  staff_name: string;
}

const PetRecords = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilter, setShowFilter] = useState(false);
  const [speciesFilter, setSpeciesFilter] = useState<string | null>(null);
  const [doctorFilter, setDoctorFilter] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<string | null>(null);
  const [vets, setVets] = useState<Vet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPets = async (params: any = { limit: 10, page: 1 }) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await businessServices.getAllRecords({
        ...params,
        species_id: speciesFilter,
        doctor_id: doctorFilter,
        time_period: durationFilter,
      });
      let petsData = response?.data as unknown as Pet[];
      if (sortOrder === "newest") {
        petsData = petsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else {
        petsData = petsData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
      if (searchTerm) {
        petsData = petsData.filter(pet =>
          pet.pet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.owner_phone?.includes(searchTerm) ||
          pet.doctor_visited?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.note?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setPets(petsData);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch pets under care.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVets = async () => {
    try {
      const response = await businessServices.getVets({ page: 1, limit: 10 });
      setVets(response.data);
    } catch (error) {
      console.error("Failed to fetch vets:", error);
    }
  };

  useEffect(() => {
    fetchPets();
    fetchVets();
  }, [sortOrder, speciesFilter, doctorFilter, durationFilter, searchTerm]);

  const handleFilterApply = () => {
    fetchPets();
    setShowFilter(false);
  };

  const handleResetFilters = () => {
    setSpeciesFilter(null);
    setDoctorFilter(null);
    setDurationFilter(null);
  };

  return (
    <>
      <div className={`min-h-screen flex flex-col ${showFilter ? "blur-sm pointer-events-none" : ""}`}>
        <BusinessNavbar />
        <div className="w-full px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-between mb-4 py-3 px-6">
              <h1 className="font-[400] font-[Cabin,sans-serif] text-[#1C232E] text-[44px]">Pet Records</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center border border-[#1C232E] text-[#1C232E]/60 rounded-[60px] px-4 py-2 hover:bg-[#1C232E]/10 transition-colors" onClick={() => setShowFilter(true)}>
                Filters    <IoIosArrowDown className="ml-2"/>
              </button>
              <div className="relative">
                <button
                  className="flex items-center border border-[#1C232E] text-[#1C232E]/60 rounded-[60px] px-4 py-2 hover:bg-[#1C232E]/10 transition-colors"
                  onClick={() => setShowSortDropdown((prev) => !prev)}
                  type="button"
                >
                  Sort By: {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                  <IoIosArrowDown className="ml-2" />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-[#1C232E]/20 rounded shadow z-10">
                    <button
                      className={`block w-full text-left px-4 py-2 hover:bg-[#1C232E]/10 ${sortOrder === "newest" ? "font-bold" : ""}`}
                      onClick={() => {
                        setSortOrder("newest");
                        setShowSortDropdown(false);
                      }}
                    >
                      Newest First
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 hover:bg-[#1C232E]/10 ${sortOrder === "oldest" ? "font-bold" : ""}`}
                      onClick={() => {
                        setSortOrder("oldest");
                        setShowSortDropdown(false);
                      }}
                    >
                      Oldest First
                    </button>
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  className="border border-[#1C232E] text-[#1C232E]/60 rounded-[60px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1C232E]/20 transition-colors"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1C232E]/60" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto bg-[#EDCC79]/50 rounded-2xl py-3 px-6 w-full mb-12 border border-black">
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
                      className="last:border-b-0 hover:bg-[var(--color-business-card-bg)] transition"
                    >
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={pet.pet_image || "https://randomuser.me/api/portraits/med/animals/1.jpg"}
                          alt={pet.pet_name}
                          className="w-8 h-8 rounded-full object-cover border border-[var(--color-business-accent)]"
                        />
                        <span className="text-[var(--color-business-heading)] font-cabin font-[400]">
                          {pet.pet_name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-business-heading)]">
                        {pet.breed_name || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-business-heading)]">
                        {pet.owner_name || "Unknown"}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-business-heading)]">
                        {pet.owner_phone || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-business-heading)]">
                        {new Date(pet.last_visited as string).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-business-heading)]">
                        {pet.last_visited
                          ? new Date(pet.last_visited as string).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-business-heading)]">
                        {pet.doctor_visited || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-business-heading)]">
                        {pet.note || "N/A"}
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
          </div>
        </div>
      </div>
      {showFilter && (
        <div className="fixed inset-0 flex justify-end z-50">
          <div className="w-[35%] bg-[#3C2A17] h-full px-14 py-3 overflow-y-auto text-white">
            <div className="flex justify-between items-center mb-6 space-y-4">
              <h2 className="text-xl font-[400] text-[#EBD5BD] pt-6">Filters</h2>
              <button onClick={() => setShowFilter(false)} className="hover:text-gray-300 text-4xl text-[#EBD5BD]">
                ×
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-[400] text-[#EBD5BD] mb-3">By Species</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={speciesFilter === "550e8400-e29b-41d4-a716-446655440001"}
                    onChange={(e) => setSpeciesFilter(e.target.checked ? "550e8400-e29b-41d4-a716-446655440001" : null)}
                    className="mr-2 w-5 h-5 accent-[#FFB23E] appearance-none rounded-[4px] border border-[#FFB23E] bg-[#3C2A17] checked:bg-[#FFB23E] checked:border-[#FFB23E] focus:outline-none"
                  />
                  <span className="text-md text-[#EBD5BD]">Dog</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={speciesFilter === "550e8400-e29b-41d4-a716-446655440002"}
                    onChange={(e) => setSpeciesFilter(e.target.checked ? "550e8400-e29b-41d4-a716-446655440002" : null)}
                    className="mr-2 w-5 h-5 accent-[#FFB23E] appearance-none rounded-[4px] border border-[#FFB23E] bg-[#3C2A17] checked:bg-[#FFB23E] checked:border-[#FFB23E] focus:outline-none"
                  />
                  <span className="text-md text-[#EBD5BD]">Cat</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-[400] text-[#EBD5BD] mb-3">By Doctor Visited</h3>
              <div className="space-y-4">
                {vets.map((vet) => (
                  <label key={vet.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={doctorFilter === vet.id}
                      onChange={(e) => setDoctorFilter(e.target.checked ? vet.id : null)}
                      className="mr-2 w-5 h-5 accent-[#FFB23E] appearance-none rounded-[4px] border border-[#FFB23E] bg-[#3C2A17] checked:bg-[#FFB23E] checked:border-[#FFB23E] focus:outline-none"
                    />
                    <span className="text-md text-[#EBD5BD]">{vet.staff_name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8 ">
              <h3 className="text-sm font-[400] text-[#EBD5BD] mb-3">By Visit</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={durationFilter === "this_week"}
                    onChange={(e) => setDurationFilter(e.target.checked ? "this_week" : null)}
                    className="mr-2 w-5 h-5 accent-[#FFB23E] appearance-none rounded-[4px] border border-[#FFB23E] bg-[#3C2A17] checked:bg-[#FFB23E] checked:border-[#FFB23E] focus:outline-none"
                  />
                  <span className="text-md text-[#EBD5BD]">This week</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={durationFilter === "this_month"}
                    onChange={(e) => setDurationFilter(e.target.checked ? "this_month" : null)}
                    className="mr-2 w-5 h-5 accent-[#FFB23E] appearance-none rounded-[4px] border border-[#FFB23E] bg-[#3C2A17] checked:bg-[#FFB23E] checked:border-[#FFB23E] focus:outline-none"
                  />
                  <span className="text-md text-[#EBD5BD]">This month</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={durationFilter === "last_3_months"}
                    onChange={(e) => setDurationFilter(e.target.checked ? "last_3_months" : null)}
                    className="mr-2 w-5 h-5 accent-[#FFB23E] appearance-none rounded-[4px] border border-[#FFB23E] bg-[#3C2A17] checked:bg-[#FFB23E] checked:border-[#FFB23E] focus:outline-none"
                  />
                  <span className="text-md text-[#EBD5BD]">Last 3 months</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 px-4 py-2 bg-transparent border border-[#FFA500] text-[#FFA500] rounded-[60px] hover:bg-[#FFA500] hover:text-white transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={handleFilterApply}
                className="flex-1 px-4 py-2 bg-[#FFA500] text-black rounded-[60px] hover:bg-[#FF8C00] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PetRecords;