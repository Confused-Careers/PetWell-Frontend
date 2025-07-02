import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar";
import TeamBox from "../../Components/Teams/TeamInfo";
import teamServices from "../../Services/teamServices";
import petServices from "../../Services/petServices";
import { Users, XCircle, PlusCircle, X } from "lucide-react";

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
          <h1 className="text-3xl md:text-4xl font-serif font-bold flex items-center gap-3 text-[var(--color-logo)]">
            <Users className="w-9 h-9 text-[var(--color-logo)]" />
            {pet.pet_name}&apos;s Teams
          </h1>
          <button
            onClick={() =>
              navigate(`/petowner/pet/${actualPetId || petId}/add-team`)
            }
            className="btn-wide-rounded border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold flex items-center gap-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition text-lg px-7 py-3 rounded-full"
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

        {teams.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4 font-semibold">
              No teams found
            </div>
            <button
              onClick={() =>
                navigate(`/petowner/pet/${actualPetId || petId}/add-team`)
              }
              className="btn-wide-rounded border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold flex items-center gap-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition text-base px-6 py-2 rounded-full mx-auto"
            >
              <PlusCircle className="w-5 h-5" /> Add New Team
            </button>
          </div>
        )}

        {open && selectedTeam && (
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
                className="absolute right-4 top-4 text-gray-500 hover:text-red-500"
                onClick={() => setOpen(false)}
                aria-label="Close"
                disabled={isDeleting}
              >
                <X className="w-6 h-6" />
              </button>
              <h2
                className="text-2xl font-bold mb-4 text-center"
                style={{ color: "var(--color-text)" }}
              >
                Remove Team?
              </h2>
              <div className="w-full text-center mb-6">
                <p className="text-base" style={{ color: "var(--color-text)" }}>
                  Are you sure you want to delete the team "
                  <span
                    className="font-semibold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {selectedTeam.business?.business_name ||
                      selectedTeam.business_name ||
                      "Unknown Team"}
                  </span>
                  "?
                </p>
                <p
                  className="text-xs mt-2"
                  style={{ color: "var(--color-text)" }}
                >
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
                <button
                  className="w-full sm:w-auto border border-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                  onClick={() => setOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto text-black px-6 py-2 rounded-lg font-semibold transition disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--color-primary)",
                  }}
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
