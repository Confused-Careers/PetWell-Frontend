import axios from "axios";

import { SERVER_BASE_URL } from "../utils/config";

// Pet User (Human Owner)
interface HumanOwnerSignupData {
  username: string;
  human_owner_name: string;
  email: string;
  location: string;
  phone: string;
  password: string;
}

// Staff User
interface StaffSignupData {
  username: string;
  staff_name: string;
  email: string;
  password: string;
  role: string;
  business_id: string;
}

// Business Owner
interface BusinessSignupData {
  business_name: string;
  email: string;
  phone: string;
  password: string;
  description: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  x?: string;
}

// Human Owner with Pet
interface HumanOwnerWithPetSignupData {
  human_owner_name: string;
  email: string;
  location: string;
  phone: string;
  password: string;
  username: string;
  pet_name: string;
  pet_age: number;
  pet_species_id: string;
  pet_breed_id: string;
  pet_weight?: number;
  pet_spay_neuter?: boolean;
  profile_picture?: File;
}

interface LoginData {
  email: string;
  password: string;
  username: string;
}

interface VerifyOTPData {
  identifier: string;
  otp_code: string;
}

interface ResendOTPData {
  email: string;
  otp_type: "Registration" | "ForgotPassword" | "EmailVerification";
}

interface ForgotPasswordData {
  identifier: string;
}

interface ResetPasswordData {
  email: string;
  otp_code: string;
  new_password: string;
}

interface AuthResponse {
  message: string;
  access_token?: string;
  user?: {
    id: string;
    email: string;
    username?: string;
    name?: string;
    role?: string;
  };
}

interface OTPResponse {
  message: string;
  token?: string;
  access_token?: string;
}

interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

const authServices = {
  async login(data: Partial<LoginData>): Promise<AuthResponse> {
    try {
      // Remove empty username if not provided
      const payload: Record<string, string> = {
        email: data.email || "",
        password: data.password || "",
      };
      if (data.username && data.username.trim() !== "") {
        payload.username = data.username.trim();
      }
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/login`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw new Error("Login failed");
    }
  },

  async signupHumanOwner(data: HumanOwnerSignupData): Promise<AuthResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/register/human-owner`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
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
          error.response.data.message || "Human owner signup failed"
        );
      }
      throw new Error("Human owner signup failed");
    }
  },

  // Enhanced signupHumanOwnerWithPet method with better debugging

  async signupHumanOwnerWithPet(
    data: HumanOwnerWithPetSignupData | FormData
  ): Promise<AuthResponse> {
    try {
      console.log("=== AUTH SERVICE DEBUG ===");

      let payload: FormData | HumanOwnerWithPetSignupData;
      let headers: Record<string, string> = {};

      if (data instanceof FormData) {
        payload = data;
        // Don't set Content-Type for FormData - let browser set it with boundary
        // headers['Content-Type'] = 'multipart/form-data'; // Remove this line

        // Log FormData entries for debugging
        const entries = Array.from(payload.entries());
        if (entries.length === 0) {
          throw new Error("FormData is empty. Please check form inputs.");
        }

        console.log("FormData payload entries:");
        for (const [key, value] of entries) {
          console.log(
            `${key}: ${
              value instanceof File
                ? `FILE: ${value.name} (${value.size} bytes, ${value.type})`
                : value
            }`
          );
        }
      } else {
        payload = data;
        headers["Content-Type"] = "application/json";
        console.log("JSON payload:", payload);
      }

      // Validate SERVER_BASE_URL
      if (!SERVER_BASE_URL) {
        throw new Error("SERVER_BASE_URL is not defined. Check your config.");
      }

      const url = `${SERVER_BASE_URL}/api/v1/auth/register/human-owner-with-pet`;
      console.log("Making request to:", url);
      console.log("Request headers:", headers);

      const response = await axios.post(url, payload, {
        headers,
        timeout: 30000, // Increased timeout to 30 seconds
        validateStatus: function (status) {
          return status < 500; // Resolve only if status is less than 500
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      console.log("Response data:", response.data);

      // Handle different response structures
      if (response.status >= 400) {
        const errorMessage =
          response.data?.data?.message || `HTTP ${response.status} error`;
        throw new Error(errorMessage);
      }

      // Handle different response data structures
      let responseData: AuthResponse;

      if (response.data?.data) {
        responseData = response.data;
      } else if ((response.data as any)?.message) {
        responseData = response.data as unknown as AuthResponse;
      } else {
        throw new Error("Invalid response structure from server");
      }

      console.log("Processed response data:", responseData);
      return responseData;
    } catch (error: unknown) {
      console.error("=== AUTH SERVICE ERROR ===");
      console.error("Error type:", typeof error);
      console.error("Error object:", error);

      if (axios.isAxiosError(error)) {
        console.error("Axios error details:");
        console.error("- Code:", error.code);
        console.error("- Message:", error.message);
        console.error("- Response:", error.response?.data);
        console.error("- Status:", error.response?.status);
        console.error("- Request URL:", error.config?.url);
        console.error("- Request method:", error.config?.method);

        // More specific error handling
        if (error.code === "NETWORK_ERROR") {
          throw new Error(
            "Network error. Please check your internet connection and server status."
          );
        } else if (error.code === "TIMEOUT") {
          throw new Error(
            "Request timeout. The server may be experiencing high load."
          );
        } else if (error.code === "ERR_CONNECTION_REFUSED") {
          throw new Error(
            "Connection refused. Please check if the server is running."
          );
        } else if (error.response) {
          // Server responded with error status
          const message =
            error.response.data?.message ||
            `Server error (${error.response.status})`;
          throw new Error(message);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error(
            "No response from server. Please check your network connection."
          );
        } else {
          // Error in setting up the request
          throw new Error(`Request setup error: ${error.message}`);
        }
      } else if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred during signup");
      }
    }
  },

  async signupStaff(data: StaffSignupData): Promise<AuthResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/register/staff`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Staff signup failed");
      }
      throw new Error("Staff signup failed");
    }
  },

  async signupBusiness(data: BusinessSignupData): Promise<AuthResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/register/business`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
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
          error.response.data.message || "Business signup failed"
        );
      }
      throw new Error("Business signup failed");
    }
  },

  async verifyOTP(data: VerifyOTPData): Promise<OTPResponse> {
    try {
      console.log("Verifying OTP with data:", data);
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/verify-otp`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      console.log("OTP verification response:", response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "OTP verification failed"
        );
      }
      throw new Error("OTP verification failed");
    }
  },

  async resendOTP(data: ResendOTPData): Promise<OTPResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/resend-otp`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "OTP resend failed");
      }
      throw new Error("OTP resend failed");
    }
  },

  async forgotPassword(
    data: ForgotPasswordData
  ): Promise<ForgotPasswordResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/forgot-password`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
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
          error.response.data.message || "Password reset request failed"
        );
      }
      throw new Error("Password reset request failed");
    }
  },

  async resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
    try {
      console.log("resetPassword - Request data:", data);

      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/reset-password`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.data) {
        throw new Error("Invalid response from server");
      }
      console.log("resetPassword - Response:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("resetPassword - Error:", error);
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || "Password reset failed");
      }
      throw new Error("Password reset failed");
    }
  },

  logout(): void {
    // Clear token from localStorage but keep lastPetId for next login
    localStorage.removeItem("token");
    // Note: We don't clear lastPetId here so users return to their last used pet on next login
  },
};

export default authServices;
