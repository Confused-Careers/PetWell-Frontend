import axios from "axios";

import { SERVER_BASE_URL } from "../utils/config";

interface Team {
  id: string;
  pet_id: string;
  business_id: string;
}

interface CreateTeamData {
  pet_id: string;
  business_id: string;
}

interface UpdateTeamData {
  pet_id?: string;
  business_id?: string;
}

interface BusinessSearchResult {
  id: string;
  business_name: string;
}

interface TeamResponse {
  message: string;
  data?: Team | Team[];
}

interface BusinessSearchResponse {
  message: string;
  data?: BusinessSearchResult[];
}

const teamServices = {
  async createTeam(data: CreateTeamData): Promise<TeamResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/teams/create`,
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
        throw new Error(error.response.data.message || "Team creation failed");
      }
      throw new Error("Team creation failed");
    }
  },

  async getAllTeams(): Promise<TeamResponse> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/teams/getAll`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      // Debug log: print all teams fetched from backend
      console.log('Fetched teams from backend:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Fetching teams failed");
      }
      throw new Error("Fetching teams failed");
    }
  },

  async getTeamById(teamId: string): Promise<TeamResponse> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/teams/getById/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      console.log('Fetched team by ID:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Fetching team failed");
      }
      throw new Error("Fetching team failed");
    }
  },

  async updateTeam(teamId: string, data: UpdateTeamData): Promise<TeamResponse> {
    try {
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/teams/update/${teamId}`,
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
        throw new Error(error.response.data.message || "Team update failed");
      }
      throw new Error("Team update failed");
    }
  },

  async deleteTeam(teamId: string): Promise<TeamResponse> {
    try {
      const response = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/teams/delete/${teamId}`,
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
        throw new Error(error.response.data.message || "Team deletion failed");
      }
      throw new Error("Team deletion failed");
    }
  },

  async searchBusinesses(query: string): Promise<BusinessSearchResponse> {
    try {
      const response  = await axios.get(
        `${SERVER_BASE_URL}/api/v1/teams/search/businesses`,
        {
          params: { query },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );
      console.log('Business search response:', response.data);
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Business search failed");
      }
      throw new Error("Business search failed");
    }
  },
};

export default teamServices;