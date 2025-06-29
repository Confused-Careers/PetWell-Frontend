import React, { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import TeamAddedModal from "./TeamAddedModal";
import teamServices from "../../Services/teamServices";
import petServices from "../../Services/petServices";

const AddTeamPage: React.FC = () => {
  const navigate = useNavigate();
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
        console.log("Raw API response:", res);
        const businesses = Array.isArray(res) ? res : [];
        const results = businesses.map((b: any) => ({
          id: b.id,
          name: b.business_name,
          description: b.description || "",
          email: b.email || "",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        }));
        console.log("Mapped results:", results);
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
      const petsRes = await petServices.getPetsByOwner();
      let petsArr = Array.isArray(petsRes) ? petsRes : petsRes.data;
      if (!petsArr) petsArr = [];
      if (!Array.isArray(petsArr)) petsArr = [petsArr];
      if (petsArr.length === 0) throw new Error("No pet found");
      const petId = petsArr[0].id;
      // Add team (business) for this pet
      await teamServices.createTeam({
        pet_id: petId,
        business_id: selectedTeam.id,
      });
      setShowTeamAdded(true);
      setModalOpen(false);
      setAddedTeamName(selectedTeam?.name || "");
    } catch (err) {
      const errorMsg =
        (err instanceof Error ? err.message : String(err)) ||
        "Failed to add team";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)]">
      <Navbar />
      <div className="container pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 pr-4 sm:pr-6 md:pr-8 pl-4 sm:pl-6 md:pl-8 mx-auto max-w-8xl flex flex-col items-center">
        <button
          className="text-[var(--color-primary)] text-sm sm:text-base font-medium mb-6 sm:mb-8 self-start flex items-center gap-2 hover:underline"
          onClick={() => navigate(-1)}
        >
          <span className="text-lg sm:text-xl">&lt;</span> Go Back
        </button>
        <div className="flex flex-col items-center w-full">
          <div className="mb-4 sm:mb-6">
            {/* Team SVG Icon */}
            <svg
              width="60"
              height="60"
              className="sm:w-20 sm:h-20"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="40"
                cy="40"
                r="40"
                fill="#EBD5BD"
                fillOpacity="0.15"
              />
              <path
                d="M40 46c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
                fill="#EBD5BD"
              />
              <path
                d="M24 60c0-8.837 7.163-16 16-16s16 7.163 16 16v2c0 1.105-.895 2-2 2H26c-1.105 0-2-.895-2-2v-2Z"
                fill="#EBD5BD"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-text)] mb-2 text-center">
            Add A Team
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text)] mb-6 sm:mb-8 opacity-80 text-center px-4">
            Search and add vets, groomers, or other care providers.
          </p>
          <div className="w-full max-w-md mt-2 flex flex-col items-center">
            <label
              className="block text-[var(--color-text)] opacity-60 font-semibold mb-2 ml-1 self-start"
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
                  className="w-full h-11 px-5 pr-12 rounded-md bg-white bg-opacity-[0.04] border border-[#232b41] text-[var(--color-text)] placeholder-black placeholder-opacity-60 text-base font-normal focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-150 shadow-none"
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
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                  <DialogContent className="bg-[#1C232E] border-[var(--color-modal-border)] max-w-md rounded-2xl p-8">
                    <DialogHeader>
                      <DialogTitle className="text-[var(--color-text)] text-3xl font-serif font-bold mb-2">
                        Add to team?
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-[var(--color-text)] text-base mb-6">
                      Once added, you can view and manage this provider from
                      your Team list.
                    </DialogDescription>
                    {selectedTeam && (
                      <div className="flex items-center gap-4 bg-[var(--color-card)] rounded-lg px-4 py-3 mb-6">
                        <img
                          src={selectedTeam.avatar}
                          alt={selectedTeam.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-lg text-[var(--color-text)]">
                            {selectedTeam.name}
                          </div>
                          <div className="text-sm text-[var(--color-text)] opacity-60">
                            {selectedTeam.address}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-4 justify-end mt-2">
                      <DialogClose asChild>
                        <button className="px-8 py-2 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent font-medium text-lg hover:bg-[var(--color-primary)] hover:text-black transition-all duration-150">
                          Cancel
                        </button>
                      </DialogClose>
                      <button
                        className="px-8 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-medium text-lg hover:opacity-90 transition-all duration-150"
                        onClick={handleAddTeam}
                        disabled={loading}
                      >
                        {loading ? "Adding..." : "Yes, Add to Team"}
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Team Added Modal */}
      {showTeamAdded && (
        <TeamAddedModal
          teamName={addedTeamName}
          onClose={() => setShowTeamAdded(false)}
          onGoHome={() => navigate("/home")}
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
