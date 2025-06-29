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

interface Staff {
  id: string;
  username: string;
  staff_name: string;
  email: string;
  role_name: string;
}

interface PetMapping {
  id: string;
  pet_id: string;
  staff_id: string;
  title: string;
  note: string;
}

interface UpdateBusinessProfileData {
  email?: string;
  phone?: string;
  website?: string;
  socials?: { [key: string]: string };
  description?: string;
  profile_picture?: File;
}

interface CreateStaffData {
  username: string;
  staff_name: string;
  email: string;
  password: string;
  role_name: string;
}

interface UpdateStaffData {
  staff_name?: string;
  email?: string;
  role_name?: string;
}

interface CreatePetMappingData {
  pet_id: string;
  staff_id: string;
  title: string;
  note: string;
}

interface BusinessResponse {
  message: string;
  data?: BusinessProfile;
}

interface StaffResponse {
  message: string;
  data?: Staff | Staff[];
}

interface PetMappingResponse {
  message: string;
  data?: PetMapping | PetMapping[];
}

interface PaginatedRequest {
  page: number;
  limit: number;
}

const businessServices = {
  async getProfile(): Promise<BusinessResponse> {
    try {
      const response=
        await axios.get(`${SERVER_BASE_URL}/api/v1/businesses/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Fetching business profile failed"
        );
      }
      throw new Error("Fetching business profile failed");
    }
  },

  async updateProfile(
    data: UpdateBusinessProfileData
  ): Promise<BusinessResponse> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append("key", key);
          formData.append(
            "value",
            value instanceof File
              ? value
              : typeof value === "object"
              ? JSON.stringify(value)
              : value.toString()
          );
          formData.append("type", value instanceof File ? "file" : "text");
          formData.append("description", `Optional: ${key}`);
        }
      });
      const response=
        await axios.patch(
          `${SERVER_BASE_URL}/api/v1/businesses/profile`,
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
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Business profile update failed"
        );
      }
      throw new Error("Business profile update failed");
    }
  },

  async createStaff(data: CreateStaffData): Promise<StaffResponse> {
    try {
      const response= await axios.post(
        `${SERVER_BASE_URL}/api/v1/businesses/staff`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Staff creation failed");
      }
      throw new Error("Staff creation failed");
    }
  },

  async updateStaff(
    staffId: string,
    data: UpdateStaffData
  ): Promise<StaffResponse> {
    try {
      const response=
        await axios.patch(
          `${SERVER_BASE_URL}/api/v1/businesses/staff/${staffId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Staff update failed");
      }
      throw new Error("Staff update failed");
    }
  },

  async deleteStaff(staffId: string): Promise<StaffResponse> {
    try {
      const response=
        await axios.delete(
          `${SERVER_BASE_URL}/api/v1/businesses/staff/${staffId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Staff deletion failed");
      }
      throw new Error("Staff deletion failed");
    }
  },

  async getStaffList(params: PaginatedRequest): Promise<StaffResponse> {
    try {
      const response= await axios.get(
        `${SERVER_BASE_URL}/api/v1/businesses/staff/get`,
        {
          params: { page: params.page, limit: params.limit },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Fetching staff list failed"
        );
      }
      throw new Error("Fetching staff list failed");
    }
  },

  async createPetMapping(
    data: CreatePetMappingData
  ): Promise<PetMappingResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/businesses/pets`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Pet mapping creation failed"
        );
      }
      throw new Error("Pet mapping creation failed");
    }
  },

  async getPetMappings(params: PaginatedRequest): Promise<PetMappingResponse> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/businesses/pets`,
        {
          params: { page: params.page, limit: params.limit },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Fetching pet mappings failed"
        );
      }
      throw new Error("Fetching pet mappings failed");
    }
  },
};

export default businessServices;
