// lib/hooks/useAuth.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { authService } from "../api/services";
import { ILoginCredentials, ISignupData } from "../types/api.types";

export const AUTH_KEYS = {
  currentUser: ["auth", "current-user"] as const,
};

// Get current user
export const useCurrentUser = () => {
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("access_token");

  return useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, 
    retry: false,
    enabled: hasToken,
  });
};

// Login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: ILoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      if (data.data?.tokens) {
        const { accessToken, refreshToken } = data.data.tokens;
        apiClient.setToken(accessToken);
        apiClient.setRefreshToken(refreshToken);
        queryClient.invalidateQueries({ queryKey: AUTH_KEYS.currentUser });
      }
    },
  });
};

// Signup
export const useSignup = () => {
  return useMutation({
    mutationFn: (data: ISignupData) => authService.signup(data),
  });
};

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      apiClient.clearTokens();
      queryClient.clear();
    },
  });
};

// Update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      authService.updateProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.currentUser });
    },
  });
};

// Change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      authService.changePassword(data),
  });
};
