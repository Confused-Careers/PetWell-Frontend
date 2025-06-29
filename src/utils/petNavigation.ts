// Utility functions for managing last used pet ID

const LAST_PET_ID_KEY = "lastPetId";

/**
 * Store the last used pet ID in localStorage
 * @param petId - The pet ID to store
 */
export const storeLastPetId = (petId: string): void => {
  console.log("storeLastPetId called with:", petId);
  if (petId && petId !== "default") {
    localStorage.setItem(LAST_PET_ID_KEY, petId);
    console.log("Pet ID stored successfully:", petId);
  } else {
    console.log("Invalid petId, not storing:", petId);
  }
};

/**
 * Get the last used pet ID from localStorage
 * @returns The last used pet ID or null if not found
 */
export const getLastPetId = (): string | null => {
  const stored = localStorage.getItem(LAST_PET_ID_KEY);
  console.log("getLastPetId retrieved:", stored);
  return stored;
};

/**
 * Clear the last used pet ID from localStorage
 */
export const clearLastPetId = (): void => {
  localStorage.removeItem(LAST_PET_ID_KEY);
};

/**
 * Logout function that clears token but keeps last pet ID for next login
 * @param petId - Optional current pet ID to store before logout
 */
export const logout = (petId?: string): void => {
  console.log("Logout called with petId:", petId);
  // Store the current pet ID if provided
  if (petId && petId !== "default") {
    console.log("Storing pet ID:", petId);
    storeLastPetId(petId);
  } else {
    console.log("No valid petId provided for storage");
  }
  localStorage.removeItem("token");
  console.log("Token removed, lastPetId should be preserved");
  // Note: We don't clear lastPetId here so users return to their last used pet on next login
};

/**
 * Get the last used pet ID or fetch the first available pet
 * @returns Promise<string> - The pet ID to use
 */
export const getLastOrFirstPetId = async (): Promise<string> => {
  const lastPetId = getLastPetId();
  console.log("getLastOrFirstPetId - stored lastPetId:", lastPetId);

  if (lastPetId) {
    console.log(
      "getLastOrFirstPetId - returning stored petId without validation:",
      lastPetId
    );
    return lastPetId;
  }

  // If no last pet ID, try to get the first pet from the API
  try {
    const { default: petServices } = await import("../Services/petServices");
    const petsRes = await petServices.getPetsByOwner();
    console.log("getLastOrFirstPetId - petsRes:", petsRes);
    let petsArr = Array.isArray(petsRes) ? petsRes : petsRes.data;

    if (!petsArr) petsArr = [];
    if (!Array.isArray(petsArr)) petsArr = [petsArr];

    console.log("getLastOrFirstPetId - petsArr:", petsArr);
    console.log("getLastOrFirstPetId - petsArr length:", petsArr.length);

    if (petsArr.length > 0) {
      console.log("getLastOrFirstPetId - first pet:", petsArr[0]);
      const firstPetId = petsArr[0].id;
      console.log("getLastOrFirstPetId - using first pet ID:", firstPetId);
      // Store this as the last used pet ID
      storeLastPetId(firstPetId);
      return firstPetId;
    }
  } catch (error) {
    console.error("Failed to fetch pets for last pet ID:", error);
  }

  // Fallback to default
  console.log("getLastOrFirstPetId - falling back to default");
  return "default";
};
