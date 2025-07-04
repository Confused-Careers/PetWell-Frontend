import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar";
import TeamBox from "../../Components/Teams/TeamInfo";
import teamServices from "../../Services/teamServices";
import petServices from "../../Services/petServices";
import { Users, PlusCircle, X } from "lucide-react";

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [teams, setTeams] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pet, setPet] = useState<any>(null);
  const [actualPetId, setActualPetId] = useState<string | null>(null);

  // Helper function to remove duplicate teams based on ID
  const removeDuplicateTeams = (teamsArr: any[]): any[] => {
    const seen = new Set();
    return teamsArr.filter((team) => {
      const id = team.id;
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });
  };

  // Function to fetch individual team details using team IDs
  const fetchTeamDetails = async (teamIds: string[]) => {
    const teamPromises = teamIds.map(async (teamId) => {
      try {
        const teamRes = await teamServices.getTeamById(teamId);

        // Handle different response structures
        if (teamRes) {
          if (teamRes.data) {
            return Array.isArray(teamRes.data) ? teamRes.data[0] : teamRes.data;
          } else if (typeof teamRes === "object" && "id" in teamRes) {
            return teamRes;
          }
        }
        return null;
      } catch (err) {
        console.error(`Failed to fetch team ${teamId}:`, err);
        return null;
      }
    });

    const teamDetails = await Promise.all(teamPromises);
    return teamDetails.filter((team) => team !== null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(
          "[TeamsPage] Starting fetchData with petId from URL:",
          petId
        );

        if (!petId) {
          setError("No pet ID provided");
          setLoading(false);
          return;
        }

        let currentPetId = petId;
        console.log("[TeamsPage] Initial currentPetId from URL:", currentPetId);

        // If petId is "default", fetch the first available pet
        if (petId === "default") {
          const petsRes = await petServices.getPetsByOwner();
          let petsArr = Array.isArray(petsRes) ? petsRes : petsRes.data;
          if (!petsArr) petsArr = [];
          if (!Array.isArray(petsArr)) petsArr = [petsArr];

          if (petsArr.length === 0) {
            setError("No pets found. Please create a pet profile first.");
            setLoading(false);
            return;
          }

          // Use the first pet's ID (since "default" means single pet)
          currentPetId = petsArr[0].id;
          setActualPetId(currentPetId);
        } else {
          setActualPetId(currentPetId);
        }

        // Fetch pet details
        console.log(
          "[TeamsPage] Fetching pet details with getPetById for ID:",
          currentPetId
        );
        const petRes = await petServices.getPetById(currentPetId);
        console.log("[TeamsPage] getPetById response:", petRes);
        let petData = null;

        // Handle different response structures
        if (petRes) {
          if (petRes.data) {
            petData = petRes.data;
          } else if (Array.isArray(petRes)) {
            petData = petRes[0];
          } else if (typeof petRes === "object" && "id" in petRes) {
            petData = petRes;
          }
        }

        setPet(petData);
        console.log("[TeamsPage] Extracted petData:", petData);
        if (!petData) {
          setError("Pet not found");
          setLoading(false);
          return;
        }

        console.log(
          "[TeamsPage] Successfully fetched pet:",
          petData.pet_name,
          "with ID:",
          petData.id
        );

        // Fetch teams - using the same methodology as VaccinesPage
        setLoading(true);
        const teamsRes = await teamServices.getAllTeams();
        console.log("TeamsPage received backend data:", teamsRes);

        let teamsArr: any[] = [];

        // Handle different response structures for teams
        if (teamsRes) {
          if (teamsRes.data) {
            teamsArr = Array.isArray(teamsRes.data)
              ? teamsRes.data
              : [teamsRes.data];
          } else if (Array.isArray(teamsRes)) {
            teamsArr = teamsRes;
          } else if (typeof teamsRes === "object" && "id" in teamsRes) {
            teamsArr = [teamsRes];
          }
        }

        // Log full team objects to debug structure
        console.log("Raw team objects:", teamsArr);
        console.log("All teams with their pet IDs:");
        teamsArr.forEach((team, index) => {
          console.log(`Team ${index}:`, {
            teamId: team.id,
            teamName: team.business?.business_name || "Unknown",
            petId: team.pet?.id || "No pet ID",
            petName: team.pet?.pet_name || "Unknown pet",
          });
        });

        // Filter teams by pet_id
        const matchingTeams: any[] = teamsArr.filter((team) => {
          const petIdMatch = team.pet && team.pet.id === currentPetId;
          console.log("Filtering team:", {
            teamId: team.id,
            teamName: team.business?.business_name || "Unknown",
            petId: team.pet?.id,
            currentPetId,
            matches: petIdMatch,
          });
          return petIdMatch;
        });

        console.log("matchingTeams:", matchingTeams);

        // Extract team IDs for detailed fetching
        const teamIds = matchingTeams.map((team) => team.id).filter((id) => id); // Remove any undefined/null IDs

        console.log("Filtered team IDs for pet:", teamIds);

        if (teamIds.length === 0) {
          console.log(
            "No teams found for current pet. Available teams:",
            teamsArr.length
          );
          setTeams([]);
          if (teamsArr.length > 0) {
            console.log(
              "Teams exist but none match the current pet ID:",
              currentPetId
            );
          }
        } else {
          // Fetch detailed team information using team IDs
          const detailedTeams = await fetchTeamDetails(teamIds);
          console.log("Detailed teams:", detailedTeams);

          // Remove duplicates before setting state
          const uniqueTeams = removeDuplicateTeams(detailedTeams);
          setTeams(uniqueTeams);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [petId]);

  const handleDelete = (index: number) => {
    console.log("[TeamsPage] handleDelete called with index:", index);
    console.log("[TeamsPage] team to delete:", teams[index]);
    setSelectedTeam(teams[index]);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTeam) return;
    try {
      setIsDeleting(true);
      await teamServices.deleteTeam(selectedTeam.id);
      setTeams(teams.filter((team) => team.id !== selectedTeam.id));
      setOpen(false);
      setSelectedTeam(null);
    } catch (err) {
      console.error("Failed to delete team:", err);
      setError("Failed to delete team. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
        <Navbar />
        <div className="container mx-auto max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
          <div className="text-center">Loading teams...</div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
        <Navbar />
        <div className="container mx-auto max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
          <div className="text-center">{error || "Pet not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      <Navbar />
      <div className="container mx-auto max-w-7xl pt-8 pb-12 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <p className="text-2xl font-lighter flex items-center gap-3 font-serif">
            <Users className="w-9 h-9 text-[var(--color-logo)]" />
            {pet.pet_name}&apos;s Teams
          </p>
          <button
            onClick={() =>
              navigate(`/petowner/pet/${actualPetId || petId}/add-team`)
            }
            className="w-auto px-10 font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
          >
            <PlusCircle className="w-6 h-6" /> Add New Team
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-8 text-base">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teams.map((team, index) => (
            <TeamBox
              key={team.id}
              team={team}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>

        {teams.length==0 && <div className="flex justify-center">No Teams Added</div>}

        {open && selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div
              className="rounded-2xl px-6 py-7 w-full max-w-sm shadow-2xl relative flex flex-col items-center border"
              style={{
                backgroundColor: "var(--color-background)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
                fontFamily: 'Cabin, sans-serif',
              }}
            >
              <button
                className="absolute right-4 top-4 text-[var(--color-text)] hover:text-[var(--color-primary)] text-2xl"
                onClick={() => setOpen(false)}
                aria-label="Close"
                disabled={isDeleting}
                style={{ background: 'none', border: 'none' }}
              >
                <X className="w-6 h-6 cursor-pointer" />
              </button>
              <div className="w-full flex">
                <h2
                  className="text-2xl mb-2 text-left"
                  style={{ color: "var(--color-text)", fontFamily: 'Cabin, sans-serif' }}
                >
                  Remove team?
                </h2>
              </div>
              <p className="text-base flex text-left mb-5" style={{ color: "var(--color-text)", fontFamily: 'Cabin, sans-serif' }}>
                Are you sure you want to remove the following team from your profile?
              </p>
              {/* Team Card */}
              <div className="flex items-center gap-4 w-full bg-[var(--color-card-team)] rounded-lg px-4 py-3 mb-7 border border-[var(--color-border)]">
                <img
                  src={selectedTeam.business?.profile_picture_document_id
                    ? `/api/v1/documents/${selectedTeam.business.profile_picture_document_id}`
                    : `https://randomuser.me/api/portraits/men/32.jpg`}
                  alt={selectedTeam.business?.business_name || 'Team'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-[var(--color-text)]" style={{ fontFamily: 'Cabin, sans-serif' }}>
                    {selectedTeam.business?.business_name || selectedTeam.business_name || 'Unknown Team'}
                  </span>
                  <span className="text-sm text-[var(--color-text)]/60 mt-1" style={{ fontFamily: 'Cabin, sans-serif' }}>
                    {selectedTeam.business?.address || 'No address provided'}
                  </span>
                </div>
              </div>
              <div className="flex flex-row gap-4 justify-center w-full mt-2">
                <button
                  className="flex-1 cursor-pointer border border-[var(--color-card-button)] text-[var(--color-primary)] bg-transparent hover:opacity-90 hover:text-[var(--color-primary)] px-0 py-2 rounded-3xl font-semibold transition text-base"
                  style={{ fontFamily: 'Cabin, sans-serif', height: 44 }}
                  onClick={() => setOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 cursor-pointer text-[var(--color-text)] bg-[var(--color-card-button)] hover:opacity-90 px-0 py-2 rounded-3xl font-semibold transition text-base"
                  style={{ fontFamily: 'Cabin, sans-serif', height: 44 }}
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Removing..." : "Yes, remove"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
