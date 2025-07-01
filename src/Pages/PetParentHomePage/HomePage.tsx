import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar";
import DocumentSection from "../../Components/Document/DocumentSection";
import TeamSection from "../../Components/Teams/TeamSection";
import VaccineSection from "../../Components/Vaccine/VaccineSection";
import petServices from "../../Services/petServices";
import vaccineServices from "../../Services/vaccineServices";
import teamServices from "../../Services/teamServices";
import RenameDocumentModal from "../../Components/Document/RenameDocumentModal";
import EditVaccineModal from "../../Components/Vaccine/EditVaccineModal";
import { PlusCircle, FilePlus, Users, Syringe, FileText } from "lucide-react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [rawVaccines, setRawVaccines] = useState<any[]>([]);
  const [rawDocuments, setRawDocuments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [rawTeams, setRawTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [petName, setPetName] = useState<string>("My Pet");
  const [editDocIdx, setEditDocIdx] = useState<number | null>(null);
  const [editDocName, setEditDocName] = useState<string>("");
  const [editVaccineIdx, setEditVaccineIdx] = useState<number | null>(null);
  const [pet, setPet] = useState<any>(null);

  // Helper function to remove duplicate vaccines based on ID
  const removeDuplicateVaccines = (vaccinesArr: any[]): any[] => {
    const seen = new Set();
    return vaccinesArr.filter((vaccine) => {
      const id = vaccine.id;
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });
  };

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

  // Helper function to calculate vaccine expiration warning and relative expiry string
  const calculateExpirationWarning = (
    expiryDate: string,
    petName?: string
  ): { soon: boolean; warning: string; relativeExpiry: string } => {
    if (!expiryDate)
      return { soon: false, warning: "", relativeExpiry: "Unknown" };
    try {
      const expiry = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expiry.setHours(0, 0, 0, 0);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        // Already expired
        return {
          soon: true,
          warning: `${
            petName || "Your pet"
          }'s vaccine has expired. Please renew as soon as possible!`,
          relativeExpiry: `Expired ${Math.abs(diffDays)} day${
            Math.abs(diffDays) === 1 ? "" : "s"
          } ago`,
        };
      } else if (diffDays <= 7) {
        // Expiring within 7 days
        return {
          soon: true,
          warning: `${
            petName || "Your pet"
          } is due for the vaccine soon. Schedule now!`,
          relativeExpiry: `In ${diffDays} day${diffDays === 1 ? "" : "s"}`,
        };
      } else {
        // Not soon, show date
        return {
          soon: false,
          warning: "",
          relativeExpiry: expiry.toLocaleDateString(),
        };
      }
    } catch (error) {
      console.error("Error parsing expiry date:", error);
      return { soon: false, warning: "", relativeExpiry: "Unknown" };
    }
  };

  // Function to fetch individual vaccine details using vaccine IDs
  const fetchVaccineDetails = async (vaccineIds: string[]) => {
    const vaccinePromises = vaccineIds.map(async (vaccineId) => {
      try {
        const vaccineRes = await vaccineServices.getPetVaccine(vaccineId);

        // Handle different response structures
        if (vaccineRes) {
          if (vaccineRes.data) {
            return Array.isArray(vaccineRes.data)
              ? vaccineRes.data[0]
              : vaccineRes.data;
          } else if (typeof vaccineRes === "object" && "id" in vaccineRes) {
            return vaccineRes;
          }
        }
        return null;
      } catch (err) {
        console.error(`Failed to fetch vaccine ${vaccineId}:`, err);
        return null;
      }
    });

    const vaccineDetails = await Promise.all(vaccinePromises);
    return vaccineDetails.filter((vaccine) => vaccine !== null);
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
    const fetchAll = async () => {
      console.log("fetchAll running...");
      console.log("[HomePage] Starting fetchAll with petId from URL:", petId);
      setLoading(true);
      setError(null);
      try {
        console.log("[HomePage] petId:", petId);
        if (!petId) {
          setLoading(false);
          return;
        }

        console.log(
          "[HomePage] Fetching pet details with getPetById for ID:",
          petId
        );
        const petRes = await petServices.getPetById(petId);
        console.log("[HomePage] getPetById response:", petRes);
        let petData: any = petRes;
        // If petRes is a PetResponse, extract .data
        if (petRes && petRes.data) petData = petRes.data;
        // If still an array, use first element
        if (Array.isArray(petData)) petData = petData[0];
        // If still not a valid pet object, error
        if (
          !petData ||
          typeof petData !== "object" ||
          !("id" in petData) ||
          !("pet_name" in petData)
        ) {
          console.error("[HomePage] No valid pet found. petData:", petData);
          setPet(null);
          setError("No pet found. Please add a pet first.");
          setLoading(false);
          return;
        }
        setPet(petData);
        setPetName(petData.pet_name || "My Pet");
        console.log(
          "[HomePage] Successfully fetched pet:",
          petData.pet_name,
          "with ID:",
          petData.id
        );

        // Vaccines - using the same methodology as VaccinesPage
        const vaccinesRes = await vaccineServices.getAllPetVaccines(petData.id);
        console.log("[HomePage] vaccinesRes:", vaccinesRes);
        let vaccinesArr: any[] = [];

        // Handle different response structures for vaccines
        if (vaccinesRes) {
          if (vaccinesRes.data) {
            vaccinesArr = Array.isArray(vaccinesRes.data)
              ? vaccinesRes.data
              : [vaccinesRes.data];
          } else if (Array.isArray(vaccinesRes)) {
            vaccinesArr = vaccinesRes;
          } else if (typeof vaccinesRes === "object" && "id" in vaccinesRes) {
            vaccinesArr = [vaccinesRes];
          }
        }

        // Log full vaccine objects to debug structure
        console.log("[HomePage] Raw vaccine objects:", vaccinesArr);

        // Filter vaccines by pet.id
        const matchingVaccines: any[] = vaccinesArr.filter((vaccine) => {
          const petIdMatch = vaccine.pet && vaccine.pet.id === petData.id;
          console.log("[HomePage] Filtering vaccine:", {
            vaccineId: vaccine.id,
            petId: vaccine.pet?.id,
            actualPetId: petData.id,
            matches: petIdMatch,
          });
          return petIdMatch;
        });

        console.log("[HomePage] matchingVaccines:", matchingVaccines);

        // Extract vaccine IDs for detailed fetching
        const vaccineIds = matchingVaccines
          .map((vaccine) => vaccine.id)
          .filter((id) => id); // Remove any undefined/null IDs

        console.log("[HomePage] Filtered vaccine IDs for pet:", vaccineIds);

        if (vaccineIds.length === 0) {
          setVaccines([]);
          setRawVaccines([]);
        } else {
          // Fetch detailed vaccine information using vaccine IDs
          const detailedVaccines = await fetchVaccineDetails(vaccineIds);
          console.log("[HomePage] Detailed vaccines:", detailedVaccines);

          // Remove duplicates and store raw data
          const uniqueVaccines = removeDuplicateVaccines(detailedVaccines);
          setRawVaccines(uniqueVaccines);

          // Map to VaccineSection shape for display
          const mappedVaccines = uniqueVaccines.map((v: any) => {
            const expiryDate = v.date_due || v.expiry_date || v.expires || "";
            const { soon, warning, relativeExpiry } =
              calculateExpirationWarning(expiryDate, petData?.pet_name);
            return {
              name: v.vaccine_name || v.name || "",
              administered: v.date_administered || v.administered || "",
              expires: relativeExpiry,
              soon,
              warning,
            };
          });
          console.log("[HomePage] mappedVaccines", mappedVaccines);
          setVaccines(mappedVaccines);
        }

        // Documents
        const docsRes = await petServices.getPetDocuments(petData.id);
        let docsArr = Array.isArray(docsRes)
          ? docsRes
          : docsRes
          ? [docsRes]
          : [];
        // Map to DocumentSection shape
        const mappedDocs = docsArr.map((d: any) => {
          let ext = d.document_name?.split(".").pop()?.toLowerCase() || "";
          let type: "pdf" | "img" = ext === "pdf" ? "pdf" : "img";
          return {
            name: d.document_name || d.name || "",
            size: d.size ? `${(d.size / (1024 * 1024)).toFixed(1)} MB` : "",
            type,
          };
        });
        console.log("[HomePage] mappedDocs", mappedDocs);
        setRawDocuments(mappedDocs);

        // Teams - using the same methodology as VaccinesPage
        const teamsRes = await teamServices.getAllTeams();
        console.log("[HomePage] teamsRes:", teamsRes);
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
        console.log("[HomePage] Raw team objects:", teamsArr);
        console.log("[HomePage] All teams with their pet IDs:");
        teamsArr.forEach((team, index) => {
          console.log(`[HomePage] Team ${index}:`, {
            teamId: team.id,
            teamName: team.business?.business_name || "Unknown",
            petId: team.pet?.id || "No pet ID",
            petName: team.pet?.pet_name || "Unknown pet",
          });
        });

        // Filter teams by pet_id
        const matchingTeams: any[] = teamsArr.filter((team) => {
          const petIdMatch = team.pet && team.pet.id === petData.id;
          console.log("[HomePage] Filtering team:", {
            teamId: team.id,
            teamName: team.business?.business_name || "Unknown",
            petId: team.pet?.id,
            actualPetId: petData.id,
            matches: petIdMatch,
          });
          return petIdMatch;
        });

        // TEMPORARY DEBUG: Show all teams to verify API is working
        console.log(
          "[HomePage] TEMPORARY DEBUG - All teams without filtering:",
          teamsArr
        );
        if (teamsArr.length > 0 && matchingTeams.length === 0) {
          console.log(
            "[HomePage] DEBUG: Showing all teams instead of filtered teams"
          );
          // Uncomment the next line to show all teams for debugging
          // const matchingTeams = teamsArr; // This would show all teams
        }

        console.log("[HomePage] matchingTeams:", matchingTeams);

        // Extract team IDs for detailed fetching
        const teamIds = matchingTeams.map((team) => team.id).filter((id) => id); // Remove any undefined/null IDs

        console.log("[HomePage] Filtered team IDs for pet:", teamIds);

        if (teamIds.length === 0) {
          console.log(
            "[HomePage] No teams found for current pet. Available teams:",
            teamsArr.length
          );
          setTeams([]);
          setRawTeams([]);
          if (teamsArr.length > 0) {
            console.log(
              "[HomePage] Teams exist but none match the current pet ID:",
              petData.id
            );
          }
        } else {
          // Fetch detailed team information using team IDs
          const detailedTeams = await fetchTeamDetails(teamIds);
          console.log("[HomePage] Detailed teams:", detailedTeams);

          // Remove duplicates and store raw data
          const uniqueTeams = removeDuplicateTeams(detailedTeams);
          setRawTeams(uniqueTeams);

          // Map to TeamSection shape for display
          const mappedTeams = uniqueTeams.map((t: any) => {
            const b = t.business || {};
            return {
              name: b.business_name || t.name || "",
              type: b.description || t.type || "",
              phone: b.phone || "",
              email: b.email || "",
              address: b.address || "",
              avatar: b.profile_picture_document_id
                ? `/api/v1/documents/${b.profile_picture_document_id}`
                : `https://randomuser.me/api/portraits/men/${
                    Math.floor(Math.random() * 100) + 1
                  }.jpg`,
            };
          });
          console.log("[HomePage] mappedTeams", mappedTeams);
          setTeams(mappedTeams);
        }
      } catch (err: any) {
        console.error("[HomePage] Error fetching homepage data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [petId]);

  const handleEditDocument = (idx: number) => {
    setEditDocIdx(idx);
    setEditDocName(rawDocuments[idx]?.name || "");
  };

  const handleSaveDocumentName = async (newName: string) => {
    if (editDocIdx === null) return;
    try {
      const doc = rawDocuments[editDocIdx];
      if (!doc.id) throw new Error("No document id");
      await petServices.updateDocumentName(doc.id, newName);
      setRawDocuments((prevDocs: any[]) =>
        prevDocs.map((d, i) => (i === editDocIdx ? { ...d, name: newName } : d))
      );
      setEditDocIdx(null);
    } catch (err) {
      setEditDocIdx(null);
    }
  };

  const handleEditVaccine = (idx: number) => {
    console.log("[HomePage] handleEditVaccine called with idx:", idx);
    console.log("[HomePage] rawVaccines at idx:", rawVaccines[idx]);
    console.log("[HomePage] vaccines at idx:", vaccines[idx]);
    setEditVaccineIdx(idx);
  };

  const handleSaveVaccine = async () => {
    // Refetch vaccines after successful edit
    if (pet) {
      try {
        const vaccinesRes = await vaccineServices.getAllPetVaccines(pet.id);
        let vaccinesArr: any[] = [];

        if (vaccinesRes) {
          if (vaccinesRes.data) {
            vaccinesArr = Array.isArray(vaccinesRes.data)
              ? vaccinesRes.data
              : [vaccinesRes.data];
          } else if (Array.isArray(vaccinesRes)) {
            vaccinesArr = vaccinesRes;
          } else if (typeof vaccinesRes === "object" && "id" in vaccinesRes) {
            vaccinesArr = [vaccinesRes];
          }
        }

        const matchingVaccines: any[] = vaccinesArr.filter((vaccine) => {
          const petIdMatch = vaccine.pet && vaccine.pet.id === pet.id;
          return petIdMatch;
        });

        const vaccineIds = matchingVaccines
          .map((vaccine) => vaccine.id)
          .filter((id) => id);

        if (vaccineIds.length > 0) {
          const detailedVaccines = await fetchVaccineDetails(vaccineIds);
          const uniqueVaccines = removeDuplicateVaccines(detailedVaccines);
          setRawVaccines(uniqueVaccines);

          const mappedVaccines = uniqueVaccines.map((v: any) => {
            const expiryDate = v.date_due || v.expiry_date || v.expires || "";
            const { soon, warning, relativeExpiry } =
              calculateExpirationWarning(expiryDate, pet.pet_name);

            return {
              name: v.vaccine_name || v.name || "",
              administered: v.date_administered || v.administered || "",
              expires: relativeExpiry,
              soon,
              warning,
            };
          });
          setVaccines(mappedVaccines);
        }
      } catch (err) {
        console.error("Failed to refetch vaccines after edit:", err);
      }
    }
    setEditVaccineIdx(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
        <Navbar />
        <div className="container mx-auto max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
        <Navbar />
        <div className="container mx-auto max-w-7xl pt-8 pb-12 px-8">
          <div className="text-center">Pet not found</div>
        </div>
      </div>
    );
  }

  // Debug logging for teams
  console.log(
    "[HomePage] Final rawTeams state passed to TeamSection:",
    rawTeams
  );
  console.log("[HomePage] RawTeams array length:", rawTeams.length);

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      <Navbar />
      <div className="container mx-auto max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <span className="inline-block">
            <svg
              className="w-12 h-12 sm:w-4 sm:h-4 md:w-12 md:h-12"
              viewBox="0 0 64 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.0012 14.5001C32.3149 14.5001 35.0012 11.8138 35.0012 8.50012C35.0012 5.18641 32.3149 2.50012 29.0012 2.50012C25.6875 2.50012 23.0012 5.18641 23.0012 8.50012C23.0012 11.8138 25.6875 14.5001 29.0012 14.5001Z"
                stroke="#1C232E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M50.0012 26.5001C53.3149 26.5001 56.0012 23.8138 56.0012 20.5001C56.0012 17.1864 53.3149 14.5001 50.0012 14.5001C46.6875 14.5001 44.0012 17.1864 44.0012 20.5001C44.0012 23.8138 46.6875 26.5001 50.0012 26.5001Z"
                stroke="#1C232E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M56.0012 50.5001C59.3149 50.5001 62.0012 47.8138 62.0012 44.5001C62.0012 41.1864 59.3149 38.5001 56.0012 38.5001C52.6875 38.5001 50.0012 41.1864 50.0012 44.5001C50.0012 47.8138 52.6875 50.5001 56.0012 50.5001Z"
                stroke="#1C232E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23.0012 26.5001C24.971 26.5001 26.9216 26.8881 28.7415 27.6419C30.5613 28.3957 32.2149 29.5006 33.6078 30.8935C35.0007 32.2864 36.1056 33.94 36.8594 35.7599C37.6132 37.5798 38.0012 39.5303 38.0012 41.5001V52.0001C38.0004 54.5095 37.1009 56.9356 35.4657 58.839C33.8304 60.7425 31.5676 61.9973 29.087 62.3763C26.6064 62.7553 24.0721 62.2333 21.9431 60.905C19.8141 59.5767 18.2312 57.5298 17.4812 55.1351C16.2012 51.0051 13.5012 48.3001 9.3812 47.0201C6.98775 46.2705 4.9417 44.6888 3.61328 42.5614C2.28487 40.434 1.76185 37.9014 2.13886 35.4218C2.51588 32.9421 3.76802 30.6794 5.66872 29.043C7.56942 27.4065 9.9931 26.5045 12.5012 26.5001H23.0012Z"
                stroke="#1C232E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">
            Welcome {pet.pet_name}!
          </h1>
        </div>
        {/* Pet Profile and Health Summary Cards */}
        {pet && (
          <div className="flex flex-col md:flex-row gap-6 mb-8 mx-auto w-full">
            {/* Pet Profile Card - image left, details right */}
            <div className="bg-[var(--color-card-profile)] rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-stretch w-full max-w-3xl min-w-[260px] text-[var(--color-white)]">
              {/* Image */}
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-xl overflow-hidden mb-4 md:mb-0 bg-[var(--color-card-profile)] flex items-center justify-center flex-shrink-0">
                <img
                  src={
                    pet.profile_picture ||
                    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80"
                  }
                  alt={pet.pet_name || "Pet"}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Details */}
              <div className="flex-1 flex flex-col justify-center md:pl-8 w-full">
                <div className="text-2xl font-bold mb-2">
                  {pet.pet_name || "Pet"}
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-1 text-base mb-2">
                  <div>
                    <span className="text-[var(--color-text)] opacity-70">
                      Age
                    </span>
                    <div className="font-bold">
                      {pet.age || "Unknown"} years old
                    </div>
                  </div>
                  <div>
                    <span className="text-[var(--color-text)] opacity-70">
                      Gender
                    </span>
                    <div className="font-bold">{pet.gender || "Unknown"}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-1 text-base mb-2">
                  <div>
                    <span className="text-[var(--color-text)] opacity-70">
                      Breed
                    </span>
                    <div className="font-bold">
                      {pet.breed?.breed_name || "Mixed Breed"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[var(--color-text)] opacity-70">
                      Colour
                    </span>
                    <div className="font-bold">{pet.color || "Unknown"}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-1 text-base mb-2">
                  <div>
                    <span className="text-[var(--color-text)] opacity-70">
                      Microchip Number
                    </span>
                    <div className="font-bold">
                      {pet.microchip || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[var(--color-text)] opacity-70">
                      Birthdate
                    </span>
                    <div className="font-bold">{pet.dob || "Unknown"}</div>
                  </div>
                </div>
                {/* Pet Code Example (if available) */}
                {pet.code && (
                  <div className="flex gap-2 mt-2">
                    {pet.code.split("").map((char: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-[var(--color-background)] border border-[var(--color-primary)] rounded-lg px-3 py-1 text-lg font-mono font-bold text-[var(--color-primary)]"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Health Summary Card */}
            <div className="bg-[var(--color-card-health-card)] rounded-2xl p-6 flex flex-col gap-2 flex-1 min-w-[260px] text-[var(--color-text)]">
              <div className="text-xl font-bold mb-2">Health Summary</div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-base mb-2">
                <div>
                  <span className="opacity-70">Spay/Neuter Status</span>
                  <span className="font-bold ml-2">
                    {pet.spay_neuter
                      ? "Spayed/Neutered"
                      : "Not Spayed/Neutered"}
                  </span>
                </div>
                <div>
                  <span className="opacity-70">Weight</span>
                  <span className="font-bold ml-2">
                    {pet.weight ? `${pet.weight} lbs` : "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="opacity-70">Special Notes</span>
                  <span className="font-bold ml-2">
                    {pet.notes || "No special notes"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-base mb-2">
                <div>
                  <span className="opacity-70">Location</span>
                  <span className="font-bold ml-2">
                    {pet.location || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-logo)]">
                <Syringe className="w-7 h-7 text-[var(--color-white)]" />
              </span>
              Vaccines
            </h2>
            <button
              onClick={() => navigate(`/petowner/pet/${petId}/add-vaccine`)}
              className="btn-wide-rounded border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition"
            >
              <PlusCircle className="w-5 h-5" /> Add New Vaccine
            </button>
          </div>
          <VaccineSection
            vaccines={vaccines.slice(0, 3)}
            onEditVaccine={handleEditVaccine}
            onViewAll={() => navigate(`/petowner/pet/${petId}/vaccine`)}
          />
        </div>

        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-logo)]">
                <FileText className="w-7 h-7 text-[var(--color-white)]" />
              </span>
              Recently Uploaded Documents
            </h2>
            <button
              onClick={() => navigate(`/petowner/pet/${petId}/upload`)}
              className="btn-wide-rounded border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold flex items-center gap-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition"
            >
              <FilePlus className="w-5 h-5" /> Upload New Document
            </button>
          </div>
          <DocumentSection
            documents={rawDocuments.slice(0, 6)}
            onEditDocument={handleEditDocument}
            onViewAll={() => navigate(`/petowner/pet/${petId}/documents`)}
          />
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-logo)]">
                <Users className="w-7 h-7 text-[var(--color-white)]" />
              </span>
              Your Teams
            </h2>
            <button
              onClick={() => navigate(`/petowner/pet/${petId}/add-team`)}
              className="btn-wide-rounded border border-[var(--color-primary)] text-[var(--color-primary)] font-semibold flex items-center gap-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition"
            >
              <Users className="w-5 h-5" /> Add New Team
            </button>
          </div>
          <TeamSection
            teams={rawTeams.slice(0, 3)}
            onViewAll={() => navigate(`/petowner/pet/${petId}/team`)}
          />
        </div>
      </div>

      {/* Modals */}
      {editDocIdx !== null && (
        <RenameDocumentModal
          open={true}
          initialName={editDocName}
          onClose={() => setEditDocIdx(null)}
          onSave={handleSaveDocumentName}
        />
      )}
      {editVaccineIdx !== null && (
        <EditVaccineModal
          open={true}
          vaccine={rawVaccines[editVaccineIdx]}
          onClose={() => setEditVaccineIdx(null)}
          onSuccess={handleSaveVaccine}
        />
      )}
    </div>
  );
};

export default HomePage;
