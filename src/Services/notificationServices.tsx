import axios from "axios";
import { SERVER_BASE_URL } from "../utils/config";

interface Notification {
  id: string;
  human_owner?: { id: string };
  pet?: { id: string };
  business?: { id: string };
  staff?: { id: string };
  message: string;
  type: 'VaccineAdded' | 'DocumentUploaded' | 'VaccineDue' | 'PetBirthday' | 'StaffAdded';
  is_read: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

interface NotificationFilter {
  pet_id?: string;
  human_owner_id?: string;
  business_id?: string;
  staff_id?: string;
  is_read?: boolean;
  type?: 'VaccineAdded' | 'DocumentUploaded' | 'VaccineDue' | 'PetBirthday' | 'StaffAdded';
}

interface NotificationResponse {
  message: string;
  data: Notification[];
}

interface SingleNotificationResponse {
  message: string;
  data: Notification;
}

interface CountResponse {
  count: number;
}

interface ActionResponse {
  message: string;
}

const notificationServices = {
  // Fetch all notifications with filters
  async getNotifications(filter: NotificationFilter): Promise<NotificationResponse> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/notifications/getAll`, {
        params: filter,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch notifications");
    }
  },

  // Get unread notifications count
  async getUnreadCount(petId?: string): Promise<CountResponse> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/notifications/unread-count`, {
        params: { petId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch unread notifications count");
    }
  },

  // Mark a notification as read
  async markAsRead(id: string): Promise<SingleNotificationResponse> {
    try {
      const response = await axios.patch(`${SERVER_BASE_URL}/api/v1/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to mark notification as read");
    }
  },

  // Mark all notifications as read
  async markAllAsRead(petId?: string): Promise<ActionResponse> {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/notifications/mark-all-read`, { petId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to mark all notifications as read");
    }
  },

  // Dismiss a notification
  async dismiss(id: string): Promise<ActionResponse> {
    try {
      const response = await axios.delete(`${SERVER_BASE_URL}/api/v1/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to dismiss notification");
    }
  },

  // Dismiss all notifications
  async dismissAll(petId?: string): Promise<ActionResponse> {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/notifications/dismiss-all`, { petId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to dismiss all notifications");
    }
  },
};

export default notificationServices;