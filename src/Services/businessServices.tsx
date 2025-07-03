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

interface Record {
  id: string;
  pet_name: string;
  owner_name: string;
  owner_phone?: string;
  breed_name?: string;
  species_name?: string;
  doctor_visited?: string;
  pet_image?: string;
  added_on: string;
  last_visited: string;
  note?: string;
  title: string;
}

interface Vet {
  id: string;
  staff_name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
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

interface CreateRecordData {
  pet_id: string;
  staff_id?: string;
  note?: string;
  title?: string;
}

interface FilterRecordsData {
  species_id?: string;
  doctor_id?: string;
  time_period?: 'this_week' | 'this_month' | 'last_3_months';
  page?: number;
  limit?: number;
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

interface RecordsResponse {
  message: string;
  data: Record[];
  total: number;
  page: number;
  limit: number;
}

interface VetsResponse {
  message: string;
  data: Vet[];
  total: number;
  page: number;
  limit: number;
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

  // Create a record
  async createRecord(data: CreateRecordData): Promise<Record> {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/records/create`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create record");
    }
  },

  // Fetch all records with filters
  async getAllRecords(params: FilterRecordsData): Promise<RecordsResponse> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/records/getAll`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      console.log("Response from getAllRecords:", response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch records");
    }
  },

  // Fetch all vets
  async getVets(params: PaginatedRequest): Promise<VetsResponse> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/records/vets`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch vets");
    }
  },

  // Fetch recent records (unique pets, latest first)
  async getRecentRecords(params: PaginatedRequest): Promise<RecordsResponse> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/records/recent`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch recent records");
    }
  },
};

export default businessServices;