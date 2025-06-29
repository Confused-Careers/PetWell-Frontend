import axios from "axios";

import { SERVER_BASE_URL } from "../utils/config";

interface HumanOwnerProfile {
  id: string;
  human_owner_name: string;
  phone: string;
  location: string;
  email: string;
  username: string;
  profile_picture?: string;
}

interface UpdateHumanOwnerData {
  human_owner_name?: string;
  phone?: string;
  location?: string;
  profile_picture?: File;
}

interface HumanOwnerResponse {
  message: string;
  data?: HumanOwnerProfile;
}

const humanOwnerServices = {
  async getProfile(): Promise<HumanOwnerResponse> {
    try {
      const response= await axios.get(
        `${SERVER_BASE_URL}/api/v1/human-owners/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Fetching profile failed");
      }
      throw new Error("Fetching profile failed");
    }
  },

  async updateProfile(data: UpdateHumanOwnerData): Promise<HumanOwnerResponse> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append('key', key);
          formData.append('value', value instanceof File ? value : value.toString());
          formData.append('type', value instanceof File ? 'file' : 'text');
          formData.append('description', `Optional: ${key}`);
        }
      });
      const response= await axios.patch(
        `${SERVER_BASE_URL}/api/v1/human-owners/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Profile update failed");
      }
      throw new Error("Profile update failed");
    }
  },
};

export default humanOwnerServices;