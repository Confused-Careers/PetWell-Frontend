import React, { useState, useRef, useEffect } from "react";
import PetWellLogo from "../../../Assets/PetWell.png";
import Stepper from "./Stepper";
import type { FormData } from "./types";
import petServices from "../../../Services/petServices";

interface Step1BasicPetInfoProps {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onNext: () => void;
  steps?: string[];
}

const Step1BasicPetInfo: React.FC<Step1BasicPetInfoProps> = ({
  form,
  setForm,
  error,
  setError,
  onNext,
  steps,
}) => {
  console.log("[Step1BasicPetInfo] Component rendered", { form });

  const [speciesOptions, setSpeciesOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [breedOptions, setBreedOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [speciesLoading, setSpeciesLoading] = useState(false);
  const [breedLoading, setBreedLoading] = useState(false);
  const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false);
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const breedInputRef = useRef<HTMLInputElement>(null);

  const validateStep1 = () => {
    if (!form.pet_name.trim()) return "Pet name is required";
    if (
      !form.pet_age ||
      isNaN(Number(form.pet_age)) ||
      Number(form.pet_age) <= 0
    )
      return "Pet age must be a positive number";
    if (!form.pet_species.trim()) return "Pet species is required";
    if (!form.pet_breed.trim()) return "Pet breed is required";
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[File Change] Triggered", { file: e.target.files?.[0]?.name });
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setForm((f) => ({ ...f, pet_profile_picture: file }));
      setError(null);
    }
  };

  const handleSpeciesInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      pet_species: "",
      pet_species_name: value,
      pet_breed: "",
      pet_breed_name: "",
    }));
    setError(null);
    setShowSpeciesDropdown(true);
    setSpeciesLoading(true);
    console.log("[Species Input] Triggered", { value });
    try {
      const res = await petServices.searchSpecies({
        search_txt: value,
        skip: 0,
        limit: 10,
      });
      console.log("[Species API full response]", res);
      const arr = Array.isArray(res) ? res : res.data || [];
      console.log("[Species Search] API response:", arr);
      setSpeciesOptions(
        arr.map((item: any) => ({
          id: item.id,
          name: item.species_name || item.name,
        }))
      );
    } catch (err) {
      console.error("[Species Search] Error:", err);
      setSpeciesOptions([]);
      setError("Failed to fetch species. Please try again.");
    }
    setSpeciesLoading(false);
    console.log("[Species Search] Dropdown options:", speciesOptions);
  };

  const handleSelectSpecies = async (option: { id: string; name: string }) => {
    console.log("[Species Select] Triggered", { option });
    setForm((f) => ({
      ...f,
      pet_species: option.id,
      pet_species_name: option.name,
      pet_breed: "",
      pet_breed_name: "",
    }));
    setShowSpeciesDropdown(false);
    setBreedOptions([]);
    try {
      setBreedLoading(true);
      const res = await petServices.searchBreeds({
        breed_species_id: option.id,
        search_txt: "",
      });
      console.log("[Breed API raw data]", res);
      const arr = Array.isArray(res) ? res : res.data || [];
      const mapped = arr.map((item: any) => ({
        id: item.id,
        name: item.breed_name || item.name,
      }));
      console.log("[Breed mapped options]", mapped);
      setBreedOptions(mapped);
    } catch (err) {
      console.error("[Breed Search] Error:", err);
      setBreedOptions([]);
      setError("Failed to fetch breeds. Please try again.");
    }
    setBreedLoading(false);
    if (breedInputRef.current) breedInputRef.current.focus();
  };

  const handleBreedInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("[Breed Input] Triggered", {
      value,
      speciesId: form.pet_species,
    });
    setForm((f) => ({
      ...f,
      pet_breed: "",
      pet_breed_name: value,
    }));
    setError(null);
    if (!form.pet_species) {
      setBreedOptions([]);
      setShowBreedDropdown(false);
      setBreedLoading(false);
      console.log("[Breed Input] No species selected, skipping API call");
      return;
    }
    setShowBreedDropdown(true);
    setBreedLoading(true);
    try {
      const res = await petServices.searchBreeds({
        breed_species_id: form.pet_species,
        search_txt: value,
      });
      console.log("[Breed API raw data]", res);
      const arr = Array.isArray(res) ? res : res.data || [];
      const mapped = arr.map((item: any) => ({
        id: item.id,
        name: item.breed_name || item.name,
      }));
      console.log("[Breed mapped options]", mapped);
      setBreedOptions(mapped);
    } catch (err) {
      console.error("[Breed Search] Error:", err);
      setBreedOptions([]);
      setError("Failed to fetch breeds. Please try again.");
    }
    setBreedLoading(false);
    console.log("[Breed Search] Dropdown options:", breedOptions);
  };

  const handleSelectBreed = (option: { id: string; name: string }) => {
    console.log("[Breed Select] Triggered", { option });
    setForm((f) => ({
      ...f,
      pet_breed: option.id,
      pet_breed_name: option.name,
    }));
    setShowBreedDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Submit] Triggered", { form });
    setError(null);
    const errorMsg = validateStep1();
    if (errorMsg) {
      setError(errorMsg);
      console.log("[Submit] Validation failed", { errorMsg });
      return;
    }
    console.log(
      "[Submit] Submitting with species ID:",
      form.pet_species,
      "and breed ID:",
      form.pet_breed
    );
    onNext();
  };

  return (
    <div className="min-h-screen bg-[#1C232E] flex flex-col items-center justify-center w-full relative">
      <img
        src={PetWellLogo}
        alt="PetWell Logo"
        className="w-16 h-16 object-contain absolute left-20 top-10"
        style={{ left: 80, top: 40 }}
      />
      <div className="flex justify-center w-full max-w-5xl mt-12 mb-6">
        <h1 className="text-[40px] font-[Alike,serif] text-[#EBD5BD] font-normal text-center">
          Welcome to your pet's new digital home.
        </h1>
      </div>
      <div className="flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <Stepper currentStep={1} steps={steps} />
        <h2 className="text-2xl font-[Cabin,sans-serif] text-[#EBD5BD] font-normal mb-8 mt-2">
          Let's start with your pet's details
        </h2>
        <form
          className="w-full max-w-2xl flex flex-col gap-5"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              What's your pet's name?
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.pet_name}
              onChange={(e) => {
                setForm((f) => ({ ...f, pet_name: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              How old are they?
            </label>
            <input
              type="number"
              placeholder="Age in years"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.pet_age}
              onChange={(e) => {
                console.log("[Age Input] Triggered", { value: e.target.value });
                setForm((f) => ({ ...f, pet_age: e.target.value }));
                setError(null);
              }}
              required
            />
          </div>
          <div className="relative">
            <label className="block text-[#EBD5BD] text-base mb-2">
              What species are they?
            </label>
            <input
              type="text"
              placeholder="Type species name"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.pet_species_name ?? ""}
              onChange={handleSpeciesInput}
              onFocus={() => {
                console.log("[Species Input Focus] Triggered");
                setShowSpeciesDropdown(true);
              }}
              onBlur={() =>
                setTimeout(() => setShowSpeciesDropdown(false), 300)
              }
              autoComplete="off"
              required
            />
            {(speciesLoading || speciesOptions.length > 0) &&
              showSpeciesDropdown && (
                <div className="absolute z-50 bg-white w-full rounded-md shadow-lg mt-1 max-h-56 overflow-y-auto border border-gray-200">
                  {speciesLoading ? (
                    <div className="p-2 text-gray-500">Loading...</div>
                  ) : speciesOptions.length > 0 ? (
                    speciesOptions.map((option) => (
                      <div
                        key={option.id}
                        className="px-4 py-2 hover:bg-[#FFB23E] hover:text-black cursor-pointer"
                        onMouseDown={() => handleSelectSpecies(option)}
                      >
                        {option.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No results</div>
                  )}
                </div>
              )}
          </div>
          <div className="relative">
            <label className="block text-[#EBD5BD] text-base mb-2">
              What breed are they?
            </label>
            <input
              type="text"
              placeholder="Type breed name"
              className="w-full rounded-md px-4 py-3 text-base bg-white text-black focus:outline-none"
              value={form.pet_breed_name ?? ""}
              onChange={handleBreedInput}
              onFocus={() => {
                console.log("[Breed Input Focus] Triggered");
                setShowBreedDropdown(true);
              }}
              onBlur={() => setTimeout(() => setShowBreedDropdown(false), 300)}
              autoComplete="off"
              ref={breedInputRef}
              required
              disabled={!form.pet_species}
            />
            {(breedLoading || breedOptions.length > 0) && showBreedDropdown && (
              <div className="absolute z-50 bg-white w-full rounded-md shadow-lg mt-1 max-h-56 overflow-y-auto border border-gray-200">
                {breedLoading ? (
                  <div className="p-2 text-gray-500">Loading...</div>
                ) : breedOptions.length > 0 ? (
                  breedOptions.map((option) => (
                    <div
                      key={option.id}
                      className="px-4 py-2 hover:bg-[#FFB23E] hover:text-black cursor-pointer"
                      onMouseDown={() => handleSelectBreed(option)}
                    >
                      {option.name}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No results</div>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-[#EBD5BD] text-base mb-2">
              Upload a profile picture!{" "}
              <span className="font-normal">(Make it boop-worthy!)</span>
            </label>
            <label className="w-full flex items-center justify-between rounded-md px-4 py-3 bg-white text-gray-500 cursor-pointer border border-gray-200">
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                {form.pet_profile_picture
                  ? form.pet_profile_picture.name
                  : "Upload image"}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-md bg-[#FFB23E] text-black text-lg font-semibold font-[Cabin,sans-serif] hover:bg-[#ffb733] transition-colors"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default Step1BasicPetInfo;
