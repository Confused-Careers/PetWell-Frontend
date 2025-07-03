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
import {
  PlusCircle,
  FilePlus,
  Users,
  Syringe,
  FileText,
  PawPrint,
  UploadIcon,
} from "lucide-react";

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

  // Handler to delete a document by index
  const handleDeleteDocument = async (idx: number) => {
    const doc = rawDocuments[idx];
    if (!doc.id) return;
    let deleted = false;
    try {
      await petServices.deleteDocument(doc.id); // Call backend API
      deleted = true;
    } catch (err) {
      alert("Failed to delete document from server. Removing from UI anyway.");
      console.error("Failed to delete document:", err);
    }
    // Always remove from UI for immediate feedback
    setRawDocuments((prevDocs: any[]) => prevDocs.filter((_, i) => i !== idx));
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
    <div className="min-h-screen w-full bg-[var(--color-card)] text-[var(--color-text)] font-sans">
      <Navbar />
      <div className="container mx-auto max-w-7xl pt-6 px-4 pb-12">
        {/* Profile & Health Summary */}
        {pet && (
          <section className="mb-6 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-2xl font-lighter flex items-center gap-3 font-serif">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent">
                  <PawPrint className="w-full h-full text-[var(--color-logo)]" />
                </span>
                Welcome {pet.pet_name}!
              </p>
              <div>
                <button
                  onClick={() => navigate(`/petowner/pet/${petId}/add-vaccine`)}
                  className="w-auto px-10 font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
                >
                  Switch to Another Pet
                </button>
              </div>
            </div>
          </section>
        )}

        {pet && (
          <div className="flex flex-col md:flex-row gap-8 md:gap-10 mb-12 md:mb-16 w-full">
            {/* Pet Profile Card */}
            <div className="border  border-black bg-[var(--color-card-profile)] rounded-3xl p-6 flex flex-col md:flex-row items-center flex-2/3 text-[var(--color-white)] shadow-lg">
              {/* Image */}
              <div className="w-56 h-56 rounded-2xl overflow-hidden bg-[var(--color-card-profile)] flex items-center justify-center">
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
                <div className="text-2xl font-medium mb-2 text-[var(--color-text-bright)]">
                  {pet.pet_name || "Pet"}
                </div>
                <div className="flex flex-wrap gap-x-4 text-base mb-2">
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] opacity-70">
                      Age
                    </span>
                    <div className="text-[var(--color-text-bright)]">
                      {pet.age || "Unknown"} years old
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] opacity-70">
                      Gender
                    </span>
                    <div className="text-[var(--color-text-bright)]">
                      {pet.gender || "Unknown"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] opacity-70">
                      Microchip Number
                    </span>
                    <div className="text-[var(--color-text-bright)]">
                      {pet.microchip || "Unknown"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-1 text-base mb-2">
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] opacity-70">
                      Breed
                    </span>
                    <div className="text-[var(--color-text-bright)]">
                      {pet.breed?.breed_name || "Mixed Breed"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] opacity-70">
                      Colour
                    </span>
                    <div className="text-[var(--color-text-bright)]">
                      {pet.color || "Unknown"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] opacity-70">
                      Birthdate
                    </span>
                    <div className="text-[var(--color-text-bright)]">
                      {pet.dob || "Unknown"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-1 text-base mb-2">
                  <div className="flex gap-2 mb-2 justify-center items-center">
                    <div className="flex flex-col gap-2">
                      <span className="text-[var(--color-text-faded)] opacity-70">
                        {pet?.pet_name}'s Code
                      </span>
                      <div className="flex gap-1">
                        {pet?.qr_code_id
                          ?.split("")
                          .map((char: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex w-6 h-8 font-medium bg-[var(--color-text-bright)] bg-opacity-80 text-[#23272f] text-sm rounded-lg items-center justify-center shadow-sm select-all transition-all duration-150 hover:scale-105 text-center"
                            >
                              {char}
                            </span>
                          ))}
                      </div>
                    </div>
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
            <div className="flex-1/3 border border-[var(--color-primary)] bg-[var(--color-card-health-card)] rounded-3xl p-6 md:p-8 flex flex-col gap-2 flex-1 text-[var(--color-text)] shadow-lg">
              <div className="text-2xl font-semibold mb-2">Health Summary</div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-base mb-2">
                <div>
                  <span className="opacity-70">Spay/Neuter Status:</span>
                  <span className="font-semibold ml-2">
                    {pet.spay_neuter
                      ? "Spayed/Neutered"
                      : "Not Spayed/Neutered"}
                  </span>
                </div>
                <div>
                  <span className="opacity-70">Weight</span>
                  <span className="font-semibold ml-2">
                    {pet.weight ? `${pet.weight} lbs` : "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="opacity-70">Special Notes</span>
                  <span className="font-semibold ml-2">
                    {pet.notes || "No special notes"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-base mb-2">
                <div>
                  <span className="opacity-70">Location</span>
                  <span className="font-semibold ml-2">
                    {pet.location || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vaccine Section */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-2xl font-lighter flex items-center gap-3 font-serif">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-logo)]">
                <Syringe className="w-5 h-5 text-[var(--color-white)]" />
              </span>
              Vaccines
            </p>
            <button
              onClick={() => navigate(`/petowner/pet/${petId}/add-vaccine`)}
              className="w-auto px-10 font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
            >
              <PlusCircle className="w-5 h-5 " /> Add New Vaccine
            </button>
          </div>
          <VaccineSection
            vaccines={vaccines.slice(0, 3)}
            onEditVaccine={handleEditVaccine}
            onViewAll={() => navigate(`/petowner/pet/${petId}/vaccine`)}
          />
        </section>

        {/* Document Section */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-2xl font-lighter flex items-center gap-3 font-serif">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-logo)]">
                <FileText className="w-5 h-5 text-[var(--color-white)]" />
              </span>
              Recently Uploaded Documents
            </p>
            <button
              onClick={() => navigate(`/petowner/pet/${petId}/upload`)}
              className="w-auto px-5 font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
            >
              <UploadIcon className="w-5 h-5" /> Upload New Document
            </button>
          </div>
          <DocumentSection
            documents={rawDocuments.slice(0, 6)}
            onEditDocument={handleEditDocument}
            onDeleteDocument={handleDeleteDocument}
            onViewAll={() => navigate(`/petowner/pet/${petId}/documents`)}
          />
        </section>

        {/* Team Section */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-2xl font-lighter flex items-center gap-3 font-serif">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-logo)]">
                <Users className="w-5 h-5 text-[var(--color-white)]" />
              </span>
              Your Teams
            </p>
            <button
              onClick={() => navigate(`/petowner/pet/${petId}/add-team`)}
              className="w-auto px-12 font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
            >
              <Users className="w-5 h-5" /> Add New Team
            </button>
          </div>
          <TeamSection
            teams={rawTeams.slice(0, 3)}
            onViewAll={() => navigate(`/petowner/pet/${petId}/team`)}
          />
        </section>
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
