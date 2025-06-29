import axios from "axios";
import { SERVER_BASE_URL } from "../utils/config";

interface AutofillResponse {
  message: string;
  pet: any;
  documents: any[];
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
