import axios from "axios";
import { SERVER_BASE_URL } from "../utils/config";

interface BusinessProfile {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  website?: string;
  socials?: { [key: string]: string };
  description?: string;
  address?: string;
  profile_picture?: string;
}

interface PetMapping {
  id: string;
  pet_id: string;
  pet_name: string;
  staff_id?: string;
  title?: string;
  note?: string;
  added_on: string;
  last_visit?: string;
  doctor?: string;
  owner?: string;
  image?: string;
  is_under_care?: boolean;
}

interface UpdateBusinessProfileData {
  business_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  socials?: { [key: string]: string };
  description?: string;
  address?: string;
  profile_picture?: File;
}

interface CreatePetMappingData {
  qr_code_id: string;
  pet_id?: string;
  staff_id?: string;
  title?: string;
  note?: string;
}

interface PaginatedRequest {
  page: number;
  limit: number;
}

interface BusinessResponse {
  business_name: string;
  profile_picture: string;
  message: string;
  data?: BusinessProfile;
}

interface PetMappingResponse {
  message: string;
  data?: PetMapping[] | PetMapping;
  pet_name?: string;
}

const businessServices = {
  // Fetch business profile
  async getProfile(): Promise<BusinessResponse> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/businesses/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch business profile");
    }
  },

  // Update business profile
  async updateProfile(data: UpdateBusinessProfileData): Promise<BusinessResponse> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value instanceof File ? value : typeof value === "object" ? JSON.stringify(value) : value);
        }
      });
      const response = await axios.patch(`${SERVER_BASE_URL}/api/v1/businesses/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update business profile");
    }
  },

  // Create pet mapping
  async createPetMapping(data: CreatePetMappingData): Promise<PetMappingResponse> {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/businesses/pets`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create pet mapping");
    }
  },

  // Fetch paginated pet mappings
  async getPetMappings(params: PaginatedRequest): Promise<PetMappingResponse> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/businesses/pets`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch pet mappings");
    }
  },
};

export default businessServices;