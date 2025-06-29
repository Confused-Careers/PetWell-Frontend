import axios from "axios";

import { SERVER_BASE_URL } from "../utils/config";

interface Pet {
  id: string;
  pet_name: string;
  age: number;
  weight: number;
  breed_species_id: string;
  breed_id: string;
  location: string;
  latitude: number;
  longitude: number;
  spay_neuter: boolean;
  color: string;
  dob: string;
  microchip: string;
  notes: string;
  profile_picture?: File;
}

interface Species {
  id: string;
  name: string;
}

interface Breed {
  id: string;
  name: string;
}

interface Document {
  id: string;
  document_name: string;
  document_type: string;
  file_type: string;
  description?: string;
  pet_id: string;
  file?: File;
}

interface CreatePetData {
  pet_name: string;
  age: number;
  weight: number;
  breed_species_id: string;
  breed_id: string;
  location: string;
  latitude: number;
  longitude: number;
  spay_neuter: boolean;
  color: string;
  dob: string;
  microchip: string;
  notes: string;
}

interface UpdatePetData {
  pet_name?: string;
  age?: number;
  weight?: number;
  location?: string;
  spay_neuter?: boolean;
  color?: string;
  dob?: string;
  microchip?: string;
  notes?: string;
  profile_picture?: File;
}

interface SearchSpeciesData {
  search_txt: string;
  skip: number;
  limit: number;
}

interface SearchBreedsData {
  breed_species_id: string;
  search_txt: string;
}

interface CreateDocumentData {
  document_name: string;
  document_type: string;
  file_type: string;
  description: string;
  file: File;
}

interface UpdateDocumentData {
  document_name?: string;
  document_type?: string;
  file_type?: string;
  description?: string;
  pet_id?: string;
  file?: File;
}

interface PetResponse {
  message: string;
  data?: Pet | Pet[];
}

interface SpeciesResponse {
  message: string;
  data?: Species[];
}

interface BreedResponse {
  message: string;
  data?: Breed[];
}

interface DocumentResponse {
  message: string;
  data?: Document | Document[];
}

const petServices = {
  async createPet(data: CreatePetData): Promise<PetResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/pets/create`,
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
        throw new Error(error.response.data.message || "Pet creation failed");
      }
      throw new Error("Pet creation failed");
    }
  },

  async getPetsByOwner(): Promise<PetResponse> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/pets/owner`, {
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
        throw new Error(error.response.data.message || "Fetching pets failed");
      }
      throw new Error("Fetching pets failed");
    }
  },

  async getPetById(petId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/pets/get/${petId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Fetching pet failed");
      }
      throw new Error("Fetching pet failed");
    }
  },

  async updatePet(petId: string, data: UpdatePetData): Promise<PetResponse> {
    try {
      const formData = Object.entries(data).map(([key, value]) => ({
        key,
        value: value instanceof File ? value : value?.toString() || "",
        type: value instanceof File ? "file" : "text",
        description: `Optional: ${key}`,
      }));
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/pets/update/${petId}`,
        formData,
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
        throw new Error(error.response.data.message || "Pet update failed");
      }
      throw new Error("Pet update failed");
    }
  },

  async searchSpecies(data: SearchSpeciesData): Promise<SpeciesResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/pets/species`,
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
        throw new Error(error.response.data.message || "Species search failed");
      }
      throw new Error("Species search failed");
    }
  },

  async searchBreeds(data: SearchBreedsData): Promise<BreedResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/pets/breeds`,
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
        throw new Error(error.response.data.message || "Breeds search failed");
      }
      throw new Error("Breeds search failed");
    }
  },

  async getBreedSpecies(): Promise<SpeciesResponse> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/pets/breeds-species`,
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
          error.response.data.message || "Fetching breed species failed"
        );
      }
      throw new Error("Fetching breed species failed");
    }
  },

  async getPetDocuments(petId: string): Promise<DocumentResponse> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/pets/documents/${petId}`,
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
          error.response.data.message || "Fetching documents failed"
        );
      }
      throw new Error("Fetching documents failed");
    }
  },

  async createDocument(
    petId: string,
    data: CreateDocumentData
  ): Promise<DocumentResponse> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/pets/documents/${petId}`,
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
          error.response.data.message || "Document creation failed"
        );
      }
      throw new Error("Document creation failed");
    }
  },

  async updateDocument(
    documentId: string,
    data: UpdateDocumentData
  ): Promise<DocumentResponse> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/pets/documents/${documentId}`,
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
          error.response.data.message || "Document update failed"
        );
      }
      throw new Error("Document update failed");
    }
  },

  async updateDocumentName(
    documentId: string,
    document_name: string
  ): Promise<DocumentResponse> {
    try {
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/pets/documents/name/${documentId}`,
        { document_name },
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
          error.response.data.message || "Document name update failed"
        );
      }
      throw new Error("Document name update failed");
    }
  },

  async uploadMultipleDocuments(
    petId: string,
    files: File[]
  ): Promise<{ message: string; results: any[] }> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/pets/documents/multiple/${petId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      // Return the full backend response (message, results)
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Multiple document upload failed"
        );
      }
      throw new Error("Multiple document upload failed");
    }
  },
};

export default petServices;
