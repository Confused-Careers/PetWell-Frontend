import React, { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import TeamAddedModal from "./TeamAddedModal";
import teamServices from "../../Services/teamServices";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { toast } from "sonner";


const AddTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showTeamAdded, setShowTeamAdded] = useState(false);
  const [addedTeamName, setAddedTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    teamServices
      .searchBusinesses(search)
      .then((res) => {
        const businesses = Array.isArray(res) ? res : [];
        const results = businesses.map((b: any) => ({
          id: b.id,
          name: b.business_name,
          description: b.description || "",
          email: b.email || "",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        }));
        setSearchResults(results);
      })
      .finally(() => setLoading(false));
    return () => {};
  }, [search]);

  const handleAddTeam = async () => {
    if (!selectedTeam) return;
    setLoading(true);
    try {
      // Get user's pets (assume first pet)
      // Add team (business) for this pet
      if (!petId) {
        throw new Error("No pet selected.");
      }
      await teamServices.createTeam({
        pet_id: petId as string,
        business_id: selectedTeam.id,
      });
      setShowTeamAdded(true);
      setModalOpen(false);
      setAddedTeamName(selectedTeam?.name || "");
      toast.success('Team Added Successfully.')
    } catch (err) {
      const errorMsg =
        (err instanceof Error ? err.message : String(err)) ||
        "Failed to add team";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)]">
      <Navbar />
      <div className="container pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 pr-4 sm:pr-6 md:pr-8 pl-4 sm:pl-6 md:pl-8 mx-auto max-w-8xl flex flex-col items-center">
        <button
          className="text-[var(--color-primary)] text-sm sm:text-base font-medium mb-6 sm:mb-8 self-start flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(-1)}
        >
         <IoIosArrowDropleftCircle /> Go Back
        </button>
        <div className="flex flex-col items-center w-full">
           <div className="flex flex-col items-center w-full mb-6">
       
        <svg className="size-16" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="60" cy="60" r="60" fill="#3C2A17"/>
