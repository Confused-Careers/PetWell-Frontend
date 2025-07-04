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
  Users,
  Syringe,
  FileText,
  PawPrint,
  UploadIcon,
  RefreshCcw,
  PlusCircle,
} from "lucide-react";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { FaCircleExclamation } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import QRCode from "react-qr-code";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [rawVaccines, setRawVaccines] = useState<any[]>([]);
  const [rawDocuments, setRawDocuments] = useState<any[]>([]);
  const [, setTeams] = useState<any[]>([]);
  const [rawTeams, setRawTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [, setPetName] = useState<string>("My Pet");
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
      setLoading(true);
      setError(null);
      try {
        if (!petId) {
          setLoading(false);
          return;
        }
        const petRes = await petServices.getPetById(petId);
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
        console.log("[HomePage] Fetched pet data:", petData);
        setPet(petData);
        setPetName(petData.pet_name || "My Pet");
        console.log("peyt:", pet);

        // Vaccines - using the same methodology as VaccinesPage
        const vaccinesRes = await vaccineServices.getAllPetVaccines(petData.id);
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

        // Filter vaccines by pet.id
        const matchingVaccines: any[] = vaccinesArr.filter((vaccine) => {
          const petIdMatch = vaccine.pet && vaccine.pet.id === petData.id;
          return petIdMatch;
        });

        // Extract vaccine IDs for detailed fetching
        const vaccineIds = matchingVaccines
          .map((vaccine) => vaccine.id)
          .filter((id) => id); // Remove any undefined/null IDs

        if (vaccineIds.length === 0) {
          setVaccines([]);
          setRawVaccines([]);
        } else {
          // Fetch detailed vaccine information using vaccine IDs
          const detailedVaccines = await fetchVaccineDetails(vaccineIds);

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
            id: d.id,
            name: d.document_name || d.name || "",
            size: d.size ? `${(d.size / (1024 * 1024)).toFixed(1)} MB` : "",
            type,
            url: d.document_url,
          };
        });
        setRawDocuments(mappedDocs);

        // Teams - using the same methodology as VaccinesPage
        const teamsRes = await teamServices.getAllTeams();
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

        // Filter teams by pet_id
        const matchingTeams: any[] = teamsArr.filter((team) => {
          const petIdMatch = team.pet && team.pet.id === petData.id;
          return petIdMatch;
        });

        // Extract team IDs for detailed fetching
        const teamIds = matchingTeams.map((team) => team.id).filter((id) => id); // Remove any undefined/null IDs

        if (teamIds.length === 0) {
          setTeams([]);
          setRawTeams([]);
          if (teamsArr.length > 0) {
            // If no matching teams but teams exist, show a message
            console.warn("[HomePage] No matching teams found for this pet.");
          }
        } else {
          // Fetch detailed team information using team IDs
          const detailedTeams = await fetchTeamDetails(teamIds);

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

  const handleSaveDocumentName = async (newName: string) => {
    try {
      if (editDocIdx === null) throw new Error("No document selected");
      const doc = rawDocuments[editDocIdx];
      if (!doc.id) throw new Error("No document ID");
      await petServices.updateDocumentName(doc.id, newName);
      setEditDocIdx(null);
      setEditDocName("");
    } catch (err) {
      console.error("Failed to rename document:", err);
    }
  };

  const handleDeleteDocument = async (idx: number) => {
    try {
      const doc = rawDocuments[idx];
      if (!doc.id) throw new Error("No document ID");
      await petServices.deleteDocument(doc.id);
      setRawDocuments((prevDocs: any[]) =>
        prevDocs.filter((_, i) => i !== idx)
      );
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const handleEditVaccine = (idx: number) => {
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

  return (
    <div className="min-h-screen w-full bg-[var(--color-card)] text-[var(--color-text)] font-sans">
      <Navbar />
      <div className="container mx-auto max-w-7xl pt-6 px-4 pb-12">
        {/* Profile & Health Summary */}
        {pet && (
          <section className="mb-6 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              {/* <p className="text-2xl font-lighter flex items-center gap-3 font-serif">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent">
                  <PawPrint className="w-full h-full text-[var(--color-logo)]" />
                </span>
                Welcome {pet.pet_name}!
              </p> */}
              <p className="text-2xl font-semibold font-[Cabin,sans-serif] flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-transparent">
                  <PawPrint className="w-full h-full text-[var(--color-logo)]" />
                </span>
                Welcome {pet.pet_name}!
              </p>
              <div>
                <button
                  onClick={() => navigate(`/petowner/pet/switch-profile`)}
                  className="w-auto px-10 font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E]"
                >
                  <RefreshCcw className="w-5 h-5" /> Switch to Another Pet
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
                    pet.profilePictureDocument === null
                      ? `https://dog.ceo/api/breeds/image/random`
                      : pet.profilePictureDocument.document_url
                  }
                  alt={pet.pet_name || "Pet"}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Details */}
              <div className="flex-1 flex flex-col justify-center md:pl-6 w-full">
                <div className="text-3xl tracking-tight font-semibold font-[Cabin,sans-serif] mb-2 text-[var(--color-text-bright)]">
                  {pet.pet_name || "Pet"}
                </div>
                <div className="flex flex-wrap text-base mb-2 font-[Cabin,sans-serif]">
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] text-sm font-[Cabin,sans-serif]">
                      Age
                    </span>
                    <div className="text-base font-semibold text-[var(--color-text-bright)] font-[Cabin,sans-serif]">
                      {pet.age || "Unknown"} years old
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] text-sm font-[Cabin,sans-serif]">
                      Gender
                    </span>
                    <div className="text-base font-semibold text-[var(--color-text-bright)] font-[Cabin,sans-serif]">
                      {pet.gender || "Unknown"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-y-1 text-base mb-2 font-[Cabin,sans-serif]">
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] text-sm font-[Cabin,sans-serif]">
                      Breed
                    </span>
                    <div className="text-base font-semibold text-[var(--color-text-bright)] font-[Cabin,sans-serif]">
                      {pet.breed?.breed_name || "Mixed Breed"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] text-sm font-[Cabin,sans-serif]">
                      Colour
                    </span>
                    <div className="text-base font-semibold text-[var(--color-text-bright)] font-[Cabin,sans-serif]">
                      {pet.color || "Unknown"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 font-[Cabin,sans-serif]">
                  <span className="text-[var(--color-text-faded)] text-md uppercase font-semibold font-[Cabin,sans-serif]">
                    {pet?.pet_name}'s Code
                  </span>
                  <div className="flex gap-1 mb-2">
                    {pet?.qr_code_id
                      ?.split("")
                      .map((char: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex w-8 h-10  bg-[var(--color-text-bright)] bg-opacity-80 text-[#23272f] text-2xl rounded-lg items-center justify-center select-all transition-all duration-150 hover:scale-105 text-center font-[Alike]"
                        >
                          {char}
                        </span>
                      ))}
                  </div>
                  <div className="w-full flex justify-start">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="cursor-pointer text-[var(--color-text)] bg-[#FFB23E] hover:opacity-90 py-2 px-8 rounded-3xl font-semibold transition text-base shadow-md font-[Cabin,sans-serif]"
                          title="Show QR Code"
                          type="button"
                        >
                          View QR Code
                        </button>
                      </DialogTrigger>
                      <DialogContent className="flex flex-col items-center bg-[#7A93A3] rounded-2xl border border-black p-8 shadow-2xl max-w-md w-full">
                        <DialogTitle className="text-3xl font-bold text-[#23272f] mb-6 text-center font-[Cabin,sans-serif]">
                          Pet QR Code
                        </DialogTitle>
                        <div className="my-4 flex flex-col items-center">
                          <div className="bg-white p-4 rounded-xl shadow-md border border-[#23272f]">
                            <QRCode value={pet?.qr_code_id || ""} size={180} />
                          </div>
                          <button
                            className="mt-6 px-6 py-2 cursor-pointer text-[#23272f] bg-[#FFB23E] hover:opacity-90 rounded-2xl font-semibold transition text-base shadow font-[Cabin,sans-serif]"
                            onClick={() => {
                              const svg = document.querySelector(
                                '[data-slot="dialog-content"] svg, .radix-dialog-content svg, .DialogContent svg, .bg-white svg'
                              );
                              if (!svg) return;
                              const serializer = new XMLSerializer();
                              const source = serializer.serializeToString(svg);
                              const url =
                                "data:image/svg+xml;charset=utf-8," +
                                encodeURIComponent(source);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `${
                                pet?.pet_name || "pet"
                              }-qr.svg`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            Download QR
                          </button>
                        </div>
                        <div className="text-center text-sm text-[#23272f] mt-4 font-[Cabin,sans-serif]">
                          Scan this QR code to add this pet to a business
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
            {/* Health Summary Card */}
            <div className="bg-[#EDCC79] rounded-2xl p-6 border border-black flex flex-col md:basis-2/5 md:max-w-[40%] w-full">
              <h2 className="text-md font-semibold font-[Cabin,sans-serif] mb-4 text-[#1C232E] tracking-tight">
                Health Summary
              </h2>
              {/* Last Vet Visit */}
              <div className="mb-6">
                <div className="text-[#1C232E]/60 mb-1 text-sm font-[Cabin,sans-serif]">
                  Last Vet Visit
                </div>
                <div className="flex flex-wrap items-center gap-2 text-base text-[#1C232E] font-[Cabin,sans-serif]">
                  <span className="font-bold">
                    {!pet.last_visit || Object.keys(pet.last_visit).length === 0
                      ? "--"
                      : new Date(pet.last_visit.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "2-digit",
                          }
                        )}
                  </span>
                  <span className="mx-2 text-[#1C232E]/40 text-lg font-bold">
                    |
                  </span>
                  <span className="font-medium">
                    {!pet.last_visit || Object.keys(pet.last_visit).length === 0
                      ? "--"
                      : `${pet.last_visit.staff?.staff_name || "--"}, ${
                          pet.last_visit.business?.business_name || "--"
                        }`}
                  </span>
                </div>
                <button
                  className="mt-2 font-semibold text-base text-[#1C232E] flex items-center gap-1 hover:underline font-[Cabin,sans-serif]"
                  onClick={() => navigate(`/petowner/pet/${petId}/documents`)}
                >
                  View Document{" "}
                  <IoIosArrowDroprightCircle className="text-lg" />
                </button>
              </div>
              {/* Next Vaccine Due */}
              <div>
                <div className="text-[#1C232E]/60 mb-1 text-sm font-[Cabin,sans-serif]">
                  Next Vaccine Due
                </div>
                <div className="flex flex-wrap items-center gap-2 text-base font-[Cabin,sans-serif]">
                  <span className="font-bold text-[#1C232E]">
                    {!pet.next_due_vaccine ||
                    Object.keys(pet.next_due_vaccine).length === 0
                      ? "--"
                      : pet.next_due_vaccine.vaccine_name}
                  </span>
                  <span className="mx-2 text-[#1C232E]/40 text-lg font-bold">
                    |
                  </span>
                  {pet.next_due_vaccine?.date_due ? (
                    <span className="text-[#B91C1C] font-semibold flex items-center gap-1">
                      In{" "}
                      {Math.max(
                        0,
                        Math.ceil(
                          (new Date(pet.next_due_vaccine.date_due).getTime() -
                            new Date().setHours(0, 0, 0, 0)) /
                            (1000 * 60 * 60 * 24)
                        )
                      )}{" "}
                      days
                      <FaCircleExclamation className="text-base" />
                    </span>
                  ) : (
                    <span className="text-[#B91C1C] font-semibold">--</span>
                  )}
                </div>
                <button
                  className="mt-2 font-semibold text-base text-[#1C232E] flex items-center gap-1 hover:underline font-[Cabin,sans-serif]"
                  onClick={() => navigate(`/petowner/pet/${petId}/documents`)}
                >
                  View Document{" "}
                  <IoIosArrowDroprightCircle className="text-lg" />
                </button>
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
            onEditDocument={async (index: number, newName: string) => {
              setEditDocIdx(index);
              setEditDocName(newName);
            }}
            onDeleteDocument={handleDeleteDocument}
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
