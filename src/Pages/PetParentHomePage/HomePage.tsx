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
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../Components/ui/dialog";
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
      <div className="container mx-auto max-w-7xl pt-6 pb-12">
        {/* Profile & Health Summary */}
        {pet && (
          <section className="mb-6 mt-4 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-3xl font-lighter flex items-center gap-3 font-serif">
                <span className="flex items-center justify-center size-8 rounded-full bg-transparent">
                  <PawPrint className="w-full h-full text-[var(--color-text)]" />
                </span>
                Welcome {pet.pet_name}!
              </p>

              <div>
                <button
                  onClick={() =>
                    navigate(`/petowner/pet/${petId}/switch-profile`)
                  }
                  className="w-full sm:w-auto px-4 sm:px-10 font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-1 border border-[#FFB23E] bg-[#FFB23E] text-center"
                >
                  <span className="flex items-center">
                    <RefreshCcw className="w-5 h-5 mr-1" />
                    Switch to Another Pet
                  </span>
                </button>
              </div>
            </div>
          </section>
        )}

        {pet && (
          <div className="flex flex-col md:flex-row gap-8 md:gap-10 mb-12 md:mb-16 w-full px-4">
            {/* Pet Profile Card */}
            <div className="border  border-black bg-[var(--color-card-profile)] rounded-3xl p-6 flex flex-col md:flex-row items-center flex-2/3 text-[var(--color-white)] shadow-lg">
              {/* Image */}
              <div className="w-56 h-56 rounded-2xl overflow-hidden bg-[var(--color-card-profile)] flex items-center justify-center">
                <img
                  src={
                    pet.profilePictureDocument === null
                      ? "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80"
                      : pet.profilePictureDocument?.document_url
                  }
                  alt={pet.pet_name || "Pet"}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Details */}
              <div className="flex-1 flex flex-col justify-center md:pl-6 w-full">
                <div className="text-2xl tracking-tight font-medium font-[Cabin,sans-serif] mb-2 text-[var(--color-text-bright)]">
                  {pet.pet_name || "Pet"}
                </div>
                <div className="flex flex-wrap text-base mb-2 font-[Cabin,sans-serif]">
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] text-sm font-[Cabin,sans-serif]">
                      Age
                    </span>
                    <div className="text-base font-medium text-[var(--color-text-bright)] font-[Cabin,sans-serif]">
                      {pet.age || "Unknown"} years old
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] text-sm font-[Cabin,sans-serif]">
                      Gender
                    </span>
                    <div className="text-base font-medium text-[var(--color-text-bright)] font-[Cabin,sans-serif]">
                      {pet.gender || "Unknown"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-y-1 text-base mb-2 font-[Cabin,sans-serif]">
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] text-sm font-[Cabin,sans-serif]">
                      Breed
                    </span>
                    <div className="text-base font-medium text-[var(--color-text-bright)] font-[Cabin,sans-serif]">
                      {pet.breed?.breed_name || "Mixed Breed"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[var(--color-text-faded)] text-sm font-[Cabin,sans-serif]">
                      Colour
                    </span>
                    <div className="text-base font-medium  text-[var(--color-text-bright)] font-[Cabin,sans-serif]">
                      {pet.color || "Unknown"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 font-[Cabin,sans-serif]">
                  <span className="text-[var(--color-text-faded)] text-md uppercase font-semibold font-[Cabin,sans-serif]">
                    {pet?.pet_name}'s Code
                  </span>
                  <div className="flex gap-1 mb-2 items-center">
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="ml-4 flex cursor-pointer items-center gap-2 bg-[var(--color-card-button)] text-[#23272f] px-3 py-1 rounded-full font-semibold text-sm hover:opacity-90"
                          title="Show QR Code"
                          type="button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="21"
                            viewBox="0 0 24 25"
                            fill="none"
                          >
                            <g clipPath="url(#clip0_1021_7408)">
                              <path
                                d="M12 3.3125V5.1875H10.125V3.3125H12ZM10.125 14.3281V17H12V14.3281H10.125ZM15.75 24.5V22.625H13.875V20.75H12V24.5H15.75ZM19.5 10.5781H13.875V12.4531H19.5V10.5781ZM19.5 14.3281H22.125V12.4531H19.5V14.3281ZM19.5 17V18.875H24V14.3281H22.125V17H19.5ZM13.875 0.5H12V3.3125H13.875V0.5ZM12 8.9375H13.875V5.1875H12V7.0625H10.125V12.4531H12V8.9375ZM0 10.5781V14.3281H1.875V12.4531H4.6875V10.5781H0ZM13.875 14.3281V12.4531H12V14.3281H13.875ZM17.625 16.2031H19.5V14.3281H17.625V16.2031ZM22.125 12.4531H24V10.5781H22.125V12.4531ZM15.75 14.3281H13.875V17H12V18.875H15.75V14.3281ZM10.125 20.75H12V18.875H10.125V20.75ZM15.75 18.875V20.75H19.5V18.875H15.75ZM21.375 22.625V20.75H19.5V22.625H21.375ZM24 24.5V22.625H21.375V24.5H24ZM17.625 24.5H19.5V22.625H17.625V24.5ZM8.4375 12.4531V10.5781H6.5625V12.4531H4.6875V14.3281H10.125V12.4531H8.4375ZM8.4375 8.9375H0V0.5H8.4375V8.9375ZM6.5625 2.375H1.875V7.0625H6.5625V2.375ZM5.15625 3.78125H3.28125V5.65625H5.15625V3.78125ZM24 0.5V8.9375H15.5625V0.5H24ZM22.125 2.375H17.4375V7.0625H22.125V2.375ZM20.7188 3.78125H18.8438V5.65625H20.7188V3.78125ZM0 16.0625H8.4375V24.5H0V16.0625ZM1.875 22.625H6.5625V17.9375H1.875V22.625ZM3.28125 21.2188H5.15625V19.3438H3.28125V21.2188Z"
                                fill="black"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_1021_7408">
                                <rect
                                  width="24"
                                  height="24"
                                  fill="white"
                                  transform="translate(0 0.5)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                          <span className="hidden sm:inline">View QR</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="flex flex-col items-center bg-[var(--color-card-profile)] rounded-2xl border border-[var(--color-primary)] p-8 shadow-2xl max-w-xs w-full">
                        <DialogTitle className="text-xl font-bold text-[var(--color-primary)] mb-2">
                          Pet QR Code
                        </DialogTitle>
                        <div className="my-4 flex flex-col items-center">
                          <div className="bg-white p-4 rounded-xl shadow-md border border-[var(--color-primary)]">
                            <QRCode value={pet?.qr_code_id || ""} size={180} />
                          </div>
                          <button
                            className="mt-4 px-3 flex-1 cursor-pointer text-[var(--color-text)] bg-[var(--color-card-button)] hover:opacity-90 py-2 rounded-3xl font-semibold transition text-base"
                            onClick={() => {
                              const svg = document.querySelector(
                                "[data-slot='dialog-content'] svg"
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
                        <div className="text-center text-sm text-[var(--color-text)] mt-2">
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
              <p className="text-2xl font-medium font-[Cabin,sans-serif] mb-4 text-[#1C232E] tracking-tight">
                Health Summary
              </p>
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
                  {pet.last_visit && Object.keys(pet.last_visit).length > 0 && (
                    <>
                      <span className="mx-2 text-[#1C232E]/40 text-lg font-bold">
                        |
                      </span>
                      <span className="font-medium">
                        {`${pet.last_visit.staff?.staff_name || "--"}, ${
                          pet.last_visit.business?.business_name || "--"
                        }`}
                      </span>
                    </>
                  )}
                </div>
                {pet.last_visit && Object.keys(pet.last_visit).length > 0 && (
                  <button
                    className="mt-2 cursor-pointer font-semibold text-base text-[#1C232E] flex items-center gap-1 font-[Cabin,sans-serif]"
                    onClick={() => navigate(`/petowner/pet/${petId}/documents`)}
                  >
                    View Document{" "}
                    <IoIosArrowDroprightCircle className="text-lg" />
                  </button>
                )}
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
                  {pet.next_due_vaccine &&
                    Object.keys(pet.next_due_vaccine).length > 0 && (
                      <>
                        <span className="mx-2 text-[#1C232E]/40 text-lg font-bold">
                          |
                        </span>
                        {pet.next_due_vaccine?.date_due ? (
                          (() => {
                            const daysLeft = Math.max(
                              0,
                              Math.ceil(
                                (new Date(
                                  pet.next_due_vaccine.date_due
                                ).getTime() -
                                  new Date().setHours(0, 0, 0, 0)) /
                                  (1000 * 60 * 60 * 24)
                              )
                            );
                            return (
                              <span className="font-semibold flex items-center gap-1 text-[#1C232E]">
                                In {daysLeft} days
                                {daysLeft <= 6 && (
                                  <FaCircleExclamation className="text-[#B91C1C] text-base" />
                                )}
                              </span>
                            );
                          })()
                        ) : (
                          <span className="text-[#B91C1C] font-semibold">
                            --
                          </span>
                        )}
                      </>
                    )}
                </div>
                {pet.next_due_vaccine &&
                  Object.keys(pet.next_due_vaccine).length > 0 && (
                    <button
                      className="mt-2 cursor-pointer font-semibold text-base text-[#1C232E] flex items-center gap-1 font-[Cabin,sans-serif]"
                      onClick={() => navigate(`/petowner/pet/${petId}/vaccine`)}
                    >
                      View Document{" "}
                      <IoIosArrowDroprightCircle className="text-lg" />
                    </button>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Vaccine Section */}
        <section className="mb-6 px-4">
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
        <section className="mb-6 px-4">
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
        <section className="mb-6 px-4">
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
