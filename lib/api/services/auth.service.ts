// lib/api/services/auth.service.ts

import {
  ILoginCredentials,
  ILoginResponse,
  IResponse,
  ISignupData,
  IUser,
} from "@/lib/types/api.types";
import { apiClient } from "../client";

export const authService = {
  // Login
  login: async (credentials: ILoginCredentials) => {
    const response = await apiClient.post<IResponse<ILoginResponse>>(
      "/auth/login",
      credentials,
    );
    return response.data;
  },

  // Signup
  signup: async (data: ISignupData) => {
    const response = await apiClient.post<IResponse>("/auth/signup", data);
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await apiClient.post<IResponse<ILoginResponse>>(
      "/auth/refresh-token",
    );
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post<IResponse>("/auth/logout");
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get<IResponse<IUser>>("/auth/me");
    return response.data;
  },

  // Update profile
  updateProfile: async (userId: string, data: Partial<IUser>) => {
    const response = await apiClient.put<IResponse<IUser>>(
      `/users/${userId}`,
      data,
    );
    return response.data;
  },

  // Change password
  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const response = await apiClient.post<IResponse>(
      "/users/change-password",
      data,
    );
    return response.data;
  },
};
