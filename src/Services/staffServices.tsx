import axios from "axios";

import { SERVER_BASE_URL } from "../utils/config";

interface StaffProfile {
  id: string;
  staff_name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  role_name: string;
  profile_picture?: string;
}

interface UpdateStaffProfileData {
  staff_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  role_name?: string;
  profile_picture?: File;
}

interface StaffResponse {
  message: string;
  data?: StaffProfile;
}

const staffServices = {
  async getProfile(): Promise<StaffResponse> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/staff/profile`,
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
        throw new Error(error.response.data.message || "Fetching staff profile failed");
      }
      throw new Error("Fetching staff profile failed");
    }
  },

  async updateProfile(data: UpdateStaffProfileData): Promise<StaffResponse> {
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
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/staff/profile`,
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
        throw new Error(error.response.data.message || "Staff profile update failed");
      }
      throw new Error("Staff profile update failed");
    }
  },
};

export default staffServices;