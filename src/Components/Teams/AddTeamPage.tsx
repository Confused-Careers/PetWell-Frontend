import React, { useState, useEffect } from "react";
import Navbar from "../Layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import TeamAddedModal from "./TeamAddedModal";
import teamServices from "../../Services/teamServices";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosPeople } from "react-icons/io";


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
          className="text-[var(--color-primary)] text-sm sm:text-base font-medium mb-6 sm:mb-8 self-start flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(-1)}
        >
         <IoIosArrowDropleftCircle /> Go Back
        </button>
        <div className="flex flex-col items-center w-full">
          <div className="mb-4 sm:mb-6 flex justify-center items-center">
            {/* Team SVG Icon with visible circular background */}
            <span
              style={{
                backgroundColor: "var(--color-logo)",
                borderRadius: "9999px",
                width: "80px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IoIosPeople size={64} className="text-[var(--color-background)]" />
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[var(--color-text)] mb-2 text-center">
            Add A Team
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text)] mb-6 sm:mb-8 opacity-80 text-center px-4">
            Search and add vets, groomers, or other care providers.
          </p>
          <div className="w-full max-w-md mt-2 flex flex-col items-center">
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
              className="text-2xl flex justify-start items-start text-left mb-4 w-full"
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
