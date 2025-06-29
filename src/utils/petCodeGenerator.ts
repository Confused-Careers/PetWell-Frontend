/**
 * Generates a 5-character pet code from a pet ID
 * @param petId - The pet's unique identifier
 * @returns A 5-character alphanumeric code
 */
export const generatePetCode = (petId: string): string => {
  if (!petId) return "00000";
  
  // Create a hash from the pet ID
  let hash = 0;
  for (let i = 0; i < petId.length; i++) {
    const char = petId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to generate a 5-character code
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  
  for (let i = 0; i < 5; i++) {
    const index = Math.abs(hash + i * 31) % chars.length;
    code += chars[index];
  }
  
  return code;
};

/**
 * Extracts pet ID and code from a QR code value
 * @param qrValue - The QR code value in format "petId|petCode"
 * @returns Object containing petId and petCode
 */
export const parseQRCodeValue = (qrValue: string): { petId: string; petCode: string } => {
  const parts = qrValue.split('|');
  return {
    petId: parts[0] || "",
    petCode: parts[1] || ""
  };
};