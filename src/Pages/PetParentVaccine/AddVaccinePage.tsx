import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar";
import BusinessNavbar from "../../Components/BusinessComponents/BusinessNavbar";
import AddVaccine from "../../Components/Vaccine/AddVaccine";
import petServices from "../../Services/petServices";
import vaccineServices from "../../Services/vaccineServices";
import { IoIosArrowDropleftCircle } from "react-icons/io";

const AddVaccinePage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const location = useLocation(); // Added to check the current route
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pet, setPet] = useState<any>(null);
  const [actualPetId, setActualPetId] = useState<string | null>(null);
  const [,] = useState<string | null>(null);

  // Determine which Navbar to use based on the route
  const isBusinessRoute = location.pathname.startsWith("/business");
  const NavComponent = isBusinessRoute ? BusinessNavbar : Navbar;

  // Fetch pet details
  useEffect(() => {
    const fetchPet = async () => {
      try {
        if (!petId) {
          setError("No pet ID provided");
          return;
        }

        let currentPetId = petId;

        // If petId is "default", fetch the first available pet
        if (petId === "default") {
          const petsRes = await petServices.getPetsByOwner();
          let petsArr = Array.isArray(petsRes) ? petsRes : petsRes.data;
          if (!petsArr) petsArr = [];
          if (!Array.isArray(petsArr)) petsArr = [petsArr];

          if (petsArr.length === 0) {
            setError("No pets found. Please create a pet profile first.");
            return;
          }

          // Use the first pet's ID (since "default" means single pet)
          currentPetId = petsArr[0].id;
          setActualPetId(currentPetId);
        } else {
          setActualPetId(currentPetId);
        }

        // Fetch pet details
        const petRes = await petServices.getPetById(currentPetId);
        let petData: any = petRes;
        if (petRes && petRes.data) petData = petRes.data;
        if (Array.isArray(petData)) petData = petData[0];
        if (
          !petData ||
          typeof petData !== "object" ||
          !("id" in petData) ||
          !("pet_name" in petData)
        ) {
          setPet(null);
          setError("Pet not found. Please add a pet first.");
        } else {
          setPet(petData);
        }
      } catch (err) {
        setError("Failed to fetch pet.");
      }
    };
    fetchPet();
  }, [petId]);

  const handleSubmit = async (data: any) => {
    if (!actualPetId) {
      setError("No pet ID available");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Map form data to expected API format
      const apiData = {
        vaccine_name: data.vaccine,
        date_administered: data.administered,
        date_due: data.expiry,
        administered_by: data.staffName,
        staff_id: "", // Empty string as required by backend
        pet_id: actualPetId,
        file: data.file,
      };

      await vaccineServices.createVaccine(apiData);
      setSuccess("Vaccine added successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add vaccine");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!pet) {
    return (
      <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
        <NavComponent />
        <div className="container mx-auto max-w-7xl pt-8 pb-12 px-8">
          <div className="text-center">{error || "Pet not found"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] text-[var(--color-text)] font-sans">
      <NavComponent />
      <div className="container mx-auto max-w-7xl pt-8 pb-12 px-8">
        <div className="flex font-semibold flex-row items-center gap-2 cursor-pointer " onClick={() => handleCancel()}>
          <IoIosArrowDropleftCircle height={24} width={24} className=" h-[24px] w-[24px]" />Go Back
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <AddVaccine
          petId={actualPetId || petId || ""}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AddVaccinePage;