<path d="M82.761 62.1611H77.8115C78.316 63.5424 78.5916 65.033 78.5916 66.5866V85.2929C78.5916 85.9407 78.4789 86.5624 78.2738 87.1407H86.4564C89.513 87.1407 91.9997 84.6539 91.9997 81.5974V71.3998C91.9998 66.3056 87.8553 62.1611 82.761 62.1611Z" fill="white"/>
<path d="M41.4082 66.5866C41.4082 65.0329 41.6838 63.5424 42.1883 62.1611H37.2388C32.1445 62.1611 28 66.3056 28 71.3999V81.5975C28 84.6541 30.4866 87.1408 33.5433 87.1408H41.726C41.5209 86.5623 41.4082 85.9407 41.4082 85.2929V66.5866Z" fill="white"/>
<path d="M65.6576 57.3525H54.3423C49.248 57.3525 45.1035 61.497 45.1035 66.5913V85.2976C45.1035 86.318 45.9308 87.1454 46.9513 87.1454H73.0486C74.0691 87.1454 74.8963 86.3181 74.8963 85.2976V66.5913C74.8963 61.497 70.7518 57.3525 65.6576 57.3525Z" fill="white"/>
<path d="M59.9994 32.8555C53.8729 32.8555 48.8887 37.8397 48.8887 43.9664C48.8887 48.122 51.1823 51.7514 54.5696 53.6569C56.1762 54.5606 58.0284 55.0771 59.9994 55.0771C61.9704 55.0771 63.8227 54.5606 65.4293 53.6569C68.8167 51.7514 71.1102 48.1219 71.1102 43.9664C71.1102 37.8399 66.126 32.8555 59.9994 32.8555Z" fill="white"/>
<path d="M40.4891 43.2119C35.9072 43.2119 32.1797 46.9394 32.1797 51.5213C32.1797 56.1032 35.9072 59.8307 40.4891 59.8307C41.6513 59.8307 42.7581 59.5899 43.7635 59.1572C45.5017 58.4088 46.935 57.0841 47.8218 55.4247C48.4443 54.2601 48.7985 52.9314 48.7985 51.5213C48.7985 46.9395 45.071 43.2119 40.4891 43.2119Z" fill="white"/>
<path d="M79.5106 43.2119C74.9287 43.2119 71.2012 46.9394 71.2012 51.5213C71.2012 52.9316 71.5553 54.2602 72.1778 55.4247C73.0647 57.0842 74.4979 58.4089 76.2362 59.1572C77.2416 59.5899 78.3483 59.8307 79.5106 59.8307C84.0924 59.8307 87.82 56.1032 87.82 51.5213C87.82 46.9394 84.0924 43.2119 79.5106 43.2119Z" fill="white"/>
</svg>


        <p className="text-3xl mt-6 font-lighter flex items-center gap-3 font-serif">
          Add A Team
        </p>
        <p className=" text-[var(--color-text)] font-normal mb-6 text-center max-w-xl">
          Search and add vets, groomers, or other care providers.
        </p>
      </div>
          
          <div className="w-full max-w-sm mt-2 flex flex-col items-center">
            <label
              className="block text-[var(--color-text)] opacity-60 mb-2 ml-1 self-start"
              htmlFor="search"
            >
              Search for a care provider
            </label>
            <div className="w-full flex justify-center relative">
              <div className="relative w-full">
                <input
                  id="search"
                  name="search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm rounded-md px-4 bg-white border border-black text-[var(--color-text)] placeholder-[var(--color-text)]/60 focus:outline-none focus:border-[#FFB23E] focus:border-2  transition-all duration-200"
                  placeholder="Search by name, clinic, or location"
                  style={{ color: "#000000" }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-[var(--color-text)] pointer-events-none">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-2-2" />
                  </svg>
                </span>
                {/* Results dropdown */}
                {searchResults.length > 0 && (
                  <div
                    className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-10 border border-[#ececec] overflow-hidden"
                    style={{ width: "100%" }}
                  >
                    {searchResults.map((business, idx) => {
                      const name =
                        business.name || business.business_name || "";
                      const searchIndex = name
                        .toLowerCase()
                        .indexOf(search.toLowerCase());
                      let displayName;
                      if (search && searchIndex !== -1) {
                        displayName = (
                          <>
                            {name.substring(0, searchIndex)}
                            <b>
                              {name.substring(
                                searchIndex,
                                searchIndex + search.length
                              )}
                            </b>
                            {name.substring(searchIndex + search.length)}
                          </>
                        );
                      } else {
                        displayName = name;
                      }
                      return (
                        <div
                          key={business.id}
                          className={`flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-[var(--color-card)] border-b ${
                            idx === searchResults.length - 1
                              ? "border-b-0"
                              : "border-[#ececec]"
                          }`}
                          onClick={() => {
                            setSelectedTeam(business);
                            setModalOpen(true);
                          }}
                        >
                          <img
                            src={
                              business.avatar ||
                              "https://randomuser.me/api/portraits/men/32.jpg"
                            }
                            alt={name}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-base text-[#232b3e]">
                              {displayName}
                            </span>
                            <span className="text-sm text-[#232b3e] opacity-70">
                              {business.description || business.email || ""}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="rounded-2xl px-6 sm:px-8 py-6 sm:py-8 w-full max-w-md shadow-2xl relative flex flex-col items-center border"
            style={{
              backgroundColor: "var(--color-background)",
              borderColor: "var(--color-primary)",
              color: "var(--color-text)",
            }}
          >
            <button
              className="absolute right-4 top-4 text-[var(--color-text)] hover:text-[var(--color-primary)]"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              disabled={loading}
            >
              <X className="w-6 h-6 cursor-pointer" />
            </button>
            <h2
              className="text-2xl flex justify-start font-serif items-start text-left mb-4 w-full"
              style={{ color: "var(--color-text)" }}
            >
              Add to team?
            </h2>
            <div
              className="flex items-center gap-4 rounded-lg px-4 py-3 mb-6 w-full border"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-card-profile) 60%, transparent)",
                borderColor: "var(--color-text)",
              }}
            >
              <img
                src={selectedTeam.avatar}
                alt={selectedTeam.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div
                  className="font-semibold text-lg"
                  style={{ color: "var(--color-text)" }}
                >
                  {selectedTeam.name}
                </div>
                <div
                  className="text-sm opacity-60"
                  style={{ color: "var(--color-text)" }}
                >
                  {selectedTeam.address ||
                    selectedTeam.description ||
                    selectedTeam.email}
                </div>
              </div>
            </div>
            <p
              className="text-sm flex justify-star text-left mb-6"
              style={{ color: "var(--color-text)" }}
            >
              Once added, you can view and manage this provider from your Team
              list.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
              <button
                className="flex-1 cursor-pointer border border-[var(--color-card-button)] text-[var(--color-primary)] bg-transparent hover:opacity-90 hover:text-[var(--color-primary)] px-0 py-2 rounded-3xl font-semibold transition text-base"
                onClick={() => setModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="flex-1 cursor-pointer text-[var(--color-text)] bg-[var(--color-card-button)] hover:opacity-90 px-0 py-2 rounded-3xl font-semibold transition text-base"
                onClick={handleAddTeam}
                disabled={loading}
              >
                {loading ? "Adding..." : "Yes, Add to team"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Added Modal */}
      {showTeamAdded && (
        <TeamAddedModal
          teamName={addedTeamName}
          onClose={() => setShowTeamAdded(false)}
          onGoHome={() => navigate(`/petowner/pet/${petId}/home`)}
          onAddMore={() => {
            setShowTeamAdded(false);
            setSearch("");
            setSelectedTeam(null);
          }}
        />
      )}
    </div>
  );
};

export default AddTeamPage;
