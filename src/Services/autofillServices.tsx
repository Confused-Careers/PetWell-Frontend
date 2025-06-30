import axios from "axios";
import { SERVER_BASE_URL } from "../utils/config";

interface HumanOwner {
  id: string;
  username: string;
  human_owner_name: string;
  email: string;
  password: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  profile_picture_document_id: string | null;
  license_id: string | null;
  token: string | null;
  qr_code_id: string | null;
  otp_code: string | null;
  otp_sent_at: string | null;
  otp_expires_at: string | null;
  is_verified: boolean;
  otp_type: string | null;
  previous_passwords: string;
  login_attempts: number;
  last_login_attempt: string;
  forget_password_attempts: number;
  last_forget_password_attempt: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BreedSpecies {
  id: string;
  species_name: string;
  status: string;
  species_description: string;
  created_at: string;
  updated_at: string;
}

interface Breed {
  id: string;
  breed_name: string;
  breed_description: string;
  status: string;
  created_at: string;
  updated_at: string;
  breed_species: BreedSpecies;
}

interface Pet {
  pet_name: string;
  age: number | null;
  weight: number | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  spay_neuter: boolean | null;
  color: string | null;
  dob: string | null;
  microchip: string | null;
  notes: string | null;
  status: string;
  human_owner: HumanOwner;
  breed: Breed;
  breed_species: BreedSpecies;
  profile_picture_document_id: string | null;
  qr_code_id: string | null;
  id: string;
  created_at: string;
  updated_at: string;
}

interface Document {
  type: string;
  id: string;
  document_id: string;
}

interface AutofillResponse {
  message: string;
  pet: Pet;
  documents: Document[];
}

const autofillServices = {
  async createPetFromDocuments(files: File[]): Promise<AutofillResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    const response = await axios.post(
      `${SERVER_BASE_URL}/api/v1/user-pets/create-from-documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }
    );
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    return response.data;
  },
};

export default autofillServices;
