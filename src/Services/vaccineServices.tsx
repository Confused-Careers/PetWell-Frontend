import axios from "axios";

import { SERVER_BASE_URL } from "../utils/config";

interface Vaccine {
  id: string;
  vaccine_name: string;
  date_administered: string;
  date_due: string;
  staff_id: string;
  pet_id: string;
  file?: string;
}

interface CreateVaccineData {
  vaccine_name: string;
  date_administered: string;
  date_due: string;
  staff_id: string;
  pet_id: string;
  file?: File;
}

interface UpdateVaccineData {
  vaccine_name?: string;
  date_administered?: string;
  date_due?: string;
  staff_id?: string;
  pet_id?: string;
  file?: File;
}

interface Doctor {
  id: string;
  staff_name: string;
}

interface VaccineResponse {
  message: string;
  data?: Vaccine | Vaccine[];
}

interface DoctorResponse {
  message: string;
  data?: Doctor[];
}

interface GetVaccineDetailsResponse {
  document_id: string;
  vaccine_name: string;
  date_administered: string;
  expiry_date: string;
  administered_by: string;
  staff_id: string | null;
}

const vaccineServices = {
  async createVaccine(data: CreateVaccineData): Promise<VaccineResponse> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(
            key,
            value instanceof File ? value : value.toString()
          );
        }
      });
      console.log("Submitting vaccine payload:", data);
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/vaccines/create`,
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
        console.error("Backend error:", error.response.data);
        throw new Error(
          error.response.data.message || "Vaccine creation failed"
        );
      }
      throw new Error("Vaccine creation failed");
    }
  },

  async getAllPetVaccines(petId: string): Promise<VaccineResponse> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/vaccines/getAllPetVaccines/${petId}`,
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
        throw new Error(
          error.response.data.message || "Fetching pet vaccines failed"
        );
      }
      throw new Error("Fetching pet vaccines failed");
    }
  },

  async getPetVaccine(vaccineId: string): Promise<VaccineResponse> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/vaccines/getPetVaccine/${vaccineId}`,
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
        throw new Error(
          error.response.data.message || "Fetching vaccine failed"
        );
      }
      throw new Error("Fetching vaccine failed");
    }
  },

  async updateVaccine(
    vaccineId: string,
    data: UpdateVaccineData
  ): Promise<VaccineResponse> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          formData.append(
            key,
            value instanceof File ? value : value.toString()
          );
        }
      });
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/vaccines/update/${vaccineId}`,
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
        throw new Error(error.response.data.message || "Vaccine update failed");
      }
      throw new Error("Vaccine update failed");
    }
  },

  async deleteVaccine(vaccineId: string): Promise<VaccineResponse> {
    try {
      const response = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/vaccines/delete/${vaccineId}`,
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
        throw new Error(
          error.response.data.message || "Vaccine deletion failed"
        );
      }
      throw new Error("Vaccine deletion failed");
    }
  },

  async getDoctors(petId: string, businessId: string): Promise<DoctorResponse> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/vaccines/doctors`,
        {
          params: { petId, businessId },
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
          error.response.data.message || "Fetching doctors failed"
        );
      }
      throw new Error("Fetching doctors failed");
    }
  },

  /**
   * Fetch vaccine details from a file and petId (POST /api/v1/vaccines/getVaccinesDetails)
   * @param file The file to upload (PDF, image, etc.)
   * @param petId The pet's ID
   */
  async getVaccinesDetails(
    file: File,
    petId: string
  ): Promise<GetVaccineDetailsResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("petId", petId);
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/vaccines/getVaccinesDetails`,
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
          error.response.data.message || "Fetching vaccine details failed"
        );
      }
      throw new Error("Fetching vaccine details failed");
    }
  },
};

export default vaccineServices;
