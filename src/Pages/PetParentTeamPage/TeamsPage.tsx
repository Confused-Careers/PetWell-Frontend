import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar";
import TeamBox from "../../Components/Teams/TeamInfo";
import teamServices from "../../Services/teamServices";
import petServices from "../../Services/petServices";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../Components/ui/dialog";

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [teams, setTeams] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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
      await teamServices.deleteTeam(selectedTeam.id);
      setTeams(teams.filter((team) => team.id !== selectedTeam.id));
      setOpen(false);
      setSelectedTeam(null);
    } catch (err) {
      console.error("Failed to delete team:", err);
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
      <div className="container mx-auto max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">
            {pet.pet_name}'s Team
          </h1>
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() =>
                navigate(`/petowner/pet/${actualPetId || petId}/add-team`)
              }
              className="border border-[var(--color-primary)] text-[var(--color-primary)] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition text-sm sm:text-base"
            >
              <span className="text-lg">+</span> Add New Team
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {teams.map((team, index) => (
            <TeamBox
              key={team.id}
              team={team}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>

        {teams.length === 0 && !error && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-base sm:text-lg mb-4">No teams found</div>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Team</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedTeam?.name}"? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
              </DialogClose>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TeamsPage;
