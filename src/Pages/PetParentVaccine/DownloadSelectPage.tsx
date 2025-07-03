import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar";
import VaccineInfo from "../../Components/Vaccine/VaccineInfo";
import vaccineServices from "../../Services/vaccineServices";
import petServices from "../../Services/petServices";
import { IoIosArrowDropleftCircle } from "react-icons/io";

import {
  generateVaccinePDF,
} from "../../Services/pdfServices";

// Helper function to determine vaccine status
const processVaccine = (vaccine: any) => {
  const newVaccine = { ...vaccine };
  const expiryDateStr =
    newVaccine.expiry_date || newVaccine.date_due || newVaccine.expires;

  if (expiryDateStr) {
    const expiryDate = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (expiryDate < today) {
      newVaccine.status = "expired";
      newVaccine.warning = "This vaccine has expired.";
    } else if (expiryDate <= thirtyDaysFromNow) {
      newVaccine.status = "expiring";
      newVaccine.warning = `This vaccine will expire in less than 30 days.`;
    } else {
      newVaccine.status = "valid";
    }
    newVaccine.soon = newVaccine.status !== "valid";
  } else {
    newVaccine.status = "valid";
    newVaccine.soon = false;
  }

  return newVaccine;
};

const DownloadSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pet, setPet] = useState<any>(null);
  const [, setActualPetId] = useState<string | null>(null);

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

        // Process vaccines to add status
        const processedVaccines = uniqueVaccines.map(processVaccine);

        setVaccines(processedVaccines);
        setError(
          processedVaccines.length === 0
            ? "No vaccines found for this pet."
            : null
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

  const allSelected = selected.length === vaccines.length;

  const toggleSelect = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const selectAll = () => {
    setSelected(allSelected ? [] : vaccines.map((_, idx) => idx));
  };

  const handleDownload = () => {
    if (selected.length === 0) return;

    const selectedVaccines = selected.map((idx) => vaccines[idx]);

    try {
      // Generate PDF with selected vaccines
      const filename = generateVaccinePDF(vaccines, pet, selectedVaccines);
      alert(`PDF downloaded successfully: ${filename}`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
        <Navbar />
        <div className="container mx-auto max-w-7xl pt-8 pb-12 px-8">
          <div className="text-center">Loading vaccines...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
        <Navbar />
        <div className="container mx-auto max-w-7xl pt-8 pb-12 px-8">
          <div className="text-center text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      <Navbar />
      <div className="container mx-auto max-w-7xl pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[var(--color-text)] text-base font-medium cursor-pointer w-fit mb-2"
            >
              <IoIosArrowDropleftCircle /> Go Back
            </button>
            <p className="text-2xl font-lighter flex items-center gap-3 font-serif">
              Select the records you want to download
            </p>
          </div>
          <button
            onClick={handleDownload}
            disabled={selected.length === 0}
            className="w-auto px-10 font-semibold cursor-pointer py-2 rounded-3xl text-[var(--color-black)] font-[Cabin,sans-serif] hover:opacity-80 transition-all duration-200 flex items-center justify-center gap-2 border border-[#FFB23E] bg-[#FFB23E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download Selected Records ({selected.length})
          </button>
        </div>
        <div className="flex items-center mb-4">
          <span
            className="flex items-center justify-center mr-2 cursor-pointer"
            style={{ width: 24, height: 24, aspectRatio: '1/1' }}
            onClick={selectAll}
            tabIndex={0}
            role="checkbox"
            aria-checked={allSelected}
          >
            {allSelected ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="5" width="28.75" height="30" rx="4" fill="#1C232E"/>
                <path d="M12 20.5L18 26.5L28 15.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
                <path d="M10.7917 35H29.9583C31.2288 34.9986 32.4468 34.4714 33.3451 33.534C34.2434 32.5966 34.7487 31.3257 34.75 30V10C34.7487 8.67434 34.2434 7.40337 33.3451 6.46599C32.4468 5.5286 31.2288 5.00138 29.9583 5H10.7917C9.52124 5.00138 8.30323 5.5286 7.4049 6.46599C6.50658 7.40337 6.00132 8.67434 6 10V30C6.00132 31.3257 6.50658 32.5966 7.4049 33.534C8.30323 34.4714 9.52124 34.9986 10.7917 35ZM7.91667 10C7.91753 9.20463 8.22071 8.44209 8.75969 7.87967C9.29867 7.31726 10.0294 7.0009 10.7917 7H29.9583C30.7206 7.0009 31.4513 7.31726 31.9903 7.87967C32.5293 8.44209 32.8325 9.20463 32.8333 10V30C32.8325 30.7954 32.5293 31.5579 31.9903 32.1203C31.4513 32.6827 30.7206 32.9991 29.9583 33H10.7917C10.0294 32.9991 9.29867 32.6827 8.75969 32.1203C8.22071 31.5579 7.91753 30.7954 7.91667 30V10Z" fill="#1C232E"/>
              </svg>
            )}
          </span>
          <label
            className="text-[var(--color-text)] font-cabin text-base cursor-pointer"
            onClick={selectAll}
          >
            Select All Records
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaccines.map((vaccine, idx) => {
            const isSelected = selected.includes(idx);
            return (
              <div key={vaccine.id || idx} className="relative">
                {/* Custom Checkbox at top-right */}
                <span
                  className="flex items-center justify-center absolute top-4 right-4 z-10 cursor-pointer"
                  style={{ width: 40, height: 40, aspectRatio: '1/1' }}
                  onClick={() => toggleSelect(idx)}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={isSelected}
                >
                  {isSelected ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <rect x="6" y="5" width="28.75" height="30" rx="4" fill="#1C232E"/>
                      <path d="M12 20.5L18 26.5L28 15.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M10.7917 35H29.9583C31.2288 34.9986 32.4468 34.4714 33.3451 33.534C34.2434 32.5966 34.7487 31.3257 34.75 30V10C34.7487 8.67434 34.2434 7.40337 33.3451 6.46599C32.4468 5.5286 31.2288 5.00138 29.9583 5H10.7917C9.52124 5.00138 8.30323 5.5286 7.4049 6.46599C6.50658 7.40337 6.00132 8.67434 6 10V30C6.00132 31.3257 6.50658 32.5966 7.4049 33.534C8.30323 34.4714 9.52124 34.9986 10.7917 35ZM7.91667 10C7.91753 9.20463 8.22071 8.44209 8.75969 7.87967C9.29867 7.31726 10.0294 7.0009 10.7917 7H29.9583C30.7206 7.0009 31.4513 7.31726 31.9903 7.87967C32.5293 8.44209 32.8325 9.20463 32.8333 10V30C32.8325 30.7954 32.5293 31.5579 31.9903 32.1203C31.4513 32.6827 30.7206 32.9991 29.9583 33H10.7917C10.0294 32.9991 9.29867 32.6827 8.75969 32.1203C8.22071 31.5579 7.91753 30.7954 7.91667 30V10Z" fill="#1C232E"/>
                    </svg>
                  )}
                </span>
                <VaccineInfo
                  name={
                    vaccine.vaccine_name || vaccine.name || "Unknown Vaccine"
                  }
                  administered={
                    vaccine.date_administered ||
                    vaccine.administered_date ||
                    vaccine.administered ||
                    "Unknown"
                  }
                  expires={
                    vaccine.date_due ||
                    vaccine.expiry_date ||
                    vaccine.expires ||
                    "Unknown"
                  }
                  soon={vaccine.soon || false}
                  warning={vaccine.warning || ""}
                />
              </div>
            );
          })}
        </div>

        {vaccines.length === 0 && !error && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-base sm:text-lg mb-4">
              No vaccines found
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-[var(--color-primary)] text-[var(--color-background)] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-[var(--color-accent-hover)] transition text-sm sm:text-base"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadSelectPage;
