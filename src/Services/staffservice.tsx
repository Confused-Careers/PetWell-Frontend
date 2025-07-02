import axios from "axios";
import { SERVER_BASE_URL } from "../utils/config";

// Interface for adding a new staff member
interface AddStaffData {
  username: string;
  staff_name: string;
  email: string;
  password: string;
  role_name: string;
  access_level: string;
}

// Interface for updating staff information
interface UpdateStaffData {
  staff_name?: string;
  email?: string;
  role_name?: string;
}

// Interface for staff response
interface StaffResponse {
  message: string;
  staff?: {
    id: string;
    username: string;
    staff_name: string;
    email: string;
    role_name: string;
    access_level: string;
  };
}

// Interface for staff list response
interface StaffListResponse {
  message: string;
  staff: {
    id: string;
    username: string;
    staff_name: string;
    email: string;
    role_name: string;
    access_level: string;
  }[];
  total: number;
  page: number;
  limit: number;
}

const staffServices = {
  // Add a new staff member
  async addStaff(data: AddStaffData): Promise<StaffResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/businesses/staff`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Failed to add staff");
      }
      throw new Error("Failed to add staff");
    }
  },

  // Update staff information
  async updateStaff(staffId: string, data: UpdateStaffData): Promise<StaffResponse> {
    try {
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/businesses/staff/${staffId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Failed to update staff");
      }
      throw new Error("Failed to update staff");
    }
  },

  // Remove a staff member
  async removeStaff(staffId: string): Promise<StaffResponse> {
    try {
      const response = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/businesses/staff/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Failed to remove staff");
      }
      throw new Error("Failed to remove staff");
    }
  },

  // Get staff list with pagination
  async getStaffList(page: number = 1, limit: number = 10): Promise<StaffListResponse> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/businesses/staff/get?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      console.log("Staff List Response:", response.data.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Failed to fetch staff list");
      }
      throw new Error("Failed to fetch staff list");
    }
  },
};

export default staffServices;