import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar";
import VaccineInfo from "../../Components/Vaccine/VaccineInfo";
import vaccineServices from "../../Services/vaccineServices";
import petServices from "../../Services/petServices";
import { generateVaccinePDF, generateDetailedVaccinePDF } from "../../Services/pdfServices";

const DownloadSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pet, setPet] = useState<any>(null);
  const [actualPetId, setActualPetId] = useState<string | null>(null);

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
        const vaccinesRes = await vaccineServices.getAllPetVaccines(currentPetId);
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
        setError(uniqueVaccines.length === 0 ? "No vaccines found for this pet." : null);
      } catch (err) {
        console.error("Failed to fetch vaccines:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch vaccines. Please check the server connection.");
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
    
    const selectedVaccines = selected.map(idx => vaccines[idx]);
    
    try {
      // Generate PDF with selected vaccines
      const filename = generateVaccinePDF(vaccines, pet, selectedVaccines);
      alert(`PDF downloaded successfully: ${filename}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleDownloadDetailed = () => {
    if (selected.length === 0) return;
    
    const selectedVaccines = selected.map(idx => vaccines[idx]);
    
    try {
      // Generate detailed PDF with selected vaccines
      const filename = generateDetailedVaccinePDF(vaccines, pet, selectedVaccines);
      alert(`Detailed PDF downloaded successfully: ${filename}`);
    } catch (error) {
      console.error('Error generating detailed PDF:', error);
      alert('Error generating detailed PDF. Please try again.');
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">
            Download Vaccine Records
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleDownload}
              disabled={selected.length === 0}
              className="border border-[var(--color-primary)] text-[var(--color-primary)] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download Summary
            </button>
            <button
              onClick={handleDownloadDetailed}
              disabled={selected.length === 0}
              className="border border-[var(--color-primary)] text-[var(--color-primary)] px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download Detailed
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={selectAll}
            className="accent-[var(--color-primary)] w-4 h-4 mr-2"
            id="select-all-checkbox"
          />
          <label htmlFor="select-all-checkbox" className="text-[var(--color-text)] font-cabin text-base cursor-pointer">
            Select All
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {vaccines.map((vaccine, idx) => (
            <VaccineInfo
              key={vaccine.id || idx}
              name={vaccine.vaccine_name || vaccine.name || "Unknown Vaccine"}
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
              showSelect={true}
              selected={selected.includes(idx)}
              onSelect={() => toggleSelect(idx)}
            />
          ))}
        </div>

        {vaccines.length === 0 && !error && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-base sm:text-lg mb-4">No vaccines found</div>
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
