import axios from "axios";

import { SERVER_BASE_URL } from "../utils/config";

interface License {
  id: string;
  purchase_date: string;
  due_date: string;
  details: string;
  license_plan: string;
  duration: number;
  status: string;
}

interface CreateLicenseData {
  purchase_date: string;
  due_date: string;
  details: string;
  license_plan: string;
  duration: number;
  status: string;
}

interface LicenseResponse {
  message: string;
  data?: License | License[];
}

const licenseServices = {
  async addLicense(data: CreateLicenseData): Promise<LicenseResponse> {
    try {
      const response= await axios.post(
        `${SERVER_BASE_URL}/api/v1/licenses/add`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
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
        throw new Error(error.response.data.message || "License creation failed");
      }
      throw new Error("License creation failed");
    }
  },

  async getAllLicenses(): Promise<LicenseResponse> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/licenses/get-all`,
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
        throw new Error(error.response.data.message || "Fetching licenses failed");
      }
      throw new Error("Fetching licenses failed");
    }
  },
};

export default licenseServices;