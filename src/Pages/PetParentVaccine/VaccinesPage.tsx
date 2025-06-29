import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar";
import VaccineInfo from "../../Components/Vaccine/VaccineInfo";
import EditVaccineModal from "../../Components/Vaccine/EditVaccineModal";
import vaccineServices from "../../Services/vaccineServices";
import petServices from "../../Services/petServices";

const VaccinesPage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pet, setPet] = useState<any>(null);
  const [actualPetId, setActualPetId] = useState<string | null>(null);

  // Helper function to remove duplicate vaccines based on ID and key fields
  const removeDuplicateVaccines = (vaccinesArr: any[]): any[] => {
    const seen = new Set();
    return vaccinesArr.filter((vaccine) => {
      const key = [
        vaccine.id,
        vaccine.vaccine_name || vaccine.name,
        vaccine.date_administered || vaccine.administered_date || vaccine.administered,
        vaccine.date_due || vaccine.expiry_date || vaccine.expires,
        vaccine.staff_id || vaccine.administered_by || ""
      ].join("|");
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
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

  // Function to refetch vaccines data
  const refetchVaccines = async () => {
    if (!actualPetId) return;

    try {
      // Fetch vaccines for the pet
      const vaccinesRes = await vaccineServices.getAllPetVaccines(actualPetId);
      console.log("vaccinesRes (pet-specific):", vaccinesRes);
      let vaccinesArr: any[] = [];

      // Handle different response structures
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
      console.log("Raw vaccine objects:", vaccinesArr);

      // Filter vaccines by pet.id
      const matchingVaccines: any[] = vaccinesArr.filter((vaccine) => {
        const petIdMatch = vaccine.pet && vaccine.pet.id === actualPetId;
        console.log("Filtering vaccine:", {
          vaccineId: vaccine.id,
          petId: vaccine.pet?.id,
          actualPetId,
          matches: petIdMatch,
        });
        return petIdMatch;
      });

      console.log("matchingVaccines:", matchingVaccines);

      // Remove duplicates before setting state
      const uniqueVaccines = removeDuplicateVaccines(matchingVaccines);
      console.log("uniqueVaccines:", uniqueVaccines);
      setVaccines(uniqueVaccines);
      setError(
        uniqueVaccines.length === 0 ? "No vaccines found for this pet." : null
      );
    } catch (err) {
      console.error("Failed to fetch vaccines:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch vaccines. Please check the server connection."
      );
      setVaccines([]);
    }
  };

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        console.log("petId:", petId);
        if (!petId) {
          setError("No pet ID provided");
          setLoading(false);
          return;
        }

        let currentPetId = petId;

        // If petId is "default", fetch the first available pet
        if (petId === "default") {
          const petsRes = await petServices.getPetsByOwner();
          let petsArr = Array.isArray(petsRes) ? petsRes : petsRes.data;
          console.log("petsArr:", petsArr);
          if (!petsArr) petsArr = [];
          if (!Array.isArray(petsArr)) petsArr = [petsArr];

          if (petsArr.length === 0) {
            setError("No pets found. Please create a pet profile first.");
            setLoading(false);
            return;
          }

          // Use the first pet's ID
          currentPetId = petsArr[0].id;
          setActualPetId(currentPetId);
        } else {
          setActualPetId(currentPetId);
        }

        // Fetch pet details
        const petRes = await petServices.getPetById(currentPetId);
        console.log("petRes:", petRes);
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

        console.log("petData:", petData);
        setPet(petData);

        if (!petData) {
          console.error("Pet data not found for ID:", currentPetId);
          setError("Pet not found");
          setLoading(false);
          return;
        }

        // Fetch vaccines for the pet
        const vaccinesRes = await vaccineServices.getAllPetVaccines(
          currentPetId
        );
        console.log("vaccinesRes (pet-specific):", vaccinesRes);
        let vaccinesArr: any[] = [];

        // Handle different response structures
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
        console.log("Raw vaccine objects:", vaccinesArr);

        // Filter vaccines by pet.id
        const matchingVaccines: any[] = vaccinesArr.filter((vaccine) => {
          const petIdMatch = vaccine.pet && vaccine.pet.id === currentPetId;
          console.log("Filtering vaccine:", {
            vaccineId: vaccine.id,
            petId: vaccine.pet?.id,
            actualPetId: currentPetId,
            matches: petIdMatch,
          });
          return petIdMatch;
        });

        console.log("matchingVaccines:", matchingVaccines);
        // Remove duplicates before setting state
        const uniqueVaccines = removeDuplicateVaccines(matchingVaccines);
        setVaccines(uniqueVaccines);
        setError(
          uniqueVaccines.length === 0 ? "No vaccines found for this pet." : null
        );
      } catch (err) {
        console.error("Failed to fetch vaccines:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch vaccines. Please check the server connection."
        );
        setVaccines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccines();
  }, [petId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
        <Navbar />
        <div className="container mx-auto max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
          <div className="text-center">Loading vaccines...</div>
        </div>
      </div>
    );
  }

  if (!pet && !actualPetId) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
        <Navbar />
        <div className="container mx-auto max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
          <div className="text-center">
            {error || "No pets found. Please create a pet profile first."}
          </div>
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
            {pet?.pet_name || "Pet"}'s Vaccines
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() =>
                navigate(`/petowner/pet/${actualPetId}/download-select`)
              }
              className="border border-[var(--color-primary)] text-[var(--color-primary)] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition text-sm sm:text-base"
            >
              <span className="text-lg">+</span> Download Vaccine records
            </button>
            <button
              onClick={() =>
                navigate(`/petowner/pet/${actualPetId}/add-vaccine`)
              }
              className="border border-[var(--color-primary)] text-[var(--color-primary)] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition text-sm sm:text-base"
            >
              <span className="text-lg">+</span> Add New Vaccine
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {vaccines.map((vaccine, index) => {
            const expiryDate =
              vaccine.date_due || vaccine.expiry_date || vaccine.expires || "";
            const { soon, warning, relativeExpiry } =
              calculateExpirationWarning(expiryDate, pet?.pet_name);
            return (
              <VaccineInfo
                key={vaccine.id}
                name={vaccine.vaccine_name || vaccine.name || "Unknown Vaccine"}
                administered={
                  vaccine.date_administered ||
                  vaccine.administered_date ||
                  vaccine.administered ||
                  "Unknown"
                }
                expires={relativeExpiry}
                soon={soon}
                warning={warning}
                showEdit={true}
                onEdit={() => setEditIdx(index)}
              />
            );
          })}
        </div>

        {vaccines.length === 0 && !error && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-base sm:text-lg mb-4">No vaccines found</div>
            <button
              onClick={() =>
                navigate(`/petowner/pet/${actualPetId}/add-vaccine`)
              }
              className="bg-[var(--color-primary)] text-[var(--color-background)] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition text-sm sm:text-base"
            >
              Add Your First Vaccine
            </button>
          </div>
        )}

        {editIdx !== null && (
          <EditVaccineModal
            open={true}
            vaccine={vaccines[editIdx]}
            onClose={() => setEditIdx(null)}
            onSuccess={refetchVaccines}
          />
        )}
      </div>
    </div>
  );
};

export default VaccinesPage;
